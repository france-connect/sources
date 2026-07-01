import { hostname } from 'os';

import { ConfigParser } from '@fc/config';
import { ServiceProvider } from '@fc/service-provider-adapter-env';

const env = new ConfigParser(process.env, 'ServiceProviderAdapterEnvLow');

export default {
  active: true,
  name: hostname(),
  redirect_uris: env.json('REDIRECT_URIS'),
  post_logout_redirect_uris: env.json('POST_LOGOUT_REDIRECT_URIS'),
  client_secret: env.string('CLIENT_SECRET'),
  client_id: env.string('CLIENT_ID'),
  scope: env.string('SCOPE'),
  id_token_signed_response_alg: env.string('ID_TOKEN_SIGNED_RESPONSE_ALG'),
  id_token_encrypted_response_alg: '',
  id_token_encrypted_response_enc: '',
  userinfo_signed_response_alg: env.string('USERINFO_SIGNED_RESPONSE_ALG'),
  userinfo_encrypted_response_alg: '',
  userinfo_encrypted_response_enc: '',
  jwks_uri: env.string('JWKS_URI'),
} as ServiceProvider;
