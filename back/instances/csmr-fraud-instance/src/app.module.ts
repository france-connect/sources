/* istanbul ignore file */

// Declarative code

import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { CsmrFraudModule } from '@fc/csmr-fraud';
import { LoggerModule } from '@fc/logger';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule.forRoot(),
        // 3. Load other modules
        CsmrFraudModule,
      ],
    };
  }
}
