import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AccessControl, AccessControlGuard } from '@fc/access-control';
import { FSA, FSAMeta } from '@fc/common';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MetadataDtoTranslationInterface,
  MetadataFormService,
} from '@fc/dto2form';
import { PartnersAccountSession } from '@fc/partners-account';
import { ISessionService, Session } from '@fc/session';

import { AddContributorInputDto, DeleteContributorsInputDto } from '../dto';
import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
  PartnersBackRoutes,
} from '../enums';
import { PartnersContributorService } from '../services';

@Injectable()
@Controller()
export class ContributorController {
  constructor(
    private readonly partnersContributor: PartnersContributorService,
    private readonly metadataFormService: MetadataFormService,
    private readonly i18n: Dto2FormI18nService,
  ) {}

  @Post(PartnersBackRoutes.SERVICE_PROVIDER_CONTRIBUTORS)
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
  ])
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(FormValidationPipe)
  async addContributor(
    @Param('serviceProviderId') serviceProviderId: string,
    @Body() { email }: AddContributorInputDto,
    @Session('PartnersAccount', PartnersAccountSession)
    sessionPartnersAccount: ISessionService<
      PartnersAccountSession<AccessControlEntity, AccessControlPermission>
    >,
  ): Promise<void> {
    const {
      identity: { firstname, lastname },
    } = sessionPartnersAccount.get();

    await this.partnersContributor.addOne(email, serviceProviderId, {
      firstname,
      lastname,
    });
  }

  @Delete(PartnersBackRoutes.SERVICE_PROVIDER_CONTRIBUTORS)
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
  ])
  @UseGuards(AccessControlGuard)
  @UseGuards(CsrfTokenGuard)
  @UsePipes(ValidationPipe)
  async deleteContributors(
    @Param('serviceProviderId') serviceProviderId: string,
    @Body() { accountIds }: DeleteContributorsInputDto,
  ): Promise<FSA<FSAMeta, unknown>> {
    await this.partnersContributor.removeMany(accountIds, serviceProviderId);

    return {
      type: 'CONTRIBUTOR',
      payload: {},
    };
  }

  @Get(PartnersBackRoutes.SP_CONTRIBUTORS_FORM_METADATA)
  @AccessControl([
    {
      permission: AccessControlPermission.SP_CONTRIBUTOR,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    },
  ])
  @UseGuards(AccessControlGuard)
  getFormMetadata(): MetadataDtoTranslationInterface[] {
    const payload = this.metadataFormService.getDtoMetadata(
      AddContributorInputDto,
    );

    const payloadI18n = this.i18n.translation(payload);

    return payloadI18n;
  }
}
