/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { DataProviderAdapterCoreConfig } from '@fc/data-provider-adapter-core';

const env = new ConfigParser(process.env, 'DataProviderAdapterCore');

export default {
  client_id: env.string('CLIENT_ID'),
  client_secret: env.string('CLIENT_SECRET'),
  checktokenEndpoint: env.string('CHECKTOKEN_ENDPOINT'),
  checktokenSignedResponseAlg: env.string('CHECKTOKEN_JWT_SIGNED_RESPONSE_ALG'),
  checktokenEncryptedResponseAlg: env.string(
    'CHECKTOKEN_JWT_ENCRYPTED_RESPONSE_ALG',
  ),
  checktokenEncryptedResponseEnc: env.string(
    'CHECKTOKEN_JWT_ENCRYPTED_RESPONSE_ENC',
  ),
  jwks: {
    keys: env.json('JWKS'),
  },
  jwksEndpoint: env.string('JWKS_ENDPOINT'),
  issuer: env.string('ISSUER'),
} as DataProviderAdapterCoreConfig;
