#!/usr/bin/env bash

_logs() {
  local option=$1

  case ${option} in
  --bg)
    task " * Start log-hub" "_do_up" "log-hub"
    echo "   Log are now available through chrome developer-tools at localhost:6666"
    ;;
  --restart)
    $DOCKER_COMPOSE restart log-hub
    ;;
  *)
    $DOCKER_COMPOSE up log-hub | sed 's/log-hub.*|//'
    ;;
  esac
}
