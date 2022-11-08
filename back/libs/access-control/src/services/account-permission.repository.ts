import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountPermission } from '@entities/typeorm';

import { uuid } from '@fc/common';

@Injectable()
export class AccountPermissionRepository {
  constructor(
    @InjectRepository(AccountPermission)
    private readonly accountPermission: Repository<AccountPermission>,
  ) {}

  /**
   * @todo should we wrap all queries with custom exceptions?
   */
  async getByAccountId(id: uuid): Promise<AccountPermission[]> {
    const rows = await this.accountPermission.find({
      select: {
        entity: true,
        entityId: true,
        permissionType: true,
      },
      where: {
        account: {
          id,
        },
      },
    });

    return rows;
  }
}
