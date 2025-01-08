import { ConfigParser } from '@fc/config';
import { AppRpcConfig } from '@fc/csmr-user-preferences';

const env = new ConfigParser(process.env, 'App');

export default {
  name: process.env.APP_NAME,
  aidantsConnectUid: env.string('AIDANTS_CONNECT_UID'),
  environment: env.string('ENVIRONMENT'),
} as AppRpcConfig;
