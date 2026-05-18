#!/usr/bin/env bash

set -e

source "${INCLUDE_DIR}/commands/cypress.sh"
source "${INCLUDE_DIR}/commands/docker.sh"
source "${INCLUDE_DIR}/commands/elastic.sh"
source "${INCLUDE_DIR}/commands/logs.sh"
source "${INCLUDE_DIR}/commands/mongo.sh"
source "${INCLUDE_DIR}/commands/node.sh"
source "${INCLUDE_DIR}/commands/postgres.sh"
source "${INCLUDE_DIR}/commands/redis.sh"
source "${INCLUDE_DIR}/commands/test.sh"
source "${INCLUDE_DIR}/commands/up.sh"
source "${INCLUDE_DIR}/commands/ci.sh"
source "${INCLUDE_DIR}/commands/buildx-bake.sh"
