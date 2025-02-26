import { Injectable } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { ConfigMessageDto, ConfigResponseDto } from '../protocol';

@Injectable()
export class CsmrConfigClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async publish(message: ConfigMessageDto): Promise<ConfigResponseDto> {
    return await this.rmqService.publish<ConfigMessageDto, ConfigResponseDto>(
      message.type,
      message,
    );
  }
}
