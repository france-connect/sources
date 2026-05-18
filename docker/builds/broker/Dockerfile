ARG DOCKER_HUB_PROXY
FROM ${DOCKER_HUB_PROXY}rabbitmq:4.2.1-management

ADD ./builds/broker/definitions.json /etc/rabbitmq/
ADD ./builds/broker/rabbitmq.config /etc/rabbitmq/
