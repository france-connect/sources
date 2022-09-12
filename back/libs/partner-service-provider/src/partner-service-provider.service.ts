import { Repository, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountServiceProvider, Datapass } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { PostgresConnectionFailure } from './exceptions';
import { IServiceProviderItem, partnerServiceProviderList } from './interfaces';

@Injectable()
export class PartnerServiceProviderService {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(AccountServiceProvider)
    private readonly accountServiceProviderRepository: Repository<AccountServiceProvider>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getServiceProvidersListByAccount(
    accountId: string,
    offset: number,
    limit: number,
  ): Promise<partnerServiceProviderList> {
    let dataFromDb, items: IServiceProviderItem[], totalItems: number;

    // get partner service providers data
    /**
     * @todo  : optimize this query
     * @todo  : refacto how we get the last datapass remoteId or createdAt
     */
    try {
      dataFromDb = await this.accountServiceProviderRepository
        .createQueryBuilder('accountServiceProvider')
        .where('accountServiceProvider.accountId = :accountId', {
          accountId,
        })
        .leftJoinAndSelect(
          'accountServiceProvider.serviceProvider',
          'serviceProvider',
        )
        .leftJoinAndSelect('serviceProvider.organisation', 'organisation')
        .leftJoinAndSelect('serviceProvider.platform', 'platform')
        .leftJoinAndSelect('serviceProvider.datapasses', 'datapass')
        .select([
          'accountServiceProvider',
          'serviceProvider',
          'organisation.name',
          'platform.name',
          'datapass.remoteId',
        ])
        .andWhere(this.getLastRemoteId)
        .offset(offset)
        .limit(limit)
        .getMany();

      items = dataFromDb.map(({ serviceProvider }) => serviceProvider);
      totalItems = dataFromDb.length;
    } catch (error) {
      this.logger.error(error);
      throw new PostgresConnectionFailure();
    }

    return {
      totalItems,
      items,
    };
  }

  private getLastRemoteId(
    qb: SelectQueryBuilder<AccountServiceProvider>,
  ): string {
    const subQuery = qb
      .subQuery()
      .select('MAX(datapass.remoteId)')
      .from(Datapass, 'datapass')
      .where('datapass.serviceProviderId = serviceProvider.id')
      .getQuery();

    return `datapass.remoteId = ${subQuery}`;
  }
}
