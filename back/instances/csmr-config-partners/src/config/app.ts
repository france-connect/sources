import { AppRmqConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: process.env.APP_NAME,
  environment: env.string('ENVIRONMENT'),
} as AppRmqConfig;
