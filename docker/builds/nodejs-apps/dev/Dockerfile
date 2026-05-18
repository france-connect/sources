# syntax=docker/dockerfile:1.7

########################################
# ARG declarations
########################################
ARG NODE_VERSION
ARG DEBIAN_VERSION
ARG DOCKER_HUB_PROXY

########################################
# Stage 1: Build the dev-deps
########################################
FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION} AS dev-back-deps

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

USER node

WORKDIR /opt/dependencies/back
COPY ./back/package.json ./back/yarn.lock ./
RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn config set ignore-engines ${NODE_IGNORE_ENGINE} && \
  yarn install --immutable --frozen-lockfile --non-interactive --network-concurrency 1 && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy

FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION} AS dev-front-deps

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

USER node

WORKDIR /opt/dependencies/front
COPY ./front/package.json ./front/yarn.lock ./
RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn config set ignore-engines ${NODE_IGNORE_ENGINE} && \
  yarn install --immutable --frozen-lockfile --non-interactive --network-concurrency 1 && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy

FROM ${DOCKER_HUB_PROXY}node:${NODE_VERSION}-${DEBIAN_VERSION} AS dev-quality-deps

ARG INTERNET_PROXY
ARG NODE_IGNORE_ENGINE

USER node

WORKDIR /opt/dependencies/quality
COPY ./quality/package.json ./quality/yarn.lock ./
RUN \
  yarn config set proxy ${INTERNET_PROXY} && \
  yarn config set https-proxy ${INTERNET_PROXY} && \
  yarn config set ignore-engines ${NODE_IGNORE_ENGINE} && \
  yarn install --immutable --frozen-lockfile --non-interactive --network-concurrency 1 && \
  yarn cache clean --all && \
  yarn config delete proxy && \
  yarn config delete https-proxy
