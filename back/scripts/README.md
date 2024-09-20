# Purpose

To certify both the encoded message and transaction signature between
`IdP` <> `core-fc` <> `SP`, we need to provide secure key generation and use, whether for encryption or signature purposes.

# Generate encoder.pem file

Refer to: <https://hexdocs.pm/jose/key-generation.html#content>

## For `ECDH-ES`

Execute this command to generate an elliptic curve key:

```bash
openssl ecparam -name secp256r1 -genkey -noout -out ./pem/ec-secp256r1.pem
```

## For `RSA-OAEP-256`

To generate an RSA key suitable for RSA-OAEP-256, execute:

```bash
openssl genpkey -algorithm RSA -out ./pem/rsa-oaep-256.pem -pkeyopt rsa_keygen_bits:2048
```

This will generate a 2048-bit RSA key for use in encryption operations using the RSA-OAEP-256 algorithm.

# Generate JWK from encoder.pem file

We can generate the JSON Web Key (JWK) format from the PEM file using the local script [`pemToJwk.js`](https://github.com/france-connect/sources/blob/main/back/scripts/pemToJwk.js).

## For `ECDH-ES`

To generate a JWK for the ECDH-ES algorithm, execute:

```bash
node pemToJwk.js ./pem/ec-secp256r1.pem my-EC-key ECDH-ES enc 1
```

## For `RSA-OAEP-256`

To generate a JWK for RSA-OAEP-256, execute:

```bash
node pemToJwk.js ./pem/rsa-oaep-256.pem my-RSA-key RSA-OAEP-256 enc 1
```

This will convert the RSA PEM file into JWK format, suitable for encryption using the RSA-OAEP-256 algorithm.

# JWKS Configuration

Once the JWK is generated, the JSON format should be copied into the OidcClient configuration to ensure proper key usage between the `IdP`, `core-fc`, and `SP` systems.

### Useful Links

- [node-jose Documentation](https://github.com/cisco/node-jose)
- [OpenSSL Key Generation](https://www.openssl.org/docs/man1.1.1/man1/openssl-genpkey.html)
