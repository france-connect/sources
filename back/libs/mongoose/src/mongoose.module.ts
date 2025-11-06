import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import {
  ModelDefinition,
  MongooseModule as MongooseNativeModule,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { MongooseProvider } from './providers';

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
      global: true,
      imports: [...mongoose.imports, CqrsModule],
      providers: [EventBus],
    };
  }

  static forFeature(models: ModelDefinition[]): DynamicModule {
    const mongoose = MongooseNativeModule.forFeature(models);
    return {
      ...mongoose,
      imports: [CqrsModule],
      providers: [...mongoose.providers],
      exports: [...mongoose.exports],
    };
  }
}
