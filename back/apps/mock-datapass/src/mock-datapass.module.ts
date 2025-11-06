import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import { ViewTemplatesModule } from '@fc/view-templates';
import { WebhooksModule } from '@fc/webhooks';

import { MockDatapassController } from './controllers';
import { MockDatapassService } from './services';

@Module({
  imports: [
    AppModule,
    AsyncLocalStorageModule,
    WebhooksModule,
    HttpModule,
    HttpProxyModule,
    ExceptionsModule,
    ViewTemplatesModule,
  ],
  providers: [
    MockDatapassService,
    {
      provide: APP_FILTER,
      useClass: UnknownHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcWebHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  controllers: [MockDatapassController],
  exports: [MockDatapassService],
})
export class MockDatapassModule {}
