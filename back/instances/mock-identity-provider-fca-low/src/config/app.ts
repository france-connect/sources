/* istanbul ignore file */

// Tested by DTO

import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-identity-provider';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  citizenDatabasePath: env.string('CITIZEN_DATABASE_PATH'),
  csvBooleanColumns: ['is_service_public'],
  scenariosDatabasePath: env.string('SCENARIOS_DATABASE_PATH'),
  httpsOptions: {
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
  },
  name: 'MOCK_IDENTITY_PROVIDER_FCA_LOW',
  urlPrefix: '',
  passwordVerification: env.boolean('PASSWORD_VERIFICATION'),
} as AppConfig;
