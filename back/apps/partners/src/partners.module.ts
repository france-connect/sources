import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { AccessControlModule } from '@fc/access-control';
import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsrfModule } from '@fc/csrf';
import { Dto2formModule } from '@fc/dto2form';
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
import { PartnersAccountModule } from '@fc/partners-account';
import { PartnersOrganisationModule } from '@fc/partners-organisation';
import { PartnersServiceProviderModule } from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceModule } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionModule } from '@fc/partners-service-provider-instance-version';
import { PostgresModule } from '@fc/postgres';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  InstanceController,
  OidcClientController,
  PartnersController,
  VersionController,
} from './controllers/';
import { AppPermissionsHandler } from './handlers';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Module({
  imports: [
    AsyncLocalStorageModule,
    AppModule,
    PartnersServiceProviderInstanceModule,
    SessionModule,
    I18nModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    PartnersOrganisationModule,
    PartnersServiceProviderModule,
    CsrfModule,
    ExceptionsModule,
    CqrsModule,
    ViewTemplatesModule,
    PostgresModule,
    PartnersAccountModule,
    PartnersServiceProviderInstanceVersionModule,
    AccessControlModule.withRolesHandler(AppPermissionsHandler),
    Dto2formModule,
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
  controllers: [
    InstanceController,
    OidcClientController,
    PartnersController,
    VersionController,
  ],
  exports: [CqrsModule],
})
export class PartnersModule {}
