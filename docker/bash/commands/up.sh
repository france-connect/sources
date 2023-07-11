#!/usr/bin/env bash

_up() {
  task " * Checking required services" \
    "_check_for_unknown_services "${@}""

  echo " * Starting services: $(format_emphasis $(join_by ", " "${@}"))"

  task " * Pull fresh node image" \
    "_pull_node_image"

  task " * Up containers" \
    "_do_up $@"

  task " * Populate global variables"
  "_get_running_containers"

  task " * Automatically install dependencies for started containers" \
    "_auto_install_dependencies"

  echo " * Automatically run init scripts for started containers"
  _auto_init_containers
}

_add_node_app() {
  task " * Up containers" \
    "_do_up "${@}""

  _start "${@}"
}

_do_up() {
  # Get wanted services
  local services=$(_get_services "$@")

  cd ${WORKING_DIR}
  docker-compose up --build -d $services
}

_check_for_unknown_services() {
  local asked=$(_get_services "$@")
  local available=$(_list_services)

  for service in $asked; do
    match=$(echo "$available" | grep "^$service$" | wc -l)

    if [ "$match" != "1" ]; then
      echo "Service / Stack Not Found: $service"
      exit 1
    fi
  done
}

_get_services() {
  local apps=${@:-none}
  local services=rp-all

  for app in $apps; do
    services="$services $app"
  done

  echo $services
}

_auto_install_dependencies() {
  if [ "${NODEJS_CONTAINERS:-xxx}" != "xxx" ]; then
    echo "Installing node modules..."
    _install_dependencies $NODEJS_CONTAINERS
  fi
}

_auto_init_containers() {
  for app in ${FC_CONTAINERS}; do
    task "   * init $(format_emphasis "${app}")" "_init_hooks "${app}""
  done
}
