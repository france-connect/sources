#!/usr/bin/env bash

source "${INCLUDE_DIR}/config/ci.sh"
# Node needs to be set before docker.
source "${INCLUDE_DIR}/config/node.sh"
source "${INCLUDE_DIR}/config/docker.sh"
source "${INCLUDE_DIR}/config/mongo.sh"
source "${INCLUDE_DIR}/config/styles.sh"
source "${INCLUDE_DIR}/config/task.sh"
