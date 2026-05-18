import { pick } from 'lodash';

import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { PartnersAccount } from '@entities/typeorm';

import {
  AccessControl,
  AccessControlGuard,
  AccountPermissions,
  AccountPermissionService,
  PermissionInterface,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';

import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
  PartnersBackRoutes,
} from '../enums';
import { PartnersServiceProviderPayloadInterface } from '../interfaces';
import { PartnersServiceProviderFormService } from '../services';

@Controller()
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: PartnersServiceProviderService,
    private readonly formService: PartnersServiceProviderFormService,
    private readonly accountPermissionService: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
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

    const transformedPermissions = permissions.map((permission) => {
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
    });

    return {
      type: 'SERVICE_PROVIDER',
      payload: transformedServiceProvider,
      meta: {
        permissions: transformedPermissions,
      },
    };
  }
}
