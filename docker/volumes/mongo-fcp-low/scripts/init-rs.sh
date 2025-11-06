#!/usr/bin/env bash
set -e

echo "Initializing replica set..."

CONF="$1"
LOCAL_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FILE="${LOCAL_PATH}/replicaSets/${CONF}.js"

[[ -z "$CONF" || ! -f "$FILE" ]] && { echo "Usage: $0 <conf>"; exit 1; }

mongosh \
  --host mongo-fcp-low:27017 \
  --tls \
  --username "${MONGO_INITDB_ROOT_USERNAME}" \
  --password "${MONGO_INITDB_ROOT_PASSWORD}" \
  --authenticationDatabase admin ${MONGO_INITDB_DATABASE} \
  --file "$FILE"

echo "initialized Replica set..."
