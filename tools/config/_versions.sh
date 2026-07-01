#!/usr/bin/env bash

set -e

## Docker

export DOCKER_VERSION="28"

## Debian

export DEBIAN_VERSION="bookworm"

## NodeJS

export NODE_VERSION="v22.22.2" # "v" is legacy, will be removed in future versions

export NODE_MODULE_BACK_VERSION=$(sha256sum ${FC_ROOT}/fc/back/yarn.lock | cut -c1-12)
export NODE_MODULE_FRONT_VERSION=$(sha256sum ${FC_ROOT}/fc/front/yarn.lock | cut -c1-12)
export NODE_MODULE_QUALITY_VERSION=$(sha256sum ${FC_ROOT}/fc/quality/yarn.lock | cut -c1-12)

export NODE_MODULE_CACHE_KEY=$(echo -n "node-${NODE_VERSION}-back-${NODE_MODULE_BACK_VERSION}-front-${NODE_MODULE_FRONT_VERSION}-quality-${NODE_MODULE_QUALITY_VERSION}" | sha256sum | cut -c1-16)

## Cypress

export CYPRESS_VERSION="cypress-base-22.21.0"
