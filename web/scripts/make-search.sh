#!/usr/bin/env bash

source "./scripts/utils.sh"

# Check if APP_NAME exists as argument
APP_NAME=$1
[ -z "$APP_NAME" ] && print_error "L'argument app_name est manquant" && exit 1

INSTANCE_FOLDER="./instances/$APP_NAME"

[ ! -d "$INSTANCE_FOLDER/dist" ] && print_error "L'application doit être build avant de lancer l'indexation de la recherche" && exit 1

(
  cd "$INSTANCE_FOLDER"
  # Cleanup existing application
  [ -d "./dist/_pagefind" ] && rm -rf "./dist/_pagefind"
  yarn make:search
)

print_success "L'index de rechercher pour l'app ${APP_NAME} a été build"
exit 0
