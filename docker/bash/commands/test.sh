#!/usr/bin/env bash

_test() {
  apps=${@:-no-container}

  for app in ${apps}; do
    cd ${WORKING_DIR}
    $DOCKER_COMPOSE exec ${NO_TTY} "${app}" "/opt/scripts/test.sh"
  done
}

_test_all() {
  _get_running_containers
  _test $NODEJS_CONTAINERS
}

_e2e() {
  app=${1:-no-container}

  [ $# -gt 0 ] && shift

  case "${app}" in
  *)
    echo "Usage: $script <option>:"
    echo "----"
    echo "* e2e ==> only this stack are allowed :"
    echo "@todo Implements this"
    echo "----"
    exit 1
    ;;
  esac
  command="open"
  if [ "${@:-xxx}" = "run" ]; then
    command='run'
  fi
  cd ${FC_ROOT}/${directory} && npx cypress ${command}
}

unit_test_watch_coverage() {
  local path=${1}
  local isFile=$(test -f ${path} && echo "1" || echo "0")
  local isDir=$(test -d ${path} && echo "1" || echo "0")

  if [ "${isFile}${isDir}" = "00" ]; then
    echo "Error: ${path} is not a file or a directory"
    return 1
  fi

  local testPath=${path}
  local coveragePath=${path}

  if [ "${isDir}" = "1" ]; then
    # Remove trailing slash and append /*
    local coveragePath="$(echo ${path} | sed -E "s/(.*)\/$/\1/")/**/*"
  fi

  if [ "${isFile}" = "1" ]; then
    local isSpecFile=$(echo ${path} | grep -E ".spec.tsx?$" | wc -l)

    if [ "${isSpecFile}" = "1" ]; then
      coveragePath=$(echo ${path} | sed -E "s/(.*).spec.ts/\1.ts/")
    else
      testPath=$(echo ${path} | sed -E "s/(.*).ts/\1.spec.ts/")
    fi
  fi

  yarn test --watch --coverage --collectCoverageFrom="${coveragePath}" "${testPath}"

}
