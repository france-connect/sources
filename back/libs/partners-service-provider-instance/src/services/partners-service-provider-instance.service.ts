import { In, QueryRunner, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { PermissionInterface, RelatedEntitiesHelper } from '@fc/access-control';
import {
  AccessControlEntity,
  AccessControlPermission,
  DefaultServiceProviderEnum,
} from '@fc/partners/enums';
import { getInsertedEntity } from '@fc/typeorm';

@Injectable()
export class PartnersServiceProviderInstanceService {
  constructor(
    @InjectRepository(PartnersServiceProviderInstance)
    private readonly repository: Repository<PartnersServiceProviderInstance>,
  ) {}

  async getAllowedInstances(
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
    accountId: string,
  ): Promise<PartnersServiceProviderInstance[]> {
    const relatedServiceProvidersIds = {
      entityTypes: [AccessControlEntity.SERVICE_PROVIDER],
    };

    const serviceProviderIds = RelatedEntitiesHelper.get(
      permissions,
      relatedServiceProvidersIds,
    );

    const instances = await this.repository.find({
      where: [
        {
          serviceProvider: {
            id: In(serviceProviderIds),
          },
        },
        {
          serviceProvider: {
            id: DefaultServiceProviderEnum.DEFAULT_LOW_SP,
          },
          creator: {
            id: accountId,
          },
        },
        {
          serviceProvider: {
            id: DefaultServiceProviderEnum.DEFAULT_HIGH_SP,
          },
          creator: {
            id: accountId,
          },
        },
      ],
      order: {
        createdAt: 'DESC',
      },
      relations: ['currentVersion', 'creator', 'serviceProvider'],
    });

    return instances;
  }

  async getById(
    instanceId: string,
  ): Promise<PartnersServiceProviderInstance | null> {
    const instance = await this.repository.findOne({
      where: { id: instanceId },
      relations: ['currentVersion', 'creator', 'serviceProvider'],
      select: {
        creator: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
        },
      },
    });

    return instance;
  }

  async getByIdWithQueryRunner(
    queryRunner: QueryRunner,
    instanceId: string,
  ): Promise<PartnersServiceProviderInstance | null> {
    const instance = await queryRunner.manager.findOne(
      PartnersServiceProviderInstance,
      {
        where: { id: instanceId },
        relations: ['currentVersion', 'creator', 'serviceProvider'],
        select: {
          creator: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    );

    return instance;
  }

  async getByIdsWithQueryRunner(
    queryRunner: QueryRunner,
    instanceIds: string[],
  ): Promise<PartnersServiceProviderInstance[]> {
    return await queryRunner.manager.find(PartnersServiceProviderInstance, {
      where: { id: In(instanceIds) },
      relations: ['currentVersion', 'creator', 'serviceProvider'],
    });
  }

  async save(
    queryRunner: QueryRunner,
    data: Partial<PartnersServiceProviderInstance>,
  ): Promise<PartnersServiceProviderInstance> {
    const insertResult = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersServiceProviderInstance)
      .values(data)
      .returning('*')
      .execute();

    return getInsertedEntity<PartnersServiceProviderInstance>(insertResult);
  }

  async getLinkableInstances(
    accountId: string,
    defaultServiceProviderId: string,
  ): Promise<PartnersServiceProviderInstance[]> {
    return await this.repository.find({
      where: {
        serviceProvider: { id: defaultServiceProviderId },
        creator: { id: accountId },
      },
      order: { createdAt: 'DESC' },
      relations: ['currentVersion', 'creator', 'serviceProvider'],
    });
  }

  async linkToServiceProvider(
    queryRunner: QueryRunner,
    instanceIds: string[],
    serviceProviderId: string,
  ): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .update(PartnersServiceProviderInstance)
      .set({ serviceProvider: { id: serviceProviderId } })
      .where({ id: In(instanceIds) })
      .execute();
  }

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
