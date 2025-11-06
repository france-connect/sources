import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-datapass';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'MOCK_DATAPASS',
  urlPrefix: '',
  assetsPaths: env.json('ASSETS_PATHS'),
  assetsDsfrPaths: env.json('DSFR_ASSETS_PATHS'),
  assetsCacheTtl: env.number('ASSETS_CACHE_TTL'),
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  environment: env.string('ENVIRONMENT'),
  webhookUrl: env.string('WEBHOOK_URL'),
} as AppConfig;
