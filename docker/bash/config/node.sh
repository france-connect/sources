#!/usr/bin/env bash

DEFAULT_NODE_VERSION=latest

# Fix node version to use
if [ "${NODE_VERSION:-xxx}" = "xxx" ]; then
  NODE_VERSION=${DEFAULT_NODE_VERSION}
fi
export NODE_VERSION
