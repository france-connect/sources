#!/usr/bin/env bash

function _llng_configure() {
  cd ${WORKING_DIR}
  $DOCKER_COMPOSE exec fia-llng-low bash /scripts/init.sh
}
