#!/usr/bin/env bash

set -e

echo "Running migrations on database..."
yarn typeorm:migrations-run

echo "Post-deploy completed successfully."
