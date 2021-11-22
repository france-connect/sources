import { ApacheIgniteConfig } from '@fc/apache-ignite';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'ApacheIgnite');

export default {
  endpoint: env.string('ENDPOINT'),
} as ApacheIgniteConfig;
