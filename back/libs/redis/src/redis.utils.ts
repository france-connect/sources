import Redis from 'ioredis';

import { RedisModuleOptions } from './interfaces/redis.interfaces';

export const createRedisConnection = ({ config }: RedisModuleOptions): Redis =>
  new Redis(config);
