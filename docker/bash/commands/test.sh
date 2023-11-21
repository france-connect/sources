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

_storybook() {
  cd ${WORKING_DIR}
  $DOCKER_COMPOSE up storybook
  $DOCKER_COMPOSE exec ${NO_TTY} storybook "/opt/scripts/install.sh"
  $DOCKER_COMPOSE exec ${NO_TTY} storybook "/opt/scripts/start.sh"
}
