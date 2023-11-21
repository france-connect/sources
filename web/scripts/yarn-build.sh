#!/usr/bin/env bash

source "./scripts/utils.sh"

setup() {
  ./scripts/yarn-prepare.sh "$1"
}

# Check if APP_NAME exists as argument
APP_NAME=$1
[ -z "$APP_NAME" ] && print_error "L'argument app_name est manquant" && exit 1

INSTANCE_FOLDER="./instances/$APP_NAME"

(
  # Cleanup existing application
  [ -d "$INSTANCE_FOLDER" ] && rm -rf "$INSTANCE_FOLDER"
  setup "$APP_NAME"
  cd "$INSTANCE_FOLDER"
  yarn build
)

print_success "L'application ${APP_NAME} a été build"
exit 0
