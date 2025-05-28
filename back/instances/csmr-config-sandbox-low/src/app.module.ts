import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { ConfigMongoAdapterProvider } from '@fc/config-mongo-adapter';
import { CsmrConfigModule } from '@fc/csmr-config';
import { CsmrConfigClientModule } from '@fc/csmr-config-client';
import { CsmrProxyClientModule } from '@fc/csmr-proxy-client';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-plugins';
import { MongooseModule } from '@fc/mongoose';

import {
  ConfigPublicationFailureEventHandler,
  ConfigPublishedEventHandler,
} from './handlers';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule.forRoot([LoggerDebugPlugin]),
        // 3. Load other modules
        MongooseModule.forRoot(),
        CsmrConfigModule.register(ConfigMongoAdapterProvider),
        CsmrConfigClientModule.registerFor('Partners'),
        CsmrProxyClientModule,
      ],
      providers: [
        ConfigPublishedEventHandler,
        ConfigPublicationFailureEventHandler,
      ],
    };
  }
}
