// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';

export default defineConfig({
  e2e: {
    baseUrl: 'https://docker.dev-franceconnect.fr',
    setupNodeEvents(on, config) {
      return pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/eidas-bridge/*.feature',
    supportFile: 'cypress/support/index.ts',
    video: false,
  },
  env: {
    // Base Configuration
    BASE_URLS: {
      recette: 'https://recette.dev-franceconnect.fr',
    },
    PLATFORM: 'fcp-high',
    TEST_ENV: 'docker',
    TAGS: '@eidasBridge and not @ignore',
    // Test environment access

    // Other Configuration
    LOG_FILE_PATH: "../../docker/volumes/log/core-fcp-high.log",
    EIDAS_LOG_FILE_PATH: "../../docker/volumes/log/eidas-bridge.log",
  },
});
