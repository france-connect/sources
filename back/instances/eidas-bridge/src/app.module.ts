import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { EidasBridgeModule } from '@fc/eidas-bridge';
import { LoggerModule } from '@fc/logger';
import { LoggerModule as LoggerLegacyModule } from '@fc/logger-legacy';
import {
  LoggerDebugPlugin,
  LoggerRequestPlugin,
  LoggerSessionPlugin,
} from '@fc/logger-plugins';

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
        ]), // 2.1 Load logger legacy module next for business logs
        LoggerLegacyModule,
        // 3. Load other modules
        EidasBridgeModule,
      ],
    };
  }
}
