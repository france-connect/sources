/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { DataProviderAdapterCoreConfig } from '@fc/data-provider-adapter-core';

const env = new ConfigParser(process.env, 'DataProviderAdapterCore');

export default {
  // Based on oidc standard
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_id: env.string('CLIENT_ID'),
  // Based on oidc standard
  // eslint-disable-next-line @typescript-eslint/naming-convention
  client_secret: env.string('CLIENT_SECRET'),
  checktokenEndpoint: env.string('CHECKTOKEN_ENDPOINT'),
} as DataProviderAdapterCoreConfig;
