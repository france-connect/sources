import { Injectable } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { FraudMessageDto, FraudResponseDto } from '../dto';

@Injectable()
export class CsmrFraudClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async publish(message: FraudMessageDto): Promise<FraudResponseDto> {
    return await this.rmqService.publish<FraudMessageDto, FraudResponseDto>(
      message.type,
      message,
    );
  }
}
