import { Injectable } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import {
  FraudCaseMessageDto,
  FraudCaseResponseDto,
  FraudTracksMessageDto,
  FraudTracksResponseDto,
} from '../dto';

@Injectable()
export class CsmrFraudClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async publishFraudCase(
    message: FraudCaseMessageDto,
  ): Promise<FraudCaseResponseDto> {
    return await this.rmqService.publish<
      FraudCaseMessageDto,
      FraudCaseResponseDto
    >(message.type, message);
  }

  async publishFraudTracks(
    message: FraudTracksMessageDto,
  ): Promise<FraudTracksResponseDto> {
    return await this.rmqService.publish<
      FraudTracksMessageDto,
      FraudTracksResponseDto
    >(message.type, message);
  }
}
