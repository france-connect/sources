/* istanbul ignore file */

// Declarative code
import { Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AccountModule } from '@fc/account';
import { AppModule } from '@fc/app';
import { ConfigService, ConfigTemplateInterceptor } from '@fc/config';
import { CoreTrackingService } from '@fc/core';
import { CryptographyEidasModule } from '@fc/cryptography-eidas';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ExceptionsModule } from '@fc/exceptions';
import { FeatureHandlerModule } from '@fc/feature-handler';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterMongoModule,
  IdentityProviderAdapterMongoService,
} from '@fc/identity-provider-adapter-mongo';
import { MailerModule } from '@fc/mailer';
import { MongooseModule } from '@fc/mongoose';
import { NotificationsModule } from '@fc/notifications';
import { OidcClientModule } from '@fc/oidc-client';
import { OidcProviderModule } from '@fc/oidc-provider';
import { RnippModule } from '@fc/rnipp';
import { ScopesModule } from '@fc/scopes';
import {
  ServiceProviderAdapterMongoModule,
  ServiceProviderAdapterMongoService,
} from '@fc/service-provider-adapter-mongo';
import { SessionConfig, SessionMiddleware, SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import {
  CoreFcpController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { CoreFcpSession } from './dto';
import {
  CoreFcpDefaultIdentityCheckHandler,
  CoreFcpDefaultVerifyHandler,
  CoreFcpEidasIdentityCheckHandler,
  CoreFcpEidasVerifyHandler,
  CoreFcpSendEmailHandler,
} from './handlers';
import {
  CoreFcpService,
  CoreFcpTrackingService,
  CoreService,
  OidcProviderConfigAppService,
} from './services';

const trackingModule = TrackingModule.forRoot(CoreFcpTrackingService);

const exceptionModule = ExceptionsModule.withTracking(trackingModule);
@Global()
@Module({
  imports: [
    exceptionModule,
    MongooseModule.forRoot(),
    SessionModule.forRoot({
      schema: CoreFcpSession,
    }),
    RnippModule,
    CryptographyFcpModule,
    CryptographyEidasModule,
    AccountModule,
    ServiceProviderAdapterMongoModule,
    IdentityProviderAdapterMongoModule,
    HttpProxyModule,
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
  ],
  controllers: [
    CoreFcpController,
    OidcClientController,
    OidcProviderController,
  ],
  providers: [
    CoreTrackingService,
    CoreFcpTrackingService,
    CoreFcpService,
    CoreService,
    OidcProviderConfigAppService,
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpSendEmailHandler,
    CoreFcpDefaultIdentityCheckHandler,
    CoreFcpEidasIdentityCheckHandler,
    {
      provide: APP_INTERCEPTOR,
      useClass: ConfigTemplateInterceptor,
    },
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
export class CoreFcpModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
}
