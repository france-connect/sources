/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-service-provider';

const env = new ConfigParser(process.env, 'App');

export default {
  assetsPaths: env.json('ASSETS_PATHS'),
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  defaultAcrValue: process.env.OidcClient_ACR,
  httpsOptions: {
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
  },
  name: 'MOCK_SERVICE_PROVIDER_FCP_LOW',
  urlPrefix: '',
  viewsPaths: env.json('VIEWS_PATHS'),
} as AppConfig;
