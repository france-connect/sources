#!/usr/bin/env bash

source "./scripts/utils.sh"

setup() {
  ./scripts/yarn-prepare.sh "$1"
}

# Check if APP_NAME exists as argument
APP_NAME=$1
[ -z "$APP_NAME" ] && print_error "L'argument app_name est manquant" && exit 1

$(
  setup $APP_NAME
  cd "instances/$APP_NAME"
  yarn build
)

print_success "L'application ${APP_NAME} a été build"
exit 0
