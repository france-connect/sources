import { pick } from 'lodash';
import { FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import { AccountPermissionService } from '@fc/access-control';
import { normalizeEmail } from '@fc/common';
import {
  AccessControlEntity,
  AccessControlPermission,
} from '@fc/partners/enums';
import { queryBuilderGetCurrentTimestamp, TypeormService } from '@fc/typeorm';

import { PartnersAccountInitException } from '../exceptions';
import { AccountInitInputInterface } from '../interfaces';

@Injectable()
export class PartnersAccountService {
  constructor(
    @InjectRepository(PartnersAccount)
    private readonly repository: Repository<PartnersAccount>,
    private readonly accessControl: AccountPermissionService<
      AccessControlEntity,
      AccessControlPermission
    >,
    private readonly typeorm: TypeormService,
  ) {}

  async init(data: AccountInitInputInterface): Promise<PartnersAccount['id']> {
    let accountId: PartnersAccount['id'];

    try {
      accountId = await this.typeorm.withTransaction(
        async (queryRunner: QueryRunner) => {
          const accountId = await this.upsert(queryRunner, data);

          await this.addPermissions(queryRunner, accountId);

          return accountId;
        },
      );
    } catch (error) {
      throw new PartnersAccountInitException(error);
    }

    return accountId;
  }

  async getOrCreateByEmail(
    queryRunner: QueryRunner,
    account: AccountInitInputInterface,
    options: { upsertFields: string[] } = {
      upsertFields: ['firstname', 'lastname'],
    },
  ): Promise<PartnersAccount['id']> {
    const normalizedAccount = {
      ...account,
      email: normalizeEmail(account.email),
    };

    const accountId = await this.upsert(
      queryRunner,
      normalizedAccount,
      options,
    );

    return accountId;
  }

  private async upsert(
    queryRunner: QueryRunner,
    data: AccountInitInputInterface,
    options: { upsertFields: string[] } = {
      upsertFields: ['firstname', 'lastname'],
    },
  ): Promise<PartnersAccount['id']> {
    const result = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersAccount)
      .values(data)
      .orUpdate(options.upsertFields, ['email'])
      .returning(['id'])
      .execute();

    const accountId = result.raw[0]?.id;

    return accountId;
  }

  private async addPermissions(
    queryRunner: QueryRunner,
    accountId: PartnersAccount['id'],
  ): Promise<void> {
    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
    });

    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: AccessControlPermission.SP_CONTRIBUTOR,
    });
  }

  async updateAccount(
    data: AccountInitInputInterface,
  ): Promise<PartnersAccount['id']> {
    const email = normalizeEmail(data.email);
    const normalizedData = { ...data, email };

    const existing = await this.repository.findOne({
      where: { email },
    });

    const updateValues = this.buildUpdateValues(normalizedData, existing);

    const accountId = await this.typeorm.withQueryRunner(
      async (queryRunner) => {
        const result = await queryRunner.manager
          .createQueryBuilder()
          .update(PartnersAccount)
          .set(updateValues)
          .where({ email })
          .returning(['id'])
          .execute();

        return result.raw[0]?.id;
      },
    );

    return accountId;
  }

  private buildUpdateValues(
    data: AccountInitInputInterface,
    existingAccount: PartnersAccount,
  ): QueryDeepPartialEntity<PartnersAccount> {
    const columns = ['firstname', 'lastname', 'sub'];

    if (
      existingAccount &&
      !columns.some((column) => data[column] !== existingAccount[column])
    ) {
      return {
        lastConnection: queryBuilderGetCurrentTimestamp,
      };
    }

    const updateFields = pick(data, columns);

    return {
      ...updateFields,
      lastConnection: queryBuilderGetCurrentTimestamp,
      updatedAt: queryBuilderGetCurrentTimestamp,
    };
  }

  async updateAccountTransactional(
    queryRunner: QueryRunner,
    data: AccountInitInputInterface,
    where?: FindOptionsWhere<PartnersAccount>,
  ): Promise<PartnersAccount['id']> {
    const { email } = data;

    const result = await queryRunner.manager
      .createQueryBuilder()
      .update(PartnersAccount)
      .set(data)
      .where(where || { email })
      .returning(['id'])
      .execute();

    return result.raw[0]?.id;
  }

  async getTransactionalByEmail(
    queryRunner: QueryRunner,
    email: string,
  ): Promise<PartnersAccount> {
    return await queryRunner.manager.findOne(PartnersAccount, {
      where: { email },
    });
  }
}
