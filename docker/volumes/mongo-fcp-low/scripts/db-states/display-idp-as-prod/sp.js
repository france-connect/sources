// == FS
const fsp = {
  'FSP1-LOW': {
    name: "fsp1-low",
    title: "FSP1 - LOW",
    eidas: 2,
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
    claims: ['amr'],
    id_token_signed_response_alg: "HS256",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "HS256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    jwks_uri:
      "https://fsp1-low.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    trustedIdentity: false,
    ssoDisabled: false,
  },
  // FSP2-LOW - amr not authorized
  'FSP2-LOW': {
    name: "fsp2-low",
    title: "FSP2 - LOW",
    eidas: 2,
    site: "https://fsp2-low.docker.dev-franceconnect.fr/login",
    redirect_uris: [
      "https://fsp2-low.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp2-low.docker.dev-franceconnect.fr/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "7a79e45107f9ccc6a3a5971d501220dc4fd9e87bb5e3fc62ce4104c756e22775",
    entityId:
      "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
    credentialsFlow: false,
    featureHandlers: { none: "" },
    email: "fsp2@franceconnect.loc",
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
    claims: [],
    id_token_signed_response_alg: "HS256",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "HS256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    jwks_uri:
      "https://fsp1-low.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    trustedIdentity: false,
    ssoDisabled: false,
  },
};

/* ------------------------------------------------------------------------------- */
Object.values(fsp).forEach((fs) => {
  print(`${fs.name} > Initializing provider: ${fs.name}`);
  db.client.update({ name: fs.name }, fs, { upsert: true });
});
