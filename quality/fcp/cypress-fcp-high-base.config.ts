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
  },
};

export default config;
