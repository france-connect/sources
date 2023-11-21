import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';
import baseConfig from './cypress-ud-base.config';

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config, false);
    },
    specPattern: 'cypress/integration/dashboard/*.feature',
  },
  env: {
    ...baseConfig.env,
    TAGS: '@userDashboard and not @validationVisuelle and not @ignore',
  },
});
