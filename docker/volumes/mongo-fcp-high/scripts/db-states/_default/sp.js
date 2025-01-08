// == FS
const fsp = {
  // -- FSP - FSP1-HIGH - Activated
  "FSP1-HIGH": {
    name: "FSP - FSP1-HIGH",
    title: "FSP - FSP1-high title",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp1-high.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp1-high.docker.dev-franceconnect.fr/client/logout-callback",
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
      "rnipp_given_name",
      "rnipp_family_name",
      "rnipp_gender",
      "rnipp_birthcountry",
      "rnipp_birthplace",
      "rnipp_birthdate",
      "rnipp_profile",
      "rnipp_birth",
      "rnipp_identite_pivot",
      "dgfip_rfr",
      "dgfip_aft",
      "dgfip_nbpac",
      "droits_assurance_maladie",
      "cnam_caisse",
    ],
    claims: ["amr"],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp1-high.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    eidas: 2,
    identityConsent: false,
    trustedIdentity: false,
    ssoDisabled: false,
  },

  // -- FSP - FSP2v2 - Activated - no post-logout-redirect-uri
  // using blacklist including fip8-high
  "FSP2-HIGH": {
    name: "FSP - FSP2v2",
    title: "FSP - FSP2v2 Title",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp2-high.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "7a79e45107f9ccc6a3a5971d501220dc4fd9e87bb5e3fc62ce4104c756e22775",
    entityId:
      "a0cd64372db6ecf39c317c0c74ce90f02d8ad7d510ce054883b759d666a996bc",
    credentialsFlow: false,
    email: "fsp2@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    featureHandlers: { none: "" },
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
      "preferred_username",
      "profile",
      "birth",
      "identite_pivot",
    ],
    claims: ["amr"],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp2-high.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: ["0cbdf732-aaea-4566-a99e-4430f388ff18"],
    eidas: 2,
    identityConsent: false,
    trustedIdentity: false,
    ssoDisabled: false,
  },

  // -- FSP - FSP3v2 - Deactivated
  "FSP3-HIGH": {
    name: "Service Provider Example 3 deactivated",
    title: "Service Provider Example 3 deactivated Title",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp3-high.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp3-high.docker.dev-franceconnect.fr/client/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "my-service-provider-deactivated",
    entityId: "eae74592cc68b8451d2621035b30dbf1",
    credentialsFlow: false,
    email: "fsp3@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: false,
    featureHandlers: { none: "" },
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
    claims: ["amr"],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp3-high.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    ssoDisabled: false,
  },

  // -- FSP - FSP4v2 - Only openid and birthdate scopes authorized
  "FSP4-HIGH": {
    name: "SP 4 - deactivated - Only openid and birthdate scopes authorized",
    title: "SP 4 - deactivated Title",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp1-high.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp1-high.docker.dev-franceconnect.fr/client/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "my-service-provider-only-openid-birthdate-scopes",
    entityId:
      "0ce6e606d53b94ccbb39d37d7acb26e63e6ec5b13d96f4ab8c7196c490f14520",
    credentialsFlow: false,
    email: "fsp4@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    type: "public",
    __v: 4,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    scopes: ["openid", "birthdate"],
    claims: ["amr"],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp1-high.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    ssoDisabled: false,
  },

  // -- FSP - FSP5-HIGH - private FSP and identity consent required
  // using whitelist not including fip8-high
  "FSP5-HIGH": {
    name: "FSP - FSP5-HIGH",
    title: "FSP - FSP5-HIGH title",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp5-high.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp5-high.docker.dev-franceconnect.fr/client/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39555",
    entityId:
      "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39555",
    credentialsFlow: false,
    featureHandlers: { none: "" },
    email: "fsp5@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    type: "private",
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
    claims: ["amr"],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp5-high.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: false,
    idpFilterList: [
      "8aa849db-8402-4f2e-bad9-7471dd21ff94",
      "dedc7160-8811-4d0f-9dd7-c072c15f2f18",
      "f9a3f6fe-f9b3-4cec-b787-33713fdffc79",
      "621c3c17-5f49-4ca5-b8ef-a4b1cecaf7c2",
      "ce0f6c4d-d70e-411e-a8a0-2a66afa7bd90",
      "3ae390ce-c9b8-4090-926f-3db90f85fe6a",
      "2031310b-186e-4643-944a-00efb9d59e0f",
      "ed928691-4697-44b4-9e56-df1853876610",
      "b4ae876d-773c-4b4a-bd45-33e0938af4a7",
      "a97369fb-f7b0-478a-bcc1-6fa49c8782d9",
      "a437f8aa-10b5-48bd-8931-78f2d055e3df",
      "7f90ea0f-b965-4f10-bbf8-d6ad19a17451",
      "8456c460-f89b-4744-93cf-e0b6ac694075",
      "81e3c37a-e7ea-43be-aa7a-0ed28a1a6e47",
      "4c3e8c0d-12e3-46c2-bef8-5cb7b0702c9d",
      "f403044b-fcd3-46f2-a87b-30e65f8e7bfe",
      "913ef56e-0997-4e25-bc55-19a20d6e0532",
      "c341093a-f4b4-4151-85ff-5fbdcd6baa58",
      "3c8776ae-5278-425b-8e97-7f01eadd22a0",
      "7d35f733-a3d0-49c1-9a6f-b9f4800b0b7a",
      "da5bbb8d-3a93-4434-b1bf-448c69fa7fc9",
    ],
    identityConsent: true,
    eidas: 2,
    trustedIdentity: false,
    ssoDisabled: false,
  },

  // -- FSP - FSP6v2 - private FSP and identity consent not required
  "FSP6-HIGH": {
    name: "FSP - FSP6v2",
    title: "FSP - FSP6v2 title",
    site: "https://site.com",
    redirect_uris: [
      "https://fsp6-high.docker.dev-franceconnect.fr/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://fsp6-high.docker.dev-franceconnect.fr/client/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39666",
    entityId:
      "6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39666",
    credentialsFlow: false,
    featureHandlers: { none: "" },
    email: "fsp6@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    type: "private",
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
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://fsp6-high.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    eidas: 2,
    trustedIdentity: false,
    ssoDisabled: false,
  },

  // Eidas-bridge
  EIDASBRIDGE: {
    name: "Eidas bridge FS",
    title: "Eidas bridge FS Title",
    site: "https://eidas-bridge.docker.dev-franceconnect.fr",
    redirect_uris: [
      "https://eidas-bridge.docker.dev-franceconnect.fr/oidc-client/redirect-to-eidas-response-proxy",
    ],
    post_logout_redirect_uris: [
      "https://eidas-bridge.docker.dev-franceconnect.fr/client/logout-callback",
    ],
    client_secret:
      "+sqGL4XE6aqzIMOp/DKC1jWB8I+8qE1jW6iz2tUv8lt+ZZzxjyoCBQeuAcJTFZxfLywkn6cAICK5JPLxYM0+8pk/q7CGHUfr/gzr3ZYRroWWE+egEEDxqRYDYe0=",
    key: "6927fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950",
    entityId: "ec8d3e2cb5ba0a7bb37b548dbaab36fc",
    credentialsFlow: false,
    email: "eidas@franceconnect.loc",
    IPServerAddressesAndRanges: ["1.1.1.1"],
    active: true,
    featureHandlers: { none: "" },
    type: "public",
    __v: 4,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    scopes: [
      "openid",
      "gender",
      "birthdate",
      "birthcountry",
      "birthplace",
      "given_name",
      "family_name",
      "email",
      "preferred_username",
      "address",
    ],
    claims: ["amr"],
    id_token_signed_response_alg: "ES256",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    jwks_uri:
      "https://eidas-bridge.docker.dev-franceconnect.fr/client/.well-known/keys",
    idpFilterExclude: true,
    idpFilterList: [
      "2031310b-186e-4643-944a-00efb9d59e0f",
      "0cbdf732-aaea-4566-a99e-4430f388ff18",
      "8aa849db-8402-4f2e-bad9-7471dd21ff94",
    ],
    identityConsent: false,
    ssoDisabled: false,
  },
};

// -- FSs ----------
Object.values(fsp).forEach((fs) => {
  print(`${fs.name} > Initializing provider: ${fs.name}`);
  db.client.updateOne({ name: fs.name }, { $set: fs }, { upsert: true });
});
