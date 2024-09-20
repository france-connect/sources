/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

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
import { FeatureHandlerModule } from '@fc/feature-handler';
import { FlowStepsModule } from '@fc/flow-steps';
import { FqdnToIdpAdapterMongoModule } from '@fc/fqdn-to-idp-adapter-mongo';
import { HttpProxyModule } from '@fc/http-proxy';
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
  ServiceProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
} from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import {
  CoreFcaController,
  DataProviderController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import {
  FcaDeprecatedExceptionFilter,
  FcaExceptionFilter,
  UnhandledExceptionFilter,
} from './exception-filters';
import { HttpExceptionFilter } from './exception-filters/http.exception-filter';
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

const exceptionModule = ExceptionsModule.withTracking(trackingModule);

const exceptionFiltersProviders = [
  {
    provide: APP_FILTER,
    useClass: UnhandledExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: FcaExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: FcaDeprecatedExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

@Global()
@Module({
  imports: [
    exceptionModule,
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
      exceptionModule,
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
  ],
  controllers: [
    CoreFcaController,
    OidcClientController,
    OidcProviderController,
    DataProviderController,
  ],
  providers: [
    ...exceptionFiltersProviders,
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
    {
      provide: CORE_SERVICE,
      useClass: CoreFcaService,
    },
  ],
  // Make `CoreTrackingService` dependencies available
  exports: [
    CoreFcaDefaultVerifyHandler,
    CoreTrackingService,
    OidcProviderConfigAppService,
  ],
})
export class CoreFcaModule {}
