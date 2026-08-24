# syntax=docker/dockerfile:1.4

########################################
# ARG declarations
########################################
ARG NODE_VERSION
ARG DEBIAN_VERSION
ARG NODE_MODULE_BACK_VERSION
ARG REGISTRY_URL

########################################
# Stage 1: Build the dev-back-deps
########################################
FROM ${REGISTRY_URL}/nodejs-apps/dev-back-deps:${NODE_MODULE_BACK_VERSION} AS dev-back-deps

########################################
# Stage 2: Build the prod-deps
########################################
FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION} AS prod-deps

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

WORKDIR /opt/dependencies/back

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
FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION} AS ca-build

COPY --from=tls FranceConnect-CA.crt /usr/local/share/ca-certificates/FranceConnect.crt

RUN update-ca-certificates --fresh;

########################################
# Stage 3.2: Base production image
########################################
FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION}-slim AS prod-base

ARG INTERNET_PROXY
ARG EXTRA_PACKAGES=""

ENV \
  DEBIAN_FRONTEND=noninteractive \
  PM2_HOME=/tmp/.pm2 \
  NODE_ENV=production \
  APP_NAME=NO_APP_NAME_PROVIDED

COPY --from=ca-build /etc/ssl/certs/ /etc/ssl/certs/

RUN \
  # Fix the cache to non-persistent locations
  --mount=type=cache,target=/var/cache/apt,sharing=locked \
  --mount=type=cache,target=/var/lib/apt,sharing=locked \
  set -eux; \
  \
  # Enforce HTTPS for Debian APT sources (PRA requirement)
  if [ -f /etc/apt/sources.list.d/debian.sources ]; then \
    sed -i 's|http://|https://|g' /etc/apt/sources.list.d/debian.sources; \
  fi; \
  \
   # Configure temporary APT proxy
  export http_proxy="${INTERNET_PROXY}" https_proxy="${INTERNET_PROXY}"; \
  echo 'Acquire::http::Proxy "'"${INTERNET_PROXY}"'";' > /etc/apt/apt.conf.d/01proxy; \
  echo 'Acquire::https::Proxy "'"${INTERNET_PROXY}"'";' >> /etc/apt/apt.conf.d/01proxy; \
  \
  # Update APT index
  apt-get update 2>&1 | tee /tmp/update.log; \
  if grep -qE '^(W: Failed to fetch|W: Some index files failed|E: )' /tmp/update.log; then \
    echo "FATAL: apt-get update failed to fetch one or more repositories" >&2; \
    exit 1; \
  fi; \
  \
  # Install last security patches
  apt-get -y --no-install-recommends upgrade; \
  \
  if [ -n "${EXTRA_PACKAGES}" ]; then \
    apt-get install -y --no-install-recommends ${EXTRA_PACKAGES}; \
  fi && \
  \
  # Cleanup
  apt-get -y autoremove; \
  apt-get clean; \
  rm -rf /var/lib/apt/lists/* /etc/apt/apt.conf.d/01proxy

RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn global add pm2 && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy

COPY --from=pm2 . /etc/pm2

VOLUME ["/data/log", "/etc/ssl/client_certs"]

ENTRYPOINT ["pm2-runtime", "/etc/pm2/ecosystem.config.js"]

########################################
# Stage 3.3: Copy sources
########################################
FROM dev-back-deps AS dev-generic

WORKDIR /opt/dependencies/back

COPY ./back/ .

########################################
# Stage 3.4: Build the application
########################################
FROM dev-generic AS app-build

ARG APP_NAME

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

COPY --chown=node:node --from=app-build /opt/dependencies/back/dist/instances/${APP_NAME} /var/www/app

COPY --chown=node:node --from=prod-deps /opt/dependencies/back/node_modules /var/www/app/node_modules

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
COPY --chown=node:node --from=dev-back-deps /opt/dependencies/back/node_modules /var/www/app/node_modules

########################################
# Stage 4.4: CLI command image driven by an external runner (e.g. GitLab CI)
########################################
FROM prod-generic AS command-cli-generic

# Empty entrypoint so an external runner (e.g. GitLab CI Docker executor) keeps
# full control of the container: it attaches and feeds its own script through
# the shell stdin. The inherited pm2-runtime entrypoint would otherwise take
# over the container and prevent the runner from executing its operations.
# Empty value is the recommended override for Docker 17.06+.
# @see https://docs.gitlab.com/ci/docker/using_docker_images/#override-the-entrypoint-of-an-image
ENTRYPOINT []

########################################
# Stage 4.5: Command pre-deploy app image
########################################
FROM command-runner-generic AS command-pre-deploy

ARG TARGET_APP
ARG NODE_ENV=production

# Copy the target app's deploy scripts
COPY --chown=node:node ./back/instances/${TARGET_APP}/deploy/${NODE_ENV} /var/www/app/deploy/${NODE_ENV}

# Copy files required for TypeORM migrations
COPY --chown=node:node ./back/tsconfig.json /var/www/app/tsconfig.json
COPY --chown=node:node ./back/typeorm.migrations.config.ts /var/www/app/typeorm.migrations.config.ts
COPY --chown=node:node ./back/migrations /var/www/app/migrations

# Use node directly instead of pm2-runtime for one-shot commands
# This ensures proper exit code propagation (pm2-runtime causes exit code 2)
# Logs are redirected to match PM2 behavior, COMMAND_ARGS is used for the command name
ENTRYPOINT ["/bin/sh", "-c", "node main.js $COMMAND_ARGS > /data/log/app/out.log 2> /data/log/app/error.log"]
