import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@fc/config';
import { CsmrConfigClientModule } from '@fc/csmr-config-client';
import { HttpProxyModule } from '@fc/http-proxy';
import { LoggerModule } from '@fc/logger';
import { LoggerDebugPlugin } from '@fc/logger-plugins';
import { MongooseModule } from '@fc/mongoose';
import { ServiceProviderAdapterMongoModule } from '@fc/service-provider-adapter-mongo';
import { WebhooksModule } from '@fc/webhooks';

import { ImportSpSandboxCommand } from './commands';
import { CsvInputService, ImportService } from './services';

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
        // 3. Load other modules
        HttpModule,
        HttpProxyModule,
        MongooseModule.forRoot(),
        ServiceProviderAdapterMongoModule,
        CsmrConfigClientModule.registerFor('SandboxLow'),
        WebhooksModule,
      ],
      providers: [ImportSpSandboxCommand, CsvInputService, ImportService],
    };
  }
}
