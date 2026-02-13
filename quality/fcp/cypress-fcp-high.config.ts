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
    specPattern:
      'cypress/integration/{accessibilité,api,usager,exploitation}/*.feature',
  },
  env: {
    ...baseConfig.env,
    APP_LABEL: 'FranceConnect+',
    // Other Configuration
    LOG_FILE_PATH: `${process.env.LOG_VOLUMES_DIR}/core-fcp-high.log`,
    // Base Configuration
    PLATFORM: 'fcp-high',
    TAGS: '@fcpHigh and not @ignoreHigh',
    TEST_ENV: 'docker',
  },
});
