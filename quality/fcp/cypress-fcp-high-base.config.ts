// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
const config: Partial<Cypress.ResolvedConfigOptions<never>> = {
  chromeWebSecurity: false,
  video: false,
  e2e: {
    baseUrl: 'https://docker.dev-franceconnect.fr',
    specPattern: 'cypress/integration/**/*.feature',
    supportFile: 'cypress/support/index.ts',
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
  },
  env: {
    // Base Configuration
    PLATFORM: 'fcp-high',
    TEST_ENV: 'docker',
    TAGS: 'not @ignoreHigh and not @fcpLow',
    // Test environment access
    EXPLOIT_ADMIN_NAME: 'jean_moust',
    EXPLOIT_ADMIN_PASS: 'georgesmoustaki',
    EXPLOIT_ADMIN_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    EXPLOIT_USER_NAME: 'jean_patoche',
    EXPLOIT_USER_PASS: 'georgesmoustaki',
    EXPLOIT_USER_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    FC_ACCESS_USER: '',
    FC_ACCESS_PASS: '',
    // Maildev
    MAILDEV_PROTOCOL: 'https',
    MAILDEV_HOST: 'maildev.docker.dev-franceconnect.fr',
    MAILDEV_SMTP_PORT: '1025',
    MAILDEV_API_PORT: '443',
    // Other Configuration
    LOG_FILE_PATH: '../../docker/volumes/log/core-fcp-high.log',
    EIDAS_LOG_FILE_PATH: '../../docker/volumes/log/eidas-bridge.log',
    ES256_SIG_PUB_KEY:
      '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEUvVm7hq8ycQGaKle6kpzUom73IQy\nYINGRdzQC75AXxzKiKAjeHjGNFA8R5fwZ8jJHiZ+Kiq80gY9anv/vHujGQ==\n-----END PUBLIC KEY-----\n',
    // Keys used by the sp mock and dp mock on the local stack
    RSA_ENC_PRIV_KEY: {
      e: 'AQAB',
      n: 'usnS3yJWQXQSCrXX1ij55Kn3T6c_G-k1MioMnhijMOH4ymc3HDyhYSzyidtmfVTNJiZu5pGRs3Wnicrpy9xgYOtdTkycAGwrqs3Y4MoKktH1rSb91F-B06OPqr7jxjB8d9pOnFKrmy9SXR_b6ARSAegdDCl0_D72AIsMtOm3n1mKwDN_87M4bTkVGyhUT3bzKiPT2PNbxoOG9QKyJxKrUK8JAINJzhLJyWm88yIIE8cZ25Q7KXqb_JZDe4uTcrUYOIgExGtZzRpzeYVtJoygeUzX66PBzexmjPgMHdURpnCqdHwJU703TguApSVxD0dn4ZWUHTl64FPintEPsn1ZUQ',
      d: 'aq4WJ6Z-yQc3vrI4wXHJt1VzkCSfIJvC7BGj_y9nFOYap87nZNMkAFIhe6a5FF-4g090C2-cXXiW5VXkza_hw7jpI20RtBQTpIvIkCoUe-I6hFg-pGqfxXYm-YfooyrSC8m9F_8HT6xpSBKIEC1XgQtGe8m5rM9wxMKl0TWiz_jkMfzxFmILO0KQBCJvlkVvW9Fc7eFo4hrtKCc8grcVgiltV4gv4DGcqKQBTslI_PnUylfqFxedVl8FFT-MShIdYa_-JwMU-BF_DBJFGlN7fo5ss6972QD6JNfMBgChMcNgNs8NwnTT7spISfSuGAIDKKmOLFCmB6xg9lH9INMhoQ',
      p: '39Ccclk7AVkRVSfeMyHtWadYSVJZo20hhVRPQrAs_5JbdiejNqOgMm__aRoh9TePGElA8FDtAWCR53P7AQO8U_wZ0w32gn77IGOyAN6WZkfMHRIS0JgERr-9OKYkZ4sCMfOLxqwcyKkNudyizyG9plUdRiY1dnWi_Ag7SuVrst0',
      q: '1aYj86jBmttuL-85Tna543pIKgbL5xRYzjcVbSAtCDC-aLIuVfGFCcVyTXtIRbPqTE_M2n6W2RE3Eh7shkaMRP8gREuhM6SxVr2PkVjE5w2OKugJgs4bGPamWYWVVu_cRWlt9xwZJUKOhNX2soeBt_SIrCURGwaWFfePy3wFFwU',
      dp: 'DtFt-jgkKvOtrRiloncFkuD8fGZCXwqTpJMvaDfn0sfq3EjFipGMwqodm-TKCMUz6SS4cvC4sFWnc05_eNK5fkn7n7iV8I_dqohPObWC-aSZQ_d1XXAjIFgDfCOr11shuxLn1zB_-10N9pdABDy0pLWP6ZwQABbLwqn82vmThtU',
      dq: 'DnK926x960sLmJJE_dlpmMicOLtc7rOhjdCL0mVqpjMlrU7fc1Bx_scrg7HioVQZdC-xWtVUvjk70C3nMO10bvYR6Ix0yllI5OTM4LdwGXABPUWT3xSxIG8NsOAnyUlPTCJlHWD5Elv9513Q4SHo09flpj6beYhoffPP9aLddUE',
      qi: 'jjbChoLdsQKinsDnichWtwyQ_M3F8ygncwVBBvbmHGUFCxZCDUc-zOA-Wipb9DxYCyu65FUpUGnxXo4yYLwtibd9ler1_7rLyZxtpAspuFvBRrScJh0x_lMvyhhf_YsNTWsOgM7YPBwU-Fis44kapNX1-AXIacgSfyspzGf-EEA',
      kty: 'RSA',
      alg: 'RSA-OAEP',
      kid: 'oidc-client:locale',
      use: 'enc',
    },
    EC_ENC_PRIV_KEY: {
      crv: 'P-256',
      x: '85iY2dD3NhgK-zyQe00NQSvLuS_GHbU_mcA2Z__QEow',
      y: 'n3zXtgfQGgHHaiI-ApcSkDvlYsE2DOrFFOvpHuECoPg',
      d: 'PlWeN6yarMmop2jzFGkp9F5a6iEnRVwIqnM_huXp7zg',
      kty: 'EC',
      alg: 'ECDH-ES',
      kid: 'EC',
      use: 'enc',
    },
  },
};

export default config;
