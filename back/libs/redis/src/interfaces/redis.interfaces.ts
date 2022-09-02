import RedisLib, { RedisOptions } from 'ioredis';

import { ModuleMetadata } from '@nestjs/common/interfaces';

export type Redis = RedisLib;

export interface RedisModuleOptions {
  config: RedisOptions;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<RedisModuleOptions>;
}
