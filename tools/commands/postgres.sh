#!/usr/bin/env bash

_migrations-postgres() {
  cd ${DOCKER_DIR}
  $DOCKER_COMPOSE exec ${NO_TTY} "${1}" yarn typeorm:migrations-run
}

_migrations-generate-postgres() {
  cd ${DOCKER_DIR}
  $DOCKER_COMPOSE exec ${NO_TTY} "${1}" yarn typeorm:migrations-generate "${2}"
}

_fixtures-postgres() {
  cd ${DOCKER_DIR}
  $DOCKER_COMPOSE exec ${NO_TTY} "${1}" yarn typeorm:fixtures:load
}
