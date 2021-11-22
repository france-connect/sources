# Purpose

To certify both the encoded message and transaction signature between
`IdP` <> `core-fc` <> `SP` we need to provide a

# Generate encoder.pem file

<https://hexdocs.pm/jose/key-generation.html#content>

## For `ECDH-ES`

Execute this command
`openssl ecparam -name secp256r1 -genkey -noout -out ./pem/ec-secp256r1.pem`

# Generate JWK from encoder.pem file

We can generate the JSON format through the local script `./pemToJwk.js`

## For `ECDH-ES`

Execute this command
`node pemToJwk.js ./pem/ec-secp256r1.pem EC enc 1`

The JWKS JSON format should be copy in the OidcClient configuration.
