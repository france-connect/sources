#!/bin/sh

test $(echo "rs.initiate().ok || rs.status().ok" | mongo --host ${HOSTNAME} -u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin ${MONGO_INITDB_DATABASE} --quiet --tls) -eq 1
