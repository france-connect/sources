// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress')

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pluginConfig = require('./cypress/plugins');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://core-fcp-high.docker.dev-franceconnect.fr',
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/**/*.js',
    excludeSpecPattern: 'cypress/integration/**/*.utils.js',
    supportFile: 'cypress/support/index.js',
    video: false,
  },
  env: {
    APP_DOMAIN: 'core-fcp-high.docker.dev-franceconnect.fr',
    APP_NAME: 'core-fcp-high',
    LOG_FILE_PATH: '../../../docker/volumes/log/core-fcp-high.log',
    LOG_CONSOLE_FILE_PATH:
      '../../../docker/volumes/log/core-fcp-high-console-0.log',
    FC_DOCKER_PATH: '../../../docker',
    FC_ROOT_URL: 'https://core-fcp-high.docker.dev-franceconnect.fr',
    FC_INTERACTION_URL:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/interaction',
    IDP_NAME: 'fip',
    IDP_AVAILABLES: [
      {
        ID: 'dedc7160-8811-4d0f-9dd7-c072c15f2f18',
        IDP_ROOT_URL: 'https://fip1-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip1-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: 'f9a3f6fe-f9b3-4cec-b787-33713fdffc79',
        IDP_ROOT_URL: 'https://fip2-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip2-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '2031310b-186e-4643-944a-00efb9d59e0f',
        IDP_ROOT_URL: 'https://fip6-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip6-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '8456c460-f89b-4744-93cf-e0b6ac694075',
        IDP_ROOT_URL: 'https://fip13-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip13-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '81e3c37a-e7ea-43be-aa7a-0ed28a1a6e47',
        IDP_ROOT_URL: 'https://fip14-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip14-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '4c3e8c0d-12e3-46c2-bef8-5cb7b0702c9d',
        IDP_ROOT_URL: 'https://fip15-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip15-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: 'f403044b-fcd3-46f2-a87b-30e65f8e7bfe',
        IDP_ROOT_URL: 'https://fip16-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip16-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '913ef56e-0997-4e25-bc55-19a20d6e0532',
        IDP_ROOT_URL: 'https://fip17-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip17-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '8aa849db-8402-4f2e-bad9-7471dd21ff94',
        IDP_ROOT_URL: 'https://fip18-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip18-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '3c8776ae-5278-425b-8e97-7f01eadd22a0',
        IDP_ROOT_URL: 'https://fip19-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip19-high.docker.dev-franceconnect.fr/interaction',
      },
      {
        ID: '7d35f733-a3d0-49c1-9a6f-b9f4800b0b7a',
        IDP_ROOT_URL: 'https://fip20-high.docker.dev-franceconnect.fr',
        IDP_INTERACTION_URL:
          'https://fip20-high.docker.dev-franceconnect.fr/interaction',
      },
    ],
    SP1_ID: '#fsp1-high',
    SP1_ROOT_URL: 'https://fsp1-high.docker.dev-franceconnect.fr',
    SP1_CLIENT_ID:
      '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39950',
    SP2_ID: '#fsp2-high',
    SP2_ROOT_URL: 'https://fsp2-high.docker.dev-franceconnect.fr',
    SP2_CLIENT_ID:
      '7a79e45107f9ccc6a3a5971d501220dc4fd9e87bb5e3fc62ce4104c756e22775',
    SP5_ID: '#fsp5-high',
    SP5_ROOT_URL: 'https://fsp5-high.docker.dev-franceconnect.fr',
    SP5_CLIENT_ID:
      '6925fb8143c76eded44d32b40c0cb1006065f7f003de52712b78985704f39555',
    SP6_ID: '#fsp6-high',
    SP6_ROOT_URL: 'https://fsp6-high.docker.dev-franceconnect.fr',
    WELL_KNOWN: '/api/v2/.well-known/openid-configuration',
    ALL_APPS_LISTED: 'https://docker.dev-franceconnect.fr/fcp.html',
    EXPLOITATION: [
      {
        USER_NAME: 'jean_patoche',
        USER_PASS: 'georgesmoustaki',
        ROLE: 'operator',
      },
      {
        USER_NAME: 'jean_moust',
        USER_PASS: 'georgesmoustaki',
        ROLE: 'admin',
      },
    ],
    SECRET_TOTP: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
  },
  chromeWebSecurity: false,
  videoUploadOnPasses: false,
  viewportHeight: 1000,
  viewportWidth: 1400,
  pageLoadTimeout: 30000,
});
