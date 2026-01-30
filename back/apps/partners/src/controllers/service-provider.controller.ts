import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissions,
  EntityType,
  PermissionInterface,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';

import { PartnersBackRoutes } from '../enums';
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
    permissionType: PermissionsType.LIST,
    entity: EntityType.SERVICE_PROVIDER,
  })
  @UseGuards(AccessControlGuard)
  async getServiceProviders(
    @AccountPermissions() permissions: PermissionInterface[],
  ): Promise<FSA<FSAMeta, PartnersServiceProvider[]>> {
    const serviceProviders =
      await this.serviceProviderService.getAllowedServiceProviders(permissions);

    return {
      type: 'SERVICE_PROVIDER',
      payload: serviceProviders,
    };
  }

  @Get(PartnersBackRoutes.SERVICE_PROVIDER)
  @RequirePermission({
    permissionType: PermissionsType.VIEW,
    entity: EntityType.SERVICE_PROVIDER,
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
