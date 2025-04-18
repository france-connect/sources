# Local docker environment

## Description

This directory contains everything to run a local FranceConnect stack. This local environment is as close as possible to the other distant ones (proxy, rp, a virtual HSM ...). Be careful not to launch too many containers as it could take too much resources (we are working on that).

## Content

- The core applications (core-\*) which are the main applications of FranceConnect (FC) and FranceConnect+ (FC+).
- The back office applications (exploitation-\*) used to manage the projects.
- The identities providers mocks (fip-\_ for FC and FC+).
- The services providers mocks (fsp-\_ for FC and FC+).
- The user websites for [FC / FC+](https://franceconnect.gouv.fr)
- The eIDAS applications which are used for european interoperability.
- All software needed alongside those apps to make the stack work (MongoDB, Redis, SoftHSM, NginX, Squid, Elasticsearch, ...).

## Prerequisites

- A linux working environment (The stack is used on ubuntu LTS 20.04 on a daily basis)
- [Yarn package manager](https://yarnpkg.com/getting-started/install). You may need to uninstall [cmdtest](https://stackoverflow.com/questions/46013544/yarn-install-command-error-no-such-file-or-directory-install).
- [Docker >= 20.04](https://docs.docker.com/engine/install/ubuntu). Don't forget to do `sudo usermod -aG docker $USER` disconnect and reconnect your current user.
- [Docker Compose >= 2.0](https://docs.docker.com/compose/install).
- Bash >= 5
- Installing the build-essential package. `sudo apt install build-essential`.
- ~~[Binding the container root user to the current host user](https://docs.docker.com/engine/security/userns-remap).~~

> For hot-reload to work properly you will need to authorize more watchers on your exploitation system (see [Webpack Article](https://webpack.js.org/configuration/watch/#not-enough-watchers)).

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
cat /proc/sys/fs/inotify/max_user_watches # check output -> 524288
```

### Under OS X

```bash
brew install bash
brew install coreutils
```

Install the latest version of bash.
Install coreutils gives you access to the timeout function.

## Setup the working environment

Now we will set up the working environment for the docker-stack.

- Add the following lines to your `~/.bashrc`:

```bash
# change /path/to/france/connect/workspace/ by actual path to your working directory:
export FC_ROOT=/path/to/france/connect/workspace/

# Workaround for UnixHTTPConnectionPool(host='localhost', port=None): Read timed out. (read timeout=70) :
export COMPOSE_HTTP_TIMEOUT=200

# Makes cypress aware of root path, not having to create relative path from e2E test file
export CYPRESS_FC_ROOT=$FC_ROOT

# Setup the docker registry url
export FC_DOCKER_REGISTRY=registry.gitlab.dev-franceconnect.fr/france-connect/fc

# Alias for the docker-stack command (you can add it to your "~/.bash_aliases" if you prefer but don't forget to set the variables before the .bash_aliases sourcing in your .bashrc 😉) :
alias dks=$FC_ROOT/fc/docker/docker-stack

# If you use version 2 of docker compose
export FC_DOCKER_COMPOSE='docker compose'
```

- Clone every needed repository

  - If you are an internal franceconnect developer

  ```bash
  mkdir -p $FC_ROOT && cd $FC_ROOT

  # The mains repositories
  git clone <france-connect-repository>/fc.git
  git clone <france-connect-repository>/rnipp-mock.git

  # User website, not needed most of the time
  git clone <france-connect-repository>/usagers.git
  git clone <france-connect-repository>/formulaire-usagers.git

  # Backoffice apps
  git clone <france-connect-repository>/fc-apps.git
  ```

  - If you are an internal agentconnect developer

  ```bash
  mkdir -p $FC_ROOT && cd $FC_ROOT

  # The main repository
  git clone <france-connect-repository>/fc.git

  # Backoffice apps
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
ln -s $FC_ROOT/formulaire-usagers
```

- Add to your host file `/etc/hosts`

```bash
127.0.0.1 elasticsearch
```

## Quick Start

This is the main script you will use to manipulate the local environment. If you run a command `dks` without arguments, it will display most of the available commands. To minimize performances impacts, you can run a sub-stack using `dks up <sub-stack>`.

### Docker Registry

To pull FC docker images, you will need to authenticate against the FC docker registry:

```bash
docker login $FC_DOCKER_REGISTRY
```

You will be prompted for:

- a username: use your gitlab.dev-franceconnect.fr username
- a password: as two factor authentication is mandatory, you'll need to create an access token with only "read_registry" permission from your account settings: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html. If you are not from the internal team, please ask an FC for one through support.

### Running FranceConnect

```bash
dks up min-fcp-low
dks start-all
```

### Running FranceConnect+

```bash
dks up min-fcp-high
dks start-all
```

### Running EidasBridge

```bash
dks up min-eidas-high
dks start-all
```

### Testing the installation

You will then find a list of accessible URLs here: https://hello.docker.dev-franceconnect.fr.

Most URLs follow the same pattern <app-name>.docker.dev-franceconnect.fr

On any URL, if you got a 502, it might still be booting, wait one minute then reload.

### Get the logs

You can use `dks log <app-container>` to obtain the NodeJS app logs. Ex. `dks log fsp1-low` or `dks log core-fcp-high`.

### Halt a stack

```bash
dks halt
```

### Starting more or less fresh

```bash
# Will clean docker containers and networks
dks prune
# Will remove as well images, caches, node_modules...
dks prune-all
```

### See Usages

```bash
dks help
```

## Some advanced usage

### Access a MongoDb shell

```bash
dks mongo-shell-core-fcp-high
# Or
dks mongo-shell-core-fcp-low
```

### Reset the MongoDb fixtures

```bash
dks reset-db-core-fcp-high
# Or
dks reset-db-core-fcp-low
```

### Execute a shell command in a container

```bash
# some commands may not work as expected since a refacto is in progress
dks exec <container_name> <command>
```

### Troubleshooting

You may experience some docker network issues with docker containers, for exemple in case of a switch of network on the hosts or long inactivity of the stack.

In most case you can get back a healthy state by resetting the stack with `dks prune`

### Maintaining and Extending

See [dedicated README](../bash/README.md) alongside the source code of docker-stack.
