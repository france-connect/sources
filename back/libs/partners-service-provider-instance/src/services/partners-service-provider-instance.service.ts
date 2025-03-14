import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';

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

    return instances;
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

  async save(
    data: Partial<PartnersServiceProviderInstance>,
  ): Promise<PartnersServiceProviderInstance> {
    const result = await this.repository.save(data);

    return result;
  }

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
