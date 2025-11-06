# syntax=docker/dockerfile:1.4

########################################
# ARG declarations
########################################
ARG NODE_VERSION
ARG DEBIAN_VERSION

########################################
# Stage 1: Build the dev-deps
########################################
FROM node:${NODE_VERSION}-${DEBIAN_VERSION} AS dev-deps

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

WORKDIR /tmp/dependencies

COPY ./back/package.json ./back/yarn.lock ./
RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn config set ignore-engines ${NODE_IGNORE_ENGINE} && \
  yarn install --immutable --frozen-lockfile && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy

########################################
# Stage 2: Build the prod-deps
########################################
FROM node:${NODE_VERSION}-${DEBIAN_VERSION} AS prod-deps

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

WORKDIR /tmp/dependencies

COPY ./back/package.json ./back/yarn.lock ./
RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn config set ignore-engines ${NODE_IGNORE_ENGINE} && \
  yarn install --production --immutable --frozen-lockfile && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy

########################################
# Stage 3.1: Base CA certificates image
########################################
FROM node:${NODE_VERSION}-${DEBIAN_VERSION}-slim AS ca-build

ARG INTERNET_PROXY

COPY --from=tls FranceConnect-CA.crt /usr/local/share/ca-certificates/FranceConnect.crt

RUN \
  echo "Acquire::http::Proxy \"$INTERNET_PROXY\";" > /etc/apt/apt.conf.d/proxy.conf && \
  export http_proxy=${INTERNET_PROXY} && export https_proxy=${INTERNET_PROXY} && \
  apt-get update && \
  apt-get install -y ca-certificates && \
  update-ca-certificates --fresh && \
  apt-get clean  && \
  unset http_proxy && unset https_proxy && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf /etc/apt/apt.conf.d/proxy.conf

########################################
# Stage 3.2: Base production image
########################################
FROM node:${NODE_VERSION}-${DEBIAN_VERSION}-slim AS prod-base

ARG INTERNET_PROXY

ENV \
  DEBIAN_FRONTEND=noninteractive \
  PM2_HOME=/tmp/.pm2 \
  NODE_ENV=production \
  APP_NAME=NO_APP_NAME_PROVIDED

RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn global add pm2 && \
  yarn config delete proxy && \
  yarn config delete https-proxy

COPY --from=pm2 . /etc/pm2

COPY --from=ca-build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=ca-build /etc/ssl/certs/*.pem /etc/ssl/certs/

VOLUME ["/data/log", "/etc/ssl/client_certs"]

ENTRYPOINT ["pm2-runtime", "/etc/pm2/ecosystem.config.js"]

########################################
# Stage 3.3: Build the application
########################################
FROM dev-deps AS app-build

ARG APP_NAME

COPY ./back .

RUN yarn run build:${APP_NAME} && \
  rm -rf node_modules

########################################
# Stage 4.1: Final generic app image
########################################
FROM prod-base AS prod-generic

ARG APP_NAME
ARG APP_VERSION

ENV \
  APP_VERSION=$APP_VERSION \
  APP_NAME=$APP_NAME

COPY --chown=node:node --from=app-build /tmp/dependencies/dist/instances/${APP_NAME} /var/www/app

COPY --chown=node:node --from=prod-deps /tmp/dependencies/node_modules /var/www/app/node_modules

WORKDIR /var/www/app
USER node

########################################
# Stage 4.2: Final specific app image
########################################
# We need some special libraries for the HSM
FROM prod-generic AS prod-with-hsm

COPY --from=hsm . /etc/hsm

########################################
# Stage 4.3: Command runner app image
########################################
FROM prod-generic AS command-runner-generic

ARG COMMAND_ARGS

ENV \
  COMMAND_ARGS=$COMMAND_ARGS

# First remove prod deps
RUN rm -rf /var/www/app/node_modules

# Use the dev deps instead
COPY --chown=node:node --from=dev-deps /tmp/dependencies/node_modules /var/www/app/node_modules