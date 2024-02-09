const BASE_PRODUCTION_IPD_LOW = {
  active: true,
  display: true,
  isBeta: false,
  trustedIdentity: false,
  eidas: 1,
  mailto: "",
  featureHandlers: {
    coreVerify: "core-fcp-default-verify",
    authenticationEmail: "core-fcp-send-email",
    idpIdentityCheck: "core-fcp-default-identity-check",
  },
  discovery: false,
  url: "https://fip1-low.docker.dev-franceconnect.fr",
  statusURL: "https://fip1.docker.dev-franceconnect.fr",
  authzURL: "https://fip1-low.docker.dev-franceconnect.fr/authorize",
  tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/token",
  userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/userinfo",
  clientID: "myclientidforfip1-low",
  client_secret:
    "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
  order: 1,
  createdAt: new Date("2022-02-15 17:09:17"),
  updatedAt: new Date("2023-03-10 17:09:17"),
  updatedBy: "admin",
  endSessionURL: "https://fip1-low.docker.dev-franceconnect.fr/session/end",
  response_types: ["code"],
  id_token_signed_response_alg: "HS256",
  token_endpoint_auth_method: "client_secret_post",
  revocation_endpoint_auth_method: "client_secret_post",
  id_token_encrypted_response_alg: "",
  id_token_encrypted_response_enc: "",
  userinfo_signed_response_alg: "HS256",
  userinfo_encrypted_response_alg: "",
  userinfo_encrypted_response_enc: "",
  amr: ["fc", "pwd", "mail"],
};

const PRODUCTION_IDPS_LOW = {
  IMPOT_GOUV: {
    order: 1,
    uid: "8dfc4080-c90d-4234-969b-f6c961de3e90",
    title: "impots.gouv.fr",
    image: "fi-impots.svg",
  },
  AMELI: {
    order: 2,
    uid: "07e573f2-3312-4bb9-bc48-6fcec737e497",
    title: "Ameli.fr",
    image: "fi-ameli.svg",
  },
  LA_POSTE: {
    order: 3,
    uid: "7d4455fb-3141-4b12-8a18-718d2cb9b149",
    title: "L'Identité Numérique La Poste",
    image: "fi-laposte.svg",
  },
  MSA: {
    order: 4,
    uid: "c8d48186-811f-4c78-85f3-a5cd2ea7bfef",
    title: "MSA",
    image: "fi-msa.svg",
  },
  YRIS: {
    order: 5,
    uid: "f5f97e5a-0f73-4ac8-8da7-b1d015cb5a7e",
    title: "YRIS",
    image: "fi-yris.svg",
  },
  FRANCE_IDENTITE: {
    order: 6,
    isBeta: true,
    uid: "0b2d3258-0ef4-42d8-981f-083175368c92",
    title: "France Identité",
    image: "fi-france-identite.svg",
  },
  AIDANTS_CONNECT: {
    order: 98,
    uid: "3189d655-0c78-4ff7-9758-f3a3ac36dd7e", // should match App_AIDANTS_CONNECT_UID env
    clientID: "08a1a257648c1742c74d6a3d84b31943", // should match aidantConnectClientId in FC legacy config
    title: "Aidants Connect",
    image: "fi-aidantsconnect.png",
  },
  // @todo #1305 Add eidas-bridge IDP once TA 1305 implemented
  // @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1305
  // EIDAS_BRIDGE: {
  //   order: 99,
  //   uid: "1f4d6633-d853-43c6-b461-ce54fdc19bff", // same as App_EIDAS_BRIDGE_UID env
  //   title: "eIDAS Bridge",
  //   image: "fi-europe.svg",
  //   disabledForLegacy: true,
  // },
};

/* ------------------------------------------------------------------------------- */

print("> remove fcp-low providers from database");
db.provider.remove({});

Object.entries(PRODUCTION_IDPS_LOW).forEach(([key, fi]) => {
  const lkey = key.toLowerCase();

  const update = {
    // default base
    ...BASE_PRODUCTION_IPD_LOW,
    // abstracts
    name: lkey,
    // overrides defined
    ...fi,
  };

  print(`- initializing "${lkey}" : { active : ${update.active} }`);
  db.provider.update({ uid: update.uid }, update, { upsert: true });
});
