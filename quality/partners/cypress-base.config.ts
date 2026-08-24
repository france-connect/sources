// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
const config: Partial<Cypress.ResolvedConfigOptions<never>> = {
  chromeWebSecurity: false,
  video: false,
  e2e: {
    baseUrl: 'https://docker.dev-franceconnect.fr',
    specPattern: 'cypress/integration/partners/*.feature',
    supportFile: 'cypress/support/index.ts',
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
  },
  env: {
    APP_LABEL: 'Espace Partenaires',
    // Base Configuration
    TEST_PLATFORM: 'partners',
    TEST_ENV: 'docker',
    TAGS: 'not @ignore',
    CI: process.env.CI,
    // Maildev
    MAILDEV_PROTOCOL: 'https',
    MAILDEV_HOST: 'maildev.docker.dev-franceconnect.fr',
    MAILDEV_API_PORT: '443',
  },
};
/* eslint-enable sort-keys-fix/sort-keys-fix, sort-keys */

export default config;
