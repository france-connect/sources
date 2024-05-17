#!/usr/bin/env bash

source "$INCLUDE_DIR/hooks/fc-apps.sh"
source "$INCLUDE_DIR/hooks/legacy-fc-commons.sh"
source "$INCLUDE_DIR/hooks/lemon-ldap.sh"
source "$INCLUDE_DIR/hooks/mongo.sh"

# Container initialisation hooks
#
# This runs arbitrary code if a container is started
# matching on the container name
#
# Hooks are called in the `docker-stack up <stack>` command,
# after all other automatic procedures.
# Nodejs dependencies are already installed at this stage
function _init_hooks() {

  local container=$1

  case $container in
  *"lemon-ldap"*)
    _hook_lemon_ldap
    ;;
  *"mongo-fca-low"*)
    _hook_mongo "mongo-fca-low"
    ;;
  *"mongo-fcp-low"*)
    _hook_mongo "mongo-fcp-low"
    ;;
  *"mongo-fcp-high"*)
    _hook_mongo "mongo-fcp-high"
    ;;
  *"pg-exploitation-high")
    _hook_fc_apps "exploitation-high"
    ;;
  *"pg-exploitation-fca-low")
    _hook_fc_apps "exploitation-fca-low"
    ;;
  *"pg-exploitation")
    _hook_fc_apps "fc-exploitation"
    ;;
  *"pg-support"*)
    _hook_fc_apps "fc-support"
    ;;
  *"elasticsearch"*)
    # Waiting for ES to be up
    sleep 15
    echo "Initialize user-dashboard data..."
    _init_ud
    ;;
  "fc-core")
    _fc_common_symlink "fc-core"
    ;;
  "partenaires")
    _fc_common_symlink "partenaires"
    ;;
  *)
    # Erase line content for containers that don't have an init section
    # This way we only display task for containers that have actually done something
    # Note that number of space characters is arbitrary but should work in most cases
    _task_result "\r                                                                 \r"
    ;;
  esac
}
