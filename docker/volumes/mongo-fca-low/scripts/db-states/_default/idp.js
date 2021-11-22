// == FI
const fia = {
  // -- FIA - FIA1-LOW - Activated
  "FIA1-LOW": {
    uid: "fia1-low",
    name: "fia1-low",
    active: true,
    display: true,
    title: "Identity Provider 1 - eIDAS faible - ES256",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    specificText: "specific text fia1-low",
    url: "https://fia1-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia1-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia1-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "ES256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA - FIA2-LOW - Activated
  "FIA2-LOW": {
    uid: "fia2-low",
    name: "fia2-low",
    active: true,
    display: true,
    title: "Identity Provider 2 - eIDAS faible - RS256",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    specificText: "specific text fia2-low",
    url: "https://fia2-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia2-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia2-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia2-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia2-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "RS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "RS256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fia2-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA - FIA3-LOW - Deactivated but visible
  "FIA3-LOW": {
    uid: "fia3-desactive-visible",
    name: "fia3-desactive-visible",
    active: false,
    display: true,
    title: "Identity Provider 3 (désactivé)- eIDAS faible",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    specificText: "specific text fia3-low",
    url: "https://fia3-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia3-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia3-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia3-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia3-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "ES256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA - FIA4-LOW - Activated - HS256
  "FIA4-LOW": {
    uid: "fia4-low",
    name: "fia4-low",
    active: true,
    display: true,
    title: "Identity Provider 4 - eIDAS faible - HS256",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    mailto: "",
    specificText: "specific text fia4-low",
    url: "https://fia4-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia4-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia4-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia4-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia4-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "HS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "HS256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA - FIA5-LOW - activated - RS256
  "FIA5-LOW": {
    uid: "fia5-low",
    name: "fia5-low",
    active: true,
    display: true,
    title: "Identity Provider 5 - eIDAS faible - RS256",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    mailto: "",
    specificText: "specific text fia5-low",
    url: "https://fia5-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia5-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia5-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia5-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia5-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "RS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "RS256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA - FIA6-LOW - Activated but not visible
  "FIA6-LOW": {
    uid: "fia6-active-invisible",
    name: "fia6-active-invisible",
    active: true,
    display: false,
    title: "Identity Provider 6 (non visible)- eIDAS faible",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    specificText: "specific text fia6-low",
    url: "https://fia6-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia6-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia6-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia3-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia6-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "ES256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA - FIA7-LOW - Deactivated and not visible
  "FIA7-LOW": {
    uid: "fia7-desactive-invisible",
    name: "fia7-desactive-invisible",
    active: false,
    display: false,
    title: "Identity Provider 7 (désactivé et non visible)- eIDAS faible",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "impots",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    specificText: "specific text fia7-low",
    url: "https://fia7-low.docker.dev-franceconnect.fr/",
    statusURL: "https://fia7-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fia7-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfia3-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://fia7-low.docker.dev-franceconnect.fr/user/session/end",
    response_types: ["code"],
    id_token_signed_response_alg: "ES256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },

  // -- FIA using LemonLDAP 
  "FIA-LLNG-LOW": {
    uid: "fia-llng-low",
    name: "LemonLDAP::ng",
    active: true,
    display: true,
    title: "Identity Provider LemonLDAP",
    image: "fi-mock-eleve.svg",
    imageFocus: "fi-mock-eleve.svg",
    alt: "llng",
    eidas: 1,
    featureHandlers: {
      coreVerify: "core-fca-default-verify",
      authenticationEmail: null,
    },
    mailto: "",
    specificText: "specific text llng",
    url: "https://auth.llng.docker.dev-franceconnect.fr",
    discoveryUrl:
      "https://auth.llng.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforllng",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    endSessionURL:
      "https://auth.llng.docker.dev-franceconnect.fr/oauth2/logout",
    response_types: ["code"],
    id_token_signed_response_alg: "RS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "RS256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "RS256",
    redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fia-llng-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fca-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },
};

// -- IDPs ----------
print("FIA > Initializing provider: fia1-low - Activated");
db.provider.update({ name: "fia1-low" }, fia["FIA1-LOW"], { upsert: true });
print("FIA > Initializing provider: fia2-low - Activated");
db.provider.update({ name: "fia2-low" }, fia["FIA2-LOW"], { upsert: true });
print("FIA > Initializing provider: fia3-low - Activated");
db.provider.update({ name: "fia3-low" }, fia["FIA3-LOW"], { upsert: true });
print("FIP > Initializing provider: fia4-low - Activated");
db.provider.update({ name: "fia4-low" }, fia["FIA4-LOW"], { upsert: true });
print("FIP > Initializing provider: fia5-low - Activated");
db.provider.update({ name: "fia5-low" }, fia["FIA5-LOW"], { upsert: true });
print("FIP > Initializing provider: fia6-low - Activated");
db.provider.update({ name: "fia6-low" }, fia["FIA6-LOW"], { upsert: true });
print("FIP > Initializing provider: fia7-low - Activated");
db.provider.update({ name: "fia7-low" }, fia["FIA7-LOW"], { upsert: true });
print("FIA > Initializing provider: llng - Activated");
db.provider.update({ name: "LemonLDAP-ng" }, fia["FIA-LLNG-LOW"], { upsert: true });
