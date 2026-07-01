ARG DEBIAN_VERSION="default"
ARG DOCKER_VERSION="default"
ARG DOCKER_HUB_PROXY=""
ARG NODE_VERSION="default"
ARG REGISTRY_URL="default"
ARG NODE_MODULE_BACK_VERSION="default"
ARG NODE_MODULE_FRONT_VERSION="default"
ARG NODE_MODULE_QUALITY_VERSION="default"

########################################
# Stage 1.1: Build the slim CI/CD image (minimal tools to run docker commands)
########################################

FROM ${DOCKER_HUB_PROXY}docker:${DOCKER_VERSION}-cli AS ci-cd-slim

# These ARGs are available as env vars during RUN
RUN apk add --no-cache bash jq

CMD ["bash"]

########################################
# Stage 1.2: Build the full CI/CD image (include nodejs and other tools)
########################################

FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION} AS ci-cd-full

ARG INTERNET_PROXY
ARG DOCKER_VERSION

RUN set -eux; \
  \
  # Configure temporary APT proxy
  echo "Acquire::http::Proxy \"${INTERNET_PROXY}\";" > /etc/apt/apt.conf.d/proxy.conf; \
  export http_proxy="${INTERNET_PROXY}" https_proxy="${INTERNET_PROXY}"; \
  \
  # Enforce HTTPS for Debian APT sources (PRA requirement)
  if [ -f /etc/apt/sources.list.d/debian.sources ]; then \
    sed -i 's|http://|https://|g' /etc/apt/sources.list.d/debian.sources; \
  fi; \
  \
  # Add Docker official APT repository (Debian-based)
  install -m 0755 -d /etc/apt/keyrings; \
  curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc; \
  chmod a+r /etc/apt/keyrings/docker.asc; \
  printf 'Types: deb\nURIs: https://download.docker.com/linux/debian\nSuites: %s\nComponents: stable\nSigned-By: /etc/apt/keyrings/docker.asc\n' \
    "$( . /etc/os-release && echo "$VERSION_CODENAME" )" \
    > /etc/apt/sources.list.d/docker.sources; \
  \
  # Update APT index
  apt-get update; \
  \
  # Resolve Docker CLI APT version from DOCKER_VERSION (e.g. 28 or 28.0.1)
  if [ -n "${DOCKER_VERSION:-}" ]; then \
    DOCKER_APT_VERSION="$(apt-cache madison docker-ce-cli | awk -v v="${DOCKER_VERSION}" '$3 ~ (":" v) { print $3; exit }')"; \
    if [ -z "${DOCKER_APT_VERSION}" ]; then \
      echo "ERROR: No docker-ce-cli version matching ${DOCKER_VERSION} found in Docker APT repo" >&2; \
      exit 1; \
    fi; \
    DOCKER_CLI_PKG="docker-ce-cli=${DOCKER_APT_VERSION}"; \
  else \
    exit 1; \
  fi; \
  \
  # Install required tools
  apt-get install -y --no-install-recommends \
    jq \
    ${DOCKER_CLI_PKG} \
    docker-buildx-plugin \
    docker-compose-plugin; \
  \
  # Cleanup APT caches and temporary proxy configuration
  apt-get clean; \
  rm -rf /var/lib/apt/lists/*; \
  rm -f /etc/apt/apt.conf.d/proxy.conf; \
  unset http_proxy https_proxy

CMD ["bash"]

########################################
# Stage 2: Build the dev-generic image (for running tests)
########################################

FROM ${REGISTRY_URL}/nodejs-apps/dev-back-deps:${NODE_MODULE_BACK_VERSION} AS dev-back-deps
FROM ${REGISTRY_URL}/nodejs-apps/dev-front-deps:${NODE_MODULE_FRONT_VERSION} AS dev-front-deps
FROM ${REGISTRY_URL}/nodejs-apps/dev-quality-deps:${NODE_MODULE_QUALITY_VERSION} AS dev-quality-deps

FROM ci-cd-full AS dev-generic

RUN mkdir -p /opt/dependencies/back /opt/dependencies/front /opt/dependencies/quality && \
    chown -R node:node /opt/dependencies

# Drop permissions to non-root user
USER node

ENV NODE_ENV=development

# Copy dependencies from external registry images
COPY --from=dev-back-deps --chown=node:node /opt/dependencies/back/node_modules /opt/dependencies/back/node_modules
COPY --from=dev-front-deps --chown=node:node /opt/dependencies/front/node_modules /opt/dependencies/front/node_modules
COPY --from=dev-quality-deps --chown=node:node /opt/dependencies/quality/node_modules /opt/dependencies/quality/node_modules

CMD ["bash"]
