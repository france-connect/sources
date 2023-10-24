#!/usr/bin/env bash

set -e

source "./scripts/utils.sh"

APP_NAME=$1
[ -z "$APP_NAME" ] && print_error "L'argument app_name est manquant" && exit 1

# Check if APP_NAME folder exists
INSTANCE_FOLDER="./instances/$APP_NAME"
FOLDERS=("data" "includes" "content" "public" "dist")

for folder in "${FOLDERS[@]}"; do
  # Use double quotes to properly handle folder names with spaces or special characters
  if [ -d "${INSTANCE_FOLDER}/${folder}" ]; then
    rm -rf "${INSTANCE_FOLDER}/${folder}"
  fi
done

# Use 'mkdir -p' to create the folder if it doesn't exist
mkdir -p "$INSTANCE_FOLDER"

# ----------------------------------------------------------------------
# Copying UI files from libraries and the application. (Overrides)
# ----------------------------------------------------------------------

LIBS_FOLDER="./libs"
APP_FOLDER="./apps/$APP_NAME"

# Use the existing 'copy_folders' function from the util file
copy_folders "$LIBS_FOLDER" "$INSTANCE_FOLDER"
copy_folders "$APP_FOLDER" "$INSTANCE_FOLDER"

# ----------------------------------------------------------------------
# Install dependencies
# ----------------------------------------------------------------------

# Use 'cd' in a subshell to avoid changing the current directory permanently
(
  cd "$INSTANCE_FOLDER"
  yarn
)

print_success "L'application ${APP_NAME} est prête"
exit 0
