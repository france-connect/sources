import { AppConfig } from '@fc/bridge-http-proxy';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'RIE_BRIDGE_PROXY',
  urlPrefix: '',
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  environment: env.string('ENVIRONMENT'),
} as AppConfig;
