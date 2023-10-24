#!/usr/bin/env bash

source "./scripts/utils.sh"

setup() {
  ./scripts/yarn-prepare.sh "$1"
}

# Check if APP_NAME exists as argument
APP_NAME=$1
[ -z "$APP_NAME" ] && print_error "L'argument app_name est manquant" && exit 1

setup $APP_NAME

CWD=$(pwd)
cd "instances/$APP_NAME"

LOG_NODE=/var/tmp/watch-node.log
LOG_ELEVENTY=/var/tmp/watch-eleventy.log

yarn eleventy --serve > $LOG_ELEVENTY &
node $CWD/scripts/apps.watch.js $APP_NAME > $LOG_NODE &

tail -f $LOG_ELEVENTY
tail -f $LOG_NODE

wait
