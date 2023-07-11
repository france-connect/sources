#!/usr/bin/env bash

_log() {
  app=${@:-no-container}
  cd ${WORKING_DIR}
  docker-compose exec ${NO_TTY} ${app} pm2 logs
}

_start() {
  local apps="${@:-no-container}"
  for app in ${apps}; do
    task "   * Starting app \e[3m${app}\e[0m" \
      "_do_start "${app}""
  done

  # Reload RP in case the app took to long and was consired down by Nginx
  task "   * Reload RP" "_reload-rp"
}

_start_ci() {
  local apps="${@:-no-container}"
  for app in ${apps}; do
    task "   * Starting app (CI mode) \e[3m${app}\e[0m" \
      "_do_start_ci "${app}""
  done

  # Reload RP in case the app took to long and was consired down by Nginx
  task "   * Reload RP" "_reload-rp"
}

_do_start() {
  local app=$1

  cd ${WORKING_DIR}
  docker-compose exec ${NO_TTY} "${app}" "/opt/scripts/start.sh"
}

_do_start_ci() {
  local app=$1

  cd ${WORKING_DIR}
  docker-compose exec ${NO_TTY} "${app}" "/opt/scripts/start-ci.sh"
}

_start_all() {
  _get_running_containers
  echo " * Automatically start apps for started nodejs containers"
  _start "${NODEJS_CONTAINERS}"
}

_start_all_ci() {
  _get_running_containers
  echo " * Automatically start apps for started nodejs containers"
  _start_ci "${NODEJS_CONTAINERS}"
}

_stop() {
  apps=${@:-no-container}
  for app in $apps; do
    task " * Stopping app \e[3m${app}\e[0m" \
      "_do_stop ${app}"
  done
}

_do_stop() {
  local app=$1

  cd ${WORKING_DIR}
  docker-compose exec ${NO_TTY} "${app}" "/opt/scripts/stop.sh"
}

_stop_all() {
  _get_running_containers
  _stop $NODEJS_CONTAINERS
}

_install_dependencies() {
  apps=${@:-no-container}

  for app in ${apps}; do
    echo "Installing dependencies for [${app}]:"
    if [ "${PROXY_EXPLOITATION}" ]; then
      echo "Setting up yarn proxy for [${app}]..."
      cd ${WORKING_DIR}
      docker-compose exec ${NO_TTY} "${app}" bash -c "yarn config set proxy ${PROXY_EXPLOITATION} && yarn config set https-proxy ${PROXY_EXPLOITATION}"
    fi

    cd ${WORKING_DIR}
    docker-compose exec ${NO_TTY} "${app}" "/opt/scripts/install.sh"
  done
}

_install_dependencies_all() {
  _get_running_containers
  _install_dependencies $NODEJS_CONTAINERS
}

_log-rotate() {
  echo "Send SIGUSR2 to core-fcp-high app..."
  cd ${WORKING_DIR}
  docker-compose exec core-fcp-high pkill -SIGUSR2 -f '/usr/bin/node -r source-map-support/register --inspect=0.0.0.0:9235 /var/www/app/dist/instances/core-fcp-high/main'
  echo "... Signal done"
}
