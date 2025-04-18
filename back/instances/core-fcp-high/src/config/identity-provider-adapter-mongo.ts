import { ConfigParser } from '@fc/config';
import { IdentityProviderAdapterMongoConfig } from '@fc/identity-provider-adapter-mongo';

const env = new ConfigParser(process.env, 'AdapterMongo');

export default {
  clientSecretEncryptKey: env.string('CLIENT_SECRET_CIPHER_PASS'),
  decryptClientSecretFeature: env.boolean('DECRYPT_CLIENT_SECRET_FEATURE'),
  disableIdpValidationOnLegacy: env.boolean('DISABLE_IDP_VALIDATION_ON_LEGACY'),
  allowedAcr: ['eidas2', 'eidas3'],
} as IdentityProviderAdapterMongoConfig;
