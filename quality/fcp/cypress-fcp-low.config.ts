import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';
import baseConfig from './cypress-fcp-low-base.config';

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config, false);
    },
    specPattern:
      'cypress/integration/{accessibilité,usager,exploitation}/*.feature',
  },
  env: {
    ...baseConfig.env,
    TAGS: 'not @ignoreLow and not @fcpHigh',
  },
});
