const BASE_PRODUCTION_IDP_HIGH = {
  eidas: 3,
  mailto: "",
  order: null,
  updatedBy: "admin",
  updatedAt: new Date("2019-04-24 17:09:17"),
  active: true,
  display: true,
  isBeta: false,
  discovery: true,
  featureHandlers: {
    coreVerify: "core-fcp-default-verify",
    authenticationEmail: "core-fcp-send-email",
    idpIdentityCheck: "core-fcp-default-identity-check",
  },
  clientID: "09a1a257648c1742c74d6a3d84b31943",
  client_secret:
    "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
  response_types: ["code"],
  userinfo_signed_response_alg: "ES256",
  userinfo_encrypted_response_alg: "RSA-OAEP-256",
  id_token_signed_response_alg: "ES256",
  id_token_encrypted_response_alg: "RSA-OAEP-256",
  id_token_encrypted_response_enc: "A256GCM",
  userinfo_encrypted_response_enc: "A256GCM",
  token_endpoint_auth_method: "client_secret_post",
  revocation_endpoint_auth_method: "client_secret_post",
  url: "https://fip1-high.docker.dev-franceconnect.fr/",
  statusURL: "https://fip1-high.docker.dev-franceconnect.fr/",
  endSessionURL:
    "https://fip1-high.docker.dev-franceconnect.fr/user/session/end",
  discoveryUrl:
    "https://fip1-high.docker.dev-franceconnect.fr/.well-known/openid-configuration",
  amr: ["fc", "pop", "pin", "mfa"],
};

const PRODUCTION_IPDS_HIGH = {
  LA_POSTE: {
    order: 1,
    uid: "87e69e8d-dc70-40c7-9d9f-48a7a33d6dfd",
    title: "L’Identité Numérique La Poste",
    image: `fi-laposte.svg`,
  },
  EIDAS_BRIDGE: {
    order: 99,
    uid: "8aa849db-8402-4f2e-bad9-7471dd21ff94", // same as App_EIDAS_BRIDGE_UID env
    active: false, // simulate eidas-bridge being blacklisted on all SP
    display: true,
    title: "eIDAS Bridge",
    image: "fi-europe.svg",
  },
};

/* ------------------------------------------------------------------------------- */

print("> remove fcp-high providers from database");
db.provider.remove({});

Object.entries(PRODUCTION_IPDS_HIGH).forEach(([key, fi]) => {
  const lkey = key.toLowerCase();

  const update = {
    // default base
    ...BASE_PRODUCTION_IDP_HIGH,
    // abstracts
    name: lkey,
    // overrides defined
    ...fi,
  };

  print(`- initializing "${lkey}" : { active : ${update.active} }`);
  db.provider.update({ uid: update.uid }, update, { upsert: true });
});
