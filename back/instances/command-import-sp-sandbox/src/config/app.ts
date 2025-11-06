import { ConfigParser } from '@fc/config';

import { AppCliConfig } from '../dto';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'COMMAND-IMPORT-SP-SANDBOX',
  environment: env.string('ENVIRONMENT'),
  dsCsvPath: env.string('DS_CSV_PATH'),
  inviteEndpoint: env.string('INVITATION_ENDPOINT'),
  testEmail: env.string('TEST_EMAIL'),
  testInstanceId: env.string('TEST_INSTANCE_ID'),
} as AppCliConfig;
