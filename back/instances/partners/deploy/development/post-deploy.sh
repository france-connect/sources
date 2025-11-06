#!/usr/bin/env bash

set -e

echo "Running migrations on database..."
yarn typeorm:migrations-run

echo "Inserting fixtures in database..."
yarn typeorm:fixtures:load

echo "Local post-deploy completed successfully."
