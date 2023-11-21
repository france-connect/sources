/* istanbul ignore file */

// Declarative code
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { ConfigService } from '@fc/config';
import {
  CORE_SERVICE,
  CoreAccountService,
  CoreAcrService,
  CoreTrackingService,
  CoreVerifyService,
} from '@fc/core';
import { CryptographyFcaModule } from '@fc/cryptography-fca';
import { ExceptionsModule } from '@fc/exceptions';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { FlowStepsModule } from '@fc/flow-steps';
import { FqdnToIdpAdapterMongoModule } from '@fc/fqdn-to-idp-adapter-mongo';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterMongoModule,
  IdentityProviderAdapterMongoService,
} from '@fc/identity-provider-adapter-mongo';
import { MinistriesModule } from '@fc/ministries';
import { MongooseModule } from '@fc/mongoose';
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
import { SessionConfig, SessionMiddleware, SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import {
  CoreFcaController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { CoreFcaSession } from './dto';
import { CoreFcaDefaultVerifyHandler } from './handlers';
import {
  CoreFcaDefaultAuthorizationHandler,
  CoreFcaMcpAuthorizationHandler,
} from './handlers/authorize';
import { CoreFcaMcpVerifyHandler } from './handlers/verify';
import {
  CoreFcaAuthorizationUrlService,
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
    MongooseModule.forRoot(),
    CryptographyFcaModule,
    AccountModule,
    ServiceProviderAdapterMongoModule,
    IdentityProviderAdapterMongoModule,
    FqdnToIdpAdapterMongoModule,
    MinistriesModule,
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
    SessionModule.forRoot({
      schema: CoreFcaSession,
    }),
    FlowStepsModule,
    /** Inject app specific tracking service */
    trackingModule,
    FeatureHandlerModule,
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
    CoreTrackingService,
    OidcProviderConfigAppService,
    CoreFcaDefaultVerifyHandler,
    CoreFcaVerifyService,
    OidcProviderGrantService,
    CoreFcaAuthorizationUrlService,
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
export class CoreFcaModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
}
