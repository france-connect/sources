/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { RedisConfig } from '@fc/redis';

const env = new ConfigParser(process.env, 'Redis');

const tlsSettings = {
  ca: env.file('CACERT'),
};

export default {
  host: env.string('HOST'),
  port: env.number('PORT'),
  password: env.string('PASSWORD'),
  db: env.number('DB'),
  sentinels: env.json('SENTINELS'),
  sentinelPassword: env.string('SENTINEL_PASSWORD'),
  name: env.string('NAME'),
  sentinelTLS: tlsSettings,
  tls: tlsSettings,
  enableTLSForSentinelMode: env.boolean('ENABLE_TLS_FOR_SENTINEL_MODE'),
} as RedisConfig;
