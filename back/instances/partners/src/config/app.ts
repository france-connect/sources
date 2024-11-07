/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/partners';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: env.string('NAME'),
  urlPrefix: '/api',
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: env.string('FQDN'),
  timezone: 'Europe/Paris',
  agentConnectIdpHint: env.string('IDP_ID'),
  environment: env.string('ENVIRONMENT'),
} as AppConfig;
