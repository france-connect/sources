#!/bin/bash

main() {
  local mode=${DEFAULT_MODE} || "legacy"

  if [ ${mode} == "prod" ]; then
    source "/opt/scripts/start-prod.sh"
  else
    source "/opt/scripts/start-dev.sh"
  fi
}

main
