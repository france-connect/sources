import { ConfigParser } from '@fc/config';

import { AppCliConfig } from '../dto';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'COMMAND-PRE-DEPLOY',
  basePath: env.string('BASEPATH'),
} as AppCliConfig;
