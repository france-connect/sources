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
    PLATFORM: 'fcp-low',
    TEST_ENV: 'docker',
    TAGS: 'not @ignoreLow and not @fcpHigh and not @userDashboard',
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
    LOG_FILE_PATH: '../../docker/volumes/log/core-fcp-low.log',
    // Keys used by the dp mock on the local stack
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
