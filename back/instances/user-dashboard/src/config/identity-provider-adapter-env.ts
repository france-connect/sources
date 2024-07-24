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
        client_id: env.string('CLIENT_ID'),
        client_secret: env.string('CLIENT_SECRET'),
        response_types: ['code'],
        id_token_signed_response_alg: env.string(
          'ID_TOKEN_SIGNED_RESPONSE_ALG',
        ),
        id_token_encrypted_response_alg: env.string(
          'ID_TOKEN_ENCRYPTED_RESPONSE_ALG',
        ),
        id_token_encrypted_response_enc: env.string(
          'ID_TOKEN_ENCRYPTED_RESPONSE_ENC',
        ),
        userinfo_signed_response_alg: env.string(
          'USERINFO_SIGNED_RESPONSE_ALG',
        ),
        userinfo_encrypted_response_alg: env.string(
          'USERINFO_ENCRYPTED_RESPONSE_ALG',
        ),
        userinfo_encrypted_response_enc: env.string(
          'USERINFO_ENCRYPTED_RESPONSE_ENC',
        ),
        token_endpoint_auth_method: env.string('TOKEN_ENDPOINT_AUTH_METHOD'),
        revocation_endpoint_auth_method: env.string(
          'REVOCATION_ENDPOINT_AUTH_METHOD',
        ),
      },
      issuer: {
        jwks_uri: env.string('JWKS_URI'),
      },
    },
  ],
} as IdentityProviderAdapterEnvConfig;
