import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { FraudMessageDto, FraudResponseDto } from '@fc/csmr-fraud-client';
import { FraudProtocol } from '@fc/microservices';
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

import { CsmrFraudDataService, CsmrFraudSupportService } from '../services';

@Controller()
export class CsmrFraudController {
  constructor(
    private readonly data: CsmrFraudDataService,
    private readonly support: CsmrFraudSupportService,
    private readonly subscriber: MicroservicesRmqSubscriberService,
  ) {}

  @MessagePattern(FraudProtocol.Commands.PROCESS_FRAUD_CASE)
  @UsePipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  )
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
}
