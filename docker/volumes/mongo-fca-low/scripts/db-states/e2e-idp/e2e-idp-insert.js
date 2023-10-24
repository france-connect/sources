db.provider.update(
  { uid: "ebe0026f-d6e3-4807-bfa2-c65c8ae46d07" },
  {
    _id: ObjectId("5eedbcb60c59aa5a1f1a56e3"),
    uid: "ebe0026f-d6e3-4807-bfa2-c65c8ae46d07",
    name: "idp-test-update",
    active: false,
    display: true,
    isBeta: false,
    title: "Idp test Inserted",
    image: "fi-mock-eleve.svg",
    imageFocus: "fi-mock-eleve.svg",
    alt: "idp test",
    eidas: 3,
    mailto: "",
    featureHandlers: { coreVerify: "core-fca-default-verify" },
    specificText: "specific text FI 3",
    url: "https://fia2-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia2-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia2-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "idptest",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia2-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "HS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "RSA-OAEP",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "HS256",
    userinfo_encrypted_response_alg: "RSA-OAEP",
    userinfo_encrypted_response_enc: "A256GCM",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip2-high",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
  { upsert: true },
);

db.ministries.update(
  { id: "mock-ministere-de-la-transition-ecologique-all-fis-sort-2" },
  {
    $push: {
      identityProviders: "ebe0026f-d6e3-4807-bfa2-c65c8ae46d07",
    },
  },
);
