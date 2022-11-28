/* istanbul ignore file */

// Declarative code
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { ConfigService } from '@fc/config';
import { ExceptionsModule } from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
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
import { SessionConfig, SessionMiddleware, SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';
import { TracksModule } from '@fc/tracks';
import { UserPreferencesModule } from '@fc/user-preferences';

import { OidcClientController, UserDashboardController } from './controllers';
import { UserDashboardSession } from './dto';
import {
  DisplayedUserPreferencesEventHandler,
  DisplayedUserTracksEventHandler,
  TrackableEventHandler,
  UpdatedUserPreferencesEventHandler,
  UpdatedUserPreferencesFutureIdpEventHandler,
  UpdatedUserPreferencesIdpEventHandler,
} from './handlers';
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
    ExceptionsModule,
    AppModule,
    HttpProxyModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    SessionModule.forRoot({ schema: UserDashboardSession }),
    TrackingModule.forRoot(UserDashboardTrackingService),
    TracksModule,
    UserPreferencesModule,
    MailerModule,
  ],
  providers: [
    UserDashboardService,
    DisplayedUserPreferencesEventHandler,
    DisplayedUserTracksEventHandler,
    TrackableEventHandler,
    UpdatedUserPreferencesEventHandler,
    UpdatedUserPreferencesIdpEventHandler,
    UpdatedUserPreferencesFutureIdpEventHandler,
  ],
})
export class UserDashboardModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
}
