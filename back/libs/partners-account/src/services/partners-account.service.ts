import { InsertResult, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

@Injectable()
export class PartnersAccountService {
  constructor(
    @InjectRepository(PartnersAccount)
    private repository: Repository<PartnersAccount>,
  ) {}

  upsert(
    account: Omit<
      PartnersAccount,
      'id' | 'createdAt' | 'updatedAt' | 'accountPermissions'
    >,
  ): Promise<InsertResult> {
    return this.repository.upsert(account, ['email']);
  }
}
