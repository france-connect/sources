#!/usr/bin/env bash

function _fc-common-symlink() {
  local base="$FC_ROOT/fc/docker/volumes/src/FranceConnect/projects"

  case ${app} in
  "fc-core")
    _update_symlink "${base}/fc/core/node_modules" "../../fc-commons"
    ;;
  "partenaires")
    _update_symlink "${base}/partenaires/node_modules" "../../fc/fc-commons"
    ;;
  esac
}

function _update_symlink() {
  local appPath="${1}"
  local libPath="${2}"

  echo "Replace lib by symlink ${appPath} ~> ${libPath}"

  cd "${appPath}"
  rm -rf fc-commons
  ln -s "${libPath}"
}
