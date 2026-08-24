import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CogModule } from '@fc/cog';
import { EudiCogModule } from '@fc/eudi-cog';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import { I18nModule } from '@fc/i18n';
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
import { Openid4vpModule } from '@fc/openid4vp';
import { QrcodeModule } from '@fc/qrcode';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { SignAdapterNativeModule } from '@fc/sign-adapter-native';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  OidcProviderController,
  OpenId4vpApiController,
  OpenId4vpUiController,
} from './controllers';
import {
  OidcMiddlewareService,
  SseService,
  WalletBridgeIdentityService,
} from './services';

@Global()
@Module({
  imports: [
    AppModule,
    AsyncLocalStorageModule,
    CogModule,
    EudiCogModule,
    I18nModule,
    SessionModule,
    ExceptionsModule,
    ViewTemplatesModule,
    HttpProxyModule,
    Openid4vpModule,
    QrcodeModule,
    CqrsModule,
    ServiceProviderAdapterEnvModule,
    OidcProviderModule.register(
      WalletBridgeIdentityService,
      ServiceProviderAdapterEnvService,
      ServiceProviderAdapterEnvModule,
      SignAdapterNativeModule,
    ),
  ],
  providers: [
    WalletBridgeIdentityService,
    OidcMiddlewareService,
    SseService,
    OidcProviderGrantService,
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
  controllers: [
    OpenId4vpApiController,
    OpenId4vpUiController,
    OidcProviderController,
  ],
  exports: [CqrsModule, WalletBridgeIdentityService],
})
export class WalletBridgeModule {}
