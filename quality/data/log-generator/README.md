# Elasticsearch Event Injection Tool

This JavaScript application allows you to inject events into an Elasticsearch cluster. It provides functionalities to generate, remove, inject, and add events for various platforms.

## Prerequisites

- Node.js
- Yarn
- Elasticsearch instance

## Usage

The application provides the following commands: `generate`, `remove`, `inject`, `add`. Each command must be preceded by `yarn traces`.

### Command Structure

```bash
cd $FC_ROOT/fc/quality/fcp
yarn traces <action> <platform> <accountId> <parameter>
```

### Actions

- **generate**: Generate mock data from fixture for the specified platform.
- **remove**: Remove data for the specified platform.
- **inject**: Inject log data from a specified file.
- **add**: Add a specific event.

### Platforms

- **legacy**: FCP Legacy platform.
- **low**: FCP Low platform.
- **high**: FCP High platform.
- **all**: All platforms.

### Account ID

- Specify the account ID for which the actions will be performed (e.g., `test_TRACE_USER`).

### Parameter

- For the `inject` command, provide the name of the log file (without the file extension).
- For the `add` command, provide the event (`action/type_action` for `legacy`, or `event` for other platforms).

### Examples

#### Generate Mock Data

```bash
yarn traces generate legacy
```

This command will generate mock data for the `legacy` platform (FC legacy) and the account ID `test_TRACE_USER` with default log and the 3 default dates ( 1 day before, 6 months minus 1 day and 6 months plus 1 day).

```bash
yarn traces generate low test '["folder/fileName.ejs"]' '["YYYY-MM-DD"]'
```

This command will generate mock data for the `low` platform (FC low) and the account ID `test` with `folder/fileName.ejs` fixture ejs ( example: `fcp-high/public_fsp1-high_fip1-high.mock.ejs`) and the custom date passed.

#### Remove Data

```bash
yarn traces remove low
```

This command will remove data for the `low` platform (FC low).

#### Inject Log Data

```bash
yarn traces inject high '' fileName.log
```

This command will inject log data from `fileName.log` (from '/docker/volumes/log/') for the `high` platform (FC+) and the default account ID: `test_TRACE_USER` (as no accountId is specified).

## Development

### Project Structure

- **__ mocks __**: Contains mocks file.
- **fixtures**: Contains fixtures to generate log.
- **src**: Contains the source code.
- **src/config**: Contains the configurations necessary for the application's operation.
- **src/enums**: Contains enumerations used in the application.
- **src/helpers**: Contains helper functions and utilities.
- **src/interfaces**: Contains TypeScript interfaces used in the application.

### Running Tests

To run the tests, use the following command:

```bash
cd $FC_ROOT/fc/quality
yarn test
```

---

Thank you for using the Elasticsearch Event Injection Tool! We hope it helps you manage your Elasticsearch events efficiently.