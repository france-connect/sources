import { EntityRepository, Repository } from 'typeorm';

import { Account } from '@entities/typeorm';

import { PostgresConnectionFailure } from '../exceptions';

@EntityRepository(Account)
export class PartnerAccountRepository extends Repository<Account> {
  async findByEmail(email: string): Promise<Account> {
    let existingUser;
    try {
      existingUser = await this.findOne({ where: { email } });
    } catch (e) {
      throw new PostgresConnectionFailure();
    }

    return existingUser;
  }
}
