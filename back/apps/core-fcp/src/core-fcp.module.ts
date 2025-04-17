import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AccountModule } from '@fc/account';
import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  CORE_AUTH_SERVICE,
  CORE_SERVICE,
  CORE_VERIFY_SERVICE,
  CoreAuthorizationService,
  CoreModule,
  CoreVerifyService,
} from '@fc/core';
import { CryptographyEidasModule } from '@fc/cryptography-eidas';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { CsrfModule } from '@fc/csrf';
import { DataProviderAdapterMongoModule } from '@fc/data-provider-adapter-mongo';
import { DeviceModule } from '@fc/device';
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
import { OidcProviderModule } from '@fc/oidc-provider';
import { RnippModule } from '@fc/rnipp';
import { ScopesModule } from '@fc/scopes';
import {
  ServiceProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
} from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  CoreFcpController,
  DataProviderController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
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
  CoreFcpTrackingService,
  CoreFcpVerifyService,
  DataProviderService,
  OidcProviderConfigAppService,
} from './services';

const oidcProviderModule = OidcProviderModule.register(
  OidcProviderConfigAppService,
  ServiceProviderAdapterMongoService,
  ServiceProviderAdapterMongoModule,
);

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterMongoService,
  IdentityProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
  ServiceProviderAdapterMongoModule,
);
@Global()
@Module({
  imports: [
    CqrsModule,
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
    oidcProviderModule,
    oidcClientModule,
    ScopesModule,
    MailerModule,
    NotificationsModule,
    FeatureHandlerModule,
    AppModule,
    DataProviderAdapterMongoModule,
    ViewTemplatesModule,
    CsrfModule,
    I18nModule,
    DeviceModule,
    ExceptionsFcpModule,
    CoreModule.register(
      CoreFcpService,
      oidcProviderModule,
      oidcClientModule,
      IdentityProviderAdapterMongoModule,
      CoreFcpTrackingService,
    ),
  ],
  controllers: [
    CoreFcpController,
    OidcClientController,
    OidcProviderController,
    DataProviderController,
  ],
  providers: [
    {
      provide: CORE_AUTH_SERVICE,
      useClass: CoreAuthorizationService,
    },
    {
      provide: CORE_VERIFY_SERVICE,
      useClass: CoreVerifyService,
    },
    CoreFcpService,
    CoreFcpVerifyService,
    CoreFcpMiddlewareService,
    DataProviderService,
    ScopesHelper,
    OidcProviderConfigAppService,
    // Verify handlers
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpAidantsConnectVerifyHandler,
    // Send email handler
    CoreFcpSendEmailHandler,
    // Identity checks handlers
    CoreFcpDefaultIdentityCheckHandler,
    CoreFcpEidasIdentityCheckHandler,
    // Authorization handlers
    CoreFcpDefaultAuthorizationHandler,
    CoreFcpAidantsConnectAuthorizationHandler,
    {
      provide: CORE_SERVICE,
      useClass: CoreFcpService,
    },
  ],
  exports: [CoreFcpService, OidcProviderConfigAppService, CqrsModule],
})
export class CoreFcpModule {}
