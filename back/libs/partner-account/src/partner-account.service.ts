import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Account } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { AccountNotFound } from './exceptions';

@Injectable()
export class PartnerAccountService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(Account)
    private readonly partnerAccountRepository: Repository<Account>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async findByEmail(email: string): Promise<Account> {
    const account = await this.partnerAccountRepository.findOne({
      where: { email },
    });

    if (!account) {
      throw new AccountNotFound();
    }
    return account;
  }
}
