#!/bin/bash

main() {
  local app=${NESTJS_INSTANCE}
  local buildPath="${PM2_CWD}/dist/instances/${app}"

  echo ${buildPath}

  if [ ! -d ${buildPath} ]; then
    echo "Building ${app}"
    yarn build ${app}
  else
    echo "Exising build Found for ${app}"
  fi

  pm2 delete all
  pm2 start /opt/scripts/pm2/app-prod.config.js

}

main
