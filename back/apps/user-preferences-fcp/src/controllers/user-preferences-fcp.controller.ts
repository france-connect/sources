import { Controller } from '@nestjs/common';

import { LoggerService } from '@fc/logger';

import { UserPreferencesFcpService } from '../services';

@Controller()
export class UserPreferencesFcpController {
  constructor(
    private readonly logger: LoggerService,
    private readonly userPreferencesFcp: UserPreferencesFcpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }
}
