#!/usr/bin/env bash

#### Global Variables:
COMPOSE_PROJECT_NAME=fc
COMPOSE_DIR="${FC_ROOT}/fc/docker/compose"
COMPOSE_FILES=$(find ${COMPOSE_DIR} -name "*.yml")
VOLUMES_DIR="${FC_ROOT}/fc/docker/volumes"
WORKING_DIR="$(cd "$(dirname "${0}")" >/dev/null 2>&1 && pwd)"
DOCKER_REGISTRY_URI="${FC_DOCKER_REGISTRY}/nodejs:${NODE_VERSION}-dev"
if [ "${FC_DOCKER_COMPOSE}" ]; then
  DOCKER_COMPOSE="${FC_DOCKER_COMPOSE}"
else
  DOCKER_COMPOSE='docker-compose'
fi

# https://docs.docker.com/compose/reference/envvars/#compose_file
COMPOSE_PATH_SEPARATOR=":"
COMPOSE_FILE=$(join_by ${COMPOSE_PATH_SEPARATOR} ${COMPOSE_FILES})
export COMPOSE_PATH_SEPARATOR
export COMPOSE_FILE
export COMPOSE_DIR
export VOLUMES_DIR
export COMPOSE_PROJECT_NAME
export WORKING_DIR
export DOCKER_COMPOSE

# Get current uid/gid to use it within docker-compose:
# see https://medium.com/redbubble/running-a-docker-container-as-a-non-root-user-7d2e00f8ee15
# Modf 2020-06-04: récupération de l'id du groupe docker (nécessaire pour le conteneur 'docker-gen')
export CURRENT_UID="$(id -u):$(grep docker /etc/group | cut -d: -f3)"
