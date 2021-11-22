/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';
import { EidasClientController, EidasClientModule } from '@fc/eidas-client';
import { EidasCountryModule } from '@fc/eidas-country';
import { EidasOidcMapperModule } from '@fc/eidas-oidc-mapper';
import {
  EidasProviderController,
  EidasProviderModule,
} from '@fc/eidas-provider';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import { OidcProviderModule } from '@fc/oidc-provider';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';

import {
  EuIdentityToFrController,
  FrIdentityToEuController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import { EidasBridgeSession } from './dto';
import { OidcMiddlewareService } from './services';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);
const oidcProviderModule = OidcProviderModule.register(
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Global()
@Module({
  imports: [
    EidasClientModule,
    EidasProviderModule,
    SessionModule.forRoot({
      schema: EidasBridgeSession,
    }),
    IdentityProviderAdapterEnvModule,
    HttpProxyModule,
    ServiceProviderAdapterEnvModule,
    oidcClientModule,
    oidcProviderModule,
    CryptographyModule,
    EidasOidcMapperModule,
    EidasCountryModule,
  ],
  controllers: [
    FrIdentityToEuController,
    EuIdentityToFrController,
    EidasClientController,
    EidasProviderController,
    OidcClientController,
    OidcProviderController,
  ],
  providers: [OidcMiddlewareService],
  exports: [],
})
export class EidasBridgeModule {}
