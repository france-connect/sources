/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule, FcWebHtmlExceptionFilter } from '@fc/exceptions';
import { RabbitmqModule } from '@fc/rabbitmq';
import { ViewTemplateService } from '@fc/view-templates';

import { BridgeHttpProxyController } from './controllers';
import { BridgeHttpProxyService } from './services';

@Global()
@Module({
  imports: [
    AsyncLocalStorageModule,
    ExceptionsModule,
    RabbitmqModule.registerFor('BridgeProxy'),
  ],
  controllers: [BridgeHttpProxyController],
  providers: [
    BridgeHttpProxyService,
    ViewTemplateService,
    FcWebHtmlExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcWebHtmlExceptionFilter,
    },
  ],
  exports: [],
})
export class BridgeHttpProxyModule {}
