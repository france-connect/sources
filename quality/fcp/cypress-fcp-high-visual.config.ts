/* ------------------------------------------------------------------
 *
 * Looking for updating the "identity providers selection as-in production" screen ?
 * Take a look into the README.md file
 *
 ------------------------------------------------------------------ */
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
    specPattern: 'cypress/integration/visuel/*.feature',
  },
  env: {
    ...baseConfig.env,
    // Other Configuration
    LOG_FILE_PATH: '../../docker/volumes/log/core-fcp-high.log',
    // Base Configuration
    PLATFORM: 'fcp-high',
    TAGS: '@fcpHigh and @validationVisuelle and not @ignore',
    TEST_ENV: 'docker',
  },
});
