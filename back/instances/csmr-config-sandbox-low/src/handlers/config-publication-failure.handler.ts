import { Inject, Injectable } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ActionTypes, CsmrConfigClientService } from '@fc/csmr-config-client';
import { ExceptionCaughtEvent } from '@fc/exceptions';

@EventsHandler(ExceptionCaughtEvent)
@Injectable()
export class ConfigPublicationFailureEventHandler {
  constructor(
    @Inject('ConfigPartners')
    private readonly partnerClient: CsmrConfigClientService,
  ) {}

  async handle(event: ExceptionCaughtEvent) {
    const message = event.context.getData();
    const { payload, meta } = message;

    const statusMessage = {
      type: ActionTypes.CONFIG_UPDATE,
      payload,
      meta: {
        ...meta,
        publicationStatus: PublicationStatusEnum.FAILED,
      },
    };

    await this.partnerClient.publish(statusMessage);
  }
}
