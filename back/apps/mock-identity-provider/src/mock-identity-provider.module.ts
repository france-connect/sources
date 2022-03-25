/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

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
import {
  MockIdentityProviderService,
  OidcProviderConfigAppService,
} from './services';

@Global()
@Module({
  imports: [
    ExceptionsModule,
    ServiceProviderAdapterEnvModule,
    SessionModule.forRoot({
      schema: MockIdentityProviderSession,
    }),
    OidcProviderModule.register(
      OidcProviderConfigAppService,
      ServiceProviderAdapterEnvService,
      ServiceProviderAdapterEnvModule,
    ),
  ],
  controllers: [MockIdentityProviderController, OidcProviderController],
  providers: [MockIdentityProviderService, OidcProviderConfigAppService],
  exports: [OidcProviderConfigAppService],
})
export class MockIdentityProviderModule {}
