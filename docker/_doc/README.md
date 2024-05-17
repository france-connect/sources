# The local DEV stack

- [The local DEV stack](#the-local-dev-stack)
  - [Architecture](#architecture)
    - [docker-stack script](#docker-stack-script)
    - [Directory : compose](#directory--compose)
    - [Directory: volumes](#directory-volumes)
  - [How To](#how-to)
    - [Add a new application to the stack](#add-a-new-application-to-the-stack)
      - [Requirements](#requirements)
      - [Front Application](#front-application)

## Architecture

:warning: The structure described below is the goal we aim for. The current architecture could not perfectly match it.

### docker-stack script

The docker-stack script can be used to ease the manipulation of the local DEV stack. It is also used by the CI.

See [docker-stack.md](./docker-stack.md).

### Directory : compose

This directory contains all compose files with their environement files. The content is organized with the following pattern:

```
compose/
  shared/ -> contains compose files for shared bricks (proxys, rnipp-mock, ...)
    .env/
      base-env.env -> Contains ENV vars shared between all NodeJS apps
  stack-name/
    .env/
      service-1.env
      service-2.env
    service-1.yml
    service-2.yml
    stack.yml -> Contains the definition of groups containers for this stack (min-core-fcp-high, all-core-fcp-high for exemple)
```

### Directory: volumes

The directory contains volumes that will be mounted inside the docker containers.

```
volumes/
  shared/
    shared-service/
      ...
  stack-name
    service-1/
      ...
    service-2/
      ...
```

⚠️ Some volumes are symbolic links to source code from in /back or /front folders.

## How To

### Add a new application to the stack

#### Requirements

- create a named application folder into `compose` folder (see [description](#directory--compose))
- create the `<my_application>/.env` folder

- create the `<my_application>/stack.yml` file

```yml
version: "2.4"

services:
  <my_application>:
    image: alpine
    depends_on:
      - "<my_application>-<front/back>"

  bdd-<my_application>:
    image: alpine
    depends_on:
      # -- MY APPLICATION
      - "<my_application>"
```

- create the application availables services `<my_application>/<my_application>.yml` file

```yml
version: "2.4"

services:
  <my_application>-<back/front>:
    hostname: <my_application>-<back/front>
    image: ${FC_DOCKER_REGISTRY}/nodejs:${NODE_VERSION}-dev
    user: ${CURRENT_UID}
    working_dir: /var/www/app
    depends_on:
      - <...any_required_service...>
    volumes:
      - "${VOLUMES_DIR}/src/fc/<back/front>:/var/www/app"
      - "${VOLUMES_DIR}/app:/opt/scripts"
      - "${VOLUMES_DIR}/.home:/home"
      - <...others_required_volumes...>
    env_file:
      - "${COMPOSE_DIR}/shared/.env/base-app.env"
    networks:
      - public
    command: "pm2 logs"
```

#### Front Application

- create the `<my_application>/.env/<my_application>-front.env` file

```yml
PM2_SCRIPT=yarn start <my_application>
PM2_CI_SCRIPT=yarn preview <my_application>
VIRTUAL_HOST=<my_application>.docker.dev-franceconnect.fr
VIRTUAL_HOST_PATH=/
APP_VERSION=DOCKER
```

- add the application to the stack dependencies `<my_application>/stack.yml` file

```yml
services:
  <my_application>:
    image: alpine
    depends_on:
      - "<my_application>-front"
```
