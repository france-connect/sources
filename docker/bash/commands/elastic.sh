#!/usr/bin/env bash

_reset_stats() {
  cd ${WORKING_DIR}
  echo "Resetting statistics index in elasticsearch..."

  ES_URL="https://localhost:9200"
  ES_AUTH="docker-stack:docker-stack"

  RUN_CONTEXT="$DOCKER_COMPOSE exec $NO_TTY elasticsearch"

  CURL_OPTIONS="-k -u $ES_AUTH"

  echo "# Delete indices"
  $RUN_CONTEXT curl ${CURL_OPTIONS} -XDELETE "$ES_URL/_all"
  echo ""

  echo "# Create log index"
  $RUN_CONTEXT curl ${CURL_OPTIONS} -XPUT -H "Content-Type:application/json" "$ES_URL/franceconnect" -d "@/index/create_index_business.json"
  echo ""

  echo "# Create events index"
  $RUN_CONTEXT curl ${CURL_OPTIONS} -XPUT -H "Content-Type:application/json" "$ES_URL/events" -d "@/index/create_index_stats.json"
  echo ""

  echo "# Create metrics index"
  $RUN_CONTEXT curl ${CURL_OPTIONS} -XPUT -H "Content-Type:application/json" "$ES_URL/metrics" -d "@/index/create_index_stats.json"
  echo ""

  echo "# Create tracks index"
  $RUN_CONTEXT curl ${CURL_OPTIONS} -XPUT -H "Content-Type:application/json" "$ES_URL/fc_tracks" -d "@/index/create_index_tracks.json"
  echo ""

  echo "# wait indices to be processed..."
  sleep 5
  echo ""

  echo "# reset stats done !"
}

_create_es_ingest_pipeline() {
  $DOCKER_COMPOSE exec $NO_TTY elasticsearch curl -u docker-stack:docker-stack -k -XPUT -H 'Content-Type:application/json' https://elasticsearch:9200/_ingest/pipeline/geo -d "@/ingest_pipelines/geo.json"
}

_create_es_alias() {
  CEA_TARGET=$1
  CEA_ALIAS=$2

  echo " ## create traces alias: $CEA_TARGET ~> $CEA_ALIAS"
  $DOCKER_COMPOSE exec $NO_TTY elasticsearch curl -u docker-stack:docker-stack -k -XPOST -H 'Content-Type:application/json' https://elasticsearch:9200/$CEA_TARGET/_alias/$CEA_ALIAS
}

_generate_legacy_traces() {
  echo "Generate traces for test_TRACE_USER"
  docker exec fc_fc-core_1 bash -c "cd cypress/support/script && node traces.js generate test_TRACE_USER"
}

_generate_v2_traces() {
  cd $FC_ROOT/fc/quality/fcp/data/userdashboard
  yarn install --ignore-engines
  URL="https://docker-stack:docker-stack@elasticsearch:9200"
  Elasticsearch_TRACKS_INDEX=fc_tracks Elasticsearch_NODES="[\"${URL}\"]" Elasticsearch_USERNAME=docker-stack Elasticsearch_PASSWORD=docker-stack node populate-account-traces.script.js
}

_init_ud() {
  echo " # init_ud"
  echo " ## _reset_stats"
  _reset_stats
  echo " ## _create_es_ingest_pipeline"
  _create_es_ingest_pipeline
  echo " ## _generate_legacy_traces"
  _generate_legacy_traces
  echo " ## _generate_v2_traces"
  _generate_v2_traces
  _create_es_alias "fc_tracks,franceconnect" "tracks"
}

_generate_stats() {
  echo "Generating statistics index in elasticsearch..."
  _create_es_ingest_pipeline
  _generate_events
  _generate_metrics
  echo "statistics in elasticsearch generated"
}

_generate_events() {
  START=$(date --rfc-3339=date -d "-3 month")
  STOP=$(date --rfc-3339=date -d "3 month")
  LOGS_PER_DAY=42
  VARIATION=0.10

  cd ${WORKING_DIR}

  echo "Generate logs"
  $DOCKER_COMPOSE exec $NO_TTY fc-workers bash -c "cd tests/fixtures && node generate-logs.js $START $STOP $LOGS_PER_DAY $VARIATION"
  echo "Sleep 2 seconds to give elastic some rest"
  sleep 1

  echo "Generate stats"
  $DOCKER_COMPOSE exec $NO_TTY fc-workers ./run IndexElasticLogs --start=$START --stop=$STOP
}

_generate_metrics() {
  echo "Generate metrics stats"
  cd ${WORKING_DIR}

  START=$(date --rfc-3339=date -d "-3 month")
  STOP=$(date --rfc-3339=date -d "3 month")
  METRIC_GROWTH=0.03

  echo "Generate metrics"
  $DOCKER_COMPOSE exec $NO_TTY fc-workers bash -c "cd tests/fixtures && node generate-metrics.js $START $STOP $METRIC_GROWTH"

  echo "Generate Identities"
  $DOCKER_COMPOSE up -d mongo
  $DOCKER_COMPOSE exec $NO_TTY fc-workers bash -c "yarn debug generate-identities.js && ./run InitIdentityES && ./run IndexUserStats --metric=identity"
}

_delete_indexes() {
  echo "Delete index in elasticsearch..."

  ES_LOG="http://localhost:9200"
  ES_STATS="http://localhost:9200"

  echo "Delete All indexes"

  echo "Delete log index"
  curl -XDELETE "$ES_LOG/fc_evt_v5"
  echo ""

  echo "Delete events index"
  curl -XDELETE "$ES_STATS/events"
  echo ""

  echo "Delete metrics index"
  curl -XDELETE "$ES_STATS/metrics"
  echo ""

}

_es_restore_snapshot() {
  echo "Create repository..."
  cd ${WORKING_DIR} && $DOCKER_COMPOSE exec $NO_TTY elasticsearch curl -X PUT "localhost:9200/_snapshot/snapshots?pretty" -H 'Content-Type: application/json' -d '{"type":"fs","settings":{"location":"/data/elasticsearch-snapshots"}}'
  echo "Restore snapshot..."
  cd ${WORKING_DIR} && $DOCKER_COMPOSE exec $NO_TTY elasticsearch curl -X POST "localhost:9200/_snapshot/snapshots/2020-05-13/_restore?pretty"
}
