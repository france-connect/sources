import { defineConfig } from 'cypress';

import pluginConfig from '../plugins';
import baseConfig from './cypress-base.config';

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config);
    },
    specPattern: 'cypress/integration/visuel/*.feature',
  },
  env: {
    ...baseConfig.env,
    APP_LABEL: 'eIDAS Bridge',
    // Base Configuration
    PLATFORM: 'fcp-high',
    TAGS: '@eidasBridge and @validationVisuelle and not @ignore',
    TEST_ENV: 'docker',
  },
});
