#!/usr/bin/env bash

set -e

## Docker

export DOCKER_VERSION="28"

## Debian

export DEBIAN_VERSION="bookworm"

## NodeJS

DEFAULT_NODE_VERSION="v22.13.0" # "v" is legacy, will be removed in future versions

# Fix node version to use
if [ "${NODE_VERSION:-xxx}" = "xxx" ]; then
  NODE_VERSION=${DEFAULT_NODE_VERSION}
fi
export NODE_VERSION

export NODE_MODULE_BACK_VERSION=$(sha256sum ${FC_ROOT}/fc/back/yarn.lock | cut -c1-12)
export NODE_MODULE_FRONT_VERSION=$(sha256sum ${FC_ROOT}/fc/front/yarn.lock | cut -c1-12)
export NODE_MODULE_QUALITY_VERSION=$(sha256sum ${FC_ROOT}/fc/quality/yarn.lock | cut -c1-12)

## Cypress

export CYPRESS_VERSION="cypress-base-22.21.0"
