// == FI
const fip = {
  // -- FIP - FIP1-LOW - Activated
  "FIP1-LOW": {
    uid: "fip1-low",
    name: "fip1-low",
    active: true,
    display: true,
    title: "IDP1 - LOW",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip1-low",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
    },
    specificText: "specific text fip1-low",
    url: "https://fip1-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },
  // -- FIP - FIP2-LOW - Activated
  "FIP2-LOW": {
    uid: "fip2-low",
    name: "fip2-low",
    active: true,
    display: true,
    title: "IDP2 - LOW",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip2-low",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
    },
    specificText: "specific text fip2-low",
    url: "https://fip2-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fip2-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfip2-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    response_types: ["code"],
    id_token_signed_response_alg: "ES256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    // fip2-low using old oidc-callback route
    redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fip2-low",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },
  // -- FIP - FIP3-LOW - Activated
  "FIP3-LOW": {
    uid: "fip3-low",
    name: "fip3-low",
    active: true,
    display: true,
    title: "IDP3 - LOW",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip3-low",
    eidas: 1,
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
    },
    specificText: "specific text fip3-low",
    url: "https://fip3-low.docker.dev-franceconnect.fr/",
    discoveryUrl:
      "https://fip3-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfip3-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: null,
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
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
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/oidc-callback",
    ],
    post_logout_redirect_uris: [
      "https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/logout/redirect-from-idp",
    ],
  },
};

// -- FIs ----------

Object.values(fip).forEach((fi) => {
  print(`FIP > Initializing provider: ${fi.name} - Activated`);
  db.provider.update({ uid: fi.uid }, fi, { upsert: true });
});
