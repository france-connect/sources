import { Repository, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Datapass, ServiceProvider } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';

import { PostgresConnectionFailure } from './exceptions';
import { IServiceProviderItem } from './interfaces';

@Injectable()
export class PartnerServiceProviderService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(ServiceProvider)
    private readonly serviceProviderRepository: Repository<ServiceProvider>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getById(id: uuid): Promise<IServiceProviderItem> {
    const { items } = await this.getByIds([id], 0, 1);

    return items.pop();
  }

  async getByIds(
    ids: uuid[],
    offset: number,
    limit: number,
  ): Promise<{ total: number; items: IServiceProviderItem[] }> {
    const query = this.serviceProviderRepository
      .createQueryBuilder('serviceProvider')
      .where('serviceProvider.id IN(:...ids)', {
        ids,
      })
      .andWhere(this.getLastRemoteId)
      .leftJoinAndSelect('serviceProvider.organisation', 'organisation')
      .leftJoinAndSelect('serviceProvider.platform', 'platform')
      .leftJoinAndSelect('serviceProvider.datapasses', 'datapass')
      .select([
        'serviceProvider',
        'organisation.name',
        'platform.name',
        'datapass.remoteId',
      ])
      .orderBy('serviceProvider.createdAt', 'ASC')
      .offset(offset)
      .limit(limit);

    let items;
    let total;

    try {
      items = await query.getMany();
      total = await query.getCount();
    } catch (error) {
      throw new PostgresConnectionFailure(error);
    }

    this.logger.trace({ items, total });

    return {
      items,
      total,
    };
  }

  private getLastRemoteId(qb: SelectQueryBuilder<ServiceProvider>): string {
    const subQuery = qb
      .subQuery()
      .select('MAX(datapass.remoteId)')
      .from(Datapass, 'datapass')
      .where('datapass.serviceProviderId = serviceProvider.id')
      .getQuery();

    return `datapass.remoteId = ${subQuery}`;
  }
}
