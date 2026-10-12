// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys */
const config: Partial<Cypress.ResolvedConfigOptions<never>> = {
  allowCypressEnv: false,
  chromeWebSecurity: false,
  video: false,
  e2e: {
    baseUrl: 'https://docker.dev-franceconnect.fr',
    specPattern: 'cypress/integration/partners/*.feature',
    supportFile: 'cypress/support/index.ts',
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
  },
  expose: {
    // Base Configuration
    TEST_PLATFORM: 'partners',
    TEST_ENV: 'docker',
    tags: 'not @ignore',
    // Maildev
    MAILDEV_PROTOCOL: 'https',
    MAILDEV_HOST: 'maildev.docker.dev-franceconnect.fr',
    MAILDEV_SMTP_PORT: '1025',
    MAILDEV_API_PORT: '443',
    // Other Configuration
    APP_LABEL: 'Espace Partenaires',
    CI: process.env.CI,
  },
};
/* eslint-enable sort-keys */

export default config;
