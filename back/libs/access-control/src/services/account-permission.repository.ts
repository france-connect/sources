import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccountPermission } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger';

@Injectable()
export class AccountPermissionRepository<
  EntityType extends string,
  PermissionType extends string,
> {
  constructor(
    @InjectRepository(PartnersAccountPermission)
    private readonly accountPermission: Repository<PartnersAccountPermission>,
    private readonly logger: LoggerService,
  ) {}

  async insert(
    accountId: uuid,
    permissionType: PermissionType,
    entity: EntityType,
    entityId: uuid,
  ): Promise<void> {
    const data = {
      accountId,
      permissionType,
      entity,
      entityId,
    };

    await this.accountPermission.insert(data).catch((error) => {
      this.logger.warning({
        msg: 'Tried to insert existing permission',
        ...data,
        error,
      });
    });
  }

  async getByEmail(email: string): Promise<PartnersAccountPermission[]> {
    const rows = await this.accountPermission.find({
      select: {
        entity: true,
        entityId: true,
        permissionType: true,
      },
      where: {
        account: {
          email,
        },
      },
    });

    return rows;
  }
}
