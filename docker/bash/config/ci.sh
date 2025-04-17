#!/usr/bin/env bash

# Disable TTY on CI env
[ $CI ] && NO_TTY=" -T" || NO_TTY=""

# Define current Cypress image version
export CYPRESS_IMAGE_VERSION=${CYPRESS_IMAGE_VERSION:-14.0.3}
