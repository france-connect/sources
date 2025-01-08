import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccountPermission } from '@entities/typeorm';

import { uuid } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';

@Injectable()
export class AccountPermissionRepository {
  constructor(
    @InjectRepository(PartnersAccountPermission)
    private readonly accountPermission: Repository<PartnersAccountPermission>,
  ) {}

  async init(accountId: uuid): Promise<void> {
    const data = {
      account: { id: accountId },
      entity: EntityType.SP_INSTANCE,
      permissionType: PermissionsType.LIST,
    };

    const existingPermission = await this.accountPermission.findOne({
      where: { ...data },
    });

    if (!existingPermission) {
      await this.accountPermission.save(data);
    }
  }

  addVersionPermission(accountId: uuid, entityId: uuid): any {
    const data = {
      account: { id: accountId },
      entityId,
      entity: EntityType.SP_INSTANCE_VERSION,
      permissionType: PermissionsType.VIEW,
    };

    return this.accountPermission.save(data);
  }

  addInstancePermission(accountId: uuid, entityId: uuid): any {
    const data = {
      account: { id: accountId },
      entityId,
      entity: EntityType.SP_INSTANCE,
      permissionType: PermissionsType.VIEW,
    };

    return this.accountPermission.save(data);
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
