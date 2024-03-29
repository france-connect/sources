import { ApacheIgniteConfig } from '@fc/apache-ignite';
import { ConfigParser } from '@fc/config';

const env = new ConfigParser(process.env, 'ApacheIgnite');

export default {
  endpoint: env.string('ENDPOINT'),
  socketKeepAlive: {
    enable: env.boolean('SOCKET_KEEP_ALIVE_ENABLE'),
    initialDelay: env.number('SOCKET_KEEP_ALIVE_INITIAL_DELAY'),
  },
  tls: {
    key: env.file('TLS_KEY'),
    cert: env.file('TLS_CERT'),
    ca: env.file('TLS_CA', { optional: true }),
    useTls: env.boolean('USE_TLS'),
  },
  auth: {
    username: env.string('USERNAME'),
    password: env.string('PASSWORD'),
  },
  maxRetryTimeout: env.number('MAX_RETRY_TIMEOUT'),
} as ApacheIgniteConfig;
