#!/bin/bash

rm -rf $CI_PROJECT_DIR/artifacts-logs
mkdir -p $CI_PROJECT_DIR/artifacts-logs

for container in `docker ps --format '{{.Names}}'`; do
  docker cp "$container:/tmp/.pm2/logs" "$CI_PROJECT_DIR/artifacts-logs/$container" &>/dev/null || echo "[$container] No PM2 logs found";
done
