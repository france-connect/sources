import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { LoggerService } from '@fc/logger';
import { FraudProtocol } from '@fc/microservices';

import { CsmrFraudService } from '../services';

@Controller()
export class CsmrFraudController {
  constructor(
    private readonly logger: LoggerService,
    private readonly csmrFraudService: CsmrFraudService,
  ) {}

  @MessagePattern(FraudProtocol.Commands.GET_HELLO)
  getHello(): string {
    this.logger.debug(
      `New message received with pattern "${FraudProtocol.Commands.GET_HELLO}"`,
    );
    return this.csmrFraudService.getHello();
  }
}
