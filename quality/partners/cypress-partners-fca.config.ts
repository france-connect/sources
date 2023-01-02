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
    specPattern: 'cypress/integration/**/*.feature',
    supportFile: 'cypress/support/index.ts',
    video: false,
  },
  env: {
    // Base Configuration
    BASE_URLS: {
      recette: 'https://recette.dev-franceconnect.fr',
    },
    PLATFORM: 'partners-fca',
    TEST_ENV: 'docker',
    TAGS: 'not @fcp and not @ignoreFca',
    // Test environment access (TBD)
  },
});
