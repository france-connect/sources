import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { DatapassModule } from '@fc/datapass';
import { HttpProxyModule } from '@fc/http-proxy';
import { LoggerModule } from '@fc/logger';
import { WebhooksModule } from '@fc/webhooks';

import { ImportDatapassCommand } from './commands';
import { ImportDatapassService } from './services';

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
        LoggerModule.forRoot(),
        // 3. Load other modules
        DatapassModule,
        WebhooksModule,
        HttpModule,
        HttpProxyModule,
      ],
      providers: [ImportDatapassCommand, ImportDatapassService],
    };
  }
}
