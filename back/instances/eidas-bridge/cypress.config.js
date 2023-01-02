// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginConfig = require('./cypress/plugins');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://eidas-bridge.docker.dev-franceconnect.fr',
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/**/*.js',
    excludeSpecPattern: 'cypress/integration/**/*.utils.js',
    supportFile: 'cypress/support/index.js',
    video: false,
  },
  env: {
    CORE_LOG_FILE_PATH: '../../../docker/volumes/log/core-fcp-high.log',
    CORE_ROOT_URL: 'https://core-fcp-high.docker.dev-franceconnect.fr',

    MOCK_EIDAS_SP_URL:
      'https://eidas-mock.docker.dev-franceconnect.fr/SP/populateIndexPage',
    MOCK_EIDAS_SP2_URL:
      'https://eidas-be.docker.dev-franceconnect.fr/SP/populateIndexPage',

    BRIDGE_ROOT_URL: 'https://eidas-bridge.docker.dev-franceconnect.fr',

    IDP_NAME: 'fip',
    IDP_ROOT_URL: 'https://IDP_NAME.docker.dev-franceconnect.fr',

    SP1_ROOT_URL: 'https://fsp1-high.docker.dev-franceconnect.fr',
    SP1_CLIENT_ID:
      '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950',

    WELL_KNOWN: '/.well-known/openid-configuration',
  },
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  viewportHeight: 1000,
  viewportWidth: 1400,
  pageLoadTimeout: 30000,
});
