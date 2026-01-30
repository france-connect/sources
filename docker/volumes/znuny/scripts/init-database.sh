#!/usr/bin/env bash

set -euo pipefail

echo "=============================================================
This script initializes the Znuny database schema if not already present.
It parses the Znuny configuration to get database connection settings,
then connects to the Postgres database and creates the schema if needed.

It is a workaround for the fact that Znuny does not automatically create its database schema
and the configuration is not widely accessible in a Docker context. please refer to
docker/volumes/znuny/README.md for more information.
============================================================="

OTRS_HOME="${OTRS_HOME:-/opt/otrs}"
CONSOLE="$OTRS_HOME/bin/otrs.Console.pl"

# 1) Paths to Znuny SQL files
DBDIR="$OTRS_HOME/scripts/database"
SCHEMA="$DBDIR/otrs-schema.postgresql.sql"
INITIAL="$DBDIR/otrs-initial_insert.postgresql.sql"
POST="$DBDIR/otrs-schema-post.postgresql.sql"

PGHOST=${ZNUNY_DB_HOST}
PGDATABASE=${ZNUNY_DB_NAME}
PGUSER=${ZNUNY_DB_USER}
PGPASSWORD=${ZNUNY_DB_PASS}
PGPORT=${ZNUNY_DB_PORT}
PGSSLMODE=${ZNUNY_DB_SSLMODE}
PGSSLROOTCERT=${ZNUNY_DB_SSLROOTCERT}
PGSSLCERT=${ZNUNY_DB_SSLCERT}
PGSSLKEY=${ZNUNY_DB_SSLKEY}
# Export only if non-empty
export PGHOST PGDATABASE PGUSER PGPASSWORD
[ -n "${PGPORT:-}" ] && export PGPORT
[ -n "${PGSSLMODE:-}" ] && export PGSSLMODE
[ -n "${PGSSLROOTCERT:-}" ] && export PGSSLROOTCERT
[ -n "${PGSSLCERT:-}" ] && export PGSSLCERT
[ -n "${PGSSLKEY:-}" ] && export PGSSLKEY

# 2) Wait for DB, then check whether schema exists (look for a core table)
psql -tAc "SELECT 1" > /dev/null

SCHEMA_EXISTS_QUERY="SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'groups';"

if ! psql -tAc "$SCHEMA_EXISTS_QUERY" | grep -q 1; then
  echo "Znuny DB schema not found. Loading SQL files..."
  psql -v ON_ERROR_STOP=1 -f "$SCHEMA"
  psql -v ON_ERROR_STOP=1 -f "$INITIAL"
  [ -f "$POST" ] && psql -v ON_ERROR_STOP=1 -f "$POST"
  echo "Schema created."
else
  echo "Znuny DB schema already present. Skipping creation."
fi

echo "Injecting fixtures..."
psql -v ON_ERROR_STOP=1 -f /tmp/fixtures.sql

echo "init-database done"
