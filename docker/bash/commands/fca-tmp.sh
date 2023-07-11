#!/usr/bin/env bash

_fca_low_front() {
  cd ${WORKING_DIR}
  docker-compose exec $NO_TTY fca-low-front yarn install
  docker-compose exec $NO_TTY fca-low-front yarn build:fca-low-front
  cd ${FC_ROOT}/fc/back/apps/core-fca/src/

  if [ -d 'public' ]; then
    rm -rf public
  fi

  mkdir public
  # @TODO agent-connect application path
  # should be moved into a bashrc global variables ?
  cd ${FC_ROOT}/fc/front/instances/agent-connect/
  cp -r ${FC_ROOT}/fc/front/instances/agent-connect/build/** ${FC_ROOT}/fc/back/apps/core-fca/src/public

  if [ -e 'interaction.ejs' ]; then
    rm ${FC_ROOT}/fc/back/apps/core-fca/src/views/interaction.ejs
  fi

  mv ${FC_ROOT}/fc/back/apps/core-fca/src/public/index.html ${FC_ROOT}/fc/back/apps/core-fca/src/views/interaction.ejs
  echo ""
  echo "L'application AgenConnect est maintenant prête à être utilisée..."
  echo ""
}
