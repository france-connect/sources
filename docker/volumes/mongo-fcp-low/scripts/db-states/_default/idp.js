// == FI
const BASE_DEV_IDP_LOW = {};

const fip = {
  // -- FIP - FIP1 - No discovery
  "FIP1-NO-DISCOVERY": {
    uid: "8dfc4080-c90d-4234-969b-f6c961de3e90",
    name: "fip1-no-discovery",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP1-LOW - eIDAS LOW - NO DISCOVERY",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip1-no-discovery",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip1-no-discovery",
    discovery: false,
    url: "https://fip1-low.docker.dev-franceconnect.fr",
    statusURL: "https://fip1.docker.dev-franceconnect.fr",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip1-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 1,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd"],
  },
  // -- FIP - FIP1-LOW - Activated
  "FIP1-LOW": {
    uid: "07e573f2-3312-4bb9-bc48-6fcec737e497",
    name: "fip1-low",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP1-LOW - eIDAS LOW",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip1-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip1-low",
    url: "https://fip1-low.docker.dev-franceconnect.fr",
    discoveryUrl:
      "https://fip1-low.docker.dev-franceconnect.fr/.well-known/openid-configuration",
    discovery: true,
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 2,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd"],
  },
  // -- FIP - FIP1-LOW - Beta ACTIVE
  "FIP1-BETA-ACTIVE": {
    uid: "7d4455fb-3141-4b12-8a18-718d2cb9b149",
    name: "fip1-beta-active",
    active: true,
    display: true,
    isBeta: true,
    title: "FIP1-LOW - eIDAS LOW - NO DISCOVERY - Bêta active",
    image: "fi-mock-substantiel.svg",
    imageFocus: "fi-mock-substantiel.svg",
    alt: "fip1-beta-active",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip1-beta-active",
    discovery: false,
    url: "https://fip1-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip1-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 9,
    createdAt: new Date("2022-02-25 17:09:17"),
    updatedAt: new Date("2022-02-25 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd"],
  },
  // -- FIP - FIP1-LOW - Beta INACTIVE
  "FIP1-BETA-INACTIVE": {
    uid: "3c7db306-1a48-42fa-9a7f-67aa85030c0f",
    name: "fip1-beta-inactive",
    active: false,
    display: true,
    isBeta: true,
    title: "FIP1-LOW - eIDAS LOW - NO DISCOVERY - Bêta inactive",
    image: "fi-mock-substantiel.svg",
    imageFocus: "fi-mock-substantiel.svg",
    alt: "fip1-beta-inactive",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip1-beta-inactive",
    discovery: false,
    url: "https://fip1-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip1-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 10,
    createdAt: new Date("2022-02-25 17:09:17"),
    updatedAt: new Date("2022-02-25 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP1 - ES256 configuré mais HS256 renvoyé par FI
  "FIP1-WRONG-SIGNATURE": {
    uid: "454833e7-4ba6-4e2f-931a-84c83553d0ce",
    name: "fip1-wrong-signature",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP1-LOW - WRONG SIGNATURE",
    image: "",
    imageFocus: "",
    alt: "fip1-wrong-signature",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip1-no-discovery",
    discovery: false,
    url: "https://fip1-low.docker.dev-franceconnect.fr",
    statusURL: "https://fip1.docker.dev-franceconnect.fr",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip1-low.docker.dev-franceconnect.fr/session/end",
    jwksURL: "https://fip1-low.docker.dev-franceconnect.fr/jwks",
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 1,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
    updatedBy: "admin",
    response_types: ["code"],
    id_token_signed_response_alg: "HS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail", "mfa"],
  },
  // -- FIP - FIP1 - Aucune signature userinfo demandé mais renvoyé par FI
  "FIP1-NO-SIGNATURE": {
    uid: "71146cf0-ee50-49a9-bac2-8c09c4ba5439",
    name: "fip1-no-signature",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP1-LOW - NO SIGNATURE",
    image: "",
    imageFocus: "",
    alt: "fip1-no-signature",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip1-no-discovery",
    discovery: false,
    url: "https://fip1-low.docker.dev-franceconnect.fr",
    statusURL: "https://fip1.docker.dev-franceconnect.fr",
    authzURL: "https://fip1-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip1-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip1-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip1-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip1-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 1,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
    updatedBy: "admin",
    response_types: ["code"],
    id_token_signed_response_alg: "HS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    disabledForLegacy: false,
    amr: ["fc", "pwd"],
  },
  // -- FIP - FIP2-LOW - Activated
  "FIP2-LOW": {
    uid: "b5e9539a-599a-4ed2-9b4f-8f4bfc5fbb64",
    name: "fip2-low",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP2-LOW - eIDAS SUBSTANTIAL - NO DISCOVERY",
    image: "fi-mock-substantiel.svg",
    imageFocus: "fi-mock-substantiel.svg",
    alt: "fip2-low",
    trustedIdentity: false,
    eidas: 2,
    allowedAcr: ["eidas2"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip2-low",
    discovery: false,
    url: "https://fip2-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip2-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip2-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip2-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip2-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip2-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 3,
    createdAt: new Date("2022-02-20 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP3-LOW - Activated
  "FIP3-LOW": {
    uid: "0adf04be-536e-4986-b639-73ea8d38493e",
    name: "fip3-low",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP3-LOW - eIDAS HIGH - NO DISCOVERY",
    image: "fi-mock-eleve.svg",
    imageFocus: "fi-mock-eleve.svg",
    alt: "fip3-low",
    trustedIdentity: false,
    eidas: 3,
    allowedAcr: ["eidas3"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip3-low",
    discovery: false,
    url: "https://fip3-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip3-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip3-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip3-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip3-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip3-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 4,
    createdAt: new Date("2022-02-25 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pop", "mfa", "pin"],
  },
  // -- FIP - FIP4-LOW - ES256
  "FIP4-LOW": {
    uid: "ed9e1fdb-f2df-4d8d-85ca-fc72510e9ec8",
    name: "fip4-low",
    active: true,
    display: true,
    isBeta: false,
    title: "FIP4-LOW - eIDAS LOW - NO DISCOVERY - ES256",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip4-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip4-low",
    discovery: false,
    url: "https://fip4-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip4-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip4-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip4-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip4-low.docker.dev-franceconnect.fr/session/end",
    jwksURL: "https://fip4-low.docker.dev-franceconnect.fr/jwks",
    clientID: "myclientidforfip4-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 4,
    createdAt: new Date("2022-02-25 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP5-LOW - Disabled
  "FIP5-LOW": {
    uid: "b18cb985-9492-4737-9890-da69a87a012a",
    name: "fip5-low",
    active: false,
    display: true,
    isBeta: false,
    title: "IDP5 - LOW disabled",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip5-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip5-low",
    discovery: false,
    url: "https://fip5-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip5-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip5-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip5-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip5-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip5-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 5,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP6-LOW - Invisible
  "FIP6-LOW": {
    uid: "caf0fe8d-0d8b-4288-9850-ce8b2a4b5251",
    name: "fip6-low",
    active: true,
    display: false,
    isBeta: false,
    title: "IDP6 - LOW invisible",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip6-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip6-low",
    discovery: false,
    url: "https://fip6-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip6-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip6-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip6-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip6-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip6-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 6,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP7-LOW - Disabled and Invisible
  "FIP7-LOW": {
    uid: "0c1edaa3-c0a5-4cac-902e-29872bae2c6e",
    name: "fip7-low",
    active: false,
    display: false,
    isBeta: false,
    title: "IDP7 - LOW disabled and invisible",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip7-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip7-low",
    discovery: false,
    url: "https://fip7-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip7-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip7-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip7-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip7-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip7-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 7,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP8-LOW - Activated - whitelisted by fsp3
  "FIP8-LOW": {
    uid: "77fe5e8c-364c-440e-909f-5ef4f494e170",
    name: "fip8-low",
    active: true,
    display: true,
    isBeta: false,
    title: "IDP8 - LOW",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip8-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip8-low",
    discovery: false,
    url: "https://fip8-low.docker.dev-franceconnect.fr",
    authzURL: "https://fip8-low.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://fip8-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip8-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "https://fip8-low.docker.dev-franceconnect.fr/session/end",
    clientID: "myclientidforfip8-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 8,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // -- FIP - FIP9-LOW - Activated - no endSessionUrl - userinfo_signed_response_alg not signed
  "FIP9-LOW": {
    uid: "720a5453-1964-4c71-a8fa-00bfb880fe9f",
    name: "fip9-low",
    active: true,
    display: true,
    isBeta: false,
    title: "IDP9 - LOW - no endSessionUrl",
    image: "fi-mock-faible.svg",
    imageFocus: "fi-mock-faible.svg",
    alt: "fip9-low",
    trustedIdentity: false,
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-default-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text fip9-low",
    url: "https://fip9-low.docker.dev-franceconnect.fr",
    tokenURL: "https://fip9-low.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://fip9-low.docker.dev-franceconnect.fr/userinfo",
    endSessionURL: "",
    authzURL: "https://fip9-low.docker.dev-franceconnect.fr/authorize",
    discovery: false,
    clientID: "myclientidforfip9-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    order: 1,
    createdAt: new Date("2022-02-15 17:09:17"),
    updatedAt: new Date("2023-03-10 17:09:17"),
    updatedBy: "admin",
    response_types: ["code"],
    id_token_signed_response_alg: "HS256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "",
    id_token_encrypted_response_enc: "",
    userinfo_signed_response_alg: "",
    userinfo_encrypted_response_alg: "",
    userinfo_encrypted_response_enc: "",
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  //Aidants Connect mock
  "aidants-connect-mock": {
    uid: "3189d655-0c78-4ff7-9758-f3a3ac36dd7e",
    name: "aidants-connect-mock",
    active: true,
    display: true,
    isBeta: false,
    title: "Aidants Connect mock",
    image: "fi-aidantsconnect.png",
    imageFocus: "fi-aidantsconnect.png",
    alt: "aidants connect mock",
    trustedIdentity: "false",
    eidas: 1,
    allowedAcr: ["eidas1"],
    mailto: "test@dev-franceconnect.fr",
    featureHandlers: {
      coreVerify: "core-fcp-aidants-connect-verify",
      authenticationEmail: "core-fcp-send-email",
      idpIdentityCheck: "core-fcp-default-identity-check",
      coreAuthorization: "core-fcp-aidants-connect-authorization",
    },
    specificText: "aidants connect mock",
    url: "https://aidants-connect-mock.docker.dev-franceconnect.fr",
    statusURL: "https://aidants-connect-mock.docker.dev-franceconnect.fr",
    authzURL:
      "https://aidants-connect-mock.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://aidants-connect-mock.docker.dev-franceconnect.fr/token",
    userInfoURL:
      "https://aidants-connect-mock.docker.dev-franceconnect.fr/userinfo",
    endSessionURL:
      "https://aidants-connect-mock.docker.dev-franceconnect.fr/session/end",
    discovery: false,
    clientID: "08a1a257648c1742c74d6a3d84b31943",
    client_secret:
      "+3wLzOoeALg6COG66XCPQNxxiH3jYNzEOxLGWOyaiI/PLYDY5xp7KlNMgJNYPhTQSa1kKFcqg5G5SnOK",
    order: null,
    createdAt: new Date("2019-04-24 17:09:17"),
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
    disabledForLegacy: false,
    amr: ["fc", "pwd", "mail"],
  },
  // eIDAS Bridge as Identity Provider
  "eidas-bridge": {
    uid: "1f4d6633-d853-43c6-b461-ce54fdc19bff",
    name: "eidas_interconnection_bridge",
    active: true,
    display: true,
    isBeta: false,
    title: "eIDAS Bridge",
    image: "fi-europe.svg",
    imageFocus: "fi-europe.svg",
    alt: "eIDAS Bridge",
    eidas: 2,
    allowedAcr: ["eidas2", "eidas3"],
    mailto: "",
    featureHandlers: {
      coreVerify: "core-fcp-eidas-verify",
      authenticationEmail: null,
      idpIdentityCheck: "core-fcp-eidas-identity-check",
      coreAuthorization: "core-fcp-default-authorization",
    },
    specificText: "specific text eidas bridge",
    clientID: "myclientidforeidas-bridge-low",
    client_secret:
      "jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE",
    url: "https://eidas-bridge.docker.dev-franceconnect.fr",
    discovery: false,
    order: 9,
    createdAt: new Date("2019-04-24 17:09:17"),
    updatedAt: new Date("2019-04-24 17:09:17"),
    updatedBy: "admin",
    authzURL: "https://eidas-bridge.docker.dev-franceconnect.fr/authorize",
    tokenURL: "https://eidas-bridge.docker.dev-franceconnect.fr/token",
    userInfoURL: "https://eidas-bridge.docker.dev-franceconnect.fr/userinfo",
    jwksURL: "https://eidas-bridge.docker.dev-franceconnect.fr/jwks",
    response_types: ["code"],
    id_token_signed_response_alg: "ES256",
    token_endpoint_auth_method: "client_secret_post",
    revocation_endpoint_auth_method: "client_secret_post",
    id_token_encrypted_response_alg: "ECDH-ES",
    id_token_encrypted_response_enc: "A256GCM",
    userinfo_signed_response_alg: "ES256",
    userinfo_encrypted_response_alg: "ECDH-ES",
    userinfo_encrypted_response_enc: "A256GCM",
    disabledForLegacy: true,
    amr: ["eidas"],
  },
};

// -- FIs ----------

db.provider.createIndex({ name: 1 }, { unique: true });

Object.values(fip).forEach((fi) => {
  print(`FIP > Initializing provider: ${fi.name} - Activated`);
  db.provider.updateOne(
    { uid: fi.uid },
    { $set: { ...BASE_DEV_IDP_LOW, ...fi } },
    { upsert: true },
  );
});
