/* istanbul ignore file */

import * as Redis from 'ioredis';

import { RedisModuleOptions } from './interfaces/redis.interfaces';

export const createRedisConnection = ({
  config,
}: RedisModuleOptions): Redis.Redis => new Redis(config);
