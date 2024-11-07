// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';
import baseConfig from './cypress-base.config';

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/eidas-bridge/*.feature',
  },
  env: {
    ...baseConfig.env,
    // Base Configuration
    PLATFORM: 'fcp-high',
    TEST_ENV: 'docker',
    TAGS: '@eidasBridge and not @ignore',
  },
});
