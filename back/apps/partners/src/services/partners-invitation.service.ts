import { QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { CryptographyService } from '@fc/cryptography';
import { PartnersAccountService } from '@fc/partners-account';
import { TypeormService } from '@fc/typeorm';

@Injectable()
export class PartnersInvitationService {
  constructor(
    private readonly partnersAccount: PartnersAccountService,
    private readonly accessControl: AccountPermissionService,
    private readonly typeorm: TypeormService,
    private readonly crypto: CryptographyService,
  ) {}

  async inviteMany(emails: string[], instances: string[]): Promise<void> {
    await Promise.all(emails.map((email) => this.inviteOne(email, instances)));
  }

  async inviteOne(email: string, instances: string[]): Promise<void> {
    const account = {
      email,
      /**
       * Data model does not allow those fields to be null or undefined,
       * We use a placeholder for now to avoid schema migration,
       * since the migration system is not yet automatized.
       *
       * @todo "2377" Update the data model and remove those placeholders
       * @todo Add a flag to indicate that the account is not fully initialized
       */
      firstname: 'N/A',
      lastname: 'N/A',
      sub: this.crypto.hash(email),
    };

    await this.typeorm.withTransaction(async (queryRunner) => {
      const accountId = await this.partnersAccount.getOrCreateByEmail(
        queryRunner,
        account,
      );

      await this.accessControl.addPermissionTransactional(queryRunner, {
        accountId,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SP_INSTANCE,
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
        permissionType: PermissionsType.VIEW,
        entity: EntityType.SP_INSTANCE,
        entityId: instanceId,
      });
    }
  }
}
