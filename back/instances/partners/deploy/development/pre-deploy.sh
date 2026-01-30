#!/usr/bin/env bash

set -e

# Base path where node_modules and config files are located
BASE_PATH="/var/www/app"

echo "=========================================="
echo "PRE-DEPLOY script for partners (development)"
echo "=========================================="

echo "Running migrations on database..."
${BASE_PATH}/node_modules/.bin/ts-node -r reflect-metadata -r tsconfig-paths/register -P ${BASE_PATH}/tsconfig.json ${BASE_PATH}/node_modules/typeorm/cli.js -d ${BASE_PATH}/typeorm.config.ts migration:run

echo "Inserting fixtures in database..."
${BASE_PATH}/node_modules/.bin/fixtures-ts-node-commonjs load "${BASE_PATH}/fixtures/partners-back" -d ${BASE_PATH}/typeorm.config.ts --require=reflect-metadata --require=tsconfig-paths/register

echo "✓ Pre-deploy completed successfully"
echo "=========================================="
