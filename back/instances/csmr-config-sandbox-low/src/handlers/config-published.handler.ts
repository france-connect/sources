import { Inject, Injectable } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ConfigPublishedEvent } from '@fc/csmr-config';
import { ActionTypes, CsmrConfigClientService } from '@fc/csmr-config-client';

@EventsHandler(ConfigPublishedEvent)
@Injectable()
export class ConfigPublishedEventHandler {
  constructor(
    @Inject('ConfigPartners')
    private readonly partnerClient: CsmrConfigClientService,
  ) {}

  async handle(event: ConfigPublishedEvent) {
    const {
      message: { meta, payload },
    } = event;

    const statusMessage = {
      type: ActionTypes.CONFIG_UPDATE,
      payload,
      meta: {
        ...meta,
        publicationStatus: PublicationStatusEnum.PUBLISHED,
      },
    };

    await this.partnerClient.publish(statusMessage);
  }
}
