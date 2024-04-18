#!/bin/bash

source "./scripts/prepare.sh"

# --------------------------------------------------------
#
# @TODOs
#
# --------------------------------------------------------
# - ajouter une option --debug
# - ajouter une option --host pour servir docker

# ---------------------------------------
#
# React Apps dev/start script
#
# ---------------------------------------
check_app_argument_exists "$1"
copy_dsfr_files "$1"
build_and_copy_fc_stylesheet_to_instances_public_folder "$1"

INSTANCE_FOLDER="./instances/$1"
cd "$INSTANCE_FOLDER"

yarn build
yarn preview
# !!! do not exit : vitejs preview will start a simple html server !!!
