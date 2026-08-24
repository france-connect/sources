# Stats GitLab schedules

How the statistics pipeline is driven by GitLab CI schedules. For the logic of
the commands themselves (transform → watcher → reindex → watcher, control index
states), see [workflow.md](./workflow.md).

## Step-by-step guide

A full walkthrough — how to create the schedules from scratch, with screenshots and the operational context — lives in the wiki:

[Exploitation › Pipeline schedules](/france-connect/documentation/-/wikis/Exploitation/Pipeline-schedules)

This page stays focused on the reference: which job builds the image, which
modes the pipeline supports, and which variables each schedule needs.

## Building the image

Schedules run a pre-built image pulled from the FC registry; they never build it.

To publish a new image:

1. Create a git tag (e.g. `fc-403RC0`).
2. In the tag pipeline, manually trigger the
   `stats/command-elastic-instance-build-image` job.

The image is published to the FC container registry under the git tag name, and
the schedules consume it through `STATS_IMAGE_TAG` (see below).

## Tagging an image as `latest`

Schedules can run `latest` rather than a specific git tag. Once a tag has been
validated, promote its image to `latest` in the FC container registry with the
`stats/command-elastic-instance-tag-to-prod-image` job. It is manual and only
available on a release-candidate tag.

A schedule then runs `latest` by default and always uses the last promoted image,
without changing the schedule at each release.

## Variables

These variables apply to both modes:

| Variable | Required | Values | Purpose |
|---|---|---|---|
| `STATS_IMAGE_TAG` | yes | A git tag (e.g. `fc-403RC0`) or `latest` | Selects which image the schedule runs. Defaults to `latest`; override it to pin a specific tag. |
| `RANGE` | yes | `month`, `semester` or `year` | The period granularity to compute. |
| `PERIOD` | no | `YYYY-MM`, `YYYY`, `YYYY-01`/`YYYY-07` | Window to process. Omitted → derived from `RANGE`. |
| `RUNNER_TAG` | no | A GitLab runner tag | The runner the jobs run on. Defaults to `poc_stats`. |
| `OPTIONS` | no | `--dry-run`, `--force` | Extra flags forwarded to the commands (see below). |

### Combination variables

These define a single combination — the product, the aggregation axis and the
metric. They are required in `replay` mode:

| Variable | Required | Values | Purpose |
|---|---|---|---|
| `PRODUCT` | yes (replay) | `franceconnect`, `franceconnect_plus` | The product to compute. |
| `PIVOT` | yes (replay) | `sp`, `idp`, `sp_idp_pair`, `idp_public_sp`, `idp_private_sp` | The aggregation axis. |
| `KEY` | yes (replay) | `nbOfIdentities`, `nbOfConnections` | The metric to compute. |

### Extra command flags (`OPTIONS`)

`OPTIONS` is forwarded as-is to the underlying commands:

| Value | Effect |
|---|---|
| `--dry-run` | No write operation is performed; the command only logs the actions it would take. |
| `--force` | Forces recreation of the transform/reindex even if it already exists. |

Use one or the other: `--force` only matters for a real run, so combining it with
`--dry-run` (which writes nothing) has no effect.

### Deriving `PERIOD`

`PERIOD` is forwarded only when set. When omitted, the command derives it from
`RANGE`:

- `month` → previous month (`YYYY-MM`)
- `year` → previous year (`YYYY`)
- `semester` → previous civil semester (`YYYY-01` or `YYYY-07`)

## Modes

Once the variables are known, a schedule runs in one of two modes, set through
the `TASK` variable:

| Variable | Required | Values | Purpose |
|---|---|---|---|
| `TASK` | yes | `auto` | Run every `PRODUCT × PIVOT` (× `KEY`) combination in parallel for a single `RANGE`. See [mode-auto.md](./mode-auto.md) for examples. |
| `TASK` | yes | `replay` | Replay one specific combination (`PRODUCT × PIVOT × KEY`). See [mode-replay.md](./mode-replay.md) for examples. |

## Recurring schedules to create

Three independent schedules must be created in the GitLab UI, each with its own
cadence. The cron runs on the 5th of the period (5-day buffer to let late
events land in the source index).

| Schedule | Cron | Purpose |
|---|---|---|
| Monthly | `0 4 5 * *` | Computes the previous month, on the 5th of every month. |
| Yearly | `0 4 5 1 *` | Computes the previous year, on January 5th. |
| Semestrial | `0 4 5 1,7 *` | Computes the previous civil semester, on January 5th and July 5th. |

Leave `PERIOD` empty for normal runs — the command derives it. Set `PERIOD`
only to backfill a specific window manually.
