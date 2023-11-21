/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-service-provider';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  assetsPaths: env.json('ASSETS_PATHS'),
  httpsOptions: {
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
  },
  fqdn: process.env.FQDN,
  name: 'MOCK_SERVICE_PROVIDER_FCP_HIGH',
  urlPrefix: '',
  viewsPaths: env.json('VIEWS_PATHS'),
  idpId: env.string('IDP_ID'),
  dataApis: env.json('DATA_APIS'),
} as AppConfig;
