# Process explaination

This fixture consists on a script : `./scripts/populate-account-traces.script.js`
This scripts will populate the Elasticsearch database with fake service providers traces of different kinds.

- Trace with an xxpired date trace (> 6 month).
- Trace with an invalid event name.
- Trace with a valide format.

## Data mock

The raw data-mocks are stored in `./mocks/account-data.mock.js`, they have some placeholders that will be removed
by the population script.

## Populate script

The population script is connected to the Elasticsearch database.
The connection credentials are provided by local environment vars set in the
previous docker compose launcher: `/fc-docker/compose/fc-core.yml` in the container `csmr-tracks`:

- `Elasticsearch_TRACKS_INDEX = fc_tracks`
- `Elasticsearch_PROTOCOL = 'http'`
- `Elasticsearch_HOST = 'localhost'`
- `Elasticsearch_PORT = 9200`

## Execute the population script

```sh
$> # connect to the local container
$> docker exec -it fc_csmr-tracks_1 /bin/bash
$> cd apps/csmr-tracks/fixtures

$> ## control that the global var are available in the container
$> echo $Elasticsearch_TRACKS_INDEX

$> # execute the population script
$> node --trace-warnings ./scripts/populate-account-traces.script.js
```
