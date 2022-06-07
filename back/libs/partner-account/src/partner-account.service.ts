import { Injectable } from '@nestjs/common';

import { Account } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { AccountNotFound } from './exceptions';
import { PartnerAccountRepository } from './repositories';

@Injectable()
export class PartnerAccountService {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerAccountRepository: PartnerAccountRepository,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async findByEmail(email: string): Promise<Account> {
    const account = await this.partnerAccountRepository.findByEmail(email);

    if (!account) {
      throw new AccountNotFound();
    }
    return account;
  }
}
