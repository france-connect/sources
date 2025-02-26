import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { ConfigPostgresAdapterProvider } from '@fc/config-postgres-adapter/providers';
import { CsmrConfigModule } from '@fc/csmr-config';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-plugins';
import { PostgresModule } from '@fc/postgres';

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
        PostgresModule,
        CsmrConfigModule.register(ConfigPostgresAdapterProvider),
      ],
    };
  }
}
