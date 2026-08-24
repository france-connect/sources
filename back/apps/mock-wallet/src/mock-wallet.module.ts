import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  IsEqualToConfigConstraint,
  IsIncludedInConfigConstraint,
} from '@fc/common';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { JwtModule } from '@fc/jwt';
import { MdocModule } from '@fc/mdoc';
import { ViewTemplatesModule } from '@fc/view-templates';

import { MockWalletController } from './controllers';
import {
  IdentityService,
  MockWalletCryptoService,
  MockWalletFlowService,
  PresentationService,
  RequestObjectService,
  WalletDocumentService,
  WalletResponseService,
} from './services';

@Module({
  imports: [
    AppModule,
    AsyncLocalStorageModule,
    ExceptionsModule,
    ViewTemplatesModule,
    JwtModule,
    MdocModule,
  ],
  controllers: [MockWalletController],
  providers: [
    MockWalletFlowService,
    RequestObjectService,
    IdentityService,
    PresentationService,
    WalletDocumentService,
    WalletResponseService,
    MockWalletCryptoService,
    FcWebHtmlExceptionFilter,
    HttpExceptionFilter,
    UnknownHtmlExceptionFilter,
    /**
     * @todo refacto
     * This should not ne needed, we should rather expose a module in @fc/common
     * that makes those validator available globally.
     */
    IsEqualToConfigConstraint,
    IsIncludedInConfigConstraint,
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
})
export class MockWalletModule {}
