// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';

export default defineConfig({
  chromeWebSecurity: false,
  video: false,
  e2e: {
    baseUrl: 'https://docker.dev-franceconnect.fr',
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/**/*.feature',
    supportFile: 'cypress/support/index.ts',
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
  },
  env: {
    // Base Configuration
    PLATFORM: 'partners-fca',
    TEST_ENV: 'docker',
    TAGS: 'not @fcp and not @ignoreFca',
    // Test environment access (TBD)
  },
});
