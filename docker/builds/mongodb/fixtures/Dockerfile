ARG DOCKER_HUB_PROXY
FROM ${DOCKER_HUB_PROXY}mongo:7.0 AS mongodb-fixtures

WORKDIR /scripts
COPY --from=fixtures ./scripts/*.js /scripts/
