/* istanbul ignore file */

import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from './interfaces/redis.interfaces';
import {
  REDIS_MODULE_CONNECTION_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from './redis.constants';
import { createRedisConnection } from './redis.utils';

@Module({})
export class RedisFactoryModule {
  public static createOptionsProvider({
    useFactory,
    inject,
  }: RedisModuleAsyncOptions): Provider {
    if (!useFactory) {
      throw new Error('Invalid configuration. Must provide useFactory');
    }

    return {
      provide: REDIS_MODULE_OPTIONS_TOKEN,
      useFactory: useFactory,
      inject: inject || [],
    };
  }

  public static createAsyncProviders(
    options: RedisModuleAsyncOptions,
  ): Provider[] {
    const { useFactory } = options;

    if (!useFactory) {
      throw new Error('Invalid configuration. Must provide useFactory');
    }

    return [this.createOptionsProvider(options)];
  }

  public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const redisConnectionProvider: Provider = {
      provide: REDIS_MODULE_CONNECTION_TOKEN,
      useFactory(options: RedisModuleOptions) {
        return createRedisConnection(options);
      },
      inject: [REDIS_MODULE_OPTIONS_TOKEN],
    };

    return {
      module: RedisFactoryModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        redisConnectionProvider,
      ],
      exports: [redisConnectionProvider],
    };
  }
}
