# Stats commands workflow

How the `command-elastic` commands build the statistics, and how their state is
tracked. This is about the commands themselves, not about setting up a local
stack or generating test data.

## The four commands

| Command | Role |
|---|---|
| `elastic-transform` | Create and start an Elasticsearch transform that aggregates the source tracks into a pivot result. |
| `elastic-transform-watcher` | Refresh the state of every running transform in the control index. Exits `0` when none remain pending/running, `1` otherwise. |
| `elastic-reindex` | Reindex a finished transform result into the `metrics` index for a given metric key. |
| `elastic-reindex-watcher` | Refresh the state of every running reindex. Exits `0` when none remain pending/running, `1` otherwise. |

The full cycle is **transform → transform-watcher → reindex → reindex-watcher**.
Reindex consumes the output of a completed transform, so the transform must reach
`completed` before its reindex starts.

## Control index: the source of truth

Each operation is tracked by a *control document* in the control index. The
document carries the operation type (`transform` / `reindex`), its options
(`product`, `range`, `pivot`, `key`, `period`) and a `state`:

| State | Meaning |
|---|---|
| `pending` | Control document created, operation not started yet. |
| `running` | Operation launched, not finished. |
| `completed` | Final — operation succeeded. |
| `failed` | Final — operation missing or in error. |

`completed` and `failed` are terminal. Watchers only act on `running` documents
and move them toward a terminal state.

## How a transform progresses

`elastic-transform` (`safeInitializeTransform`):

1. Gets or creates the control document (state `pending`).
2. Looks up the actual ES transform for the same options.
3. Initializes it **only if** it does not exist yet and the control document is
   `pending` — unless `--force`, which always re-initializes.
4. On launch, moves the control document to `running`.

So re-running `elastic-transform` on an already-initialized operation is a no-op
by design; use `--force` to restart it.

`elastic-transform-watcher` (`actualizeAllTransforms`):

1. Lists every `running` transform control document.
2. For each, reads the real ES transform state and computes the next state:
   - transform missing → `failed`
   - transform completed → `completed`
   - transform still running → `running`
   - any other case → `failed`
3. Updates the control documents.
4. Returns `true` only when no non-final transform operation remains.

The exit code is what the CI watch loop relies on: it keeps polling until the
watcher returns `0`.

## How a reindex progresses

`elastic-reindex` / `elastic-reindex-watcher` follow the same pattern as the
transform pair, on `reindex` control documents. A reindex targets a single
metric `--key` (`nbOfIdentities` or `nbOfConnections`), whereas a transform has
no key — this is why one transform feeds several reindexes.

## Options

| Flag | Commands | Meaning |
|---|---|---|
| `--product` | all create commands | `franceconnect` or `franceconnect_plus`. |
| `--range` | all create commands | `month`, `semester` or `year`. Scopes the source documents. |
| `--pivot` | transform, reindex | Aggregation shape: `sp`, `idp`, `sp_idp_pair`, `idp_public_sp`, `idp_private_sp`. |
| `--key` | reindex only | Metric to promote: `nbOfIdentities` or `nbOfConnections`. |
| `--period` | create commands | Optional. Window to process; format depends on `--range` (`YYYY-MM`, `YYYY`, `YYYY-01`/`YYYY-07`). Defaults to the previous period. |
| `--dry-run` | all | No write; only logs the intended actions. |
| `--force` | transform, reindex | Re-initialize even if the operation already exists. |

## Combinatorics

For one period: 2 products × 5 pivots × 3 ranges = **30 transforms**, and
× 2 metric keys = **60 reindexes**. The CI `auto` mode fans these out in
parallel (see [schedules.md](./schedules.md)).
