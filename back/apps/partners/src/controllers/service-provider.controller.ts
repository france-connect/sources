import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  AccessControlGuard,
  AccountPermissions,
  IPermission,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta, IdParamDto, PaginationOptionDto } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { IServiceProviderItem } from '@fc/partner-service-provider';

import { PartnersRoutes } from '../enums';
import { IServiceProviderList } from '../interfaces';
import { PartnersService } from '../services';

@Controller()
export class ServiceProviderController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(PartnersRoutes.SERVICE_PROVIDER_LIST)
  @RequirePermission(PermissionsType.SERVICE_PROVIDER_LIST)
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getServiceProviderList(
    @AccountPermissions() permissions: IPermission[],
    @Query() query: PaginationOptionDto,
  ): Promise<IServiceProviderList> {
    const { offset, size } = query;

    const serviceProviderList =
      await this.partnersService.getServiceProvidersFromPermissions(
        permissions,
        offset,
        size,
      );

    return serviceProviderList;
  }

  @Get(PartnersRoutes.SERVICE_PROVIDER_VIEW)
  @RequirePermission(PermissionsType.SERVICE_PROVIDER_VIEW)
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getServiceProviderView(
    @Param() params: IdParamDto,
  ): Promise<FSA<FSAMeta, Partial<IServiceProviderItem>>> {
    const { id: serviceProviderId } = params;
    const { id, name, organisation, platform, status } =
      await this.partnersService.getServiceProviderById(serviceProviderId);

    const payload = {
      id,
      name,
      organisation,
      platform,
      status,
    };

    const data = {
      type: 'SERVICE_PROVIDER_VIEW',
      payload,
    };

    return data;
  }

  @Get(PartnersRoutes.SERVICE_PROVIDER_EDIT)
  @RequirePermission(PermissionsType.SERVICE_PROVIDER_EDIT)
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getServiceProviderEdit(
    @Param() params: IdParamDto,
  ): Promise<FSA<FSAMeta, Partial<IServiceProviderItem>>> {
    const { id: serviceProviderId } = params;

    const { id, name, organisation, platform, status } =
      await this.partnersService.getServiceProviderById(serviceProviderId);

    const payload = {
      id,
      name,
      organisation,
      platform,
      status,
    };

    const data = {
      type: 'SERVICE_PROVIDER_EDIT',
      payload,
    };

    return data;
  }
}
