#!/usr/bin/env bash

set -e

checkInput() {
  local APP="$1"
  
  if [ -z "$APP" ]; then
    echo "Error: APP argument is required."
    echo "Usage: entrypoint.sh <app_name>"
    exit 1
  fi
  
  if [ -z "$NODE_ENV" ]; then
    echo "Error: NODE_ENV environment variable is required."
    exit 1
  fi
  
  if [[ "$NODE_ENV" != "development" && "$NODE_ENV" != "production" ]]; then
    echo "Error: Unknown NODE_ENV '$NODE_ENV'. Expected: development or production" >&2
    exit 1
  fi
}

run() {
  local APP="$1"
  local ENV="$NODE_ENV"
  
  echo "=== Post-deploy for ${APP} in ${ENV} environment ==="
  
  local SCRIPT_PATH="instances/${APP}/deploy/${ENV}/post-deploy.sh"
  
  if [ ! -f "$SCRIPT_PATH" ]; then
    echo "No post-deploy script found for ${APP} in ${ENV} environment (${SCRIPT_PATH})."
    echo "This is not an error - no post-deploy actions needed."
    exit 0
  fi

  echo "Running post-deploy script: ${SCRIPT_PATH}"
  
  bash "${SCRIPT_PATH}" || {
    echo "Error: Failed to run post-deploy script for ${APP} in ${ENV} environment."
    exit 1
  }
  
  echo "=== Post-deploy completed successfully ==="
}

# Main entry point
main() {
  checkInput "$@"
  run "$@"
}

main "$@"
