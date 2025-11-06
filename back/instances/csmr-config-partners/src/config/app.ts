import { AppRmqConfig } from '@fc/app';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'CSMR-CONFIG-PARTNERS',
  environment: env.string('ENVIRONMENT'),
} as AppRmqConfig;
