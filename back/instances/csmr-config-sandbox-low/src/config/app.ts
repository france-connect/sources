import { AppRmqConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: env.root.string('APP_NAME'),
  environment: env.string('ENVIRONMENT'),
  updateProxy: env.boolean('UPDATE_PROXY'),
} as AppRmqConfig;
