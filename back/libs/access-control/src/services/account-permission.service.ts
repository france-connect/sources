import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { NO_ENTITY_ID, PartnersAccountPermission } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { AccessControlAccountSession, AccessControlIdentityDto } from '../dto';
import {
  AccountPermissionInterface,
  AddPermissionInterface,
  PermissionInterface,
} from '../interfaces';
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

  hasPermission(
    email: string,
    permissionTypes: PermissionType[],
    entity: EntityType,
    entityId: string,
  ): Promise<boolean> {
    return this.accountPermission.hasPermission(
      email,
      permissionTypes,
      entity,
      entityId,
    );
  }

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

  async removePermissionTransactional(
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
      .delete()
      .from(PartnersAccountPermission)
      .where('accountId = :accountId', { accountId })
      .andWhere('permissionType = :permissionType', { permissionType })
      .andWhere('entity = :entity', { entity })
      .andWhere('entityId = :entityId', { entityId })
      .execute();
  }

  getAccountsByPermissions<A extends AccessControlIdentityDto, T>(
    permissionTypes: T[],
    entity?: EntityType,
    entityId?: string,
  ): Promise<AccountPermissionInterface<A, T>[]> {
    return this.accountPermission.getAccountsByPermissions<A, T>(
      permissionTypes,
      entity,
      entityId,
    );
  }
}
