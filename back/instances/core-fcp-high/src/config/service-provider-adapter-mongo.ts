/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';

const env = new ConfigParser(process.env, 'AdapterMongo');

export default {
  clientSecretEncryptKey: env.string('CLIENT_SECRET_CIPHER_PASS'),
} as ServiceProviderAdapterMongoConfig;
