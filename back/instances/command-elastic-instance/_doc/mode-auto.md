# Mode `auto`

A statistic is computed for a **combination** of three axes:

- **the product** — FranceConnect or FranceConnect+ ;
- **the axis** (`PIVOT`) — how connections are grouped: by service provider, by
  identity provider, by pair, etc. ;
- **the metric** (`KEY`) — what is counted: number of connections, or number of
  identities.

For example, "*number of connections, grouped by service provider, for
FranceConnect*" is one combination.

`TASK=auto` computes **all** the combinations at once for a single time range
(`RANGE`). It is the mode used by the recurring schedules: every month (or year,
or semester), it refreshes the full set of statistics in one run.

> For the list of every product, axis and metric, see
> [schedules.md › Combination variables](./schedules.md#combination-variables).

## Examples

> `STATS_IMAGE_TAG` is optional in these examples — it defaults to `latest`. Set
> it only to pin a specific tag.

### Compute the previous month

| Variable | Value |
|---|---|
| `TASK` | `auto` |
| `RANGE` | `month` |
| `STATS_IMAGE_TAG` | `<tag>` |

`PERIOD` is left empty, so the command computes the previous month
(e.g. run on 2025-04-05 → processes **March 2025**).

### Backfill a specific month

| Variable | Value |
|---|---|
| `TASK` | `auto` |
| `RANGE` | `month` |
| `PERIOD` | `2025-03` |
| `STATS_IMAGE_TAG` | `<tag>` |

Processes **March 2025** for every combination, regardless of today's date.

### Backfill a specific year

| Variable | Value |
|---|---|
| `TASK` | `auto` |
| `RANGE` | `year` |
| `PERIOD` | `2024` |
| `STATS_IMAGE_TAG` | `<tag>` |

Processes the **whole year 2024**.

### Backfill a specific semester

| Variable | Value |
|---|---|
| `TASK` | `auto` |
| `RANGE` | `semester` |
| `PERIOD` | `2025-01` |
| `STATS_IMAGE_TAG` | `<tag>` |

Processes **S1 2025** (January 1 → July 1, 2025). A semester is identified by its
**start month**: `YYYY-01` for S1, `YYYY-07` for S2.
