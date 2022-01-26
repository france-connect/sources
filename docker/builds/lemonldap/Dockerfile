FROM coudot/lemonldap-ng:2.0.13

COPY ./builds/lemonldap/entrypoint.sh /entrypoint.sh

ENTRYPOINT ["dumb-init", "--", "/bin/sh", "/entrypoint.sh"]