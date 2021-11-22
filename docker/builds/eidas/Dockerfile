ARG FC_DOCKER_REGISTRY

FROM ${FC_DOCKER_REGISTRY}/eidas-mock:2.4

COPY ./volumes/ssl/docker-stack-ca.crt /usr/local/share/ca-certificates/
RUN update-ca-certificates
