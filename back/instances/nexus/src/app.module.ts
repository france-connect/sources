import { DynamicModule, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-debug-plugin';
import { LoggerRequestPlugin } from '@fc/logger-request-plugin';
import { NexusModule } from '@fc/nexus';

@Module({})
export class AppModule {
  static forRoot(configService: ConfigService): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot(configService),
        LoggerModule.forRoot([LoggerDebugPlugin, LoggerRequestPlugin]),
        NexusModule,
      ],
    };
  }
}
