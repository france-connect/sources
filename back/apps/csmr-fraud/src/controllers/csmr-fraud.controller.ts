import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  ActionTypes,
  FraudCaseMessageDto,
  FraudCaseResponseDto,
  FraudTracksMessageDto,
  FraudTracksResponseDto,
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
    @Payload() message: FraudCaseMessageDto,
  ): Promise<FraudCaseResponseDto> {
    const { fraudCase, identity } = message.payload;

    const { ticketData, trackingData } = await this.data.enrichFraudData(
      identity,
      fraudCase,
    );
    await this.support.createSecurityTicket(ticketData);

    return this.subscriber.response<FraudCaseResponseDto>(trackingData);
  }

  @MessagePattern(ActionTypes.PROCESS_UNVERIFIED_IDENTITY_FRAUD_CASE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async processUnverifiedFraudCase(
    @Payload() message: FraudCaseMessageDto,
  ): Promise<FraudCaseResponseDto> {
    const { fraudCase, identity } = message.payload;

    const { ticketData, trackingData } =
      await this.data.enrichUnverifiedIdentityFraudData(identity, fraudCase);

    await this.support.createSecurityTicket(ticketData);

    return this.subscriber.response<FraudCaseResponseDto>(trackingData);
  }

  @MessagePattern(ActionTypes.GET_FRAUD_TRACKS)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  async getFraudTracks(
    @Payload() message: FraudTracksMessageDto,
  ): Promise<FraudTracksResponseDto> {
    const { authenticationEventId } = message.payload;

    const fraudTracks = await this.data.fetchFraudTracks(authenticationEventId);

    return this.subscriber.response<FraudTracksResponseDto>(fraudTracks);
  }
}
