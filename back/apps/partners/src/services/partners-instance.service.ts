import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import {
  PartnersServiceProviderInstance,
  PublicationStatusEnum,
} from '@entities/typeorm';

import {
  ActionTypes,
  ConfigCreateViaMessageDtoPayload,
} from '@fc/csmr-config-client';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { TypeormService } from '@fc/typeorm';

import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';
import { PartnerPublicationService } from './partners-publication.service';

@Injectable()
export class PartnersInstanceService {
  constructor(
    private readonly typeorm: TypeormService,
    private readonly version: PartnersServiceProviderInstanceVersionService,
    private readonly publication: PartnerPublicationService,
    private readonly form: PartnersInstanceVersionFormService,
  ) {}

  // It is what it takes...
  // eslint-disable-next-line max-params
  async update(
    queryRunner: QueryRunner,
    data: ServiceProviderInstanceVersionDto | OidcClientInterface,
    instance: PartnersServiceProviderInstance,
    serviceProviderId: string,
    updatedBy: string,
  ): Promise<void> {
    const fullData = await this.form.fromFormValues(
      data,
      serviceProviderId,
      instance.id,
    );

    // Skip "DRAFT" for sandbox since there is no point to update right after creation
    const status = PublicationStatusEnum.PENDING;

    const { id: versionId } = await this.version.create(
      queryRunner,
      fullData,
      instance.id,
      status,
    );

    const fullDataWithCreatedInfo: ConfigCreateViaMessageDtoPayload = {
      ...fullData,
      updatedBy,
    };

    await this.publication.publish(
      instance.id,
      versionId,
      fullDataWithCreatedInfo,
      ActionTypes.CONFIG_UPDATE,
    );
  }
}
