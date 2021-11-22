/* istanbul ignore file */

// Declarative code
import { DynamicModule, Module, Type } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CryptographyModule } from '@fc/cryptography';
import {
  IServiceProviderAdapter,
  SERVICE_PROVIDER_SERVICE_TOKEN,
} from '@fc/oidc';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import { IIdentityProviderAdapter } from './interfaces';
import {
  OidcClientConfigService,
  OidcClientIssuerService,
  OidcClientService,
  OidcClientUtilsService,
} from './services';
import { IDENTITY_PROVIDER_SERVICE } from './tokens';

@Module({})
export class OidcClientModule {
  static register(
    identityProvider: Type<IIdentityProviderAdapter>,
    identityProviderModule,
    serviceProvider: Type<IServiceProviderAdapter>,
    serviceProviderModule,
  ): DynamicModule {
    return {
      module: OidcClientModule,
      imports: [
        identityProviderModule,
        serviceProviderModule,
        CryptographyModule,
        CqrsModule,
        TrackingModule.forLib(),
        SessionModule,
      ],
      providers: [
        {
          provide: IDENTITY_PROVIDER_SERVICE,
          useExisting: identityProvider,
        },
        {
          provide: SERVICE_PROVIDER_SERVICE_TOKEN,
          useExisting: serviceProvider,
        },
        OidcClientUtilsService,
        OidcClientService,
        OidcClientConfigService,
        OidcClientIssuerService,
      ],
      exports: [OidcClientService, OidcClientConfigService],
    };
  }
}
