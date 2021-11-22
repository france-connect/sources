import * as Redis from 'ioredis';

import { ModuleMetadata } from '@nestjs/common/interfaces';

export type Redis = Redis.Redis;

export interface RedisModuleOptions {
  config: Redis.RedisOptions;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<RedisModuleOptions>;
}
