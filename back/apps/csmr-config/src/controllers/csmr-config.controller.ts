import { Injectable, UsePipes } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  ActionTypes,
  ConfigCreateMessageDto,
  ConfigDeleteMessageDto,
  ConfigResponseDto,
  ConfigUpdateMessageDto,
} from '@fc/csmr-config-client/protocol';
import {
  MicroservicesRmqMessageValidationPipe,
  MicroservicesRmqSubscriberService,
} from '@fc/microservices-rmq';
import {} from '@fc/microservices-rmq/pipes/message-validation.pipe';

import { ConfigPublishedEvent } from '../events';
import { ConfigPublishedEventPropertiesInterface } from '../interfaces';
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
    @Payload() message: ConfigCreateMessageDto,
  ): Promise<ConfigResponseDto> {
    const result = await this.csmrConfigService.create(message);

    const properties: ConfigPublishedEventPropertiesInterface = {
      type: ActionTypes.CONFIG_CREATE,
      payload: {
        message,
      },
      meta: result,
    };

    this.eventBus.publish(new ConfigPublishedEvent(properties));

    return this.subscriber.response(message);
  }

  @MessagePattern(ActionTypes.CONFIG_UPDATE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async updateConfig(
    @Payload() message: ConfigUpdateMessageDto,
  ): Promise<ConfigResponseDto> {
    const result = await this.csmrConfigService.update(message);

    const properties: ConfigPublishedEventPropertiesInterface = {
      type: ActionTypes.CONFIG_UPDATE,
      payload: {
        message,
      },
      meta: result,
    };

    this.eventBus.publish(new ConfigPublishedEvent(properties));

    return this.subscriber.response(message);
  }

  // @NOTE the deletion tolerates the extra properties of an outdated instance
  // instead of rejecting them, they are stripped and only the client
  // identifier is validated
  @MessagePattern(ActionTypes.CONFIG_DELETE)
  @UsePipes(
    new MicroservicesRmqMessageValidationPipe({ forbidNonWhitelisted: false }),
  )
  async deleteConfig(
    @Payload() message: ConfigDeleteMessageDto,
  ): Promise<ConfigResponseDto> {
    const result = await this.csmrConfigService.delete(message);

    const properties: ConfigPublishedEventPropertiesInterface = {
      type: ActionTypes.CONFIG_DELETE,
      payload: {
        message,
      },
      meta: result,
    };

    this.eventBus.publish(new ConfigPublishedEvent(properties));

    return this.subscriber.response(message);
  }
}
