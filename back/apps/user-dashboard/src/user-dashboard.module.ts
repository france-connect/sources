// Stryker disable all
/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
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
import { SessionModule } from '@fc/session';
import { TracksModule } from '@fc/tracks';
import { UserPreferencesModule } from '@fc/user-preferences';

import { OidcClientController, UserDashboardController } from './controllers';
import { UserDashboardSession } from './dto';
import { UserDashboardService } from './services';

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
    TracksModule,
    UserPreferencesModule,
    MailerModule,
  ],
  providers: [UserDashboardService],
})
export class UserDashboardModule {}
