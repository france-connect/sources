#!/usr/bin/env bash

# Find which nodejs containers are running and store it into $NODEJS_CONTAINERS
_get_running_containers() {
  local raw_nodejs_containers=$(docker ps --format '{{.Names}}' -f ancestor=${FC_DOCKER_REGISTRY}/nodejs:${NODE_VERSION}-dev)
  local raw_all_containers=$(docker ps --format '{{.Names}}')

  NODEJS_CONTAINERS=$(_container-to-compose-name "${raw_nodejs_containers}")
  FC_CONTAINERS=$(_container-to-compose-name "${raw_all_containers}")
}

_reload-rp() {
  docker exec fc-rp-all service nginx reload
}

_container-to-compose-name() {
  local input=$1
  local output=""

  for container in ${input}; do
    local name=$(echo ${container} | sed -E 's/^fc_(.*)_1$/\1/')
    output=$(echo -e "${output}\n${name}")
  done

  echo ${output}
}

_halt() {
  echo "Stopping FC Dev environment..."
  cd ${WORKING_DIR}
  $DOCKER_COMPOSE stop
}

_exec() {
  app=${1:-empty}
  [ $# -gt 0 ] && shift

  case ${app} in
  empty)
    echo "Usage: docker-stack exec <container_name> <command>"
    exit 1
    ;;
  *)
    cd ${WORKING_DIR}
    $DOCKER_COMPOSE exec ${NO_TTY} ${app} ${@}
    ;;
  esac
}

_list_services() {
  local search=$1

  if [ -z ${search} ]; then
    $DOCKER_COMPOSE ps --services | sort
  else
    $DOCKER_COMPOSE ps --services | grep "${search}" | sort
  fi
}

_pull_node_image() {
  if [ -z ${OFFLINE} ]; then
    _do_pull
  else
    _task_result "$(format_warning "skipped")" "newline"
  fi
}

_do_pull() {
  timeout 5 docker login ${FC_DOCKER_REGISTRY} || _pull_failure
  docker pull ${DOCKER_REGISTRY_URI} || _pull_failure
}

_pull_failure() {
  echo "Could not fetch fresh nodejs Image, not connected to the Internet or maybe need to login"
  echo "Use 'OFFLINE' env var to skip:"
  echo " > OFFLINE=1 ${@}"
  echo "Or 'VERBOSE' env var to be prompted for login"
  echo " > VERBOSE=1 ${@}"
  exit 1
}

_prune() {
  _halt
  docker network prune -f
  docker container prune -f
}

_prune_all() {
  cat "${INCLUDE_DIR}/txt/atomic.art.txt"
  _halt
  docker system prune -af
  docker image prune -af
  docker system prune -af --volumes
  docker system df
  (cypress cache prune || echo "skipped cypress cache prune")
  npm cache clean --force
  yarn cache clean
  sudo du -sh /var/cache/apt/archives
  cd $FC_ROOT
  find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
}
