#! /bin/bash

KEY_DEST="/etc/ssl/postgres.key"

copyKey() {
  local key="${1}"

  echo "Copying server private key from ${key}"
  cp "${key}" "${KEY_DEST}"

  echo "Setting ownership on ${KEY_DEST}"
  chown postgres:postgres "${KEY_DEST}"

  echo "Setting permissions on ${KEY_DEST}"
  chmod 0600 "${KEY_DEST}"
}

copyKey "/etc/ssl/docker_host/postgres.key"

echo "Starting postgres with conf"
exec gosu postgres /usr/local/bin/docker-entrypoint.sh postgres -c config_file=/etc/postgresql/postgresql.conf -c hba_file=/etc/postgresql/pg_hba.conf
