import { pick } from 'lodash';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { EnvironmentEnum, PartnersAccount } from '@entities/typeorm';

import {
  AccessControl,
  AccessControlGuard,
  AccountPermissions,
  AccountPermissionService,
  PermissionInterface,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MetadataDtoTranslationInterface,
  MetadataFormService,
} from '@fc/dto2form';
import { PartnersAccountSession } from '@fc/partners-account';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { ServiceProviderInstanceVersionFromSpDto } from '@fc/partners-service-provider-instance-version';
import { ISessionService, Session } from '@fc/session';

import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
  PartnersBackRoutes,
} from '../enums';
import {
  InstanceVersionFromSpPayloadInterface,
  PartnersServiceProviderPayloadInterface,
} from '../interfaces';
import {
  PartnersInstanceService,
  PartnersServiceProviderFormService,
} from '../services';

@Controller()
export class ServiceProviderController {
  // More than 4 parameters allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly serviceProviderService: PartnersServiceProviderService,
    private readonly formService: PartnersServiceProviderFormService,
    private readonly accountPermissionService: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    private readonly instanceService: PartnersInstanceService,
    private readonly metadataFormService: MetadataFormService,
    private readonly i18n: Dto2FormI18nService,
  ) {}

  @Get(PartnersBackRoutes.SERVICE_PROVIDERS)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
  ])
  @UseGuards(AccessControlGuard)
  async getServiceProviders(
    @AccountPermissions()
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): Promise<
    FSA<FSAMeta, Omit<PartnersServiceProviderPayloadInterface, 'fcScopes'>[]>
  > {
    const serviceProviders =
      await this.serviceProviderService.getAllowedServiceProviders(permissions);

    const transformedServiceProviders = serviceProviders.map((sp) => {
      const { fcScopes: _fcScopes, ...rest } =
        this.formService.toDisplayValue(sp);
      return rest;
    });

    return {
      type: 'SERVICE_PROVIDER',
      payload: transformedServiceProviders,
    };
  }

  @Get(PartnersBackRoutes.SERVICE_PROVIDER)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_TECH,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  async getServiceProvider(
    @Param('serviceProviderId') serviceProviderId: string,
  ): Promise<FSA<FSAMeta, PartnersServiceProviderPayloadInterface>> {
    const serviceProvider =
      await this.serviceProviderService.getById(serviceProviderId);

    const transformedServiceProvider =
      this.formService.toDisplayValue(serviceProvider);

    const permissions =
      await this.accountPermissionService.getAccountsByPermissions<
        PartnersAccount,
        AccessControlPermission
      >(
        [
          AccessControlPermission.SP_ADMIN,
          AccessControlPermission.SP_TECH,
          AccessControlPermission.SP_CONTRIBUTOR,
        ],
        AccessControlEntity.SERVICE_PROVIDER,
        serviceProvider.id,
      );

    const transformedPermissions = permissions
      .map((permission) => {
        return {
          account: pick(permission.account, [
            'id',
            'email',
            'firstname',
            'lastname',
            'lastConnection',
            'phone',
          ]),
          permissionType: permission.permissionType,
        };
      })
      .sort(this.formService.sortPermissions.bind(this.formService));

    return {
      type: 'SERVICE_PROVIDER',
      payload: transformedServiceProvider,
      meta: {
        permissions: transformedPermissions,
      },
    };
  }

  @Post(PartnersBackRoutes.SERVICE_PROVIDER_CREATE_INSTANCE)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_TECH,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async createInstance(
    @Param('serviceProviderId') serviceProviderId: string,
    @Body() values: ServiceProviderInstanceVersionFromSpDto,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ): Promise<FSA<FSAMeta, unknown>> {
    const {
      identity: { id: accountId, email },
    } = sessionPartnersAccount.get();

    const serviceProvider =
      await this.serviceProviderService.getById(serviceProviderId);

    const version: InstanceVersionFromSpPayloadInterface = {
      ...values,
      signupId: serviceProvider.datapassRequestId,
    };

    const { instanceId, versionId } = await this.instanceService.create(
      version,
      { accountId, email, serviceProviderId },
      {
        environment: EnvironmentEnum.SANDBOX,
        grantInstanceContributor: false,
      },
    );

    return {
      type: 'INSTANCE',
      payload: { instanceId, versionId },
    };
  }

  @Get(PartnersBackRoutes.SERVICE_PROVIDER_INSTANCE_FORM_METADATA)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
    {
      permission: AccessControlPermission.SP_TECH,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
      entityIdLocation: { src: 'params', key: 'serviceProviderId' },
    },
  ])
  @UseGuards(AccessControlGuard)
  getInstanceFormMetadata(): MetadataDtoTranslationInterface[] {
    const payload = this.metadataFormService.getDtoMetadata(
      ServiceProviderInstanceVersionFromSpDto,
    );

    const payloadI18n = this.i18n.translation(payload);

    return payloadI18n;
  }
}
