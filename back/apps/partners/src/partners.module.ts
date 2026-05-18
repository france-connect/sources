import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersPlatform } from '@entities/typeorm';

import { AccessControlModule } from '@fc/access-control';
import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CsmrConfigClientModule } from '@fc/csmr-config-client';
import { CsrfModule } from '@fc/csrf';
import { Dto2formModule, FormValidationExceptionFilter } from '@fc/dto2form';
import {
  ExceptionsModule,
  FcWebJsonExceptionFilter,
  UnknownJsonExceptionFilter,
} from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import { I18nModule } from '@fc/i18n';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import { PartnersAccountModule } from '@fc/partners-account';
import { PartnersOrganizationModule } from '@fc/partners-organization';
import { PartnersServiceProviderModule } from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceModule } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionModule } from '@fc/partners-service-provider-instance-version';
import { PostgresModule } from '@fc/postgres';
import { ScopesModule } from '@fc/scopes';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { TypeormModule } from '@fc/typeorm';
import { ViewTemplatesModule } from '@fc/view-templates';
import { WebhooksModule } from '@fc/webhooks';

import { AccessControlEntitiesMap } from './const';
import {
  DatapassWebhookController,
  InstanceController,
  InvitationController,
  OidcClientController,
  PartnersController,
  ServiceProviderController,
  VersionController,
} from './controllers/';
import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
} from './enums';
import { AppPermissionsHandler } from './handlers';
import {
  PartnerPublicationService,
  PartnersDatapassService,
  PartnersInstanceService,
  PartnersInstanceVersionFormService,
  PartnersInvitationService,
  PartnersOidcClientService,
  PartnersServiceProviderFormService,
} from './services';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

const accessControlModule = AccessControlModule.withRolesHandler<
  AccessControlEntity,
  AccessControlPermission,
  AccessControlHandler
>(AppPermissionsHandler, AccessControlEntitiesMap);

@Module({
  imports: [
    AsyncLocalStorageModule,
    AppModule,
    PartnersServiceProviderInstanceModule,
    SessionModule,
    I18nModule,
    IdentityProviderAdapterEnvModule,
    oidcClientModule,
    PartnersOrganizationModule,
    PartnersServiceProviderModule,
    CsrfModule,
    ExceptionsModule,
    CqrsModule,
    ViewTemplatesModule,
    PostgresModule,
    PartnersAccountModule.register(accessControlModule),
    PartnersServiceProviderInstanceVersionModule,
    accessControlModule,
    Dto2formModule,
    CsmrConfigClientModule.registerFor('SandboxLow'),
    HttpProxyModule,
    ScopesModule,
    TypeormModule,
    TypeOrmModule.forFeature([PartnersPlatform]),
    WebhooksModule,
  ],
  providers: [
    FcWebJsonExceptionFilter,
    FormValidationExceptionFilter,
    PartnerPublicationService,
    PartnersInvitationService,
    {
      provide: APP_FILTER,
      useClass: UnknownJsonExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcWebJsonExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FormValidationExceptionFilter,
    },
    PartnersInstanceVersionFormService,
    PartnersOidcClientService,
    PartnersDatapassService,
    PartnersServiceProviderFormService,
    PartnersInstanceService,
  ],
  controllers: [
    InstanceController,
    InvitationController,
    OidcClientController,
    PartnersController,
    ServiceProviderController,
    VersionController,
    DatapassWebhookController,
  ],
  exports: [CqrsModule],
})
export class PartnersModule {}
