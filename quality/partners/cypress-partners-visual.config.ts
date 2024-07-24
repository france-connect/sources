import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';
import baseConfig from './cypress-partners-base.config';

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config, true);
    },
    specPattern: 'cypress/integration/*.feature',
  },
  env: {
    ...baseConfig.env,
    TAGS: '@validationVisuelle and not @ignore',
  },
});
