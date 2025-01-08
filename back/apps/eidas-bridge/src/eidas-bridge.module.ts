import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

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
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import { I18nModule } from '@fc/i18n';
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
  OidcProviderRedirectExceptionFilter,
  OidcProviderRenderedHtmlExceptionFilter,
  OidcProviderRenderedJsonExceptionFilter,
} from '@fc/oidc-provider/filters';
import { ExceptionOccurredHandler } from '@fc/oidc-provider/handlers';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';
import { ViewTemplatesModule } from '@fc/view-templates';

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
);

@Global()
@Module({
  imports: [
    ExceptionsModule,
    AsyncLocalStorageModule,
    CqrsModule,
    SessionModule,
    EidasClientModule,
    EidasProviderModule,
    I18nModule,
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
    ViewTemplatesModule,
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
    FcWebHtmlExceptionFilter,
    OidcProviderRenderedHtmlExceptionFilter,
    OidcProviderRenderedJsonExceptionFilter,
    OidcProviderRedirectExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: UnknownHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcWebHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OidcProviderRenderedHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: OidcProviderRedirectExceptionFilter,
    },

    ExceptionOccurredHandler,
  ],
  exports: [OidcProviderConfigAppService, CqrsModule],
})
export class EidasBridgeModule {}
