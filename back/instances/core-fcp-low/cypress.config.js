// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginConfig = require('./cypress/plugins');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://core-fcp-low.docker.dev-franceconnect.fr',
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/**/*.js',
    excludeSpecPattern: 'cypress/integration/**/*.utils.js',
    supportFile: 'cypress/support/index.js',
    video: false,
  },
  env: {
    APP_DOMAIN: 'core-fcp-low.docker.dev-franceconnect.fr',
    APP_NAME: 'core-fcp-low',
    LOG_FILE_PATH: '../../../docker/volumes/log/core-fcp-low.log',
    FC_DOCKER_PATH: '../../../docker',
    FC_ROOT_URL: 'https://core-fcp-low.docker.dev-franceconnect.fr',
    FC_INTERACTION_URL:
      'https://core-fcp-low.docker.dev-franceconnect.fr/api/v2/interaction',
    IDP_NAME: 'fip1-low',
    IDP_ROOT_URL: 'https://fip1-low.docker.dev-franceconnect.fr',
    IDP_INTERACTION_URL:
      'https://fip1-low.docker.dev-franceconnect.fr/interaction',
    SP1_ROOT_URL: 'https://fsp1-low.docker.dev-franceconnect.fr',
    SP1_CLIENT_ID:
      '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950',
    SP1_ID: '#fsp1-low',
    WELL_KNOWN: '/api/v2/.well-known/openid-configuration',
    ALL_APPS_LISTED: 'https://docker.dev-franceconnect.fr/fcp-low.html',
  },
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  viewportHeight: 1000,
  viewportWidth: 1400,
  pageLoadTimeout: 30000,
});
