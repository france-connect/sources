import { AppCliConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: env.string('NAME'),
  environment: env.string('ENVIRONMENT'),
} as AppCliConfig;
