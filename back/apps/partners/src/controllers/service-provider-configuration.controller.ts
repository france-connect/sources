import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  AccessControlGuard,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import {
  PartnerServiceProviderConfigurationMissingSpIdException,
  ServiceProviderConfigurationDto,
  ServiceProviderConfigurationItemInterface,
} from '@fc/partner-service-provider-configuration';

import { getConfigurationsFromServiceProviderQueryDto } from '../dto';
import { PartnersRoutes } from '../enums';
import { ServiceProviderConfigurationListInterface } from '../interfaces';
import { PartnersService } from '../services';

@Controller()
export class ServiceProviderConfigurationController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(PartnersRoutes.SERVICE_PROVIDER_CONFIGURATION_LIST)
  @RequirePermission(PermissionsType.SERVICE_PROVIDER_CONFIGURATION_LIST)
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async getConfigurationsFromServiceProvider(
    @Query() query: getConfigurationsFromServiceProviderQueryDto,
  ): Promise<ServiceProviderConfigurationListInterface> {
    const { serviceProviderId } = query;

    const spConfigList =
      await this.partnersService.getConfigurationsFromServiceProvider(
        serviceProviderId,
      );

    return spConfigList;
  }

  @Post(PartnersRoutes.SERVICE_PROVIDER_CONFIGURATION_CREATE)
  @RequirePermission(PermissionsType.SERVICE_PROVIDER_CONFIGURATION_CREATE)
  @UseGuards(AccessControlGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async postServiceProviderConfiguration(
    @Body() body: ServiceProviderConfigurationDto,
  ): Promise<FSA<FSAMeta, Partial<ServiceProviderConfigurationItemInterface>>> {
    const { serviceProviderId } = body;

    if (!serviceProviderId) {
      throw new PartnerServiceProviderConfigurationMissingSpIdException();
    }

    const data = await this.partnersService.saveConfigurationForServiceProvider(
      serviceProviderId,
    );

    return data;
  }
}
