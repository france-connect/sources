import { In, QueryRunner, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnersServiceProvider } from '@entities/typeorm';

import { PermissionInterface, RelatedEntitiesHelper } from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import {
  AccessControlEntity,
  AccessControlPermission,
} from '@fc/partners/enums';

import { PartnersServiceProviderNotFoundException } from '../exceptions';

@Injectable()
export class PartnersServiceProviderService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(PartnersServiceProvider)
    private readonly repository: Repository<PartnersServiceProvider>,
  ) {}

  async getAllowedServiceProviders(
    permissions: PermissionInterface<
      AccessControlEntity,
      AccessControlPermission
    >[],
  ): Promise<PartnersServiceProvider[]> {
    const relatedEntitiesOptions = {
      entityTypes: [AccessControlEntity.SERVICE_PROVIDER],
    };
    const serviceProviderIds = RelatedEntitiesHelper.get(
      permissions,
      relatedEntitiesOptions,
    );

    const serviceProviders = await this.getByIds(serviceProviderIds);

    return serviceProviders;
  }

  async getByIds(
    serviceProviderIds: string[],
  ): Promise<PartnersServiceProvider[]> {
    if (serviceProviderIds.length === 0) {
      return [];
    }

    const serviceProviders = await this.repository.find({
      where: { id: In(serviceProviderIds) },
      order: { createdAt: 'DESC' },
    });

    return serviceProviders;
  }

  async getById(id: string): Promise<PartnersServiceProvider> {
    const serviceProvider = await this.repository.findOne({
      where: { id },
    });

    if (!serviceProvider) {
      throw new PartnersServiceProviderNotFoundException();
    }

    return serviceProvider;
  }

  async upsert(
    queryRunner: QueryRunner,
    data: PartnersServiceProvider,
  ): Promise<PartnersServiceProvider> {
    const result = await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(PartnersServiceProvider)
      .values(data)
      .orUpdate(
        ['name', 'organizationName', 'datapassScopes'],
        ['datapassRequestId'],
      )
      .returning('*')
      .execute();

    const savedEntity = result.generatedMaps[0] as PartnersServiceProvider;

    this.logger.debug({
      message: 'Service Provider upserted successfully',
      serviceProviderId: savedEntity.id,
      datapassRequestId: savedEntity.datapassRequestId,
    });

    return savedEntity;
  }

  async delete(id: string): Promise<number> {
    const result = await this.repository.delete(id);

    return result.affected;
  }
}
