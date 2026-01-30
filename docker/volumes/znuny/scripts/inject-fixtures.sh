#!/usr/bin/env bash

set -euo pipefail

# We need to temporary give access to otrs user since permission should always be 0600 like.
chown otrs:www-data /etc/ssl/postgres.znuny.client.*

# This command is not part of the original Znuny start script.

CONSOLE="/opt/otrs/bin/otrs.Console.pl"

if [ ! -x "$CONSOLE" ]; then
  echo "Error: otrs.Console.pl not found" >&2
  exit 1
fi

# Run a shell command as 'otrs' user if available, else run as current user.
run_cmd() {
  local cmd="$1"
  echo "+ $cmd"
  if id otrs >/dev/null 2>&1; then
    su -s /bin/bash otrs -c "bash -lc '$cmd'"
  else
    echo "Error: otrs user not found" >&2
    exit 1;
  fi
}

# Rebuild configuration
run_cmd "$CONSOLE Maint::Config::Rebuild"

# Try to install DB schema (tolerate failure if already initialized)
run_cmd "$CONSOLE Maint::Database::Check"

# Create admin user
run_cmd "${CONSOLE} Admin::User::Add --user-name ${ZNUNY_ADMIN_USER} --password ${ZNUNY_ADMIN_PASS} --email-address ${ZNUNY_ADMIN_EMAIL} --first-name ${ZNUNY_ADMIN_FIRSTNAME} --last-name ${ZNUNY_ADMIN_LASTNAME}"

chown www-data:www-data /etc/ssl/postgres.znuny.client.*

echo "Fixture injection completed."
