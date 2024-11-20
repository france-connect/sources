/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsrfModule } from '@fc/csrf';
import {
  ExceptionsModule,
  FcWebJsonExceptionFilter,
  UnknownJsonExceptionFilter,
} from '@fc/exceptions';
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
import { ViewTemplatesModule } from '@fc/view-templates';

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
    ExceptionsModule,
    CqrsModule,
    ViewTemplatesModule,
  ],
  providers: [
    FcWebJsonExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: UnknownJsonExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcWebJsonExceptionFilter,
    },
  ],
  exports: [CqrsModule],
})
export class PartnersModule {}
