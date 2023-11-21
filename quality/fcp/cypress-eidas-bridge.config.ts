// Disable sort-keys to separate base configuration and access env variables
/* eslint-disable sort-keys-fix/sort-keys-fix, sort-keys */
import { defineConfig } from 'cypress';

import pluginConfig from './cypress/plugins';
import baseConfig from './cypress-fcp-high-base.config';

const FLOW_CONSISTENCY_GLOBAL = [
  'level',
  'time',
  'pid',
  'hostname',
  'event',
  'category',
  'step',
];

export default defineConfig({
  ...baseConfig,
  e2e: {
    ...baseConfig.e2e,
    async setupNodeEvents(on, config) {
      return await pluginConfig(on, config, false);
    },
    specPattern: 'cypress/integration/eidas-bridge/*.feature',
  },
  env: {
    ...baseConfig.env,
    TAGS: '@eidasBridge and not @ignore',
    // Test environment access

    // Other Configuration
    FLOW_CONSISTENCY_FR_EU: [
      {
        event: 'INCOMING_EIDAS_REQUEST',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeDst',
          'source',
          'sessionId',
          'logId',
        ],
      },
      {
        event: 'REDIRECT_TO_FC_AUTHORIZE',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'logId',
        ],
      },
      {
        event: 'RECEIVED_FC_AUTH_CODE',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'logId',
        ],
      },
      {
        event: 'REDIRECTING_TO_EIDAS_FR_NODE',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'eidasLevelReceived',
          'idpSub',
          'spSub',
          'logId',
        ],
      },
    ],
    FLOW_CONSISTENCY_EU_FR: [
      {
        event: 'INCOMING_FC_REQUEST',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'source',
          'sessionId',
          'logId',
        ],
      },
      {
        event: 'DISPLAYING_CITIZEN_COUNTRY_CHOICE',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'logId',
        ],
      },
      {
        event: 'SELECTED_CITIZEN_COUNTRY',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'logId',
        ],
      },
      {
        event: 'REDIRECTING_TO_FR_NODE',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'logId',
        ],
      },
      {
        event: 'INCOMING_EIDAS_RESPONSE',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'logId',
        ],
      },
      {
        event: 'REDIRECT_TO_FC',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'eidasLevelReceived',
          'idpSub',
          'spSub',
          'logId',
        ],
      },
      {
        event: 'RECEIVED_CALL_ON_TOKEN',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'eidasLevelReceived',
          'idpSub',
          'spSub',
          'logId',
        ],
      },
      {
        event: 'RECEIVED_CALL_ON_USERINFO',
        keys: [
          ...FLOW_CONSISTENCY_GLOBAL,
          'countryCodeSrc',
          'countryCodeDst',
          'source',
          'sessionId',
          'eidasLevelRequested',
          'eidasLevelReceived',
          'idpSub',
          'spSub',
          'logId',
        ],
      },
    ],
  },
});
