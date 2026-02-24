import { Controller, Get, Injectable, UseGuards } from '@nestjs/common';

import { AccessControl, AccessControlGuard } from '@fc/access-control';
import {
  Dto2FormI18nService,
  MetadataDtoTranslationInterface,
  MetadataFormService,
} from '@fc/dto2form';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';

import {
  AccessControlHandler,
  AccessControlPermission,
  PartnersBackRoutes,
} from '../enums';

@Controller()
@Injectable()
export class VersionController {
  constructor(
    private readonly metadataFormService: MetadataFormService,
    private readonly partnersi18n: Dto2FormI18nService,
  ) {}

  @Get(PartnersBackRoutes.SP_VERSION_FORM_METADATA)
  @AccessControl([
    {
      permission: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
  ])
  @UseGuards(AccessControlGuard)
  getFormMetadata(): MetadataDtoTranslationInterface[] {
    const payload = this.metadataFormService.getDtoMetadata(
      ServiceProviderInstanceVersionDto,
    );

    const payloadI18n = this.partnersi18n.translation(payload);

    return payloadI18n;
  }
}
