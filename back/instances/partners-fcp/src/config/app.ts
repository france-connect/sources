// Stryker disable all
/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/partners';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  httpsOptions: {
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
  },
  name: 'PARTNERS_FCP',
  urlPrefix: '/api',
} as AppConfig;
