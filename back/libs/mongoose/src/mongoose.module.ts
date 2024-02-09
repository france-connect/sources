/* istanbul ignore file */

// Declarative code

import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import {
  ModelDefinition,
  MongooseModule as MongooseNativeModule,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MongooseConnectionConnectedHandler } from './handlers';
import { MongooseCollectionOperationWatcherHelper } from './helpers';
import { MongooseProvider } from './providers';

@Global()
@Module({})
export class MongooseModule {
  static forRoot(): DynamicModule {
    const mongoose = MongooseNativeModule.forRootAsync({
      imports: [CqrsModule],
      inject: [LoggerService, ConfigService, EventBus],
      useFactory: (
        logger: LoggerService,
        config: ConfigService,
        eventBus: EventBus,
      ): MongooseModuleOptions =>
        MongooseProvider.buildMongoParams(logger, config, eventBus),
    });
    return {
      ...mongoose,
      imports: [...mongoose.imports, CqrsModule],
      providers: [
        EventBus,
        MongooseConnectionConnectedHandler,
        MongooseCollectionOperationWatcherHelper,
      ],
      exports: [MongooseCollectionOperationWatcherHelper],
    };
  }

  static forFeature(models: ModelDefinition[]): DynamicModule {
    const mongoose = MongooseNativeModule.forFeature(models);
    return {
      ...mongoose,
      imports: [CqrsModule],
      providers: [
        ...mongoose.providers,
        MongooseCollectionOperationWatcherHelper,
      ],
      exports: [...mongoose.exports, MongooseCollectionOperationWatcherHelper],
    };
  }
}
