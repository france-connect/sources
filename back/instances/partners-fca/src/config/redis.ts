/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { RedisConfig } from '@fc/redis';

const env = new ConfigParser(process.env, 'Redis');

export default {
  host: env.string('HOST'),
  port: env.number('PORT'),
  password: env.string('PASSWORD'),
  db: env.number('DB'),
} as RedisConfig;
