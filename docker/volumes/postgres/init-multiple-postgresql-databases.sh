#!/bin/bash

set -e
set -u

shopt -s expand_aliases

export PGPASSWORD="$POSTGRES_PASSWORD"; 

alias psql="psql -v ON_ERROR_STOP=1 --username \"$POSTGRES_USER\"";

function create_user() {
  echo "Creating user \"$1\"";

  psql -c "CREATE USER $1 WITH PASSWORD '$2';";
}

function create_database_with_owner() {
  echo "Creating database \"$1\" with owner \"$2\""

  psql -c "CREATE DATABASE $1;";
  psql -c "GRANT ALL PRIVILEGES ON DATABASE $1 TO $2;";
}

function load_extensions() {
  echo "Activating extension $2 on database $1"

  psql -c "CREATE EXTENSION IF NOT EXISTS \"$2\";" -d "$1" 
}

function init() {
  i=1;
  while true;
  do
      DB="POSTGRES_${i}"
      USER="POSTGRES_${i}_USER"
      PASSWORD="POSTGRES_${i}_PASSWORD"

      if [ -z "${!DB-}" ] && [ -z "${!USER-}" ] && [ -z "${!PASSWORD-}" ];
      then
        break ;
      elif [ -z "${!DB-}" ] || [ -z "${!USER-}" ] || [ -z "${!PASSWORD-}" ];
      then
        echo "Invalid configuration for DB number $i. Did you forget to set a variable ? Exiting with error..."
        exit 1;
      fi

      create_user "${!USER}" "${!PASSWORD}"
      create_database_with_owner "${!DB}" "${!USER}"
      # Application DB User is not allowed to load modules and won't be in production either.
      # We have to load extension at init time with our admin user!
      load_extensions "${!DB}" "uuid-ossp"

      i=$(($i+1))
  done
}
init
echo "Finished initialization :)"
