import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import {
  AccessControl,
  AccessControlGuard,
  AccountPermissions,
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
  ) {}

  @Get(PartnersBackRoutes.SERVICE_PROVIDERS)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_ADMIN,
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
  ])
  @UseGuards(AccessControlGuard)
  async getServiceProvider(
    @Param('serviceProviderId') serviceProviderId: string,
  ): Promise<FSA<FSAMeta, PartnersServiceProviderPayloadInterface>> {
    const serviceProvider =
      await this.serviceProviderService.getById(serviceProviderId);

    const transformedServiceProvider =
      this.formService.toDisplayValue(serviceProvider);

    return {
      type: 'SERVICE_PROVIDER',
      payload: transformedServiceProvider,
    };
  }
}
