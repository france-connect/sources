/* ------------------------------------------------------------------
 *
 * Looking for updating the "identity providers selection as-in production" screen ?
 * Take a look into the README.md file
 *
 ------------------------------------------------------------------ */
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
  expose: {
    ...baseConfig.expose,
    APP_LABEL: 'FranceConnect',
    // Base Configuration
    TEST_ENV: 'docker',
    TEST_PLATFORM: 'fcp-low',
    tags: '@fcpLow and @validationVisuelle and not @ignore',
  },
});
