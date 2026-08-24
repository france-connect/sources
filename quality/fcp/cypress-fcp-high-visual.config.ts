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
  env: {
    ...baseConfig.env,
    APP_LABEL: 'FranceConnect+',
    // Other Configuration
    LOG_FILE_PATH: `${process.env.LOG_VOLUMES_DIR}/core-fcp-high.log`,
    // Base Configuration
    TAGS: '@fcpHigh and @validationVisuelle and not @ignore',
    TECHNICAL_LOG_FILE_PATH: `${process.env.LOG_VOLUMES_DIR}/core-fcp-high-out.log`,
    TEST_ENV: 'docker',
    TEST_PLATFORM: 'fcp-high',
  },
});
