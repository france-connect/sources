#!/usr/bin/env bash

function _hook_patners() {
  local app="$1"

  echo "Running migrations on database..."
  _migrations-partners "$app"
  echo "Inserting fixtures in database..."
  _fixtures-partners "$app"
}
