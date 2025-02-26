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
import { PartnersI18nService } from '../services';

@Controller()
@Injectable()
export class VersionController {
  constructor(
    private readonly metadataFormService: MetadataFormService,
    private readonly partnersi18n: PartnersI18nService,
  ) {}

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

    const payloadI18n = this.partnersi18n.translation(payload);

    return payloadI18n;
  }
}
