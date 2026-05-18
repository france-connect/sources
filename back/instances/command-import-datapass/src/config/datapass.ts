import { ConfigParser } from '@fc/config';
import { DatapassConfig } from '@fc/datapass';

const env = new ConfigParser(process.env, 'Datapass');

export default {
  apiUrl: env.string('API_URL'),
  clientId: env.string('API_CLIENT_ID'),
  clientSecret: env.string('API_CLIENT_SECRET'),
} as DatapassConfig;
