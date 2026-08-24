import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccountPermission } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { AccessControlIdentityDto } from '../dto';
import { AccountPermissionInterface } from '../interfaces';

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

  async hasPermission(
    email: string,
    permissionTypes: PermissionType[],
    entity: EntityType,
    entityId: string,
  ): Promise<boolean> {
    const count = await this.accountPermission.count({
      where: {
        account: { email },
        permissionType: In(permissionTypes),
        entity,
        entityId,
      },
    });

    return count > 0;
  }

  async getAccountsByPermissions<A extends AccessControlIdentityDto, T>(
    permissions: T[],
    entity?: EntityType,
    entityId?: string,
  ): Promise<AccountPermissionInterface<A, T>[]> {
    const accountsPermissions = await this.accountPermission.find({
      where: { permissionType: In(permissions), entity, entityId },
      relations: ['account'],
    });

    return accountsPermissions.map((accountPermission) => ({
      account: accountPermission.account as unknown as A,
      permissionType: accountPermission.permissionType as T,
    }));
  }
}
