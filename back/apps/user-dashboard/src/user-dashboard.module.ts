/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsrfModule } from '@fc/csrf';
import { ExceptionsModule } from '@fc/exceptions-deprecated';
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
import { TracksModule } from '@fc/tracks';
import { UserPreferencesModule } from '@fc/user-preferences';

import { OidcClientController, UserDashboardController } from './controllers';
import { UserDashboardService, UserDashboardTrackingService } from './services';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Module({
  controllers: [UserDashboardController, OidcClientController],
  imports: [
    ExceptionsModule.withoutTracking(),
    AsyncLocalStorageModule,
    SessionModule,
    AppModule,
    HttpProxyModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    TrackingModule.forRoot(UserDashboardTrackingService),
    TracksModule,
    UserPreferencesModule,
    MailerModule,
    CsrfModule,
    I18nModule,
  ],
  providers: [UserDashboardService],
})
export class UserDashboardModule {}
