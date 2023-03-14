/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { DataProviderCoreAuthConfig } from '@fc/data-provider-core-auth';
import { fcTracks } from '@fc/scopes';

const env = new ConfigParser(process.env, 'DataProviderCoreAuth');
const [connexionTracks] = fcTracks.scopes.connexion_tracks;

export default {
  tokenEndpoint: env.string('TOKEN_ENDPOINT'),
  scope: connexionTracks,
} as DataProviderCoreAuthConfig;
