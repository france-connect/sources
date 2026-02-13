# Testing of FranceConnect Statistics

This document explains how to test manually the FranceConnect statistics.

## Prerequisites

- Docker & the `docker-stack` helper available in the workspace.
- Node.js and Yarn.
- Elasticsearch reachable for indexing and transform previews.
- Run commands from the repository root (some paths are relative to `quality/data`).

## Overview / Quick Workflow

1. Generate connection metadata used by the log generator.
2. Generate FranceConnect business logs
3. Inject business logs into Elasticsearch
4. Index events into Elasticsearch for a chosen date range.
5. Execute transforms and indexer.
6. Search data in local Elasticsearch instance.

## Commands and scripts

### 0) Start the Elasticsearch stack

```bash
docker-stack init-stats
```

### 1) Generate metadata

Purpose: prepare connection metadata (SP/IDP lists, parameters).

#### Generate the connexion metadata

It will generate a CSV file with each line: <offset-ms>,<sp>,<idp>,<account-uuid>

```bash
cd quality/data
yarn connection:metadata [options]
```

#### Available parameters

All parameters are optional. If not provided, default values are used.

- `-o, --output-file <output-file>` : output filename (default: `connections.csv`, written in the artifacts folder)
- `-n, --num-connections <num-connections>` : how many connection lines to generate (default: `50000`)
- `-d, --num-days <num-days>` : window size in days; offsets are in [0, NUM_DAYS * 24h] in milliseconds (default: `33`)
- `-a, --num-accounts <num-accounts>` : number of distinct account UUIDs pre-generated and reused (default: `25`)
- `-s, --num-sp <num-sp>` : number of SP base names; script generates sp-public1..N and sp-private1..N (total NUM_SP \* 2 entries) (default: `5`)
- `-i, --num-idp <num-idp>` : number of IdP base names; script generates idp-public1..N and idp-private1..N (total NUM_IDP \* 2 entries) (default: `5`)

#### Example with custom parameters

```bash
yarn connection:metadata -n 100000 -d 60 -a 50 -s 10 -i 8
```

### 2) Generate business logs

Purpose: produce a log file (e.g. `connections.log`) containing events to inject.

#### Generate the connexion logs

I will generate a business log file with the same amount of rows as the input CSV file corresponding to FC_VERIFIED events. The connections start at the given START_DAY.

```bash
cd quality/data
yarn connection:logs [options]
```

#### Available parameters

All parameters are optional. If not provided, default values are used.

- `-i, --input-file <input-file>` : CSV input (offset, spId, idpId, accountId) read from the artifacts folder (default: `connections.csv`)
- `-o, --output-file <output-file>` : JSON-lines output file, opened in append mode (default: `connections.log`, written in the artifacts folder)
- `-s, --start-day <start-day>` : base day used to compute absolute timestamps, format dd/MM/yyyy (default: `31/07/2025`)
- `-e, --event <event>` : the event type to generate logs for (default: `FC_VERIFIED`)
- `-a, --acr <acr>` : authentication context string used in several fields (default: `eidas2`)
- `-h, --hostname <hostname>` : hostname to use in log entries (default: `core-fcp-01`)
- `-c, --category <category>` : category of the log event (default: `FRONT_CINEMATIC`)

#### Example with custom parameters

```bash
yarn connection:logs -s 01/01/2026 -a eidas3 -e FC_VERIFIED
```

### 3) Inject logs into traces instances

Purpose: post generated events to a local ingestion endpoint for a given platform.

- FranceConnect: `low`
- FranceConnect+: `high`

#### Clean business logs for FranceConnect+ (`high`):

```bash
yarn traces remove high
```

#### Inject logs:

```bash
# yarn traces inject <profile> <env> <file>
# example:
yarn traces inject high '' ../../../quality/data/statistics/artifacts/connections.log
```

Parameters:

- `<platform>`: `high`, `low`
- `<env>`: optional additional arg used by the script (often empty `''`).
- `<file>`: path to the generated log file.

Inject the business log in the `fc_tracks` index in Elasticsearch.

### 4) Index events into Elasticsearch

Purpose: Populate the `events` index (used by fc-workers).

Syntax:

```bash
# docker-stack index-events <variant> <from> <to>
# example:
docker-stack index-events v2 2025-07-01 2025-09-01
```

- `variant`: business log variant.
  - `v2` for FranceConnect/FranceConnect+,
  - `cl` for FranceConnect legacy.
- `from`: inclusive start date `YYYY-MM-DD`.
- `to`: exclusive end date `YYYY-MM-DD`.
- The date range is used as `gte` / `lt` in the transform or indexer queries.

### 5) Transforms and Indexers (one at a time)

#### Elastic transform & reindex commands

The local `docker-stack` helper exposes Elastic-related operations via `command-elastic`. Two common commands used in the statistics workflow are:

- `elastic-transform` — build / run transforms (pivot/aggregation) for a product and time range.
- `elastic-reindex` — reindex results (or aggregated metrics) into target indices useful for reporting/consumption.

Below is a short reference for those commands and the flags used in the examples.

#### Example commands

- Run a pivot transform grouped by `(spId, idpId)` for the FranceConnect+ yearly range:

```bash
docker-stack command command-elastic command-elastic elastic-transform --product=franceconnect_plus --range=year --pivot=sp_idp_pair
```

- Reindex aggregated results for the same product / range grouped by `sp` using the metric `nbOfIdentities`:

```bash
docker-stack command command-elastic command-elastic elastic-reindex --product=franceconnect_plus --range=year --pivot=sp --key=nbOfIdentities
```

### Flags explained

- `--product`  
  The product for which the transform/reindex will run. Example values in this repo: `franceconnect_plus` (FranceConnect+) or `franceconnect`.

- `--range`  
  Time range selector that the command uses to scope the source documents. Common values: `year`, `semester`, `month` (project-specific — check your local indexer/command-elastic implementation for the exact supported values). This usually filters the source index with `gte` / `lt` before pivoting.

- `--pivot`  
  Which pivot shape / aggregation pivot to build. Example pivots:

  - `sp` — buckets per service provider only.
  - `idp` — buckets per identity provider only.
  - `idp_public_sp` — buckets per identity provider counting only connections for public service providers.
  - `idp_private_sp` — buckets per identity provider counting only connections for private service providers.
  - `sp_idp_pair` — buckets per (spId, idpId) pair (useful for two‑dimension metrics).

- `--key` (used by `elastic-reindex`)  
  Metric key to reindex or promote during the reindex step.

  - `nbOfIdentities` - Count of unique identities.
  - `nbOfConnections` - Count of all connections.

- `--period`  
  (Optional) The target period in `YYYY-MM` format. It sets the last month of the desired range. By default, it would use the previous month.

### 6) Run all Statistics commands

#### Context

FranceConnect statistics concern:

- 2 products (FranceConnect, FranceConnect+)
- 5 pivots (sp, idp, sp_idp_pair, etc)
- 3 ranges (year, semester, month)
- 2 metric (nbOfIdentities, nbOfConnections)

The number of transforms to execute for a period is:

- 2 x 5 x 3 = 30 transforms

The number of reindex to execute for a period is:

- 2 x 5 x 3 x 2 = 60 reindex

In total, in order to test, we need to run **180 commands**

- 30 x 2 + 60 x 2 = 180 commands

We have written the script [launch-elastic-commands.sh](scripts/launch-elastic-commands.sh) in order to launch all combinations of command-elastic commands.

#### Example command

The script follows those steps:

1. It creates and starts all the elastic tranforms
2. It waits 5 minutes
3. It runs all the transform watcher commands (to change the tranform status from running to completed in the `control` index)
4. It runs all the reindex processes
5. It waits 5 minutes
6. It runs all the reindex watcher commands (to change the reindex status from running to completed in the `control` index)

```bash
yarn stats:run
```

### 7) Search the data in local Elasticsearch

Open the Devtool console: http://localhost:5601/app/dev_tools#/console

#### Query the tracks index (ingested business logs)

```json
GET tracks/_search
{
  "size": 100
}
```

```json
GET tracks/_search
{
  "size": 1000,
  "track_total_hits": true,
  "query": {
    "bool": {
      "filter": [
        { "term": { "service": "fc_core_low_app" } }
      ]
    }
  }
}
```

#### Query the events index (old fc-worker statistics)

Index used by `fc-worker`. The tranforms are using directly the business logs from `tracks` index instead.

```json
GET events/_search
{
  "size": 100
}
```

#### Query a transform

```json
GET 2025-11_sp_franceconnect_plus_year/_search
{
  "size": 100
}
```

#### Query the control index (list of stats processes)

The control index lists all the transform and reindex processes and their state (running, failed or completed).

```json
GET /control/_search
{
  "size": 100
}
```

Get the "not completed" transform operations for FranceConnect stats

```json
GET /control/_search
{
  "size": 100,
  "query": {
    "bool": {
      "filter": [
        { "term": { "operation": "transform" } },
        { "term": { "options.product": "franceconnect" } }
      ],
      "must_not": [
        { "term": { "state": "completed" } }
      ]
    }
  }
}
```

Get the "not completed" reindex operations for FranceConnect+ stats

```json
GET /control/_search
{
  "size": 100,
  "query": {
    "bool": {
      "filter": [
        { "term": { "operation": "reindex" } },
        { "term": { "options.product": "franceconnect_plus" } }
      ],
      "must_not": [
        { "term": { "state": "completed" } }
      ]
    }
  }
}
```

#### Query the metrics index (new statistics)

```json
GET metrics/_search
{
  "size": 100,
  "query": {
    "bool": {
      "filter": [
        {"term": {"key": "nbOfConnections"}},
        {"term": {"product": "franceconnect_plus"}},
        {"term": {"range": "year"}},
        {"term": {"date": "2025-11"}}
      ]
    }
  }
}
```

```json
GET metrics/_search
{
  "size": 100,
  "query": {
    "bool": {
      "filter": [
        {"term": {"key": "nbOfIdentities"}},
        {"term": {"product": "franceconnect_plus"}},
        {"term": {"range": "year"}},
        {"term": {"date": "2025-11"}}
      ]
    }
  }
}
```

```json
GET metrics/_search
{
  "size": 10000,
  "track_total_hits": true,
  "query": {
    "bool": {
      "filter": [
        { "term": { "product": "franceconnect_plus" } },
        { "term": { "range": "year" } }
      ]
    }
  }
}
```
