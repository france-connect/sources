#!/bin/bash

set -e
set -u

shopt -s expand_aliases

export PGPASSWORD="$POSTGRES_PASSWORD"; 

alias psql="psql -v ON_ERROR_STOP=1 --username \"$POSTGRES_USER\"";

function create_user() {

  local user=$1
  local db=$1
  local password=$2

  echo "Creating user \"$user\"";

  psql -c "CREATE USER $user WITH PASSWORD '$password';";
}

function create_database_with_owner() {
  local db=$1
  local user=$2


  echo "Creating database \"$db\" with owner \"$user\""

  psql -c "CREATE DATABASE $db;";
  psql -c "GRANT ALL PRIVILEGES ON DATABASE $db TO $user;";
  psql -d "$db" -c "GRANT USAGE, CREATE ON SCHEMA public TO $user;"
}

function load_extensions() {
  local db=$1
  local extension=$2

  echo "Activating extension $extension on database $db"

  psql -c "CREATE EXTENSION IF NOT EXISTS \"$extension\";" -d "$db" 
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
