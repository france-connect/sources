ARG FC_DOCKER_REGISTRY=registry.gitlab.dev-franceconnect.fr/france-connect/fc
ARG NODE_VERSION=v22.13.0

FROM ${FC_DOCKER_REGISTRY}/nodejs:${NODE_VERSION}-dev

# Copy project files (including node_modules)
COPY ./back /tmp/build
WORKDIR /tmp/build

COPY ./docker/builds/post-deploy/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
