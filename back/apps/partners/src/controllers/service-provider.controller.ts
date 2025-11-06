import { Controller, Get, UseGuards } from '@nestjs/common';

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

@Controller()
export class ServiceProviderController {
  constructor(
    private readonly serviceProviderService: PartnersServiceProviderService,
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
}
