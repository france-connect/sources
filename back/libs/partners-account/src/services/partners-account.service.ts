import { pick } from 'lodash';
import { QueryRunner, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { queryBuilderGetCurrentTimestamp, TypeormService } from '@fc/typeorm';

import { PartnersAccountInitException } from '../exceptions';
import { AccountInitInputInterface } from '../interfaces';

@Injectable()
export class PartnersAccountService {
  constructor(
    @InjectRepository(PartnersAccount)
    private readonly repository: Repository<PartnersAccount>,
    private readonly accessControl: AccountPermissionService,
    private readonly typeorm: TypeormService,
  ) {}

  async init(data: AccountInitInputInterface): Promise<PartnersAccount['id']> {
    let accountId: PartnersAccount['id'];

    try {
      accountId = await this.typeorm.withTransaction(
        async (queryRunner: QueryRunner) => {
          const accountId = await this.create(queryRunner, data);

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
  ): Promise<PartnersAccount['id']> {
    const existing = await this.repository.findOne({
      where: { email: account.email },
    });

    if (existing) {
      return existing.id;
    }

    const accountId = await this.create(queryRunner, account);

    return accountId;
  }

  private async create(
    queryRunner: QueryRunner,
    data: AccountInitInputInterface,
  ): Promise<PartnersAccount['id']> {
    const result = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersAccount)
      .values(data)
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
      permissionType: PermissionsType.LIST,
      entity: EntityType.SP_INSTANCE,
    });

    await this.accessControl.addPermissionTransactional(queryRunner, {
      accountId,
      permissionType: PermissionsType.LIST,
      entity: EntityType.SERVICE_PROVIDER,
    });
  }

  async updateAccount(
    data: AccountInitInputInterface,
  ): Promise<PartnersAccount['id']> {
    const { email } = data;

    const existing = await this.repository.findOne({
      where: { email },
    });

    const updateValues = this.buildUpdateValues(data, existing);

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
}
