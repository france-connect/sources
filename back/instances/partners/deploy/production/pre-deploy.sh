#!/usr/bin/env bash

set -e

# Base path where node_modules and config files are located
BASE_PATH="/var/www/app"

echo "==========================================="
echo "PRE-DEPLOY script for partners (production)"
echo "==========================================="

echo "Running migrations on database..."
${BASE_PATH}/node_modules/.bin/ts-node -r reflect-metadata -r tsconfig-paths/register -P ${BASE_PATH}/tsconfig.json ${BASE_PATH}/node_modules/typeorm/cli.js -d ${BASE_PATH}/typeorm.migrations.config.ts migration:run


# Deployment of FC-2542
# Can be removed in next releases

${BASE_PATH}/node_modules/.bin/ts-node -r reflect-metadata -r tsconfig-paths/register -P ${BASE_PATH}/tsconfig.json ${BASE_PATH}/node_modules/typeorm/cli.js \
 -d "${BASE_PATH}/deploy/production/FC-2542/typeorm.migrations.config.ts" \
 migration:run

echo "✓ Pre-deploy completed successfully"
echo "=========================================="
