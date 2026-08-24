import { Injectable } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { ConfigBaseMessageDto, ConfigResponseDto } from '../protocol';

@Injectable()
export class CsmrConfigClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async publish(message: ConfigBaseMessageDto): Promise<ConfigResponseDto> {
    return await this.rmqService.publish<
      ConfigBaseMessageDto,
      ConfigResponseDto
    >(message.type, message);
  }
}
