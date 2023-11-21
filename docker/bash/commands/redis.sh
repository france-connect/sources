#!/usr/bin/env bash

_redis_cli() {
  local service=$1
  echo -n "  * Check Redis DB number for ${service}: ..." 
  local db=$(_get_redis_db_for_service "${service}")

  if [ -z ${db} ]; then
    echo "    $(format_failure "Could not detect Redis DB"), are you sure container $(format_warning $(format_emphasis "${service}")) is up and name is correct?"
    exit 1;
  fi

  echo -e "\r  * $(format_success "Found") Redis DB number for ${service}: $(format_success "${db}")   "

  local command="REDISCLI_AUTH=\$REDIS_PASSWORD\
    redis-cli\
    --tls\
    -n ${db}\
    --cacert \$REDIS_TLS_CA_FILE"

  docker exec -ti fc_redis-cluster-master_1 bash -c "$command"
}

_get_redis_db_for_service() {
  local service=$1
  local pattern="Redis_DB="

  docker-compose exec ${service} env | grep ${pattern} | sed "s/${pattern}//"| sed 's/\r//'
}
