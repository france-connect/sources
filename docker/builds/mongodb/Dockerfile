FROM mongo:7.0.22

COPY ./volumes/ssl/mongo.pem /mongo.pem

# Certificate copied to the directory used by the system for managing the local trusted AC but before configuring mongoDB to use it and potentially used by the system to authenticate against other resources.
# MongoDB use it to perform authentication with trusted AC (ie: Mandatory for mongoDB >= 5.0.27, mongoDB are not configured to use the AC trusted by the system)
COPY ./volumes/ssl/docker-stack-ca.crt /usr/local/share/ca-certificates/
# key file that stores the shared secret that MongoDB instances use to authenticate to each other in a sharded cluster or replica set.
COPY ./volumes/ssl/mongo-key-file /mongo-key-file

RUN chmod 400 /mongo-key-file /mongo.pem && \
    chown mongodb:mongodb /mongo-key-file /mongo.pem && \
    update-ca-certificates

CMD [ "--replSet", "rs0", "--keyFile", "/mongo-key-file", "--enableMajorityReadConcern", \
    "--tlsMode", "requireTLS", "--tlsCertificateKeyFile", "/mongo.pem", "--tlsCAFile", "/usr/local/share/ca-certificates/docker-stack-ca.crt", \
    "--tlsAllowConnectionsWithoutCertificates" ]
