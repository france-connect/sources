#!/bin/bash

cd ../front/apps/agent-connect
yarn install
yarn build
cd -
nest build core-fca-low
# ajout des fichiers statiques dans le bon dossier
mkdir ./dist/instances/core-fca-low/public
cp -r ../front/apps/agent-connect/build/** ./dist/instances/core-fca-low/public
# changement extension .html en .ejs pour pouvoir le récupérer dans le render
mv ./dist/instances/core-fca-low/public/index.html ./dist/instances/core-fca-low/views/interaction.ejs
