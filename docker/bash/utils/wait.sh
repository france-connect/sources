#!/usr/bin/env bash

wait_for_nodejs() {

  local container=$1
  local url=$2
  local max_time=${3:-180} # 3 minutes
  local delay=${4:-5}
  local max_retries=${5:-100}

  echo "Waiting for ${container} on URL: $url"

  (
    curl --insecure --fail --retry ${max_retries} \
      --retry-delay ${delay} \
      --retry-max-time ${max_time} "${url}" \
      &>$__DKS_LAST_LOG_FILE && _wait_for_nodejs_success "${container}"
  ) ||
    _wait_for_nodejs_fail "${container}"

}

_wait_for_nodejs_fail() {
  echo "$(format_failure " Failed ") Service DOWN: $1"
  echo ""
  echo "--- PM2 Logs for ${1} ---------------------------"
  docker exec "fc_${1}_1" bash -c 'cat /tmp/.pm2/logs/*.log' || true
  echo "--- End of PM2 Logs for ${1} --------------------"
  echo ""
  echo "--- curl Logs for ${1} ---------------------------"
  cat "$__DKS_LAST_LOG_FILE"
  echo "--- End of curl Logs for ${1} ---------------------------"

  exit 1
}

_wait_for_nodejs_success() {
  echo "$(format_success "OK") Service UP: $1"
}
