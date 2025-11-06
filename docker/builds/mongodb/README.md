# MongoDB

## Mongo daemon server options
> Mandatory option for our current implementation

Following up our upgrade strategy you will find our [ MongoDB: Release planning ](https://gitlab.dev-franceconnect.fr/ops/documentation-infra/-/wikis/MongoDB:-Release-planning) page for keeping track of the current version (and status) of the deployment accross our stacks end environments

| Option Name | Attribute <br /> (mongod) | Parameter  | Description |
| ----------- | ------------------------- | ---------- | ----------- |
| Key secret File | --keyFile          | _path_     | _Key file that stores the shared secret that **MongoDB instances** use to authenticate to each other in our replica set_ |
| TLS Mode    | --tlsMode                 | requireTLS | _The server uses and accepts only TLS encrypted connections_ |
| TLS CA File | --tlsCAFile               | _path_     | _Mandatory when using x509 authentication (And mongodb >= 5.0.27)_ <br /> File read for authenticate Server and client (if the option --tlsClusterCAFile are not set) <br /> _Specifies the .pem file that contains the root certificate chain from the Certificate Authority_ |
| TLS Certificate key file | --tlsCertificateKeyFile | _path_ | Specifies the .pem file that contains both the TLS certificate and key |
| TLS Clients CA File | --tlsClusterCAFile | _path_ | _Specifies the .pem file that contains the root certificate chain from the Certificate Authority used to validate the certificate presented by a client establishing a connection_ <br /> If --tlsClusterCAFile does not specify the .pem file for validating the certificate from a client establishing a connection, the cluster uses the .pem file (certificate) specified in the --tlsCAFile option <br /> _Requires that --tlsCAFile is set_ <br /> Not mandatory in our case as it is implicit when using the _--ltsCAFile_ option but worth it to made that explicit for better readability |
| TLS Allow Connections Without Certificates | --tlsAllowConnectionsWithoutCertificates | NA | It allow us to activate gradually the client authentication mith mutual TLS for our stack environements and preserve retrocompatibility for jobs/script and applications who are not ready to implement it, please refer to our upgrade plan to define when/if we can deactivate that option |

## Authentication

### Clients and server 
> x509 extended attribute

> TODO: Cipher suite approved ?


| Services | x509 Attribute | Parameter | Description |
| -------- | -------------- | --------- | ----------- |
| Mongo daemon | extendedKeyUsage | serverAuth, clientAuth | When mutual TLS mode are used the mongo certificate will be used to authenticate against client. It is necessary to add the (x509) clientAuth extended key usage option when generating the certificate |
| Applications <br /> (generic) | extendedKeyUsage | clientAuth | Apllied to various application/job who need to be authenticated to mongodb | 

### Sample implementation on dev stack
> Autosigned certificate with custom scripts
> Please refer to the [ Docker Stack PKI ](https://gitlab.dev-franceconnect.fr/france-connect/fc/-/tree/staging/docker/volumes/ssl?ref_type=heads) guideline for more informations
```console
# Generate new key
openssl genpkey -algorithm RSA -out mongo.key
# csr
openssl req -new -key mongo.key -out requests/mongo.csr -config requests/mongo-req.conf
# Autosigned certificate
openssl x509 -req -in requests/mongo.csr -CA docker-stack-ca.crt -CAkey docker-stack-ca.key -CAcreateserial -out mongo.crt -days 3650 -extfile requests/mongo-req.conf -extensions req_ext
# bundle the required pem file
cat mongo.crt mongo.key > mongo.pem
```

## Acceptance testing
> Quick sample of acceptance testing on dev stack from the Ops perspective

### Without TLS Client

_<u>Use docker stack CLI: Test connexion **without TLS Client** and **with TLS server**</u>:_
> Use of the dev tools docker-stack, we have backward compatibility of the docker-stack mongo shell cli thanks to the mongo daemon option _--tlsAllowConnectionsWithoutCertificates_ until we decide otherwise or switch that option depends environments.
```console
➜  ssl git:(staging) ✗ dks mongo mongo-fcp-high core-fcp-high

connecting to mongo mongo-fcp-high database in shell using mongosh cli from inside the mongodb container using docker-compose exec
without TLS client authentication activated
setting docker-compose tmpdir to /var/tmp-docker-compose
Current Mongosh Log ID:	66ed427ad5d58e82a6964032
Connecting to:		mongodb://<credentials>@127.0.0.1:27017/core-fcp-high?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&tls=true&appName=mongosh+2.3.1
Using MongoDB:		7.0.22
Using Mongosh:		2.3.1

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2024-09-19T14:06:55.374+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2024-09-19T14:06:55.786+00:00: vm.max_map_count is too low
------

Warning: Found ~/.mongorc.js, but not ~/.mongoshrc.js. ~/.mongorc.js will not be loaded.
  You may want to copy or rename ~/.mongorc.js to ~/.mongoshrc.js.
rs0 [direct: primary] core-fcp-high> 
```

### With TLS Client

#### Connect to the mongo daemon

_<u>Use docker stack CLI: Test connexion **with TLS Client** and **with TLS server**</u>:_

> Use of the dev tools docker-stack, and authenticate the client using the application certificate (app.pem) with mutualTLS
> Use of the local mongosh cli for testing purpose using socket connection from outside the container

```console
# dks mongo mongo-fcp-high core-fcp-high tls

	connecting to mongo mongo-fcp-high database in shell using mongosh cli using your local mongosh cli
	with TLS client authentication activated (Using the application app.pem certificate)
	pwd: /home/pbarrillion/repos/fc_new/fc/docker
	MONGO CA: /home/pbarrillion/repos/fc_new/fc/docker/volumes/ssl/docker-stack-ca.crt
	MONGO TLS APP KEY: /home/pbarrillion/repos/fc_new/fc/docker/volumes/ssl/app.pem
	Current Mongosh Log ID:	66ed4373e89377c2565e739b
	Connecting to:		mongodb://<credentials>@127.0.0.1:27018/core-fcp-high?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&tls=true&tlsCertificateKeyFile=%2Fhome%2Fpbarrillion%2Frepos%2Ffc_new%2Ffc%2Fdocker%2Fvolumes%2Fssl%2Fapp.pem&tlsCAFile=%2Fhome%2Fpbarrillion%2Frepos%2Ffc_new%2Ffc%2Fdocker%2Fvolumes%2Fssl%2Fdocker-stack-ca.crt&appName=mongosh+2.3.0
	Using MongoDB:		7.0.22
	Using Mongosh:		2.3.0
	mongosh 2.3.1 is available for download: https://www.mongodb.com/try/download/shell
	
	For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/
	
	------
	   The server generated these startup warnings when booting
	   2024-09-19T14:06:55.374+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
	   2024-09-19T14:06:55.786+00:00: vm.max_map_count is too low
	------
	
	rs0 [direct: primary] core-fcp-high>
```

#### Check logs of the mongo daemon

> Validate if the server is properly launched
```console
# docker logs -f 063f2e8b4d5c (mongo-fcp-high)
# Check the mongodb is up and running
{"t":{"$date":"2024-09-19T14:06:55.337+00:00"},"s":"I",  "c":"CONTROL",  "id":23285,   "ctx":"-","msg":"Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'"}
{"t":{"$date":"2024-09-19T14:06:55.338+00:00"},"s":"I",  "c":"NETWORK",  "id":4648601, "ctx":"main","msg":"Implicit TCP FastOpen unavailable. If TCP FastOpen is required, set tcpFastOpenServer, tcpFastOpenClient, and tcpFastOpenQueueSize."}
{"t":{"$date":"2024-09-19T14:06:55.365+00:00"},"s":"I",  "c":"REPL",     "id":5123008, "ctx":"main","msg":"Successfully registered PrimaryOnlyService","attr":{"service":"TenantMigrationDonorService","namespace":"config.tenantMigrationDonors"}}
{"t":{"$date":"2024-09-19T14:06:55.365+00:00"},"s":"I",  "c":"REPL",     "id":5123008, "ctx":"main","msg":"Successfully registered PrimaryOnlyService","attr":{"service":"TenantMigrationRecipientService","namespace":"config.tenantMigrationRecipients"}}
{"t":{"$date":"2024-09-19T14:06:55.365+00:00"},"s":"I",  "c":"REPL",     "id":5123008, "ctx":"main","msg":"Successfully registered PrimaryOnlyService","attr":{"service":"ShardSplitDonorService","namespace":"config.tenantSplitDonors"}}
{"t":{"$date":"2024-09-19T14:06:55.366+00:00"},"s":"I",  "c":"CONTROL",  "id":5945603, "ctx":"main","msg":"Multi threading initialized"}
{"t":{"$date":"2024-09-19T14:06:55.366+00:00"},"s":"I",  "c":"CONTROL",  "id":4615611, "ctx":"initandlisten","msg":"MongoDB starting","attr":{"pid":1,"port":27017,"dbPath":"/data/db","architecture":"64-bit","host":"mongo-fcp-high"}}
{"t":{"$date":"2024-09-19T14:06:55.366+00:00"},"s":"I",  "c":"CONTROL",  "id":23403,   "ctx":"initandlisten","msg":"Build Info","attr":{"buildInfo":{"version":"7.0.22","gitVersion":"1b0ca02043c6d35d5cfdc91e21fc00a05d901539","openSSLVersion":"OpenSSL 3.0.2 15 Mar 2022","modules":[],"allocator":"tcmalloc","environment":{"distmod":"ubuntu2204","distarch":"x86_64","target_arch":"x86_64"}}}}
{"t":{"$date":"2024-09-19T14:06:55.366+00:00"},"s":"I",  "c":"CONTROL",  "id":51765,   "ctx":"initandlisten","msg":"Operating System","attr":{"os":{"name":"Ubuntu","version":"22.04"}}}
{"t":{"$date":"2024-09-19T14:06:55.366+00:00"},"s":"I",  "c":"CONTROL",  "id":21951,   "ctx":"initandlisten","msg":"Options set by command line","attr":{"options":{"net":{"bindIp":"*","tls":{"CAFile":"/usr/local/share/ca-certificates/docker-stack-ca.crt","allowConnectionsWithoutCertificates":true,"certificateKeyFile":"/mongo.pem","mode":"requireTLS"}},"replication":{"enableMajorityReadConcern":true,"replSet":"rs0"},"security":{"authorization":"enabled","keyFile":"/mongo-key-file"}}}}
...
# When we connect to the server using the cli (dks mongo mongo-fcp-high core-fcp-high tls) The connection are negociated using TLS client authentication
{"t":{"$date":"2024-09-18T07:51:32.908+00:00"},"s":"W",  "c":"NETWORK",  "id":23236,   "ctx":"conn22920","msg":"Client connecting with server's own TLS certificate"}
{"t":{"$date":"2024-09-18T07:51:32.908+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn22920","msg":"client metadata","attr":{"remote":"172.16.4.2:58032","client":"conn22920","negotiatedCompressors":[],"doc":{"application":{"name":"mongosh 2.1.5"},"driver":{"name":"nodejs|mongosh","version":"6.3.0|2.1.5"},"platform":"Node.js v20.11.1, LE","os":{"name":"linux","architecture":"x64","version":"6.8.0-40-generic","type":"Linux"}}}}
{"t":{"$date":"2024-09-18T07:51:32.909+00:00"},"s":"I",  "c":"ACCESS",   "id":20250,   "ctx":"conn22919","msg":"Authentication succeeded","attr":{"mechanism":"SCRAM-SHA-256","speculative":true,"principalName":"rootAdmin","authenticationDatabase":"admin","remote":"172.16.4.2:58028","extraInfo":{}}}
{"t":{"$date":"2024-09-18T07:51:32.909+00:00"},"s":"I",  "c":"ACCESS",   "id":20250,   "ctx":"conn22920","msg":"Authentication succeeded","attr":{"mechanism":"SCRAM-SHA-256","speculative":true,"principalName":"rootAdmin","authenticationDatabase":"admin","remote":"172.16.4.2:58032","extraInfo":{}}}
...
```
