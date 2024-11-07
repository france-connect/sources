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
    specPattern:
      'cypress/integration/{accessibilité,api,usager,exploitation}/*.feature',
  },
  env: {
    ...baseConfig.env,
    // Base Configuration
    PLATFORM: 'fcp-low',
    TAGS: '@fcpLow and not @ignoreLow',
    TEST_ENV: 'docker',
  },
});
