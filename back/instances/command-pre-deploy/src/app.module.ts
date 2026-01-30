import { DynamicModule, Global, Module } from '@nestjs/common';

import { EnvService } from '@fc/common';
import { ConfigModule, ConfigService } from '@fc/config';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-debug-plugin';

import { PreDeployCommand } from './commands';
import { CommandPreDeployService } from './services';

@Global()
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
      ],
      providers: [EnvService, PreDeployCommand, CommandPreDeployService],
    };
  }
}
