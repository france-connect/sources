/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { DataProviderAdapterMongoConfig } from '@fc/data-provider-adapter-mongo';

const env = new ConfigParser(process.env, 'AdapterMongo');

export default {
  clientSecretEncryptKey: env.string('CLIENT_SECRET_CIPHER_PASS'),
  decryptClientSecretFeature: env.boolean('DECRYPT_CLIENT_SECRET_FEATURE'),
} as DataProviderAdapterMongoConfig;
