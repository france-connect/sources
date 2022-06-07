import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerAccountService } from '@fc/partner-account';

import { ILoggedUser } from '../interfaces';

@Injectable()
export class PartnersService {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerAccountService: PartnerAccountService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async login(email: string): Promise<ILoggedUser> {
    const { firstname, lastname } =
      await this.partnerAccountService.findByEmail(email);

    return {
      firstname,
      lastname,
    };
  }
}
