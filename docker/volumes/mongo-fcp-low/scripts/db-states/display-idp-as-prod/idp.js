/**
 * Impôts like IDP
 */
print("Initializing impot_gouv");
db.provider.replaceOne(
  {
    uid: "45387392-621b-4830-85c3-4a1e1d4ef18c",
  },
  {
    uid: "45387392-621b-4830-85c3-4a1e1d4ef18c",
    name: "impot_gouv",
    active: true,
    display: false,
    isBeta: false,
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
);

/* ------------------------------------------------------------------------------- */

/**
 * Ameli like IDP
 */
print("Initializing ameli");
db.provider.replaceOne(
  {
    uid: "67fb107f-337d-4543-8eae-038b450dac01",
  },
  {
    uid: "67fb107f-337d-4543-8eae-038b450dac01",
    name: "ameli",
    active: true,
    display: false,
    isBeta: false,
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
);

/* ------------------------------------------------------------------------------- */

/**
 * La poste like IDP
 */
print("Initializing la_poste");
db.provider.replaceOne(
  {
    uid: "bd2618cc-1d7f-4384-9f04-13352e8d51c6",
  },
  {
    uid: "bd2618cc-1d7f-4384-9f04-13352e8d51c6",
    name: "la_poste",
    active: true,
    display: true,
    isBeta: false,
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
);

/* ------------------------------------------------------------------------------- */

/**
 * Mobile connect like IDP
 */
print("Initializing mobile_connect");
db.provider.replaceOne(
  {
    uid: "7769ef21-d29c-4a87-9025-4970ba0f6be1",
  },
  {
    uid: "7769ef21-d29c-4a87-9025-4970ba0f6be1",
    name: "mobile_connect",
    active: true,
    display: true,
    isBeta: false,
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
);

/* ------------------------------------------------------------------------------- */

/**
 * MSA like IDP
 */
print("Initializing msa");
db.provider.replaceOne(
  {
    uid: "10685777-0965-468e-a3c3-6a7a0bdbbf5e",
  },
  {
    uid: "10685777-0965-468e-a3c3-6a7a0bdbbf5e",
    name: "msa",
    active: true,
    display: false,
    isBeta: false,
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
);

/* ------------------------------------------------------------------------------- */

/**
 * Alicem like IDP
 */
print("Initializing alicem");
db.provider.replaceOne(
  {
    uid: "81d72ad1-b0c1-431c-ad5b-72cbb0e547a7",
  },
  {
    uid: "81d72ad1-b0c1-431c-ad5b-72cbb0e547a7",
    name: "alicem",
    active: false,
    display: true,
    isBeta: false,
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/client/logout-callback",
    ],
  },
);

/* ------------------------------------------------------------------------------- */
