/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { TracksModule } from '@fc/tracks';

import { OidcClientController, UserDashboardController } from './controllers';
import { UserDashboardSession } from './dto';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Module({
  controllers: [UserDashboardController, OidcClientController],
  imports: [
    AppModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    SessionModule.forRoot({ schema: UserDashboardSession }),
    TracksModule,
  ],
})
export class UserDashboardModule {}
