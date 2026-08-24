# Mode `replay`

A statistic is computed for a **combination** of three axes:

- **the product** (`PRODUCT`) — FranceConnect or FranceConnect+ ;
- **the axis** (`PIVOT`) — how connections are grouped: by service provider, by
  identity provider, by pair, etc. ;
- **the metric** (`KEY`) — what is counted: number of connections, or number of
  identities.

For example, "*number of connections, grouped by service provider, for
FranceConnect*" is one combination.

`TASK=replay` recomputes **one** of these combinations only. Use it for a one-off
rerun, when a single statistic needs to be refreshed — without rerunning the
whole set.

> Because it targets one combination, `PRODUCT`, `PIVOT` and `KEY` are all
> required. To recompute **every** combination at once, use
> [mode-auto.md](./mode-auto.md) instead.

> For the list of every product, axis and metric, see
> [schedules.md › Combination variables](./schedules.md#combination-variables).

## Examples

> `STATS_IMAGE_TAG` is optional in these examples — it defaults to `latest`. Set
> it only to pin a specific tag.

### Replay a monthly combination

| Variable | Value |
|---|---|
| `TASK` | `replay` |
| `RANGE` | `month` |
| `PRODUCT` | `franceconnect` |
| `PIVOT` | `sp` |
| `KEY` | `nbOfConnections` |
| `PERIOD` | `2025-03` |
| `STATS_IMAGE_TAG` | `<tag>` |

Recomputes connections by service provider, for FranceConnect, for **March 2025**.
Leave `PERIOD` empty to default to last month.

### Replay a yearly combination

| Variable | Value |
|---|---|
| `TASK` | `replay` |
| `RANGE` | `year` |
| `PRODUCT` | `franceconnect_plus` |
| `PIVOT` | `idp` |
| `KEY` | `nbOfIdentities` |
| `PERIOD` | `2024` |
| `STATS_IMAGE_TAG` | `<tag>` |

Recomputes identities by identity provider, for FranceConnect+, for the **whole
year 2024**. Leave `PERIOD` empty to default to last year.

### Replay a semestrial combination

| Variable | Value |
|---|---|
| `TASK` | `replay` |
| `RANGE` | `semester` |
| `PRODUCT` | `franceconnect` |
| `PIVOT` | `sp_idp_pair` |
| `KEY` | `nbOfConnections` |
| `PERIOD` | `2024-07` |
| `STATS_IMAGE_TAG` | `<tag>` |

Recomputes connections by service-provider/identity-provider pair, for
FranceConnect, for **S2 2024** (July 1, 2024 → January 1, 2025).

A semester is identified by its **start month**: `YYYY-01` for S1, `YYYY-07` for
S2. Any other month is rejected with an explicit error. Leave `PERIOD` empty to
default to the previous civil semester.
