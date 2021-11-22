FROM mongo:4.2

RUN openssl rand -base64 756 > /mongo-key-file
COPY ./volumes/ssl/docker-stack-ca.crt /usr/local/share/ca-certificates/
COPY ./volumes/ssl/mongo.pem /mongo.pem

RUN chmod 400 /mongo-key-file /mongo.pem && \
    chown mongodb:mongodb /mongo-key-file /mongo.pem && \
    update-ca-certificates

COPY ./builds/mongodb/healthcheck.sh /
HEALTHCHECK --interval=2s --timeout=2s --start-period=5s --retries=3 CMD [ "bash", "/healthcheck.sh" ]

CMD [ "--replSet", "rs0", "--keyFile", "/mongo-key-file", "--enableMajorityReadConcern", \
    "--tlsMode", "requireTLS", "--tlsCertificateKeyFile", "/mongo.pem" ]
