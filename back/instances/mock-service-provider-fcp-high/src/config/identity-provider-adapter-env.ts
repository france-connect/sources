/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { IdentityProviderAdapterEnvConfig } from '@fc/identity-provider-adapter-env';

const env = new ConfigParser(process.env, 'IdentityProviderAdapterEnv');

export default {
  list: [
    {
      uid: env.string('UID'),
      name: env.string('NAME'),
      title: env.string('TITLE'),
      active: true,
      display: true,
      discovery: env.boolean('DISCOVERY'),
      discoveryUrl: env.string('DISCOVERY_URL'),
      clientSecretEncryptKey: env.string('CLIENT_SECRET_CIPHER_PASS'),
      client: {
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: env.string('CLIENT_ID'),
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: env.string('CLIENT_SECRET'),
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response_types: ['code'],
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_signed_response_alg: env.string(
          'ID_TOKEN_SIGNED_RESPONSE_ALG',
        ),
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
        userinfo_signed_response_alg: env.string(
          'USERINFO_SIGNED_RESPONSE_ALG',
        ),
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
        //oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        token_endpoint_auth_method: env.string('TOKEN_ENDPOINT_AUTH_METHOD'),
        //oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        revocation_endpoint_auth_method: env.string(
          'REVOCATION_ENDPOINT_AUTH_METHOD',
        ),
      },
      issuer: {
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jwks_uri: env.string('JWKS_URI'),
      },
    },
  ],
} as IdentityProviderAdapterEnvConfig;
