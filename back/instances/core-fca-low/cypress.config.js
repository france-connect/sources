// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginConfig = require('./cypress/plugins');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://core-fca-low.docker.dev-franceconnect.fr',
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/**/*.spec.js',
    excludeSpecPattern: 'cypress/integration/**/*.utils.js',
    supportFile: 'cypress/support/index.js',
    video: false,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
  },
  env: {
    APP_DOMAIN: 'core-fca-low.docker.dev-franceconnect.fr',
    APP_NAME: 'fca',
    LOG_FILE_PATH: '../../../docker/volumes/log/core-fca-low.log',
    FC_DOCKER_PATH: '../../../docker',
    FC_ROOT_URL: 'https://core-fca-low.docker.dev-franceconnect.fr',
    FC_INTERACTION_URL:
      'https://core-fca-low.docker.dev-franceconnect.fr/api/v2/interaction',
    IDP_NAME: 'fia',
    IDP_NAME_NOT_EXIST: 'not-fia',
    IDP_AVAILABLES: [
      {
        ID: '9c716f61-b8a1-435c-a407-ef4d677ec270',
        IDP_ROOT_URL: 'https://fia1-low.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fia1-low.docker.dev-franceconnect.fr/interaction',
        MINISTRY_NAME:
          'MOCK - Ministère de la transition écologique - ALL FIS - SORT 2',
        TITLE: 'Identity Provider 1 - eIDAS faible - ES256',
        EMAIL: 'test@fia1.fr',
      },
      {
        ID: '0e7c099f-fe86-49a0-b7d1-19df45397212',
        IDP_ROOT_URL: 'https://fia2-low.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fia2-low.docker.dev-franceconnect.fr/interaction',
        MINISTRY_NAME:
          'MOCK - Ministère de la transition écologique - ALL FIS - SORT 2',
        TITLE: 'Identity Provider 2 - eIDAS faible - RS256',
        EMAIL: 'test@fia2.fr',
      },
      {
        ID: '87762a76-7da0-442d-8243-5785f859b88b',
        IDP_ROOT_URL: 'https://fia4-low.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fia4-low.docker.dev-franceconnect.fr/interaction',
        MINISTRY_NAME: 'MOCK - Ministère de la mer - E2E - SORT 4',
        TITLE: 'Identity Provider 4 - eIDAS faible - HS256',
        EMAIL: 'test@fia4.fr',
      },
      {
        ID: '46f5d9f9-881d-46b1-bdcc-0548913ea443',
        IDP_ROOT_URL: 'https://fia5-low.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fia5-low.docker.dev-franceconnect.fr/interaction',
        MINISTRY_NAME: 'MOCK - Ministère de la mer - E2E - SORT',
        TITLE: 'Identity Provider 5 - eIDAS faible - RS256',
        EMAIL: 'test@fia5.fr',
      },
    ],
    SP_NAME: 'fsa',
    SP_AVAILABLES: [
      {
        ID: 'fsa1-low',
        SP_ROOT_URL: 'https://fsa1-low.docker.dev-franceconnect.fr',
        SP_CLIENT_ID:
          '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950',
      },
      {
        ID: 'fsa2-low',
        SP_ROOT_URL: 'https://fsa2-low.docker.dev-franceconnect.fr',
        SP_CLIENT_ID:
          '7a79e45107f9ccc6a3a5971d501220dc4fd9e87bb5e3fc62ce4104c756e22775',
      },
      {
        ID: 'fsa4-low',
        SP_ROOT_URL: 'https://fsa4-low.docker.dev-franceconnect.fr',
        SP_CLIENT_ID:
          '6495f347513b860e6b931fae4a1ba70c8489a558a0fc74ecdc094d48a4035e77',
      },
    ],
    WELL_KNOWN: '/api/v2/.well-known/openid-configuration',
  },
  chromeWebSecurity: false,
  viewportHeight: 1000,
  viewportWidth: 1400,
  pageLoadTimeout: 30000,
});
