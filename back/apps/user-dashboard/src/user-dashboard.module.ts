import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsmrFraudClientModule } from '@fc/csmr-fraud-client';
import { TracksModule } from '@fc/csmr-tracks-client';
import { CsrfModule } from '@fc/csrf';
import {
  ExceptionsModule,
  FcWebJsonExceptionFilter,
  UnknownJsonExceptionFilter,
} from '@fc/exceptions';
import { FraudIdentityTheftModule } from '@fc/fraud-identity-theft';
import { HttpProxyModule } from '@fc/http-proxy';
import { I18nModule } from '@fc/i18n';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { MailerModule } from '@fc/mailer';
import { OidcClientModule } from '@fc/oidc-client';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';
import { UserPreferencesModule } from '@fc/user-preferences';

import { OidcClientController, UserDashboardController } from './controllers';
import { UserDashboardService, UserDashboardTrackingService } from './services';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

const trackingModule = TrackingModule.forRoot(UserDashboardTrackingService);

@Module({
  controllers: [UserDashboardController, OidcClientController],
  imports: [
    CqrsModule,
    ExceptionsModule,
    AsyncLocalStorageModule,
    SessionModule,
    AppModule,
    HttpProxyModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    trackingModule,
    TracksModule,
    CsmrFraudClientModule,
    UserPreferencesModule,
    MailerModule,
    CsrfModule,
    I18nModule,
    FraudIdentityTheftModule.register(trackingModule),
  ],
  providers: [
    UserDashboardService,
    FcWebJsonExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: UnknownJsonExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcWebJsonExceptionFilter,
    },
  ],
})
export class UserDashboardModule {}
