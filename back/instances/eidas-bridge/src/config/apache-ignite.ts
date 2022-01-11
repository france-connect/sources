import { ApacheIgniteConfig } from '@fc/apache-ignite';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'ApacheIgnite');

export default {
  endpoint: env.string('ENDPOINT'),
  socketKeepAlive: {
    enable: env.boolean('SOCKET_KEEP_ALIVE_ENABLE'),
    initialDelay: env.number('SOCKET_KEEP_ALIVE_INITIAL_DELAY'),
  },
} as ApacheIgniteConfig;
