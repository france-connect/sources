/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { DataProviderCoreAuthConfig } from '@fc/data-provider-core-auth';

const env = new ConfigParser(process.env, 'DataProviderCoreAuth');

export default {
  tokenEndpoint: env.string('TOKEN_ENDPOINT'),
  scope: 'connexion_tracks',
} as DataProviderCoreAuthConfig;
