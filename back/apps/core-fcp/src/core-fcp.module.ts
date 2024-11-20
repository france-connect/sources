/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AccountModule } from '@fc/account';
import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  CORE_SERVICE,
  CoreAccountService,
  CoreAcrService,
  CoreAuthorizationService,
  CoreTrackingService,
  CoreVerifyService,
} from '@fc/core';
import { CryptographyEidasModule } from '@fc/cryptography-eidas';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { CsrfModule, CsrfService } from '@fc/csrf';
import { DataProviderAdapterMongoModule } from '@fc/data-provider-adapter-mongo';
import { DeviceModule } from '@fc/device';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  FcWebJsonExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { ExceptionsFcpModule } from '@fc/exceptions-fcp';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { FlowStepsModule } from '@fc/flow-steps';
import { HttpProxyModule } from '@fc/http-proxy';
import { I18nModule } from '@fc/i18n';
import {
  IdentityProviderAdapterMongoModule,
  IdentityProviderAdapterMongoService,
} from '@fc/identity-provider-adapter-mongo';
import { JwtModule } from '@fc/jwt';
import { MailerModule } from '@fc/mailer';
import { MongooseModule } from '@fc/mongoose';
import { NotificationsModule } from '@fc/notifications';
import { OidcAcrModule } from '@fc/oidc-acr';
import { OidcClientModule } from '@fc/oidc-client';
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
import { RnippModule } from '@fc/rnipp';
import { ScopesModule } from '@fc/scopes';
import {
  ServiceProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
} from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  CoreFcpController,
  DataProviderController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { DataProviderExceptionFilter } from './filters';
import {
  CoreFcpAidantsConnectAuthorizationHandler,
  CoreFcpAidantsConnectVerifyHandler,
  CoreFcpDefaultAuthorizationHandler,
  CoreFcpDefaultIdentityCheckHandler,
  CoreFcpDefaultVerifyHandler,
  CoreFcpEidasIdentityCheckHandler,
  CoreFcpEidasVerifyHandler,
  CoreFcpSendEmailHandler,
} from './handlers';
import { ScopesHelper } from './helpers';
import {
  CoreFcpMiddlewareService,
  CoreFcpService,
  CoreFcpVerifyService,
  DataProviderService,
  OidcProviderConfigAppService,
} from './services';

@Global()
@Module({
  imports: [
    CqrsModule,
    ExceptionsModule,
    AsyncLocalStorageModule,
    MongooseModule.forRoot(),
    SessionModule,
    FlowStepsModule,
    RnippModule,
    CryptographyFcpModule,
    CryptographyEidasModule,
    AccountModule,
    ServiceProviderAdapterMongoModule,
    JwtModule,
    IdentityProviderAdapterMongoModule,
    HttpProxyModule,
    OidcAcrModule,
    OidcProviderModule.register(
      OidcProviderConfigAppService,
      ServiceProviderAdapterMongoService,
      ServiceProviderAdapterMongoModule,
    ),
    ScopesModule,
    OidcClientModule.register(
      IdentityProviderAdapterMongoService,
      IdentityProviderAdapterMongoModule,
      ServiceProviderAdapterMongoService,
      ServiceProviderAdapterMongoModule,
    ),
    MailerModule,
    /** Inject app specific tracking service */
    TrackingModule.forRoot(CoreTrackingService),
    NotificationsModule,
    FeatureHandlerModule,
    AppModule,
    DataProviderAdapterMongoModule,
    ViewTemplatesModule,
    CsrfModule,
    I18nModule,
    DeviceModule,
    ExceptionsFcpModule,
  ],
  controllers: [
    CoreFcpController,
    OidcClientController,
    OidcProviderController,
    DataProviderController,
  ],
  providers: [
    CoreTrackingService,
    CoreFcpService,
    CoreAccountService,
    CoreAcrService,
    CoreVerifyService,
    CoreFcpVerifyService,
    CoreFcpMiddlewareService,
    CoreAuthorizationService,
    OidcProviderConfigAppService,
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpAidantsConnectVerifyHandler,
    CoreFcpSendEmailHandler,
    CoreFcpDefaultIdentityCheckHandler,
    CoreFcpEidasIdentityCheckHandler,
    CoreFcpDefaultAuthorizationHandler,
    CoreFcpAidantsConnectAuthorizationHandler,
    FcWebHtmlExceptionFilter,
    FcWebJsonExceptionFilter,
    HttpExceptionFilter,
    OidcProviderRedirectExceptionFilter,
    OidcProviderRenderedHtmlExceptionFilter,
    OidcProviderRenderedJsonExceptionFilter,
    HttpExceptionFilter,
    UnknownHtmlExceptionFilter,
    DataProviderExceptionFilter,
    ExceptionOccurredHandler,
    CsrfService,
    {
      provide: CORE_SERVICE,
      useClass: CoreFcpService,
    },
    OidcProviderGrantService,
    DataProviderService,
    ScopesHelper,
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
      useClass: OidcProviderRenderedHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OidcProviderRedirectExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  // Make `CoreTrackingService` dependencies available
  exports: [
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpSendEmailHandler,
    OidcProviderConfigAppService,
    CoreTrackingService,
    CqrsModule,
  ],
})
export class CoreFcpModule {}
