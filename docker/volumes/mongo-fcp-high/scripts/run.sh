#! /bin/bash

mongo="mongo --host ${Mongoose_HOSTS} -u ${Mongoose_USER} -p ${Mongoose_PASSWORD} ${Mongoose_DATABASE} --quiet --tls"
script=${1}

cd "$(dirname "$0")"

if [ ! -f "./${script}" ]; then
  echo "Script not found: ${script}"
  exit 1
fi

${mongo} "./${script}"
