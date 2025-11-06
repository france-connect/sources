# Base on the image built on CI/CD pipeline
FROM registry.gitlab.dev-franceconnect.fr/france-connect/fc/nodejs-apps/command-import-sp-sandbox:fc-369RC1  

# Copy real data into the container
COPY --chown=node:node ./ds.csv /var/data/ds.csv

