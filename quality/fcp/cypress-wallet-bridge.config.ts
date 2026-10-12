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
    specPattern: 'cypress/integration/wallet-bridge/*.feature',
  },
  expose: {
    ...baseConfig.expose,
    APP_LABEL: 'Wallet Bridge',
    // Base Configuration
    TEST_ENV: 'docker',
    TEST_PLATFORM: 'fcp-low',
    tags: '@walletBridge and not @ignore',
  },
});
