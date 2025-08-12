import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  ActionTypes,
  FraudMessageDto,
  FraudResponseDto,
} from '@fc/csmr-fraud-client/protocol';
import {
  MicroservicesRmqMessageValidationPipe,
  MicroservicesRmqSubscriberService,
} from '@fc/microservices-rmq';

import { CsmrFraudDataService, CsmrFraudSupportService } from '../services';

@Controller()
export class CsmrFraudController {
  constructor(
    private readonly data: CsmrFraudDataService,
    private readonly support: CsmrFraudSupportService,
    private readonly subscriber: MicroservicesRmqSubscriberService,
  ) {}

  @MessagePattern(ActionTypes.PROCESS_VERIFIED_IDENTITY_FRAUD_CASE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async processFraudCase(
    @Payload() message: FraudMessageDto,
  ): Promise<FraudResponseDto> {
    const { fraudCase, identity } = message.payload;

    const { ticketData, trackingData } = await this.data.enrichFraudData(
      identity,
      fraudCase,
    );
    await this.support.createSecurityTicket(ticketData);

    return this.subscriber.response<FraudResponseDto>(trackingData);
  }

  @MessagePattern(ActionTypes.PROCESS_UNVERIFIED_IDENTITY_FRAUD_CASE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async processUnverifiedFraudCase(
    @Payload() message: FraudMessageDto,
  ): Promise<FraudResponseDto> {
    const { fraudCase, identity } = message.payload;

    const { ticketData, trackingData } =
      await this.data.enrichUnverifiedIdentityFraudData(identity, fraudCase);

    await this.support.createSecurityTicket(ticketData);

    return this.subscriber.response<FraudResponseDto>(trackingData);
  }
}
