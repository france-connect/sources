#!/usr/bin/env bash

function _hook_fc_apps() {
  local apps=${@:-fc-exploitation fc-support exploitation-high}

  for app in ${apps}; do
    local db_container=$(echo "$app" | sed 's/^fc-*//')
    echo "  Fixture for ${app} app..."
    cd ${WORKING_DIR}
    ${DOCKER_COMPOSE} exec ${NO_TTY} "${app}" yarn typeorm schema:drop
    ${DOCKER_COMPOSE} exec ${NO_TTY} "${app}" yarn migrations:run
    ${DOCKER_COMPOSE} exec ${NO_TTY} "${app}" yarn fixtures:load

    cd ${FC_ROOT}/fc-apps/shared/cypress/support/ && ./db.sh ${db_container} create
  done
}
