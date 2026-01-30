#!/usr/bin/env bash

set -e

./node_modules/.bin/ts-node -r reflect-metadata -r tsconfig-paths/register -P tsconfig.json ./node_modules/typeorm/cli.js -d ./typeorm.migrations.config.ts migration:run
