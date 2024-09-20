/* istanbul ignore file */

// Declarative code
import { PartnersModule } from 'apps/partners/src';

import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
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
        ]),
        // 3. Load other modules
        PartnersModule,
      ],
    };
  }
}
