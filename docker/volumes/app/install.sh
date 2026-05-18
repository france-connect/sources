#!/bin/bash

set -e

cd /var/www/app

yarn_args=(
  --frozen-lockfile
  --ignore-engines
  --non-interactive
)

if [ -n "${PROXY_EXPLOITATION:-}" ]; then
  yarn config set proxy "${PROXY_EXPLOITATION}" && yarn config set https-proxy "${PROXY_EXPLOITATION}"
fi

if [ -n "${CI:-}" ]; then
  echo "CI install, no cache is needed"
  yarn install "${yarn_args[@]}" --no-cache
else
  echo "Local install, keeping existing cache"
  yarn install "${yarn_args[@]}"
fi
