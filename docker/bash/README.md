# docker-stack: FranceConnect's dev stack utility

`docker-stack` is the tool to manage FranceConnect stacks for the development environment.  
It provides tools and conventions for getting a stack up and running.

The main entrypoint is located at the root of the [`$FC_ROOT/docker`](../docker-stack) folder for historical reasons.  
The real content is in this folder, in [index.sh](./index.sh).

## Quick start

We advise to create a shortcut alias as `dks` for everyday use.

```bash
# ~/.bashrc
alias dks=$FC_ROOT/fc/docker/docker-stack
```

List available commands by running `help` command:

```bash
dks help
```

Use `VERBOSE` env var if you need more output for debugging:

```bash
VERBOSE=1 dks up <some-stack>
```

Use `OFFLINE` env var if you don't want / can't connect to docker registry:  
_(you need to already have an existing version of docker images you want to use)_

```bash
OFFLINE=1 dks up <some-stack>
```

## Developer tools to maintain and extend docker-stack

### Commands

This tools is intended to register commands that can be run by `docker-stack` and generate a dynamic summary of available commands.

**`_command_register`** is the only function one should use, to add a new command to `docker-stack`.

Here are its arguments:

| position | name    | type   | description                                                             |
| -------- | ------- | ------ | ----------------------------------------------------------------------- |
| 1        | key     | string | the name that will be used to invoke the command: `docker-stack <key>`  |
| 2        | command | string | the bash function that will be invoked (as a string)                    |
| 3        | usage   | string | documentation about the command, will be printed in help or error cases |

The use of `commands` require that you define a single function to handle the actual command code. This is not a hard prerequisites but a general good practice that will both prevent issues with arguments, IO, etc. and make your code much more readable.

> :bulb: Avoid oneliners and the use of `&&` or `;`

> :pencil: Source code is in [./utils/commands.sh](./utils/commands.sh).

> :bulb: Commands should be stored in [./commands](./commands) directory.

### Tasks

The `task` utility allows to wrap a function call to hide the output, making the global output of a command much lighter.

Here are its arguments:

| position | name  | type   | description                                                           |
| -------- | ----- | ------ | --------------------------------------------------------------------- |
| 1        | label | string | A description of the task being ran, will hang for result of the task |
| 2        | task  | string | the bash function that will be executed                               |

The utility first print the `label`, then execute the `task`.

In case of error during execution, both `STDOUT` and `STDERR` will be printed to the screen.

In case of success, the utility will display an "OK" message after the `label`.

The whole behavior can be turned off using the global variable `VERBOSE` :

```shell
> VERBOSE=1 docker-stack up some-stack
```

**Returning custom messages**

The utility allows to return custom messages instead of "OK".  
To use this feature, use `_task_result` in your task.

| position | name    | type     | description                                                                                  |
| -------- | ------- | -------- | -------------------------------------------------------------------------------------------- |
| 1        | message | string   | The custom message to display                                                                |
| 2        | newline | any/null | Should the terminal print a new line after your message? defaults to not printing a new line |

> :pencil: Source code is in [./utils/task.sh](./utils/task.sh).

### Initialisation hooks

Initialisation hooks allow you to define instructions to be executed after stack startup, matching the containers that are up at this moment.

This is the place to load some fixtures in a database for example.

The index file contains a `case` statement which allows basic pattern matching against container names.

The init functions should be placed in a dedicated file in the [/hooks](./hooks) directory.

> :bulb: Target the container that really needs the operation to be run.

> :pencil: Source code is in [./hooks/index.sh](./hooks/index.sh).

## Other features

### Wait

Wait for a nodejs app to be up (useful mostly for CI)

Usage in script:

```bash
wait_for_nodejs container-name, URL [max_time, delay_between_retries, max_retries]
```

Usage is shell / CI:

```bash
> docker-stack wait "fc-exploitation" "https://fc-exploitation.docker.dev-franceconnect.fr"
```

This will print PM2 logs on case of failure to reach the app.  
See source for more information.

> :pencil: Source code is in [./utils/wait.sh](./utils/wait.sh).

### Format

Helpers to format string printed by utilities.

> :pencil: Source code is in [./utils/format.sh](./utils/format.sh).
