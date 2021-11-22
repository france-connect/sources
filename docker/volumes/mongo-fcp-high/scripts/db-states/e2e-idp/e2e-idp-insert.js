db.provider.update(
  { uid: "idp-test-update" },
  {
    _id: ObjectId("5eedbcb60c59aa5a1f1a56e3"),
    uid: "idp-test-update",
    name: "idp-test-update",
    active: false,
    display: true,
    title: "Idp test Inserted",
    image: "fi-mock-eleve.svg",
    imageFocus: "fi-mock-eleve.svg",
    alt: "idp test",
    eidas: 3,
    featureHandlers: { coreVerify: "core-fcp-default-verify" },
    mailto: "",
    specificText: "specific text FI 3",
    url: "https://fip2-high.docker.dev-franceconnect.fr/",
    statusURL: "https://fip2-high.docker.dev-franceconnect.fr/",
    authzURL: "https://fip2-high.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip2-high.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip2-high.docker.dev-franceconnect.fr/api/user",
    discovery: false,
    clientID: "idptest",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip2-high.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip2-high",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },
  { upsert: true }
);

db.provider.update(
  { uid: "fip2v2" },
  {
    $set: { title: "Idp test Inserted" },
  }
);
