import { AppConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'MOCK_RNIPP',
  urlPrefix: '',
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  environment: env.string('ENVIRONMENT'),
} as AppConfig;
