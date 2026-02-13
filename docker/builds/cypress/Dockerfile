FROM cypress/browsers:22.21.0

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

ENV CYPRESS_CACHE_FOLDER=/root/.cache/Cypress

USER node

WORKDIR /var/www/quality
COPY ./quality/package.json ./quality/yarn.lock ./

RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY}; \
  yarn config set ignore-engines ${NODE_IGNORE_ENGINE} && \
  yarn install --immutable --frozen-lockfile --non-interactive --network-concurrency 1 && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy;

RUN yarn cypress install

RUN chmod -R 777 /root/.cache/Cypress
