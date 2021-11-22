#!/bin/bash

SCRIPTS_DIR="/opt/scripts/db-states"
MONGO="mongo --host mongo-fca-low -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin $MONGO_INITDB_DATABASE --quiet --tls";

usage() {
  echo "Usage:";
  echo "";
  echo -e "-h, --help\t\t\t\t\tDisplay this";
  echo -e "-r[=state-name], --reset-db[=state-name]\tReset the database to a defined state (\"_default\" by default)";
  echo "";
  exit 0;
}

drop_database() {
  eval "$MONGO $SCRIPTS_DIR/mongo-reset.js";
}

reset_state() {
  STATE="_default";

  if [ "$1" != "" ]; then
    STATE="$1";
  fi

  SCRIPT_TO_EXEC="$SCRIPTS_DIR/$STATE/index.js";

  drop_database;

  if [ ! -f $SCRIPT_TO_EXEC ]; then
    echo "The state $STATE does not exists in $SCRIPT_TO_EXEC !";
    exit 1;
  fi

  eval "$MONGO $SCRIPT_TO_EXEC";
  exit 0;
}

options=$(getopt -l "help,reset-db::" -o "h,r::" -a -- "$@");

eval set -- "$options";

while true; do
    case $1 in
      -r | --reset-db)
        reset_state $2;
        ;;
      -h | --help | *)
        usage;
        ;;
      --)
        shift
        break;;
    esac
    shift
done
