import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { ConfigMongoAdapterProvider } from '@fc/config-mongo-adapter';
import { CsmrHsmClientModule } from '@fc/csmr-hsm-client';
import { CsmrImportCoreModule } from '@fc/csmr-import-core';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-plugins';
import { MongooseModule } from '@fc/mongoose';

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
        CsmrImportCoreModule.register(ConfigMongoAdapterProvider),
        CsmrHsmClientModule,
        MongooseModule.forRoot(),
      ],
    };
  }
}
