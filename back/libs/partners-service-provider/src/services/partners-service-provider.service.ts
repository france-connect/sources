import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import { PostgresOperationFailure } from '@fc/postgres';

@Injectable()
export class PartnersServiceProviderService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(PartnersServiceProvider)
    private readonly repository: Repository<PartnersServiceProvider>,
  ) {}

  async getInstancesFromServiceProvider(
    serviceProviderIds: string,
    permissions: PermissionInterface[],
  ): Promise<PartnersServiceProvider> {
    const relatedEntitiesOptions = {
      entityTypes: [EntityType.SP_INSTANCE],
    };
    const instanceIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    const items = await this.getByIds([serviceProviderIds], instanceIds);

    return items.pop();
  }

  async getByIds(
    serviceProviderIds: string[],
    instancesIds: string[] = [],
  ): Promise<PartnersServiceProvider[]> {
    const query = this.repository
      .createQueryBuilder('partnersServiceProvider')
      .leftJoinAndSelect('partnersServiceProvider.instances', 'instances')
      .leftJoinAndSelect('partnersServiceProvider.organisation', 'organisation')
      .where('partnersServiceProvider.id IN(:...serviceProviderIds)', {
        serviceProviderIds,
      })
      .select([
        'partnersServiceProvider',
        'instances.id',
        'instances.name',
        'organisation.id',
        'organisation.name',
      ])
      .orderBy('partnersServiceProvider.name', 'ASC');

    if (instancesIds && instancesIds.length > 0) {
      query.andWhere('instances.id IN (:...instancesIds)', {
        instancesIds,
      });
    }

    let items: PartnersServiceProvider[];

    try {
      items = await query.getMany();
    } catch (error) {
      throw new PostgresOperationFailure(error);
    }

    return items;
  }

  async upsert(
    data: PartnersServiceProvider,
  ): Promise<PartnersServiceProvider> {
    const result = await this.repository.save(data);

    return result;
  }

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
