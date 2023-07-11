#!/usr/bin/env bash

function join_by() {
  local IFS="$1"
  shift
  echo "$*"
}
