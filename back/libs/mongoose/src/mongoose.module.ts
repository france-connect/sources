/* istanbul ignore file */

// Declarative code

import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  ModelDefinition,
  MongooseModule as MongooseNativeModule,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { DEFAULT_CONNECTION_NAME } from './constants';
import { MongooseProvider } from './providers';

@Global()
@Module({})
export class MongooseModule {
  static forRoot(connectionName = DEFAULT_CONNECTION_NAME): DynamicModule {
    const mongoose = MongooseNativeModule.forRootAsync({
      connectionName,
      inject: [LoggerService, ConfigService],
      useFactory: (
        logger: LoggerService,
        config: ConfigService,
      ): MongooseModuleOptions =>
        MongooseProvider.buildMongoParams(logger, config, connectionName),
    });
    return mongoose;
  }

  static forFeature(
    models: ModelDefinition[],
    connectionName = DEFAULT_CONNECTION_NAME,
  ): DynamicModule {
    const mongoose = MongooseNativeModule.forFeature(models, connectionName);
    return mongoose;
  }
}
