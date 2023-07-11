#!/usr/bin/env bash

function _llng-configure() {
  cd ${WORKING_DIR}
  docker-compose exec fia-llng-low bash /scripts/init.sh
}
