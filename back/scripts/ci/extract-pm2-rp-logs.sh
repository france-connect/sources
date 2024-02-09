#!/bin/bash

rm -rf $CI_PROJECT_DIR/artifacts-logs
mkdir -p $CI_PROJECT_DIR/artifacts-logs

for container in `docker ps --format '{{.Names}}'`; do
  docker cp "$container:/tmp/.pm2/logs" "$CI_PROJECT_DIR/artifacts-logs/$container" &>/dev/null || echo "[$container] No PM2 logs found";
done

mkdir -p $CI_PROJECT_DIR/artifacts-logs/nginx

docker cp fc-rp-all:/var/log/nginx/nginx_error.log $CI_PROJECT_DIR/artifacts-logs/nginx/nginx_error.log || echo "[fc-rp-all] No NginX error logs found";
docker cp fc-rp-all:/var/log/nginx/nginx_access.log $CI_PROJECT_DIR/artifacts-logs/nginx/nginx_access.log || echo "[fc-rp-all] No NginX access logs found";
