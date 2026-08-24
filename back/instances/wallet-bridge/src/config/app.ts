import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/wallet-bridge';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'WALLET_BRIDGE',
  urlPrefix: '',
  assetsUrlPrefix: env.string('ASSETS_URL_PREFIX'),
  assetsUrlDomain: env.string('ASSETS_URL_DOMAIN'),
  assetsPaths: env.json('ASSETS_PATHS'),
  assetsCacheTtl: env.number('ASSETS_CACHE_TTL'),
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: env.string('FQDN'),
  timezone: 'Europe/Paris',
  environment: env.string('ENVIRONMENT'),
  showDevTools: env.boolean('SHOW_DEV_TOOLS'),
  devToolsMockUrl: env.string('DEV_TOOLS_MOCK_URL'),
} as AppConfig;
