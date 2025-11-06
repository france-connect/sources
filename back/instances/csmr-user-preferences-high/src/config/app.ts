import { ConfigParser } from '@fc/config';
import { AppRpcConfig } from '@fc/csmr-user-preferences';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'CSMR-USER-PREFERENCES-HIGH',
  aidantsConnectUid: env.string('AIDANTS_CONNECT_UID'),
  environment: env.string('ENVIRONMENT'),
} as AppRpcConfig;
