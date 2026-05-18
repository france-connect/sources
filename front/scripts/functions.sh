#!/bin/bash

source "./scripts/utils.sh"

# ---------------------------------------
#
# React Apps prepare script
#
# ---------------------------------------
check_app_argument_exists() {
  [ -z "$1" ] && print_error "L'argument app_name est manquant" && exit 1
}

copy_dsfr_files() {
  DEST_FOLDER="./instances/$1/public"
  DSFR_FOLDER="./node_modules/@gouvfr/dsfr/dist"

  check_source_and_files "$DSFR_FOLDER"
  check_source_and_files "$DEST_FOLDER"

  # Remove existing dsfr folder in destination if it exists to avoid stale files
  rm -rf "$DEST_FOLDER/dsfr"

  copy_folder "$DSFR_FOLDER/fonts" "$DEST_FOLDER/dsfr/fonts"
  copy_folder "$DSFR_FOLDER/icons" "$DEST_FOLDER/dsfr/icons"
  copy_folder "$DSFR_FOLDER/artwork" "$DEST_FOLDER/dsfr/artwork"

  copy_file "$DSFR_FOLDER/dsfr.min.css" "$DEST_FOLDER/dsfr/dsfr.min.css"
  create_folder_path "$DEST_FOLDER/dsfr/utility"
  copy_file "$DSFR_FOLDER/utility/utility.min.css" "$DEST_FOLDER/dsfr/utility/utility.min.css"
}

build_and_copy_fc_stylesheet_to_instances_public_folder() {
  # @NOTE Sass Cli do not have any node_modules resolution
  # if we would like to manage custom importer like `~`
  # We should install a third-party plugin or using a build tool like rollup
  MODULES_PATH="$(pwd)/node_modules"

  SRC_FOLDER="./libs/css"
  DEST_FOLDER="./instances/$1/public"

  check_source_and_files "$MODULES_PATH"
  check_source_and_files "$SRC_FOLDER"
  check_source_and_files "$DEST_FOLDER"

  SRC_FILE="$SRC_FOLDER/src/index.scss"
  OUTPUT_FILE="$DEST_FOLDER/fc/fc.min.css"

  print_info "Building $OUTPUT_FILE..."
  yarn sass \
    --style=compressed \
    --load-path="$MODULES_PATH" "$SRC_FILE" "$OUTPUT_FILE"

  if [ $? -ne 0 ]; then
    print_error "$OUTPUT_FILE build has failed successfully !"
    exit 1
  fi
  print_success "$OUTPUT_FILE created successfully !"
}

generate_18n_files() {
  if [ -z "$1" ]; then
    echo '❌ Missing argument'
    exit 1
  fi

  print_info "Generating i18n for $1..."
  # Ignore irrelevant i18n apps/libs for each app
  local -a args=()
  case "$1" in
    partners)
      args=("apps/core-user-dashboard" "apps/tracks" "apps/user-preferences")
      ;;
    user-dashboard)
      args=("apps/core-partners")
      ;;
  esac

  node ./scripts/i18n.mjs "$1" "${args[@]}"
  if [ $? -ne 0 ]; then
    print_error "Error generating i18n for $1"
  fi

  print_success "Files created successfully !"
}
