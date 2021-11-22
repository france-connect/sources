# Docker Stack PKI

Procédure pour générer un certificat signé avec l'autorité de certification local de développement (Docker Stack CA).

> L'exemple ci-dessous a été utilisé pour générer le certificat `mongo.pem`

## Créer un fichier de config openssl

à déposer dans le dossier `./requests/mongo-req.conf`
```ini
[req]
distinguished_name = req_distinguished_name
x509_extensions = req_ext
prompt = no

[req_distinguished_name]
C = FR
ST = IDF
L = Paris
O = FranceConnect
OU = docker-stack
CN = mongo

[req_ext]
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
authorityKeyIdentifier = keyid,issuer
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
basicConstraints = CA:FALSE

[alt_names]
DNS.1 = mongo
DNS.2 = mongo-fcp-high
DNS.3 = mongo-fca-low
DNS.4 = mongo-fcp-low
DNS.5 = localhost
IP.1  = 127.0.0.1

```

> Les champs importants à modifier sont `CN` et `alt_names`.

## Générer la CSR (Certificate Signing Request)

```shell
> openssl genpkey -algorithm RSA -out mongo.key
> openssl req -new -key mongo.key -out requests/mongo.csr -config requests/mongo-req.conf
```

## Signer la CSR

```shell
> openssl x509 -req \ 
    -in requests/mongo.csr \
    -CA docker-stack-ca.crt \
    -CAkey docker-stack-ca.key \
    -CAcreateserial \
    -out mongo.crt \
    -days 365 \
    -extfile requests/mongo-req.conf \
    -extensions req_ext
```

> Concernant l'option `-days 365`, certains OS invalident les certificats de plus d'un an.

## Utilisation des certificats

### Fusionner le certificat et la clé privée

Il est parfois nécessaire d'avoir la clé privée et le certificat dans un même fichier.

Par convention nous les mettrons dans un fichier `pem`.

Par exemple avec mongoDB:
```shell
> cat mongo.crt mongo.key > mongo.pem
```
Le certificat est utilisé dans `docker/builds/mongodb/Dockerfile`.

### Certificat CA et NodeJS

Afin que les requêtes https vers nos mocks soient validées, il faut déclarer la variable `NODE_EXTRA_CA_CERTS`: 
```
NODE_EXTRA_CA_CERTS=/etc/ssl/docker_host/docker-stack-ca.crt
```

### Ajouter le certificat CA dans votre navigateur

Vous pouvez ajouter le certificat CA `docker-stack-ca.crt` dans votre navigateur. Ce dernier pourra ainsi valider les certificats.

- Firefox: https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox
- Chrome: https://support.globalsign.com/digital-certificates/digital-certificate-installation/install-client-digital-certificate-windows-using-chrome

### Ajouter le certificat CA sur votre système

#### Ubuntu / Debian

```shell
> sudo cp docker-stack-ca.crt /usr/local/share/ca-certificates/
> sudo update-ca-certificates
```

#### Archlinux / Fedora

```shell
> sudo trust anchor --store docker-stack-ca.crt
```

## Le cas de `app.crt`

Le certificat `app.crt` est un certificat "générique" utilisé abusivement afin de simplifier la configuration de la docker stack.

Ce certificat est à la fois `client` et `serveur` avec un wildcard `*.docker.dev-franceconnect.fr`
> voir la conf `./requests/app.req.conf`
