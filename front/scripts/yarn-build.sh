#!/bin/bash

source "./scripts/prepare.sh"
source "./scripts/utils.sh"

# ---------------------------------------
#
# React Apps build script
#
# ---------------------------------------
check_app_argument_exists "$1"
copy_dsfr_files "$1"
build_and_copy_fc_stylesheet_to_instances_public_folder "$1"

INSTANCE_FOLDER="./instances/$1"
if [ -d "$INSTANCE_FOLDER/build" ]; then
  print_info "Removing $1 build folder"
  rm -rf "$INSTANCE_FOLDER/build"
fi

cd "$INSTANCE_FOLDER"
yarn build

exit 0
