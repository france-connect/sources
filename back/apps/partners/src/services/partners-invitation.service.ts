import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { AccountPermissionService } from '@fc/access-control';
import { CryptographyService } from '@fc/cryptography';
import { PartnersAccountService } from '@fc/partners-account';
import { TypeormService } from '@fc/typeorm';

import { AccessControlEntity, AccessControlPermission } from '../enums';

@Injectable()
export class PartnersInvitationService {
  constructor(
    private readonly partnersAccount: PartnersAccountService,
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    private readonly typeorm: TypeormService,
    private readonly crypto: CryptographyService,
  ) {}

  async inviteMany(emails: string[], instances: string[]): Promise<void> {
    await Promise.all(emails.map((email) => this.inviteOne(email, instances)));
  }

  async inviteOne(email: string, instances: string[]): Promise<void> {
    const account = {
      email,
      sub: this.crypto.hash(email),
    };

    await this.typeorm.withTransaction(async (queryRunner) => {
      const accountId = await this.partnersAccount.getOrCreateByEmail(
        queryRunner,
        account,
      );

      await this.accessControl.addPermissionTransactional(queryRunner, {
        accountId,
        permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      });

      await this.addInstancesPermissions(queryRunner, accountId, instances);
    });
  }

  private async addInstancesPermissions(
    queryRunner: QueryRunner,
    accountId: string,
    instances: string[],
  ): Promise<void> {
    for (const instanceId of instances) {
      await this.accessControl.addPermissionTransactional(queryRunner, {
        accountId,
        permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
        entity: AccessControlEntity.SP_INSTANCE,
        entityId: instanceId,
      });
    }
  }
}
