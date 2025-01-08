#!/usr/bin/env bash

function _hook_partners() {
  local app="$1"

  echo "Running migrations on database..."
  _migrations-postgres "$app"
  echo "Inserting fixtures in database..."
  _fixtures-postgres "$app"
}
