/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { UserPreferencesFcpModule } from '@fc/user-preferences-fcp';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule,
        // 3. Load other modules
        UserPreferencesFcpModule,
      ],
    };
  }
}
