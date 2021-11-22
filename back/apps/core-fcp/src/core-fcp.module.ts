/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { AppModule } from '@fc/app';
import {
  CoreService,
  CoreTrackingService,
  OidcClientTokenEventHandler,
  OidcProviderAuthorizationEventHandler,
  OidcProviderTokenEventHandler,
  OidcProviderUserinfoEventHandler,
  RnippReceivedValidEventHandler,
  RnippRequestedEventHandler,
  TrackableEventHandler,
  UserinfoEventHandler,
} from '@fc/core';
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
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import {
  CoreFcpController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { CoreFcpSession } from './dto';
import {
  CoreFcpDatatransferConsentIdentityEventHandler,
  CoreFcpDatatransferInformationAnonymousEventHAndler,
  CoreFcpDatatransferInformationIdentityEventHandler,
  CoreFcpDefaultIdentityCheckHandler,
  CoreFcpDefaultVerifyHandler,
  CoreFcpEidasIdentityCheckHandler,
  CoreFcpEidasVerifyHandler,
  CoreFcpSendEmailHandler,
} from './handlers';
import { CoreFcpService } from './services';

@Global()
@Module({
  imports: [
    ExceptionsModule,
    MongooseModule,
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
  ],
  controllers: [
    CoreFcpController,
    OidcClientController,
    OidcProviderController,
  ],
  providers: [
    CoreService,
    CoreTrackingService,
    CoreFcpService,
    OidcClientTokenEventHandler,
    UserinfoEventHandler,
    RnippRequestedEventHandler,
    RnippReceivedValidEventHandler,
    OidcProviderAuthorizationEventHandler,
    OidcProviderTokenEventHandler,
    OidcProviderUserinfoEventHandler,
    TrackableEventHandler,
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpSendEmailHandler,
    CoreFcpDefaultIdentityCheckHandler,
    CoreFcpEidasIdentityCheckHandler,
    CoreFcpDatatransferInformationIdentityEventHandler,
    CoreFcpDatatransferInformationAnonymousEventHAndler,
    CoreFcpDatatransferConsentIdentityEventHandler,
  ],
  // Make `CoreTrackingService` dependencies available
  exports: [
    CoreFcpDefaultVerifyHandler,
    CoreFcpEidasVerifyHandler,
    CoreFcpSendEmailHandler,
  ],
})
export class CoreFcpModule {}
