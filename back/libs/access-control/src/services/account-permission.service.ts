import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { NO_ENTITY_ID, PartnersAccountPermission } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { PartnersAccountSession } from '@fc/partners-account';
import { PostgresNativeError } from '@fc/postgres';
import { SessionService } from '@fc/session';

import { AddPermissionInterface, PermissionInterface } from '../interfaces';
import { ACCESS_CONTROL_TOKEN } from '../tokens';
import { AccountPermissionRepository } from './account-permission.repository';

@Injectable()
export class AccountPermissionService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly accountPermission: AccountPermissionRepository,
    private readonly logger: LoggerService,
  ) {}

  getPermissionsFromSession(): PermissionInterface[] {
    const sessionData =
      this.sessionService.get<PartnersAccountSession>('PartnersAccount');

    const { userPermissions } = sessionData[ACCESS_CONTROL_TOKEN];
    return userPermissions;
  }

  async addPermission(permission: AddPermissionInterface): Promise<void> {
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
    permission: AddPermissionInterface,
  ): Promise<void> {
    const {
      accountId,
      permissionType,
      entity,
      entityId = NO_ENTITY_ID,
    } = permission;

    try {
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
        .execute();
    } catch (error) {
      if (error.code === PostgresNativeError.DUPLICATE_ENTRY) {
        this.logger.warning({
          msg: 'Tried to insert existing permission',
          accountId,
          permissionType,
          entity,
          entityId,
        });
      } else {
        throw error;
      }
    }
  }
}
