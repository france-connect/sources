#!/usr/bin/env bash

_reset_mongodb() {
  local db_container_name=$1
  echo "Reseting database ${db_container_name} to default state..."
  $DOCKER_COMPOSE exec ${NO_TTY} ${db_container_name} /opt/scripts/manage.sh --reset-db
}

_reset_mongodb_as_prod() {
  local db_container_name=$1
  echo "Reseting database ${db_container_name} to some production states"
  cd ${WORKING_DIR} && $DOCKER_COMPOSE exec ${NO_TTY} ${db_container_name} /opt/scripts/manage.sh --reset-db=display-idp-as-in-prod
}

_mongo_core_shell() {
  local app_name=$1
  _mongo_shell "mongo-$app_name" "core-$app_name"
}

_mongo_shell() {
  local server=$1
  local database=$2
  local TLSClient=$3
  local TLSClient=${TLSClient:=none}

  echo -n "Starting mongo ${server} database in shell "

  if [ "$TLSClient" = "none" ];then

    echo "Using mongosh cli from inside the mongodb container using docker-compose exec"
    echo "Without TLS client authentication activated"

    $DOCKER_COMPOSE exec "${server}" \
      mongosh -u ${MONGO_DEFAULT_USER} -p ${MONGO_DEFAULT_PASS} \
      --authenticationDatabase admin "${database}" \
      --tls

  elif [ "$TLSClient" = "tls" ];then

    echo "using mongosh cli using your local mongosh cli"
    echo "with TLS client authentication activated (Using the local application app.pem certificate)"
    
    $MONGO_SH -u ${MONGO_DEFAULT_USER} -p ${MONGO_DEFAULT_PASS} --authenticationDatabase admin "${database}" --tls --tlsCertificateKeyFile ${MONGO_TLS_APP_KEY}  --tlsCAFile ${MONGO_TLS_CA_FILE} --port ${MONGO_FCPHIGH_LOCALPORT}
    
  else
	  echo -e "\nUsage: mongo <server> <database> [tls]. 3rd argument '$3' not valid. Do you mean \"tls\"?"
	  exit 1
  fi
}

_mongo_script() {
  container=$1
  script=$2

  $DOCKER_COMPOSE exec -T ${container} /opt/scripts/run.sh "${script}"
}

# Presets for backward compatibility

_reset_db_fcp_high() {
  _reset_mongodb "mongo-fcp-high"
}

_reset_db_fcp_low() {
  _reset_mongodb "mongo-fcp-low"
}

_mongo_shell_core_fcp_high() {
  _mongo_core_shell "fcp-high"
}

_mongo_shell_core_fcp_low() {
  _mongo_core_shell "fcp-low"
}