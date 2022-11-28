/* istanbul ignore file */

// Tested by DTO
import { AppConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: 'fcplus',
  urlPrefix: '/api/v2',
  assetsPaths: env.json('ASSETS_PATHS'),
  assetsCacheTtl: env.number('ASSETS_CACHE_TTL'),
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: process.env.FQDN,
  udFqdn: process.env.UD_FQDN,
} as AppConfig;
