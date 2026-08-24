#!/usr/bin/env bash

set -e

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

_reload_haproxy() {
  docker restart fc_haproxy_1
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
  cd ${DOCKER_DIR}
  $DOCKER_COMPOSE stop
}

_compose() {
  cd ${DOCKER_DIR}
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
    cd ${DOCKER_DIR}
    $DOCKER_COMPOSE exec ${NO_TTY} ${app} ${@}
    ;;
  esac
}

_list_services() {
  local search=$1

  DOCKER_COMPOSE_SERVICES_CMD="${DOCKER_COMPOSE} config"

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

_init_stats() {
  local clean=false
  if [ "${1:-}" = "--clean" ]; then
    clean=true
  fi

  echo "========================================="
  echo "  Initializing Statistics Stack"
  echo "========================================="

  if [ "$clean" = true ]; then
    echo ""
    echo "Removing Elasticsearch data..."
    [ -n "${DOCKER_DIR}" ] || { echo "DOCKER_DIR is not set"; exit 1; }
    sudo rm -rf "${DOCKER_DIR}/volumes/elasticsearch/data/nodes"
  fi

  echo ""
  echo "Switching to Kibana stack..."
  _switch "kibana"

  echo ""
  _wait_for_es || exit 1

  echo ""
  echo "Setting kibana_system password..."
  $DOCKER_COMPOSE exec $NO_TTY elasticsearch curl -sk -u docker-stack:docker-stack -XPOST "https://elasticsearch:9200/_security/user/kibana_system/_password" -H 'Content-Type: application/json' -d '{"password":"kibana_system_pwd"}' >/dev/null
  echo "  kibana_system password set."

  echo ""
  echo "Recreating Kibana to apply credentials..."
  $DOCKER_COMPOSE up -d --force-recreate --no-deps kibana

  echo ""
  echo "Resets statistics related to Elasticsearch."
  _reset_stats

  echo ""
  echo "Creating Elasticsearch ingest pipeline..."
  _create_es_ingest_pipeline

  echo ""
  echo "========================================="
  echo "  ✓ Statistic Stack Ready!"
  echo "========================================="
  echo "  Kibana: http://localhost:5601"
  echo "  Elasticsearch: http://localhost:9200"
  echo "========================================="
}

_switch() {
  if [ -z "${CI:-}" ]; then
    _prune
    _logs "--bg"
    _up "${@}"
    _start_all
  else
    _prune_ci
    _logs "--bg"
    _up "${@}"
    _start_all_ci
  fi
}

_run_once() {
  if [ -z "$1" ]; then
    echo "Usage: docker-stack run-once <service>"
    exit 1
  fi

  _compose run --rm "${@}"
}

_grab_logs() {
  if [ -z "$1" ]; then
    echo "Usage: docker-stack grab-logs <output_dir>"
    exit 1
  fi

  local output_dir="$1"

  mkdir -p "${output_dir}"

  _compose ps --all -q | while read -r cid; do
    [ -n "$cid" ] || continue

    local name="$(docker inspect -f '{{.Name}}' "$cid")"
    name="${name#/}"
    safe="$(printf '%s' "$name" | tr '/: ' '___')"

    docker logs --timestamps "$cid" >"${output_dir}/${safe}.log" 2>&1 || true
  done
}

_docker_image_exists() {
  local image="$1"
  local tag="$2"

  docker manifest inspect "${image}:${tag}" > /dev/null 2>&1
}

_docker_image_retag() {
  local overwrite=false

  if [[ "$1" == "--overwrite" ]]; then
    overwrite=true
    shift
  fi

  local image="$1"
  local source_tag="$2"
  local target_tag="$3"

  if [[ -z "$image" || -z "$source_tag" || -z "$target_tag" ]]; then
    echo "Usage: _docker_image_retag [--overwrite] <image> <source_tag> <target_tag>"
    return 1
  fi

  if _docker_image_exists "$image" "$target_tag"; then
    if [[ "$overwrite" == false ]]; then
      echo "🟢 Target already exists → skip (${target_tag})"
      return 0
    fi

    echo "🟠 Overwriting existing tag → ${target_tag}"
  fi

  echo "⬇️ Pull ${source_tag}"
  docker pull --quiet "${image}:${source_tag}" || return 1

  echo "🏷️ Tag -> ${target_tag}"
  docker tag "${image}:${source_tag}" "${image}:${target_tag}" || return 1

  echo "⬆️ Push ${target_tag}"
  docker push --quiet "${image}:${target_tag}" || return 1
}

_docker_image_digest() {
  local image="${1}"
  local tag="${2}"

  docker manifest inspect "${image}:${tag}" \
    | jq -r '.config.digest // .manifests[0].digest'
}

_docker_images_in_sync() {
  local image="${1}"
  local tag_a="${2}"
  local tag_b="${3}"

  [[ "$(_docker_image_digest "${image}" "${tag_a}")" \
  == "$(_docker_image_digest "${image}" "${tag_b}")" ]]
}