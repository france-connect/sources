ARG MONGO_VERSION=4.4
FROM mongo:${MONGO_VERSION}

# key file that stores the shared secret that MongoDB instances use to authenticate to each other in a sharded cluster or replica set.
RUN openssl rand -base64 756 > /mongo-key-file
COPY ./volumes/ssl/mongo.pem /mongo.pem

# Certificate copied to the directory used by the system for managing the local trusted AC but before configuring mongoDB to use it and potentially used by the system to authenticate against other resources.
# MongoDB use it to perform authentication with trusted AC (ie: Mandatory for mongoDB >= 5.0.27, mongoDB are not configured to use the AC trusted by the system)
COPY ./volumes/ssl/docker-stack-ca.crt /usr/local/share/ca-certificates/

RUN chmod 400 /mongo-key-file /mongo.pem && \
    chown mongodb:mongodb /mongo-key-file /mongo.pem && \
    update-ca-certificates

COPY ./builds/mongodb/healthcheck.sh /
HEALTHCHECK --interval=2s --timeout=2s --start-period=5s --retries=3 CMD [ "bash", "/healthcheck.sh" ]

CMD [ "--replSet", "rs0", "--keyFile", "/mongo-key-file", "--enableMajorityReadConcern", \
    "--tlsMode", "requireTLS", "--tlsCertificateKeyFile", "/mongo.pem", "--tlsCAFile", "/usr/local/share/ca-certificates/docker-stack-ca.crt", \
    "--tlsAllowConnectionsWithoutCertificates" ]
