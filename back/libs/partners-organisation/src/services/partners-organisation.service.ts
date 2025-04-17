import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersOrganisation } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { PostgresOperationFailure } from '@fc/postgres';

@Injectable()
export class PartnersOrganisationService {
  constructor(
    @InjectRepository(PartnersOrganisation)
    private readonly repository: Repository<PartnersOrganisation>,
  ) {}

  async getOrganisationsFromPermission(
    permissions: PermissionInterface[],
  ): Promise<PartnersOrganisation[]> {
    const relatedEntitiesOptions = {
      entityTypes: [EntityType.ORGANISATION],
    };
    const organisationIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    if (organisationIds.length === 0) {
      return [];
    }

    const partnersOrganisation = await Promise.all(
      organisationIds.map(
        async (organisationId) =>
          await this.getServiceProvidersFromOrganisation(
            organisationId,
            permissions,
          ),
      ),
    );

    return partnersOrganisation;
  }

  async getServiceProvidersFromOrganisation(
    organisationId: string,
    permissions: PermissionInterface[],
  ): Promise<PartnersOrganisation> {
    const relatedEntitiesOptions = {
      entityTypes: [EntityType.SERVICE_PROVIDER],
    };
    const serviceProviderIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    const items = await this.getByIds([organisationId], serviceProviderIds);

    return items.pop();
  }

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  async getByIds(
    organisationIds: string[],
    serviceProviderIds: string[] = [],
  ): Promise<PartnersOrganisation[]> {
    const query = this.repository
      .createQueryBuilder('partnersOrganisation')
      .leftJoinAndSelect(
        'partnersOrganisation.serviceProviders',
        'serviceProviders',
      )
      .where('partnersOrganisation.id IN(:...organisationIds)', {
        organisationIds,
      })
      .select([
        'partnersOrganisation',
        'serviceProviders.id',
        'serviceProviders.name',
      ])
      .orderBy('partnersOrganisation.name', 'ASC');

    if (serviceProviderIds && serviceProviderIds.length > 0) {
      query.andWhere('serviceProviders.id IN (:...serviceProviderIds)', {
        serviceProviderIds,
      });
    }

    let items: PartnersOrganisation[];

    try {
      items = await query.getMany();
    } catch (error) {
      throw new PostgresOperationFailure(error);
    }

    return items;
  }

  async upsert(data: PartnersOrganisation): Promise<PartnersOrganisation> {
    const result = await this.repository.save(data);

    return result;
  }

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
