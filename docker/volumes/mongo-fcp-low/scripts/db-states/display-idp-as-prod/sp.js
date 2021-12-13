/**
 * Average SP with basic configuration
 */
print("Initializing fsp1-low");
db.client.replaceOne(
  {
    name: "fsp1-low",
  },
  {
    name: "fsp1-low",
    title: "FSP1 - LOW",
    eidas: "eidas2",
    site: "https://fsp1-low.docker.dev-franceconnect.fr/login",
    redirect_uris: [
      "https://fsp1-low.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp1-low.docker.dev-franceconnect.fr/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950",
    entityId:
      "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
    credentialsFlow: false,
    featureHandlers: { none: "" },
    email: "fsp1@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    type: "public",
    __v: 4,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    scopes: [
      "openid",
      "given_name",
      "family_name",
      "birthdate",
      "gender",
      "birthplace",
      "birthcountry",
      "email",
      "preferred_username",
      "address",
      "phone",
      "profile",
      "birth",
      "identite_pivot",
    ],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp1-low.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    trustedIdentity: false,
  },
  { upsert: true }
);

/* ------------------------------------------------------------------------------- */
