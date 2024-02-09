/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  CORE_SERVICE,
  CoreAccountService,
  CoreAcrService,
  CoreTrackingService,
  CoreVerifyService,
} from '@fc/core';
import { CryptographyEidasModule } from '@fc/cryptography-eidas';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { DataProviderAdapterMongoModule } from '@fc/data-provider-adapter-mongo';
import { ExceptionsModule } from '@fc/exceptions';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { FlowStepsModule } from '@fc/flow-steps';
import { HttpProxyModule } from '@fc/http-proxy';
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
import {
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

const trackingModule = TrackingModule.forRoot(CoreTrackingService);

const exceptionModule = ExceptionsModule.withTracking(trackingModule);
@Global()
@Module({
  imports: [
    exceptionModule,
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
      exceptionModule,
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
    trackingModule,
    NotificationsModule,
    FeatureHandlerModule,
    AppModule,
    DataProviderAdapterMongoModule,
    ViewTemplatesModule,
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
    OidcProviderConfigAppService,
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpSendEmailHandler,
    CoreFcpDefaultIdentityCheckHandler,
    CoreFcpEidasIdentityCheckHandler,
    {
      provide: CORE_SERVICE,
      useClass: CoreFcpService,
    },
    OidcProviderGrantService,
    DataProviderService,
    ScopesHelper,
  ],
  // Make `CoreTrackingService` dependencies available
  exports: [
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpSendEmailHandler,
    OidcProviderConfigAppService,
    CoreTrackingService,
  ],
})
export class CoreFcpModule {}
