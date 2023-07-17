/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { IdentityProviderAdapterEnvConfig } from '@fc/identity-provider-adapter-env';

const env = new ConfigParser(process.env, 'IdentityProviderAdapterEnv');

export default {
  discovery: false,
  // No discovery URL for legacy core
  discoveryUrl: undefined,
  provider: {
    issuer: env.string('ISSUER'),
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id: env.string('CLIENT_ID'),
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret: env.string('CLIENT_SECRET'),
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    authorization_endpoint: env.string('AUTHORIZATION_ENDPOINT'),
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint: env.string('TOKEN_ENDPOINT'),
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_endpoint: env.string('USERINFO_ENDPOINT'),
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_types: ['code'],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_signed_response_alg: 'HS256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_enc: 'plain',

    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jwks_uri: env.string('JWKS_URI'),
    //oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint_auth_method: env.string('TOKEN_ENDPOINT_AUTH_METHOD'),
    //oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    revocation_endpoint_auth_method: env.string(
      'REVOCATION_ENDPOINT_AUTH_METHOD',
    ),
    //oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    end_session_endpoint: env.string('END_SESSION_ENDPOINT'),
  },
  clientSecretEncryptKey: env.string('CLIENT_SECRET_CIPHER_PASS'),
} as IdentityProviderAdapterEnvConfig;
