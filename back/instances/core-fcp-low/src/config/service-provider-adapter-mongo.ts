import { ConfigParser } from '@fc/config';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';

const env = new ConfigParser(process.env, 'AdapterMongo');

export default {
  clientSecretEncryptKey: env.string('CLIENT_SECRET_CIPHER_PASS'),
  platform: env.string('PLATFORM'),
  urlsRequireTld: env.boolean('URL_REQUIRE_TLD'),
} as ServiceProviderAdapterMongoConfig;
