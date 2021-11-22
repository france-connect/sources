/* istanbul ignore file */

// Tested by DTO
import { hostname } from 'os';

import { ConfigParser } from '@fc/config';
/**
 * Rename this librairy into a more appropriate name `adapter`, `mongo`
 * @TODO #246 ETQ Dev, j'ai des application avec un nommage précis et explicite
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/246
 */
import { ServiceProviderAdapterEnvConfig } from '@fc/service-provider-adapter-env';

const env = new ConfigParser(process.env, 'ServiceProviderAdapterEnv');

export default {
  active: true,
  name: hostname(),
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  redirect_uris: env.json('REDIRECT_URIS'),
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  post_logout_redirect_uris: env.json('POST_LOGOUT_REDIRECT_URIS'),
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: env.string('CLIENT_SECRET'),
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: env.string('CLIENT_ID'),
  scope: env.string('SCOPE'),
  // openid defined property names
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_signed_response_alg: env.string('ID_TOKEN_SIGNED_RESPONSE_ALG'),
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_alg: env.string(
    'ID_TOKEN_ENCRYPTED_RESPONSE_ALG',
  ),
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_token_encrypted_response_enc: env.string(
    'ID_TOKEN_ENCRYPTED_RESPONSE_ENC',
  ),
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_signed_response_alg: env.string('USERINFO_SIGNED_RESPONSE_ALG'),
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_alg: env.string(
    'USERINFO_ENCRYPTED_RESPONSE_ALG',
  ),
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  userinfo_encrypted_response_enc: env.string(
    'USERINFO_ENCRYPTED_RESPONSE_ENC',
  ),
  // oidc param name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jwks_uri: env.string('JWKS_URI'),
} as ServiceProviderAdapterEnvConfig;
