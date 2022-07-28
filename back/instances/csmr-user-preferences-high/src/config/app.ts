/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/csmr-user-preferences';

const env = new ConfigParser(process.env, 'App');

export default {
  aidantsConnectUid: env.string('AIDANTS_CONNECT_UID'),
} as AppConfig;
