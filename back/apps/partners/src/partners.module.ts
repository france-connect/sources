/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsrfModule } from '@fc/csrf';
import { I18nModule } from '@fc/i18n';
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

import { OidcClientController, PartnersController } from './controllers/';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Module({
  controllers: [PartnersController, OidcClientController],
  imports: [
    AsyncLocalStorageModule,
    AppModule,
    SessionModule,
    I18nModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    CsrfModule,
  ],
})
export class PartnersModule {}
