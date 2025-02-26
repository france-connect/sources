import { Inject } from '@nestjs/common';

import { PublicationStatusEnum } from '@entities/typeorm';

import {
  ActionTypes,
  ConfigCreateMessageDtoPayload,
  ConfigResponseDto,
  CsmrConfigClientService,
} from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';

export class PartnerPublicationService {
  constructor(
    @Inject('ConfigSandboxLow')
    private readonly configSandboxLow: CsmrConfigClientService,
    private readonly version: PartnersServiceProviderInstanceVersionService,
  ) {}

  async publish(
    instanceId: string,
    versionId: string,
    payload: ConfigCreateMessageDtoPayload,
    type: ActionTypes,
  ): Promise<ConfigResponseDto> {
    const message = {
      type,
      meta: {
        instanceId,
        versionId,
        publicationStatus: PublicationStatusEnum.PENDING,
      },
      payload,
    };

    try {
      return await this.configSandboxLow.publish(message);
    } catch (error) {
      await this.version.updateStatus({
        id: versionId,
        publicationStatus: PublicationStatusEnum.FAILED,
      });

      throw error;
    }
  }
}
