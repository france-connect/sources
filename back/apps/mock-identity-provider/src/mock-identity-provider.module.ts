/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ExceptionsModule } from '@fc/exceptions';
import { OidcProviderModule } from '@fc/oidc-provider';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';

import {
  MockIdentityProviderController,
  OidcProviderController,
} from './controllers';
import { MockIdentityProviderSession } from './dto';
import { MockIdentityProviderService } from './services';

const oidcProviderModule = OidcProviderModule.register(
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Module({
  imports: [
    ExceptionsModule,
    ServiceProviderAdapterEnvModule,
    SessionModule.forRoot({
      schema: MockIdentityProviderSession,
    }),
    oidcProviderModule,
  ],
  controllers: [MockIdentityProviderController, OidcProviderController],
  providers: [MockIdentityProviderService],
})
export class MockIdentityProviderModule {}
