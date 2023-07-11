#!/usr/bin/env bash

_reset_mongodb() {
  local db_container_name=$1
  echo "Reseting database ${db_container_name} to default state..."
  docker-compose exec ${NO_TTY} ${db_container_name} /opt/scripts/manage.sh --reset-db
}

_idp_as_prod_v2() {
  echo "Set IdP as production ..."
  cd ${WORKING_DIR} && docker-compose exec ${NO_TTY} mongo-fcp-high /opt/scripts/manage.sh --reset-db=display-idp-as-in-prod
}

_idp_as_prod_legacy() {
  echo "Set IdP as production ..."
  cd ${WORKING_DIR} && docker-compose exec ${NO_TTY} mongo-legacy /opt/scripts/manage.sh --reset-db=display-idp-as-in-prod
}

_mongo_core_shell() {
  local app_name=$1
  _mongo_shell "mongo-$app_name" "core-$app_name"
}

_mongo_shell() {
  local server=$1
  local database=$2

  echo "starting mongo ${server} database in shell..."

  docker-compose exec "${server}" \
    mongo -u ${MONGO_DEFAULT_USER} -p ${MONGO_DEFAULT_PASS} \
    --authenticationDatabase admin "${database}" \
    --tls
}

# Presets for backward compatibility

_reset_db_legacy() {
  _reset_mongodb "mongo-legacy"
}

_reset_db_fcp_high() {
  _reset_mongodb "mongo-fcp-high"
}

_reset_db_fcp_low() {
  _reset_mongodb "mongo-fcp-low"
}

_reset_db_core_fca_low() {
  _reset_mongodb "mongo-fca-low"
}

_mongo_shell_core_fca_low() {
  _mongo_core_shell "fca-low"
}

_mongo_shell_core-fcp-high() {
  _mongo_core_shell "fcp-high"
}

_mongo_shell_core-fcp-low() {
  _mongo_core_shell "fcp-low"

}
_mongo_shell_core-legacy() {
  _mongo_core_shell "legacy"
}
