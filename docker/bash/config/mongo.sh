#!/usr/bin/env bash

MONGO_DEFAULT_USER="rootAdmin"
MONGO_DEFAULT_PASS="pass"

MONGO_TLS_CA_FILE=${FC_ROOT}/fc/docker/volumes/ssl/docker-stack-ca.crt
MONGO_TLS_APP_KEY=${FC_ROOT}/fc/docker/volumes/ssl/app.pem

MONGO_FCPHIGH_LOCALPORT="27018"
MONGO_FCPHIGH_PORT="27017"

# User local path for mongosh
MONGO_SH=${FC_MONGOSH:=mongosh}

export MONGO_FCPHIGH_LOCALPORT
export MONGO_FCPHIGH_PORT
