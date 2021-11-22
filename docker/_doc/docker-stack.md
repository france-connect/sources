# Local docker environment

## Description

This directory contains everything to run a local FranceConnect or AgentConnect stack. This local environment is as close as possible to the other distant ones (proxy, rp, a virtual HSM ...). Be careful not to launch too many containers as it could take too much resources (we are working on that).

## Content

- The core applications (core-\*) which are the main applications of FranceConnect (FC), AgentConnect (AC) and FranceConnect+ (FC+).
- The back office applications (exploitation-\*) used to manage the projects.
- The identities providers mocks (fip-_ for FC and FC+, fia-_ for AC).
- The services providers mocks (fsp-_ for FC and FC+, fsa-_ for AC).
- The user websites for [FC / FC+](https://franceconnect.gouv.fr) and [AC](https://agentconnect.gouv.fr).
- The eIDAS applications which are used for european interoperability.
- All softwares needed alongside those apps to make the stack work (MongoDB, Redis, SoftHSM, NginX, Squid, Elasticsearch, ...).

## Prerequisites

- A linux working environment (The stack is used on ubuntu LTS 20.04 on a daily basis)
- [Yarn package manager](https://yarnpkg.com/getting-started/install). You may need to uninstall [cmdtest](https://stackoverflow.com/questions/46013544/yarn-install-command-error-no-such-file-or-directory-install).
- [Docker >= 20.04](https://docs.docker.com/engine/install/ubuntu). Don't forget to do `sudo usermod -aG docker $USER` disconnect and reconnect your current user.
- [docker-compose = 1.21](https://docs.docker.com/compose/install).
- Installing the build-essential package. `sudo apt install build-essential`.
- ~~[Binding the container root user to the current host user](https://docs.docker.com/engine/security/userns-remap).~~

> For hot-reload to work properly you will need to authorize more watchers on your exploitation system (see [Webpack Article](https://webpack.js.org/configuration/watch/#not-enough-watchers)).

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
cat /proc/sys/fs/inotify/max_user_watches # check output -> 524288
```

## Setup the working environment

Now we will setup the working environment for the docker-stack.

- Add the following lines to your `~/.bashrc`:

```bash
# change /path/to/france/connect/workspace/ by actual path to your working directory:
export FC_ROOT=/path/to/france/connect/workspace/

# Workaround for UnixHTTPConnectionPool(host='localhost', port=None): Read timed out. (read timeout=70) :
export COMPOSE_HTTP_TIMEOUT=200

# Makes cypress aware of root path, not having to create relative path from e2E test file
export CYPRESS_FC_ROOT=$FC_ROOT

# Setup the docker registry url
export FC_DOCKER_REGISTRY=france-connect-docker-registry-url

# Alias for the docker-stack command (you can add it to your "~/.bash_aliases" if you prefer but don't forget to set the variables before the .bash_aliases sourcing in your .bashrc 😉) :
alias docker-stack=$FC_ROOT/fc/docker/docker-stack
```

- Clone every needed repository

  - If you are an internal developer

  ```bash
  mkdir -p $FC_ROOT && cd $FC_ROOT

  # The mains repositories
  git clone <france-connect-repository>/fc.git
  git clone <france-connect-repository>/rnipp-mock.git

  # User website, not needed most of the time
  git clone <france-connect-repository>/usagers.git
  git clone <france-connect-repository>/usagers-fca.git
  git clone <france-connect-repository>/formulaire-usagers.git

  # Old backoffice apps (DEPRECATED)
  git clone <france-connect-repository>/fc-apps.git
  ```

  - If you are an external developer

  ```bash
  mkdir -p $FC_ROOT && cd $FC_ROOT

  # The mains repositories
  git clone git@github.com:france-connect/sources.git fc
  git clone git@github.com:france-connect/sources.git/rnipp-mock.git

  # ⚠️ You currently does not have access to others repositories listen below
  ```

- Link the cloned repository in the docker volumes

```bash
cd $FC_ROOT/fc/docker/volumes/src
ln -s $FC_ROOT/fc
ln -s $FC_ROOT/rnipp-mock

ln -s $FC_ROOT/fc-apps

ln -s $FC_ROOT/usagers
ln -s $FC_ROOT/usagers-fca
ln -s $FC_ROOT/formulaire-usagers
```

- Add to your host file `/etc/hosts`

```bash
127.0.0.1 elasticsearch
```

## Quick Start

This is the main script you will use to manipulate the local environment. If you run a command `docker-stack` without arguments, it will display most of the available commands. To minimize performances impacts, you can run a sub-stack using `docker-stack up <sub-stack>`.

### Running FranceConnect

```bash
docker-stack up min-fcp-low
docker-stack dep-all
docker-stack start-all
```

### Running FranceConnect+

```bash
docker-stack up min-fcp-high
docker-stack dep-all
docker-stack start-all
```

### Running EidasBridge

```bash
docker-stack up min-eidas-high
docker-stack dep-all
docker-stack start-all
```

### Running AgentConnect

```bash
docker-stack up min-fca-low
docker-stack dep-all
docker-stack fca-low-front
docker-stack start-all
```

You will then find a list of accessible URLs here: https://hello.docker.dev-franceconnect.fr. Most URLs follow the same pattern <app-name>.docker.dev-franceconnect.fr

> Nota bene: You can use `docker-stack log <app-container>` to obtain the NodeJS app logs. Ex. `docker-stack log fsp1-low` or `docker-stack log core-fcp-high`.

### Halt a stack

```bash
docker-stack halt
```

### Starting more or less fresh

```bash
# Will clean docker containers and networks
docker-stack prune
# Will remove as well images, caches, node_modules...
docker-stack prune-all
```

### See Usages

```bash
docker-stack help
```

## Some advanced usage

### Access a MongoDb shell

```bash
docker-stack mongo-shell-core-fcp-high
# Or
docker-stack mongo-shell-core-fcp-low
# Or
docker-stack mongo-shell-core-fca-low
```

### Reset the MongoDb fixtures

```bash
docker-stack reset-db-core-fcp-high
# Or
docker-stack reset-db-core-fcp-low
# Or
docker-stack reset-db-core-fca-low
```

### Execute a shell command in a container

```bash
# some commands may not work as expected since a refacto is in progress
docker-stack exec <container_name> <command>
```

### Troubleshooting

You may experience some docker network issues with docker containers, for exemple in case of a switch of network on the hosts or long inactivity of the stack.

In most case you can get back a healthy state by reseting the stack with `docker-stack prune`
