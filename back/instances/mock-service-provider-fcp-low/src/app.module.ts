import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-debug-plugin';
import { LoggerRequestPlugin } from '@fc/logger-request-plugin';
import { LoggerSessionPlugin } from '@fc/logger-session-plugin';
import { MockServiceProviderModule } from '@fc/mock-service-provider';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule.forRoot([
          LoggerDebugPlugin,
          LoggerRequestPlugin,
          LoggerSessionPlugin,
        ]), // 3. Load other modules
        MockServiceProviderModule,
      ],
    };
  }
}
