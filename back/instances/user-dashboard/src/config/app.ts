import { AppConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'USER-DASHBOARD',
  urlPrefix: '/api',
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: process.env.FQDN,
  timezone: 'Europe/Paris',
  idpId: env.string('IDP_ID'),
  environment: env.string('ENVIRONMENT'),
} as AppConfig;
