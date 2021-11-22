/* istanbul ignore file */

// Tested by DTO
import { RedisConfig } from '@fc/redis';

export default {
  host: process.env.FC_REDIS_HOST,
  port: parseInt(process.env.FC_REDIS_PORT, 10),
  password: process.env.FC_REDIS_PASSWORD,
  db: parseInt(process.env.FC_REDIS_DB, 10),
} as RedisConfig;
