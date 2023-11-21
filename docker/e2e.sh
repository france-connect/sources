#!/usr/bin/env bash
set -e

if [ -z "$FC_ROOT"  ]
then
  read -p "Missing FC_ROOT path. Please fill in: " FC_ROOT
fi

#### Global Functions:
function join_by { local IFS="$1"; shift; echo "$*"; }

# Node needs to be set before docker.
source "$FC_ROOT/fc/docker/bash/config/node.sh"
source "$FC_ROOT/fc/docker/bash/config/docker.sh"

_e2e_idp_insert() {
  echo "Insert idp in `core-fcp-high` database..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fcp-high mongo -u 'fc' -p 'pass' --host mongo-fcp-high --tls  --authenticationDatabase core-fcp-high core-fcp-high /opt/scripts/db-states/e2e-idp/e2e-idp-insert.js
}

_e2e_idp_update_activate() {
  echo "Update idp in `core-fcp-high` database, activate idp..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fcp-high mongo -u 'fc' -p 'pass' --host mongo-fcp-high --tls  --authenticationDatabase core-fcp-high core-fcp-high /opt/scripts/db-states/e2e-idp/e2e-idp-update-activate.js
}

_e2e_idp_update_desactivate() {
  echo "Update idp in `core-fcp-high` database, desactivate idp..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fcp-high mongo -u 'fc' -p 'pass' --host mongo-fcp-high --tls  --authenticationDatabase core-fcp-high core-fcp-high /opt/scripts/db-states/e2e-idp/e2e-idp-update-desactivate.js
}

_e2e_idp_update_wrong_issuer() {
  echo "Update idp in `core-fcp-high` database, set a wrong secret idp..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fcp-high mongo -u 'fc' -p 'pass' --host mongo-fcp-high --tls  --authenticationDatabase core-fcp-high core-fcp-high /opt/scripts/db-states/e2e-idp/e2e-idp-update-wrong-issuer.js
}

_e2e_sp_update_scopes() {
  echo "Update sp in `core-fcp-high` database, autorize fewer scopes..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fcp-high mongo -u 'fc' -p 'pass' --host mongo-fcp-high --tls  --authenticationDatabase core-fcp-high core-fcp-high /opt/scripts/db-states/e2e-sp/e2e-sp-update-scopes.js
}

_e2e_idp_remove() {
  echo "Remove idp in `core-fcp-high` database..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fcp-high mongo -u 'fc' -p 'pass' --host mongo-fcp-high --tls  --authenticationDatabase core-fcp-high core-fcp-high /opt/scripts/db-states/e2e-idp/e2e-idp-remove.js
}

_e2e_fca-low_idp_insert() {
  echo "Insert idp in `core-fca-low` database..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fca-low mongo -u 'fc' -p 'pass' --host mongo-fca-low --tls  --authenticationDatabase core-fca-low core-fca-low /opt/scripts/db-states/e2e-idp/e2e-idp-insert.js
}

_e2e_fca-low_idp_update_activate() {
  echo "Update idp in database, activate idp..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fca-low mongo -u 'fc' -p 'pass' --host mongo-fca-low --tls  --authenticationDatabase core-fca-low core-fca-low /opt/scripts/db-states/e2e-idp/e2e-idp-update-activate.js
}

_e2e_fca-low_idp_update_desactivate() {
  echo "Update idp in `core-fca-low` database, desactivate idp..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fca-low mongo -u 'fc' -p 'pass' --host mongo-fca-low --tls  --authenticationDatabase core-fca-low core-fca-low /opt/scripts/db-states/e2e-idp/e2e-idp-update-desactivate.js
}

_e2e_fca-low_idp_remove() {
  echo "Remove idp in `core-fca-low` database..."
  cd ${WORKING_DIR} && ${DOCKER_COMPOSE} exec -T mongo-fca-low mongo -u 'fc' -p 'pass' --host mongo-fca-low --tls  --authenticationDatabase core-fca-low core-fca-low /opt/scripts/db-states/e2e-idp/e2e-idp-remove.js
}



script=$0
action=${1:-help}
[ $# -gt 0 ] && shift
case "$action" in
  idp_insert)
    _e2e_idp_insert $@
    ;;

  idp_update_activate)
    _e2e_idp_update_activate $@
    ;;

  idp_update_desactivate)
    _e2e_idp_update_desactivate $@
    ;;

  idp_update_wrong_issuer)
    _e2e_idp_update_wrong_issuer $@
    ;;

  sp_update_scopes)
    _e2e_sp_update_scopes $@
    ;;

  idp_remove)
    _e2e_idp_remove $@
    ;;
  fca_idp_insert)
    _e2e_fca-low_idp_insert $@
    ;;

  fca_idp_update_activate)
    _e2e_fca-low_idp_update_activate $@
    ;;

  fca_idp_update_desactivate)
    _e2e_fca-low_idp_update_desactivate $@
    ;;

  fca_idp_remove)
    _e2e_fca-low_idp_remove $@
    ;;
esac
