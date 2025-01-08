import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';

import {
  AccessControlGuard,
  EntityType,
  PermissionsType,
  RequirePermission,
} from '@fc/access-control';
import { MetadataDtoInterface, MetadataFormService } from '@fc/dto2form';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';

import { PartnersBackRoutes } from '../enums';

@Controller()
@Injectable()
export class VersionController {
  constructor(private readonly metadataFormService: MetadataFormService) {}

  @Get(PartnersBackRoutes.SP_VERSION_FORM_METADATA)
  @RequirePermission({
    permissionType: PermissionsType.LIST,
    entity: EntityType.SP_INSTANCE,
  })
  @UseGuards(AccessControlGuard)
  getFormMetadata(): MetadataDtoInterface[] {
    const payload = this.metadataFormService.getDtoMetadata(
      ServiceProviderInstanceVersionDto,
    );

    return payload;
  }
}
