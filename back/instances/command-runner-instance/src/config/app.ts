import { AppCliConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'COMMAND-RUNNER',
  environment: env.string('ENVIRONMENT'),
} as AppCliConfig;
