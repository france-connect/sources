import { QueryRunner, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { queryBuilderGetCurrentTimestamp } from '@fc/typeorm';

import { PartnersAccountInitException } from '../exceptions';
import { AccountInitInputInterface } from '../interfaces';

@Injectable()
export class PartnersAccountService {
  constructor(
    @InjectRepository(PartnersAccount)
    private readonly repository: Repository<PartnersAccount>,
    private readonly accessControl: AccountPermissionService,
  ) {}

  async init(data: AccountInitInputInterface): Promise<PartnersAccount['id']> {
    const queryRunner = await this.getQueryRunner();
    await queryRunner.startTransaction();

    try {
      const accountId = await this.create(queryRunner, data);

      await this.addPermissions(queryRunner, accountId);

      await queryRunner.commitTransaction();

      return accountId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new PartnersAccountInitException(error);
    } finally {
      await queryRunner.release();
    }
  }

  private async getQueryRunner(): Promise<QueryRunner> {
    const queryRunner = this.repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
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
  }

  async updateLastConnection(
    data: AccountInitInputInterface,
  ): Promise<PartnersAccount['id']> {
    const { email } = data;
    const queryRunner = await this.getQueryRunner();

    const result = await queryRunner.manager
      .createQueryBuilder()
      .update(PartnersAccount)
      .set({ lastConnection: queryBuilderGetCurrentTimestamp })
      .where({ email })
      .returning(['id'])
      .execute();

    await queryRunner.release();

    const accountId = result.raw[0]?.id;
    return accountId;
  }
}
