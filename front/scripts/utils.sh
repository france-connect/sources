#!/bin/bash

PUCE=" *  "
RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[32m'
GREY='\033[90m'

print_error() {
  echo -e "${RED}ERROR : $1${RESET}" >&2
  exit 1
}

print_info() {
  echo -e "${GREY}$1${RESET}"
}

print_success() {
  echo -e "${GREEN}$1${RESET}"
}

print_list() {
  echo "${PUCE}$1"
}

create_folder_path() {
  local path="$1"
  if mkdir -p "$path"; then
    print_success "Dossier créé avec succès : $path"
  fi
}

check_source_and_files() {
  if [ ! -d "$1" ] || [ ! -n "$(ls -A "$1")" ]; then
    echo "Le dossier '$1' est invalide."
    exit 1
  fi
}

copy_folder() {
  local src_folder="$1"
  local dest_folder="$2"

  create_folder_path "$dest_folder"

  if check_source_and_files "$src_folder"; then
    echo "Copie de $src_folder vers $dest_folder"
    cp -r "$src_folder"/. "$dest_folder"/
  fi
}

copy_file() {
  local src="$1"
  local dest="$2"
  echo "Copie de ${src} vers ${dest}"
  cp "$src" "$dest"
}
