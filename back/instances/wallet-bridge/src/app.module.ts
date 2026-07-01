import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-debug-plugin';
import { LoggerModule as LoggerLegacyModule } from '@fc/logger-legacy';
import { LoggerRequestPlugin } from '@fc/logger-request-plugin';
import { WalletBridgeModule } from '@fc/wallet-bridge';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(configService),
        LoggerModule.forRoot([LoggerDebugPlugin, LoggerRequestPlugin]),
        LoggerLegacyModule,
        WalletBridgeModule,
      ],
    };
  }
}
