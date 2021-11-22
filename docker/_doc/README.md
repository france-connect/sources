# The local DEV stack

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

## Directory: volumes

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
