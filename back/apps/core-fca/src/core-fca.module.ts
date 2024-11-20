/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AccountModule } from '@fc/account';
import { AccountFcaModule } from '@fc/account-fca';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  CORE_SERVICE,
  CoreAccountService,
  CoreAcrService,
  CoreAuthorizationService,
  CoreTrackingService,
  CoreVerifyService,
} from '@fc/core';
import { CsrfModule } from '@fc/csrf';
import { DataProviderAdapterMongoModule } from '@fc/data-provider-adapter-mongo';
import { ExceptionsModule } from '@fc/exceptions';
import {
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions/filters';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { FlowStepsModule } from '@fc/flow-steps';
import { FqdnToIdpAdapterMongoModule } from '@fc/fqdn-to-idp-adapter-mongo';
import { HttpProxyModule } from '@fc/http-proxy';
import { I18nModule } from '@fc/i18n';
import {
  IdentityProviderAdapterMongoModule,
  IdentityProviderAdapterMongoService,
} from '@fc/identity-provider-adapter-mongo';
import { JwtModule } from '@fc/jwt';
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
import {
  ServiceProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
} from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  CoreFcaController,
  DataProviderController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { DataProviderExceptionFilter } from './filters';
import { CoreFcaDefaultVerifyHandler } from './handlers';
import {
  CoreFcaDefaultAuthorizationHandler,
  CoreFcaMcpAuthorizationHandler,
} from './handlers/authorize';
import { CoreFcaMcpVerifyHandler } from './handlers/verify';
import {
  CoreFcaMiddlewareService,
  CoreFcaService,
  CoreFcaTrackingService,
  CoreFcaVerifyService,
  DataProviderService,
  OidcProviderConfigAppService,
} from './services';
import { CoreFcaFqdnService } from './services/core-fca-fqdn.service';

const trackingModule = TrackingModule.forRoot(CoreFcaTrackingService);

@Global()
@Module({
  imports: [
    CqrsModule,
    ExceptionsModule,
    AsyncLocalStorageModule,
    SessionModule,
    MongooseModule.forRoot(),
    AccountModule,
    ServiceProviderAdapterMongoModule,
    IdentityProviderAdapterMongoModule,
    FqdnToIdpAdapterMongoModule,
    DataProviderAdapterMongoModule,
    JwtModule,
    HttpProxyModule,
    OidcAcrModule,
    OidcProviderModule.register(
      OidcProviderConfigAppService,
      ServiceProviderAdapterMongoService,
      ServiceProviderAdapterMongoModule,
    ),
    OidcClientModule.register(
      IdentityProviderAdapterMongoService,
      IdentityProviderAdapterMongoModule,
      ServiceProviderAdapterMongoService,
      ServiceProviderAdapterMongoModule,
    ),
    FlowStepsModule,
    /** Inject app specific tracking service */
    trackingModule,
    NotificationsModule,
    FeatureHandlerModule,
    CsrfModule,
    AccountFcaModule,
    ViewTemplatesModule,
    I18nModule,
  ],
  controllers: [
    CoreFcaController,
    OidcClientController,
    OidcProviderController,
    DataProviderController,
  ],
  providers: [
    CoreAccountService,
    CoreAcrService,
    CoreFcaService,
    CoreVerifyService,
    CoreFcaMiddlewareService,
    CoreAuthorizationService,
    CoreTrackingService,
    OidcProviderConfigAppService,
    CoreFcaDefaultVerifyHandler,
    CoreFcaVerifyService,
    OidcProviderGrantService,
    CoreFcaMcpVerifyHandler,
    CoreFcaDefaultAuthorizationHandler,
    CoreFcaMcpAuthorizationHandler,
    DataProviderService,
    CoreFcaFqdnService,
    FcWebHtmlExceptionFilter,
    HttpExceptionFilter,
    OidcProviderRedirectExceptionFilter,
    OidcProviderRenderedHtmlExceptionFilter,
    OidcProviderRenderedJsonExceptionFilter,
    DataProviderExceptionFilter,
    ExceptionOccurredHandler,
    {
      provide: CORE_SERVICE,
      useClass: CoreFcaService,
    },
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
  // Make `CoreTrackingService` dependencies available
  exports: [
    CoreFcaDefaultVerifyHandler,
    CoreTrackingService,
    OidcProviderConfigAppService,
    CqrsModule,
  ],
})
export class CoreFcaModule {}
