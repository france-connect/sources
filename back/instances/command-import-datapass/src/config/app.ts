import { ConfigParser } from '@fc/config';

import { AppCliConfig } from '../dto';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'COMMAND-IMPORT-DATAPASS',
  environment: env.string('ENVIRONMENT'),
} as AppCliConfig;
