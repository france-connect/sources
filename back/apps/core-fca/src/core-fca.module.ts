/* istanbul ignore file */

// Declarative code
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { ConfigService } from '@fc/config';
import {
  CoreService,
  CoreTrackingService,
  OidcClientTokenEventHandler,
  OidcProviderAuthorizationEventHandler,
  OidcProviderTokenEventHandler,
  OidcProviderUserinfoEventHandler,
  UserinfoEventHandler,
} from '@fc/core';
import { CryptographyFcaModule } from '@fc/cryptography-fca';
import { ExceptionsModule } from '@fc/exceptions';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterMongoModule,
  IdentityProviderAdapterMongoService,
} from '@fc/identity-provider-adapter-mongo';
import { MinistriesModule } from '@fc/ministries';
import { MongooseModule } from '@fc/mongoose';
import { OidcClientModule } from '@fc/oidc-client';
import { OidcProviderModule } from '@fc/oidc-provider';
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
import { CoreFcaService, OidcProviderConfigAppService } from './services';

@Global()
@Module({
  imports: [
    ExceptionsModule,
    MongooseModule.forRoot(),
    CryptographyFcaModule,
    AccountModule,
    ServiceProviderAdapterMongoModule,
    IdentityProviderAdapterMongoModule,
    MinistriesModule,
    HttpProxyModule,
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
    SessionModule.forRoot({
      schema: CoreFcaSession,
    }),
    /** Inject app specific tracking service */
    TrackingModule.forRoot(CoreTrackingService),
    FeatureHandlerModule,
  ],
  controllers: [
    CoreFcaController,
    OidcClientController,
    OidcProviderController,
  ],
  providers: [
    CoreService,
    CoreFcaService,
    CoreTrackingService,
    OidcClientTokenEventHandler,
    OidcProviderConfigAppService,
    UserinfoEventHandler,
    OidcProviderAuthorizationEventHandler,
    OidcProviderTokenEventHandler,
    OidcProviderUserinfoEventHandler,
    CoreFcaDefaultVerifyHandler,
  ],
  // Make `CoreTrackingService` dependencies available
  exports: [CoreFcaDefaultVerifyHandler, OidcProviderConfigAppService],
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
