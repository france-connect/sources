import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import {
  AccessControlGuard,
  AccountPermissions,
  PermissionInterface,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';

import {
  AccessControlEntity,
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
  @RequirePermission({
    permissionType: AccessControlPermission.LIST,
    entity: AccessControlEntity.SERVICE_PROVIDER,
  })
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
  @RequirePermission({
    permissionType: AccessControlPermission.VIEW,
    entity: AccessControlEntity.SERVICE_PROVIDER,
    entityIdLocation: { src: 'params', key: 'serviceProviderId' },
  })
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
