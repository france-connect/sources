import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProcessFraudCasePayloadDto } from '@fc/csmr-fraud-client';
import { LoggerService } from '@fc/logger';
import { FraudProtocol } from '@fc/microservices';

import { CsmrFraudDataService, CsmrFraudSupportService } from '../services';
import _ = require('lodash');

@Controller()
export class CsmrFraudController {
  constructor(
    private readonly logger: LoggerService,
    private readonly data: CsmrFraudDataService,
    private readonly support: CsmrFraudSupportService,
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
    @Payload() payload: ProcessFraudCasePayloadDto,
  ): Promise<'SUCCESS' | 'ERROR'> {
    this.logger.debug(
      `New message received with pattern "${FraudProtocol.Commands.PROCESS_FRAUD_CASE}"`,
    );

    const { identity, fraudCase } = payload;

    try {
      const ticketData = this.data.enrichFraudData(identity, fraudCase);
      await this.support.createSecurityTicket(ticketData);

      return 'SUCCESS';
    } catch (error) {
      this.logger.err(error);

      return 'ERROR';
    }
  }
}
