import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';

@Injectable()
export class PartnerDatapassService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }
}