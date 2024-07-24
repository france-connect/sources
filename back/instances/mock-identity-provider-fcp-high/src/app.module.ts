import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { LoggerRequestPlugin } from '@fc/logger-plugins';
import { MockIdentityProviderModule } from '@fc/mock-identity-provider';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        // 1. Load config module first
        ConfigModule.forRoot(configService),
        // 2. Load logger module next
        LoggerModule.forRoot([LoggerRequestPlugin]),
        // 3. Load other modules
        MockIdentityProviderModule,
      ],
    };
  }
}
