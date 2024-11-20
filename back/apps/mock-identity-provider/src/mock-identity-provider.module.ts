/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { OidcAcrModule } from '@fc/oidc-acr';
import {
  OidcProviderGrantService,
  OidcProviderModule,
} from '@fc/oidc-provider';
import {
  OidcProviderRedirectExceptionFilter,
  OidcProviderRenderedHtmlExceptionFilter,
  OidcProviderRenderedJsonExceptionFilter,
} from '@fc/oidc-provider/filters';
import { ExceptionOccurredHandler } from '@fc/oidc-provider/handlers';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  MockIdentityProviderController,
  OidcProviderController,
} from './controllers';
import {
  MockIdentityProviderService,
  OidcProviderConfigAppService,
  OidcProviderMiddlewareService,
  ScenariosService,
} from './services';

@Global()
@Module({
  imports: [
    AppModule,
    CqrsModule,
    ExceptionsModule,
    AsyncLocalStorageModule,
    ServiceProviderAdapterEnvModule,
    SessionModule,
    OidcProviderModule.register(
      OidcProviderConfigAppService,
      ServiceProviderAdapterEnvService,
      ServiceProviderAdapterEnvModule,
    ),
    ViewTemplatesModule,
    OidcAcrModule,
  ],
  controllers: [MockIdentityProviderController, OidcProviderController],
  providers: [
    MockIdentityProviderService,
    OidcProviderConfigAppService,
    OidcProviderGrantService,
    OidcProviderMiddlewareService,
    ScenariosService,
    FcWebHtmlExceptionFilter,
    OidcProviderRenderedHtmlExceptionFilter,
    OidcProviderRenderedJsonExceptionFilter,
    OidcProviderRedirectExceptionFilter,
    ExceptionOccurredHandler,
    HttpExceptionFilter,
    UnknownHtmlExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: UnknownHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OidcProviderRenderedHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OidcProviderRedirectExceptionFilter,
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
  exports: [CqrsModule, OidcProviderConfigAppService],
})
export class MockIdentityProviderModule {}
