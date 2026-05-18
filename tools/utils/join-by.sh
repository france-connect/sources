#!/usr/bin/env bash

set -e

function join_by() {
  local IFS="$1"
  shift
  echo "$*"
}
