#!/usr/bin/env bash

function _hook_mongo() {
  local app="$1"

  # Sleep to wait for mongodb replicat initialization
  sleep 10
  _reset_mongodb "$app"
}
