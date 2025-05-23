#!/usr/bin/env bash

# Find which nodejs containers are running and store it into $NODEJS_CONTAINERS
_get_running_containers() {
  local raw_nodejs_containers=$(docker ps --format '{{.Names}}' -f ancestor=${FC_DOCKER_REGISTRY}/nodejs:${NODE_VERSION}-dev)
  local raw_all_containers=$(docker ps --format '{{.Names}}')

  NODEJS_CONTAINERS=$(_container_to_compose_name "${raw_nodejs_containers}")
  FC_CONTAINERS=$(_container_to_compose_name "${raw_all_containers}")
}

_reload_rp() {
  docker exec fc-rp-all service nginx reload
}

_container_to_compose_name() {
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

_compose() {
  cd ${WORKING_DIR}
  $DOCKER_COMPOSE "${@}"
}

_exec() {
  app=${1:-empty}
  [ $# -gt 0 ] && shift

  case ${app} in
  empty)
    echo "Usage: dks exec <container_name> <command>"
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

  DOCKER_COMPOSE_SERVICES_CMD="${DOCKER_COMPOSE} ps"

  if $DOCKER_COMPOSE version | grep -iq 'docker compose version v2'; then
    DOCKER_COMPOSE_SERVICES_CMD="${DOCKER_COMPOSE} config"
  fi

  if [ -z ${search} ]; then
    $DOCKER_COMPOSE_SERVICES_CMD --services | sort
  else
    $DOCKER_COMPOSE_SERVICES_CMD --services | grep "${search}" | sort
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
  $DOCKER_COMPOSE down -v --remove-orphans
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

_prune_ci() {
  ${DOCKER_COMPOSE} down --volumes --remove-orphans
}

_build_push() {
  local USAGE="Syntax: docker-stack build-push [service] [version]"
  
  # Check parameters
  if [ "$#" -lt 2 ]; then
    echo ${USAGE}
  fi
  # Check whether the Docker Registry environment variables are set
  if [ "x${FC_DOCKER_REGISTRY}" = "x" ]; then
    echo "The environment variable FC_DOCKER_REGISTRY is not defined"
  fi
  if [ "x${FC_DOCKER_REGISTRY_USER}" = "x" ]; then
    echo "The environment variables FC_DOCKER_REGISTRY_USER is not defined"
  fi
  if [ "x${FC_DOCKER_REGISTRY_PASS}" = "x" ]; then
    echo "The environment variables FC_DOCKER_REGISTRY_PASS is not defined"
  fi
  local SERVICE="$1"
  local VERSION="$2"

  echo "login to FC Docker Register with ${FC_DOCKER_REGISTRY_USER}"
  echo ${FC_DOCKER_REGISTRY_PASS} | docker login ${FC_DOCKER_REGISTRY} --username ${FC_DOCKER_REGISTRY_USER} --password-stdin
  
  echo "build ${FC_DOCKER_REGISTRY}/${SERVICE}:${VERSION}"
  IMAGE_VERSION="${VERSION}" ${DOCKER_COMPOSE} build --build-arg CURRENT_UID="${CURRENT_UID}" --no-cache --push ${SERVICE}
}

_get_env() {
  local app=${1}
  local varName=${2}
  local containerName="${COMPOSE_PROJECT_NAME}_${app}_1"
  local expression='${'${varName}'}'

  docker exec ${containerName} bash -c "echo ${expression}"
}

_switch() {
  _prune
  _logs "--bg"
  _up "${@}"
  _start_all
}
