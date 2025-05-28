import { Injectable } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import {
  CsmrHsmClientMessageDto,
  CsmrHsmClientResponseDto,
  CsmrHsmRandomMessageDto,
} from '../dto';

@Injectable()
export class CsmrHsmClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async publish(
    message: CsmrHsmClientMessageDto,
  ): Promise<CsmrHsmClientResponseDto> {
    return await this.rmqService.publish<
      CsmrHsmClientMessageDto,
      CsmrHsmClientResponseDto
    >(message.type, message, CsmrHsmClientResponseDto);
  }

  async random(
    message: CsmrHsmRandomMessageDto,
  ): Promise<CsmrHsmClientResponseDto> {
    return await this.rmqService.publish<
      CsmrHsmRandomMessageDto,
      CsmrHsmClientResponseDto
    >(message.type, message, CsmrHsmClientResponseDto);
  }
}
