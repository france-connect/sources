/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-data-provider';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: process.env.APP_NAME,
  urlPrefix: '/api',
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  apiAuthSecret: env.string('API_AUTH_SECRET'),
} as AppConfig;
