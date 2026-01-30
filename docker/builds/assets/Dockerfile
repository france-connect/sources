ARG APP_NAME=core-fcp-low

FROM registry.gitlab.dev-franceconnect.fr/france-connect/fc/nodejs-apps/${APP_NAME}:staging AS app

FROM nginx AS assets

COPY --from=app /var/www/app/public /var/www/
COPY ./assets.conf.template /etc/nginx/conf.d/default.conf

ARG CACHE_BUSTING
ARG APP_DOMAIN

RUN sed -i s/{CACHE_BUSTING}/$CACHE_BUSTING/ /etc/nginx/conf.d/default.conf && \
    sed -i s/{APP_DOMAIN}/$APP_DOMAIN/ /etc/nginx/conf.d/default.conf
