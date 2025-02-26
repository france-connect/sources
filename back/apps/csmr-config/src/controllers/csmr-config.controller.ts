import { Injectable, UsePipes } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  ActionTypes,
  ConfigMessageDto,
  ConfigResponseDto,
} from '@fc/csmr-config-client/protocol';
import {
  MicroservicesRmqMessageValidationPipe,
  MicroservicesRmqSubscriberService,
} from '@fc/microservices-rmq';
import {} from '@fc/microservices-rmq/pipes/message-validation.pipe';

import { ConfigPublishedEvent } from '../events';
import { CsmrConfigService } from '../services';

@Injectable()
export class CsmrConfigController {
  constructor(
    private readonly csmrConfigService: CsmrConfigService,
    private readonly eventBus: EventBus,
    private readonly subscriber: MicroservicesRmqSubscriberService,
  ) {}

  @MessagePattern(ActionTypes.CONFIG_CREATE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async createConfig(
    @Payload() message: ConfigMessageDto,
  ): Promise<ConfigResponseDto> {
    await this.csmrConfigService.create(message);

    this.eventBus.publish(new ConfigPublishedEvent(message));

    return this.subscriber.response(message);
  }

  @MessagePattern(ActionTypes.CONFIG_UPDATE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async updateConfig(
    @Payload() message: ConfigMessageDto,
  ): Promise<ConfigResponseDto> {
    await this.csmrConfigService.update(message);

    this.eventBus.publish(new ConfigPublishedEvent(message));

    return this.subscriber.response(message);
  }
}
