/* istanbul ignore file */

// Declarative code
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CryptographyModule } from '@fc/cryptography';
import { ExceptionsModule } from '@fc/exceptions';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionConfig, SessionMiddleware, SessionModule } from '@fc/session';

import {
  MockServiceProviderController,
  OidcClientController,
} from './controllers';
import { MockServiceProviderSession } from './dto';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Module({
  imports: [
    ExceptionsModule,
    IdentityProviderAdapterEnvModule,
    SessionModule.forRoot({
      schema: MockServiceProviderSession,
    }),
    CryptographyModule,
    oidcClientModule,
  ],
  controllers: [OidcClientController, MockServiceProviderController],
})
export class MockServiceProviderModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
}
