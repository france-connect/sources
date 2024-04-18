#!/usr/bin/env bash
set -e

if [ -z "${FC_ROOT}" ]; then
  read -p "Missing FC_ROOT path. Please fill in: " FC_ROOT
  exit 1
fi

INCLUDE_DIR="$FC_ROOT/fc/docker/bash"

source "${INCLUDE_DIR}/utils/index.sh"
source "${INCLUDE_DIR}/config/index.sh"
source "${INCLUDE_DIR}/commands/index.sh"
source "${INCLUDE_DIR}/hooks/index.sh"

## Data initialisation

### Postgres
_command_register "fixtures" "_hook_fc_apps" "Init postgres FC-Apps : docker-stack fixtures <fc-exploitation | fc-support | exploitation-high | exploitation-fca-low>"

### Mongo
_command_register "reset-db-core-fcp-high" "_reset_db_fcp_high" ""                # Description to be defined # Deprecated
_command_register "reset-db-core-fcp-low" "_reset_db_fcp_low" ""                  # Description to be defined # Deprecated
_command_register "reset-db-core-fca-low" "_reset_db_core_fca_low" ""             # Description to be defined # Deprecated
_command_register "reset-db" "_reset_db_fcp_low" "Alias to reset-db-core-fcp-low" # Backward compatibility entry
_command_register "reset-mongo" "_reset_mongodb" "reset-mongo <mongo-service-name> : Reset given mongodb container"
_command_register "reset-mongo-as-prod" "_reset_mongodb_as_prod" "reset-mongo-as-prod <mongo-service-name> : Reset given mongodb container with production IDPs"

### Redis

_command_register "redis" "_redis_cli" "Connect to redis cli: redis <db>"

### Elastic
_command_register "init-ud" "_init_ud" "init-ud => Initialize data for user dashboard"
_command_register "reset-stats" "_reset_stats" "reset-stats => drop stats index"
_command_register "es-create-ingest-pipeline" "_create_es_ingest_pipeline" "" # Description to be defined
_command_register "generate-legacy-traces" "_generate_legacy_traces" "Generate FC legacy connection logs and inject them into Elasticsearch"
_command_register "generate-v2-traces" "_generate_v2_traces" "Generate FC+ connection logs and inject them into Elasticsearch from '/quality/fcp/data/userdashboard/quality/fcp/data/userdashboard/populate-account-traces.script.js'"
_command_register "create-es-alias" "_create_es_alias" "create automatic es alias for FC legacy & FC v2 during _init_ud"
_command_register "create-es-alias-legacy" "_create_es_alias_legacy" "create manual es alias for FC legacy"
_command_register "create-es-alias-v2" "_create_es_alias_v2" "create manual es alias for FC v2"
_command_register "generate-metrics" "_generate_metrics" ""                   # Description to be defined
_command_register "generate-stats" "_generate_stats" "generate-stats => restore all stats (logs, event and metrics) index"
_command_register "generate-events" "_generate_events" "restore logs and events index"
_command_register "delete-indexes" "_delete_indexes" ""                       # Description to be defined
_command_register "restore-snapshot" "_es_restore_snapshot" ""                # Description to be defined # Deprecated

## Nodejs apps
_command_register "start" "_start" "start application"
_command_register "start-all" "_start_all" "Start all application for wich containers are up"

_command_register "start-ci" "_start_ci" "start for CI only"
_command_register "start-all-ci" "_start_all_ci" "start for CI only"

_command_register "stop" "_stop" "stop application"
_command_register "stop-all" "_stop_all" "Stop all application for wich containers are up"

_command_register "reload" "_start" "Alias of start"
_command_register "reload-all" "_start_all" "Alias for start-all"

_command_register "log" "_log" "log [<app>] => exec pm2 logs for given instance"

_command_register "dependencies" "_install_dependencies" "dependencies [<app1> <app2> <...>] / dep [...] => install dependencies (using npm or yarn) on given nodejs applications (fc-core|fc-exploitation|fc-support|fc-workers|fdp1|fip1|aidants-connect-mock|fsp1|fsp2|fsp3|rnipp|partenaires|usagers - default: fc-core)"
_command_register "dependencies-all" "_install_dependencies_all" "dependencies-all | dep-all => install dependencies (using npm or yarn) on all nodejs applications"

_command_register "dep" "_install_dependencies" "Alias de dependencies"
_command_register "dep-all" "_install_dependencies_all" "Alias de dependencies-all"

_command_register "test" "_test" "Launch tests?"
_command_register "test-all" "_test_all" "" # Description to be defined
_command_register "e2e" "_e2e" ""           # Description to be defined
_command_register "twc" "unit_test_watch_coverage" "twc <path> => Watch unit tests for given path and display coverage only for that path"

## Docker
_command_register "prune" "_prune" "Stop and remove all runing containers"
_command_register "prune-all" "_prune_all" "" # Description to be defined
_command_register "prune-ci" "_prune_ci" "Reset docker for CI runners"
_command_register "up" "_up" "up <stack name> => Launch a stack"
_command_register "exec" "_exec" "exec <container_name> <command> => exec a command inside a container"
_command_register "halt" "_halt" "alt => stop docker-compose and delete containers"
_command_register "switch" "_switch" "Switch to another stack: performs a prune, an up and a start-all"

_command_register "run-prod" "_run_prod" "" # Description to be defined
_command_register "list" "_list_services" "List available services / stacks: list <search term>"

## General / utils
_command_register "help" "_command_list" "Display this help: help <search term>"

_command_register "reload-rp" "_reload-rp" "Reload Reverse proxy"

_command_register "compose" "cd ${WORKING_DIR} && ${DOCKER_COMPOSE}" "Alias for docker-compose"

_command_register "llng-configure" "_llng-configure" "Restore LemonLDAP configuration from ./docker/volumes/llng/llng-conf.json dump file"

_command_register "wait" "wait_for_nodejs" "Wait for a nodejs HTTP service to respond on an URL or try to display logs"

_command_register "log-rotate" "_log-rotate" "log-rotate Rotate the logs and send SIGUSR"

_command_register "mongo" "_mongo_shell" "mongo <server> <database>: Opens mongo shell"
### Legacy aliases for mongo shell access
_command_register "mongo-shell-core-fca-low" "_mongo_shell_core_fca_low" "[deprecated] Open mongo shell for core-fca-low "
_command_register "mongo-shell-core-fcp-high" "_mongo_shell_core-fcp-high" "[deprecated] Open mongo shell for core-fcp-high"
_command_register "mongo-shell-core-fcp-low" "_mongo_shell_core-fcp-low" "[deprecated] Open mongo shell for core-fcp-low"
_command_register "mongo-shell-core-legacy" "_mongo_shell_core-legacy" "[deprecated] Open mongo shell for core-legacy"
_command_register "mongo-script" "_mongo_script" "Execute MongoDB <script> on given <container>: docker-stack mongo-script <container> <script>"

_command_register "add" "_add_node_app" "Start a node application."
_command_run "$1" "${@:2}"
