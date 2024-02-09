/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CryptographyModule } from '@fc/cryptography';
import { CryptographyEidasModule } from '@fc/cryptography-eidas';
import { EidasClientController, EidasClientModule } from '@fc/eidas-client';
import { EidasCountryModule } from '@fc/eidas-country';
import { EidasOidcMapperModule } from '@fc/eidas-oidc-mapper';
import {
  EidasProviderController,
  EidasProviderModule,
} from '@fc/eidas-provider';
import { ExceptionsModule } from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import {
  OidcProviderGrantService,
  OidcProviderModule,
} from '@fc/oidc-provider';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import {
  EuIdentityToFrController,
  FrIdentityToEuController,
  OidcClientController,
  OidcProviderController,
} from './controllers';
import {
  EidasBridgeTrackingService,
  OidcMiddlewareService,
  OidcProviderConfigAppService,
} from './services';

const trackingModule = TrackingModule.forRoot(EidasBridgeTrackingService);

const exceptionModule = ExceptionsModule.withTracking(trackingModule);

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);
const oidcProviderModule = OidcProviderModule.register(
  OidcProviderConfigAppService,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
  exceptionModule,
);

@Global()
@Module({
  imports: [
    exceptionModule,
    AsyncLocalStorageModule,
    SessionModule,
    EidasClientModule,
    EidasProviderModule,
    IdentityProviderAdapterEnvModule,
    HttpProxyModule,
    ServiceProviderAdapterEnvModule,
    oidcClientModule,
    oidcProviderModule,
    CryptographyModule,
    CryptographyEidasModule,
    EidasOidcMapperModule,
    EidasCountryModule,
    trackingModule,
  ],
  controllers: [
    FrIdentityToEuController,
    EuIdentityToFrController,
    EidasClientController,
    EidasProviderController,
    OidcClientController,
    OidcProviderController,
  ],
  providers: [
    OidcMiddlewareService,
    OidcProviderConfigAppService,
    OidcProviderGrantService,
  ],
  exports: [OidcProviderConfigAppService],
})
export class EidasBridgeModule {}
