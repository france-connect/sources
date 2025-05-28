FROM cypress/browsers:22.13.0

ARG PROXY_EXPLOITATION
ARG CURRENT_UID

ENV CYPRESS_CACHE_FOLDER=/root/.cache/Cypress

USER ${CURRENT_UID}

COPY . /var/www/quality
WORKDIR /var/www/quality

RUN if [ -n "$PROXY_EXPLOITATION" ]; then \
  yarn config set proxy "$PROXY_EXPLOITATION" && yarn config set https-proxy "$PROXY_EXPLOITATION"; \
  fi

RUN yarn install --frozen-lockfile

RUN yarn cypress install

RUN chmod -R 777 /root/.cache/Cypress
