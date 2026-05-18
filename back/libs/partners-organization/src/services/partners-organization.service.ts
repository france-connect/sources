import { QueryRunner, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersOrganization } from '@entities/typeorm';

import { PermissionInterface, RelatedEntitiesHelper } from '@fc/access-control';
import {
  AccessControlEntity,
  AccessControlPermission,
} from '@fc/partners/enums';
import { PostgresOperationFailure } from '@fc/postgres';

@Injectable()
export class PartnersOrganizationService {
  constructor(
    @InjectRepository(PartnersOrganization)
    private readonly repository: Repository<PartnersOrganization>,
  ) {}

  async getOrganizationsFromPermission(
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): Promise<PartnersOrganization[]> {
    const relatedEntitiesOptions = {
      entityTypes: [AccessControlEntity.ORGANIZATION],
    };
    const organizationIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    if (organizationIds.length === 0) {
      return [];
    }

    const partnersOrganization = await Promise.all(
      organizationIds.map(
        async (organizationId) =>
          await this.getServiceProvidersFromOrganization(
            organizationId,
            permissions,
          ),
      ),
    );

    return partnersOrganization;
  }

  async getServiceProvidersFromOrganization(
    organizationId: string,
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): Promise<PartnersOrganization> {
    const relatedEntitiesOptions = {
      entityTypes: [AccessControlEntity.SERVICE_PROVIDER],
    };
    const serviceProviderIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    const items = await this.getByIds([organizationId], serviceProviderIds);

    return items.pop();
  }

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  async getByIds(
    organizationIds: string[],
    serviceProviderIds: string[] = [],
  ): Promise<PartnersOrganization[]> {
    const query = this.repository
      .createQueryBuilder('partnersOrganization')
      .leftJoinAndSelect(
        'partnersOrganization.serviceProviders',
        'serviceProviders',
      )
      .where('partnersOrganization.id IN(:...organizationIds)', {
        organizationIds,
      })
      .select([
        'partnersOrganization',
        'serviceProviders.id',
        'serviceProviders.name',
      ])
      .orderBy('partnersOrganization.name', 'ASC');

    if (serviceProviderIds && serviceProviderIds.length > 0) {
      query.andWhere('serviceProviders.id IN (:...serviceProviderIds)', {
        serviceProviderIds,
      });
    }

    let items: PartnersOrganization[];

    try {
      items = await query.getMany();
    } catch (error) {
      throw new PostgresOperationFailure(error);
    }

    return items;
  }

  async upsert(
    queryRunner: QueryRunner,
    data: PartnersOrganization,
  ): Promise<PartnersOrganization> {
    const result = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersOrganization)
      .values(data)
      .orUpdate(['name'], ['siret'])
      .returning('*')
      .execute();

    const savedEntity = result.generatedMaps[0] as PartnersOrganization;

    return savedEntity;
  }

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
