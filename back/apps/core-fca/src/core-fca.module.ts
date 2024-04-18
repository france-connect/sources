/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  CORE_SERVICE,
  CoreAccountService,
  CoreAcrService,
  CoreAuthorizationService,
  CoreTrackingService,
  CoreVerifyService,
} from '@fc/core';
import { CryptographyFcaModule } from '@fc/cryptography-fca';
import { CsrfModule } from '@fc/csrf';
import { ExceptionsModule } from '@fc/exceptions-deprecated';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { FlowStepsModule } from '@fc/flow-steps';
import { FqdnToIdpAdapterMongoModule } from '@fc/fqdn-to-idp-adapter-mongo';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterMongoModule,
  IdentityProviderAdapterMongoService,
} from '@fc/identity-provider-adapter-mongo';
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
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { CoreFcaDefaultVerifyHandler } from './handlers';
import {
  CoreFcaDefaultAuthorizationHandler,
  CoreFcaMcpAuthorizationHandler,
} from './handlers/authorize';
import { CoreFcaMcpVerifyHandler } from './handlers/verify';
import {
  CoreFcaMiddlewareService,
  CoreFcaService,
  CoreFcaVerifyService,
  OidcProviderConfigAppService,
} from './services';

const trackingModule = TrackingModule.forRoot(CoreTrackingService);

const exceptionModule = ExceptionsModule.withTracking(trackingModule);
@Global()
@Module({
  imports: [
    exceptionModule,
    AsyncLocalStorageModule,
    SessionModule,
    MongooseModule.forRoot(),
    CryptographyFcaModule,
    AccountModule,
    ServiceProviderAdapterMongoModule,
    IdentityProviderAdapterMongoModule,
    FqdnToIdpAdapterMongoModule,
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
  ],
  controllers: [
    CoreFcaController,
    OidcClientController,
    OidcProviderController,
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
