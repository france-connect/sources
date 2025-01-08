import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AccountModule } from '@fc/account';
import { AccountFcaModule } from '@fc/account-fca';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import {
  CORE_AUTH_SERVICE,
  CORE_SERVICE,
  CORE_VERIFY_SERVICE,
  CoreAuthorizationService,
  CoreModule,
  CoreVerifyService,
} from '@fc/core';
import { CsrfModule } from '@fc/csrf';
import { DataProviderAdapterMongoModule } from '@fc/data-provider-adapter-mongo';
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
  ServiceProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
} from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  CoreFcaController,
  DataProviderController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import {
  CoreFcaDefaultAuthorizationHandler,
  CoreFcaDefaultVerifyHandler,
  CoreFcaMcpAuthorizationHandler,
  CoreFcaMcpVerifyHandler,
} from './handlers';
import {
  CoreFcaFqdnService,
  CoreFcaMiddlewareService,
  CoreFcaService,
  CoreFcaTrackingService,
  CoreFcaVerifyService,
  DataProviderService,
  OidcProviderConfigAppService,
} from './services';
import { IsPhoneNumberFCAConstraint } from './validators';

@Global()
@Module({
  imports: [
    CqrsModule,
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
    NotificationsModule,
    FeatureHandlerModule,
    CsrfModule,
    AccountFcaModule,
    ViewTemplatesModule,
    I18nModule,
    CoreModule.register(
      CoreFcaService,
      OidcProviderConfigAppService,
      ServiceProviderAdapterMongoService,
      ServiceProviderAdapterMongoModule,
      IdentityProviderAdapterMongoService,
      IdentityProviderAdapterMongoModule,
      CoreFcaTrackingService,
    ),
  ],
  controllers: [
    CoreFcaController,
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
    {
      provide: CORE_SERVICE,
      useClass: CoreFcaService,
    },
    CoreFcaDefaultAuthorizationHandler,
    CoreFcaMcpAuthorizationHandler,
    CoreFcaVerifyService,
    CoreFcaDefaultVerifyHandler,
    CoreFcaMcpVerifyHandler,
    OidcProviderConfigAppService,
    CoreFcaService,
    CoreFcaMiddlewareService,
    OidcProviderGrantService,
    CoreFcaFqdnService,
    DataProviderService,
    IsPhoneNumberFCAConstraint,
  ],
  exports: [OidcProviderConfigAppService, CqrsModule, CoreFcaService],
})
export class CoreFcaModule {}
