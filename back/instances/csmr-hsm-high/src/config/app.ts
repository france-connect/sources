import { AppRmqConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'CSMR-HSM-HIGH',
  environment: env.string('ENVIRONMENT'),
} as AppRmqConfig;
