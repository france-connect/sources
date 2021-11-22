/**
 * Impôts like IDP
 */
print("Initializing impot_gouv");
db.provider.replaceOne(
  {
    uid: "impot_gouv",
  },
  {
    uid: "impot_gouv",
    name: "impot_gouv",
    active: true,
    display: false,
    title: "Identity Provider - eIDAS élevé",
    image: "fi-impots.png",
    imageFocus: "fi-impots.png",
    alt: "impots",
    eidas: 3,
    mailto: "",
    specificText: "specific text impot_gouv",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fip1-low.docker.dev-franceconnect.fr/",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/api/user",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "09a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip1-low.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  }
);

/* ------------------------------------------------------------------------------- */

/**
 * Ameli like IDP
 */
print("Initializing ameli");
db.provider.replaceOne(
  {
    uid: "ameli",
  },
  {
    uid: "ameli",
    name: "ameli",
    active: true,
    display: false,
    title: "Identity Provider - eIDAS élevé",
    image: "fi-impots.png",
    imageFocus: "fi-impots.png",
    alt: "impots",
    eidas: 3,
    mailto: "",
    specificText: "specific text ameli",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fip1-low.docker.dev-franceconnect.fr/",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/api/user",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "09a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip1-low.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  }
);

/* ------------------------------------------------------------------------------- */

/**
 * La poste like IDP
 */
print("Initializing la_poste");
db.provider.replaceOne(
  {
    uid: "la_poste",
  },
  {
    uid: "la_poste",
    name: "la_poste",
    active: true,
    display: true,
    title: "L’Identité Numérique La Poste",
    image: "fi-laposte.svg",
    imageFocus: "fi-laposte.svg",
    alt: "impots",
    eidas: 3,
    mailto: "",
    specificText: "specific text la_poste",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fip1-low.docker.dev-franceconnect.fr/",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/api/user",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "09a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip1-low.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  }
);

/* ------------------------------------------------------------------------------- */

/**
 * Mobile connect like IDP
 */
print("Initializing mobile_connect");
db.provider.replaceOne(
  {
    uid: "mobile_connect",
  },
  {
    uid: "mobile_connect",
    name: "mobile_connect",
    active: true,
    display: true,
    title: "MobileConnect et moi",
    image: "fi-impots.png",
    imageFocus: "fi-impots.png",
    alt: "impots",
    eidas: 3,
    mailto: "",
    specificText: "specific text mobile_connect",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fip1-low.docker.dev-franceconnect.fr/",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/api/user",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "09a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip1-low.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  }
);

/* ------------------------------------------------------------------------------- */

/**
 * MSA like IDP
 */
print("Initializing msa");
db.provider.replaceOne(
  {
    uid: "msa",
  },
  {
    uid: "msa",
    name: "msa",
    active: true,
    display: false,
    title: "Identity Provider - eIDAS élevé",
    image: "fi-impots.png",
    imageFocus: "fi-impots.png",
    alt: "impots",
    eidas: 3,
    mailto: "",
    specificText: "specific text msa",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fip1-low.docker.dev-franceconnect.fr/",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/api/user",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "09a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip1-low.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  }
);

/* ------------------------------------------------------------------------------- */

/**
 * Alicem like IDP
 */
print("Initializing alicem");
db.provider.replaceOne(
  {
    uid: "alicem",
  },
  {
    uid: "alicem",
    name: "alicem",
    active: false,
    display: true,
    title: "Identity Provider - alicem",
    image: "fi-alicem.png",
    imageFocus: "fi-impots.png",
    alt: "impots",
    eidas: 3,
    mailto: "",
    specificText: "specific text alicem",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fip1-low.docker.dev-franceconnect.fr/",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/user/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/user/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/api/user",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "09a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fip1-low.docker.dev-franceconnect.fr/user/session/end",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip1-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  }
);

/* ------------------------------------------------------------------------------- */
