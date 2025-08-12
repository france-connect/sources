#!/bin/sh
set -e

# List all instances
get_app_list() {
  local exclude_list="${1}"
  local app_list=$(ls -d back/instances/*/ | xargs -n1 basename)

  for exclude_list in ${1}; do
    app_list=$(echo "${app_list}" | grep -v "${exclude_list}")
  done

  echo "${app_list}" | tr '\n' ',' | sed 's/,$//'
}

# Format as ["app1","app2",...]
jsonify_app_list() {
  local app_list="$1"

  if [ -z "${app_list}" ]; then
    echo "Usage: $0 <APP_LIST>"
    exit 1
  fi

  result=""

  local old_ifs=${IFS}
  IFS=,
  set -- ${app_list}
  for item; do
    result="\"${item}\",${result}"
  done
  IFS=${old_ifs}

  result=$(echo "${result}" | sed 's/,$//')
  echo "[${result}]"
}
