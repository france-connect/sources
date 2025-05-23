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
_command_register "migrations-partners-back" "_migrations-postgres partners-back" ""                   # Description to be defined
_command_register "migrations-generate-partners-back" "_migrations-generate-postgres partners-back" "" # Description to be defined
_command_register "fixtures-partners-back" "_fixtures-postgres 'partners-back'" ""                     # Description to be defined

_command_register "fixtures" "_hook_fc_apps" "Init postgres FC-Apps : docker-stack fixtures <fc-exploitation | fc-support | exploitation-high>"

### Mongo
_command_register "reset-db-core-fcp-high" "_reset_db_fcp_high" ""                # Description to be defined # Deprecated
_command_register "reset-db-core-fcp-low" "_reset_db_fcp_low" ""                  # Description to be defined # Deprecated
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
_command_register "generate-metrics" "_generate_metrics" "" # Description to be defined
_command_register "generate-stats" "_generate_stats" "generate-stats => restore all stats (logs, event and metrics) index"
_command_register "generate-events" "_generate_events" "restore logs and events index"
_command_register "delete-indexes" "_delete_indexes" ""        # Description to be defined
_command_register "restore-snapshot" "_es_restore_snapshot" "" # Description to be defined # Deprecated

## Nodejs apps
_command_register "start" "_start" "start application"
_command_register "start:prod" "_start_prod" "Build, then start NestJS applications (each application is built only once)"
_command_register "start:dev" "_start_dev" "Start application in dev mode (watching changes)"
_command_register "start-all" "_start_all" "Start all application for wich containers are up"

_command_register "start-ci" "_start_ci" "start for CI only"
_command_register "start-all-ci" "_start_all_ci" "start for CI only"

_command_register "stop" "_stop" "stop application"
_command_register "stop-all" "_stop_all" "Stop all application for wich containers are up"

_command_register "reload" "_start" "Alias of start"
_command_register "reload-all" "_start_all" "Alias for start-all"

_command_register "log" "_log" "log [<app>] => exec pm2 logs for given instance"
_command_register "logs" "_logs" "[--bg] - Show and expose logs for chrome dev-tools. If --bg option is passed, logs are only exposed to dev-tools with a background process"

_command_register "dependencies" "_install_dependencies" "dependencies [<app1> <app2> <...>] / dep [...] => install dependencies (using npm or yarn) on given nodejs applications (fc-core|fc-exploitation|fc-support|fc-workers|fdp1|fip1|aidants-connect-mock|fsp1|fsp2|fsp3|rnipp|partenaires|usagers - default: fc-core)"
_command_register "dependencies-all" "_install_dependencies_all" "dependencies-all | dep-all => install dependencies (using npm or yarn) on all nodejs applications"

_command_register "dep" "_install_dependencies" "Alias de dependencies"
_command_register "dep-all" "_install_dependencies_all" "Alias de dependencies-all"

## Test
_command_register "test" "_test" "Launch tests?"
_command_register "test-all" "_test_all" "" # Description to be defined
_command_register "e2e" "_e2e" ""           # Description to be defined
_command_register "twc" "unit_test_watch_coverage" "twc <path> => Watch unit tests for given path and display coverage only for that path"
_command_register "cypress" "_cypress" "Run Cypress tests"
_command_register "bdd-fcp-report" "_bdd_fcp_report" "Generate the test report for fcp workspace"
_command_register "bdd-eidas-open" "_bdd_eidas_open" "Open Cypress UI for eIDAS bridge"
_command_register "bdd-eidas-test" "_bdd_eidas_test" "Run Cypress tests on eIDAS bridge"
_command_register "bdd-eidas-test-visual" "_bdd_eidas_test_visual" "Run Cypress visual tests on eIDAS bridge"
_command_register "bdd-exploitation-open" "_bdd_exploitation_open" "Open Cypress UI for FC Exploitation"
_command_register "bdd-exploitation-test" "_bdd_exploitation_test" "Run Cypress tests on FC Exploitation"
_command_register "bdd-high-open" "_bdd_high_open" "Open Cypress UI for FC+"
_command_register "bdd-high-test" "_bdd_high_test" "Run Cypress tests on FC+"
_command_register "bdd-high-test-visual" "_bdd_high_test_visual" "Run Cypress visual tests on FC+"
_command_register "bdd-low-open" "_bdd_low_open" "Open Cypress UI for FC v2"
_command_register "bdd-low-test" "_bdd_low_test" "Run Cypress tests on FC v2"
_command_register "bdd-low-test-visual" "_bdd_low_test_visual" "Run Cypress visual tests on FC v2"
_command_register "bdd-support-open" "_bdd_support_open" "Open Cypress UI for FC Support"
_command_register "bdd-support-test" "_bdd_support_test" "Run Cypress tests on FC Support"
_command_register "bdd-ud-open" "_bdd_ud_open" "Open Cypress UI for User-Dashboard"
_command_register "bdd-ud-test" "_bdd_ud_test" "Run Cypress tests on User-Dashboard"
_command_register "bdd-ud-test-visual" "_bdd_ud_test_visual" "Run Cypress visual tests on User-Dashboard"
_command_register "bdd-partners-report" "_bdd_partners_report" "Generate the test report for partners workspace"
_command_register "bdd-partners-open" "_bdd_partners_open" "Open Cypress UI for Partners"
_command_register "bdd-partners-test" "_bdd_partners_test" "Run Cypress tests on Partners"
_command_register "bdd-partners-test-visual" "_bdd_partners_test_visual" "Run Cypress visual tests on Partners"

## Docker
_command_register "prune" "_prune" "Stop and remove all runing containers"
_command_register "prune-all" "_prune_all" "" # Description to be defined
_command_register "prune-ci" "_prune_ci" "Reset docker for CI runners"
_command_register "up" "_up" "up <stack name> => Launch a stack"
_command_register "exec" "_exec" "exec <container_name> <command> => exec a command inside a container"
_command_register "halt" "_halt" "alt => stop docker-compose and delete containers"
_command_register "switch" "_switch" "Switch to another stack: performs a prune, an up and a start-all"
_command_register "build-push" "_build_push" "Build and push image to FC Docker registry"
_command_register "run-prod" "_run_prod" "" # Description to be defined
_command_register "list" "_list_services" "List available services / stacks: list <search term>"

## General / utils
_command_register "help" "_command_list" "Display this help: help <search term>"

_command_register "reload-rp" "_reload_rp" "Reload Reverse proxy"

_command_register "compose" "_compose" "Run a docker compose command on project"

_command_register "wait" "wait_for_nodejs" "Wait for a nodejs HTTP service to respond on an URL or try to display logs"

_command_register "log-rotate" "_log_rotate" "log-rotate Rotate the logs and send SIGUSR"

_command_register "mongo" "_mongo_shell" "mongo <server> <database> [tls]: Opens mongo shell [Optional tls argument to activate client authentication]"
### Legacy aliases for mongo shell access
_command_register "mongo-shell-core-fcp-high" "_mongo_shell_core_fcp_high" "[deprecated] Open mongo shell for core-fcp-high"
_command_register "mongo-shell-core-fcp-low" "_mongo_shell_core_fcp_low" "[deprecated] Open mongo shell for core-fcp-low"
_command_register "mongo-shell-core-legacy" "_mongo_shell_core_legacy" "[deprecated] Open mongo shell for core-legacy"
_command_register "mongo-script" "_mongo_script" "Execute MongoDB <script> on given <container>: docker-stack mongo-script <container> <script>"

_command_register "inspect-files-back" "_get_back_app_files" "inspect-files-for-app <app> => Extract files needed for a built application, based on webpack stats. App must be built before running this command"
_command_register "inspect-files-front" "_get_front_app_files" "inspect-files-for-app <app> => Extract files needed for a built application, based on webpack stats. App must be built before running this command"
_command_register "inspect-updated-files-for-apps" "_get_modified_files_for_apps" "inspect-updated-files-for-apps <app1> [<app2> <app3> ...] <git revision> => Compare list if files needed for an application to list of files modified for the given revision "
_command_register "detect-back-changes" "_ci_job_relevant_for_back_apps" "ci-diff-files <app1> [<app2> <app3> ...] => CI ONLY! Runs inspect-updated-files-for-apps but auto build the applications and fetches the git revision"
_command_register "detect-front-changes" "_ci_job_relevant_for_front_apps" "ci-diff-files <app1> [<app2> <app3> ...] => CI ONLY! Runs inspect-updated-files-for-apps but auto build the applications and fetches the git revision"

_command_register "add" "_add_node_app" "Start a node application."
_command_run "$1" "${@:2}"
