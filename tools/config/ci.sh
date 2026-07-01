#!/usr/bin/env bash

set -e

export REPOSITORY_MAIN_BRANCH="staging"

# Disable TTY on CI env
[ $CI ] && NO_TTY=" -T" || NO_TTY=""

# Define current Cypress image version
export CYPRESS_IMAGE_VERSION=${CYPRESS_IMAGE_VERSION:-15.8.2-es8}
