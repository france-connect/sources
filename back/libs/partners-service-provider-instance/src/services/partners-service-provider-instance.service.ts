import { QueryRunner, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { getInsertedEntity } from '@fc/typeorm';

@Injectable()
export class PartnersServiceProviderInstanceService {
  constructor(
    @InjectRepository(PartnersServiceProviderInstance)
    private readonly repository: Repository<PartnersServiceProviderInstance>,
  ) {}

  async getAllowedInstances(
    permissions: PermissionInterface[],
  ): Promise<PartnersServiceProviderInstance[]> {
    const relatedEntitiesOptions = {
      entityTypes: [EntityType.SP_INSTANCE],
    };

    const instanceIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    const instances = await Promise.all(
      instanceIds.map(async (instanceId) => await this.getById(instanceId)),
    );

    const existsInstances = instances.filter(Boolean);

    return existsInstances;
  }

  async getById(
    instanceId: string,
  ): Promise<PartnersServiceProviderInstance | null> {
    const instance = await this.repository.findOne({
      where: { id: instanceId },
      relations: ['versions'],
      order: {
        versions: {
          createdAt: 'DESC',
        },
      },
    });

    if (instance?.versions?.length > 0) {
      const latestVersion = instance.versions[0];
      instance.versions = [latestVersion];
    }

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
        relations: ['versions'],
        order: {
          versions: {
            createdAt: 'DESC',
          },
        },
      },
    );

    if (instance?.versions?.length > 0) {
      const latestVersion = instance.versions[0];
      instance.versions = [latestVersion];
    }

    return instance;
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

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
