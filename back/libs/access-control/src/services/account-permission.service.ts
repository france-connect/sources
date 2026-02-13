import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { NO_ENTITY_ID, PartnersAccountPermission } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { AccessControlAccountSession } from '../dto';
import { AddPermissionInterface, PermissionInterface } from '../interfaces';
import { AccountPermissionRepository } from './account-permission.repository';

@Injectable()
export class AccountPermissionService<
  EntityType extends string,
  PermissionType extends string,
> {
  constructor(
    private readonly sessionService: SessionService,
    private readonly accountPermission: AccountPermissionRepository<
      EntityType,
      PermissionType
    >,
    private readonly logger: LoggerService,
  ) {}

  getPermissionsFromSession(): PermissionInterface<
    EntityType,
    PermissionType
  >[] {
    const sessionData =
      this.sessionService.get<
        AccessControlAccountSession<EntityType, PermissionType>
      >('PartnersAccount');

    const { permissions } = sessionData;
    return permissions;
  }

  async addPermission(
    permission: AddPermissionInterface<EntityType, PermissionType>,
  ): Promise<void> {
    const {
      accountId,
      permissionType,
      entity,
      entityId = NO_ENTITY_ID,
    } = permission;

    await this.accountPermission.insert(
      accountId,
      permissionType,
      entity,
      entityId,
    );
  }

  async addPermissionTransactional(
    queryRunner: QueryRunner,
    permission: AddPermissionInterface<EntityType, PermissionType>,
  ): Promise<void> {
    const {
      accountId,
      permissionType,
      entity,
      entityId = NO_ENTITY_ID,
    } = permission;

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersAccountPermission)
      .values({
        accountId,
        permissionType,
        entity,
        entityId,
      })
      .orIgnore()
      .execute();
  }
}
