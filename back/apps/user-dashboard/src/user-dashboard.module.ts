/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import { RabbitmqModule } from '@fc/rabbitmq';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';

import { OidcClientController, UserDashboardController } from './controllers';
import { UserDashboardSession } from './dto';
import { TracksService } from './services/tracks.service';

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
    RabbitmqModule.registerFor('Tracks'),
  ],
  providers: [TracksService],
})
export class UserDashboardModule {}
