import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  ServiceProvider,
  ServiceProviderConfiguration,
} from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger-legacy';
import { PartnerServiceProviderService } from '@fc/partner-service-provider';

import { EnvironmentEnum } from '../enums';
import {
  PartnerServiceProviderConfigurationFetchException,
  PartnerServiceProviderConfigurationPostException,
} from '../exceptions';
import {
  ServiceProviderConfigurationItemInterface,
  ServiceProviderConfigurationMetaInterface,
} from '../interfaces';

@Injectable()
export class PartnerServiceProviderConfigurationService {
  constructor(
    private readonly logger: LoggerService,
    private readonly partnerServiceProvider: PartnerServiceProviderService,
    @InjectRepository(ServiceProviderConfiguration)
    private readonly serviceProviderConfigurationRepository: Repository<ServiceProviderConfiguration>,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getByServiceProvider(
    serviceProviderId: uuid,
  ): Promise<ServiceProviderConfigurationMetaInterface> {
    const query = this.serviceProviderConfigurationRepository
      .createQueryBuilder('ServiceProviderConfiguration')
      .where(
        'ServiceProviderConfiguration.serviceProviderId = :serviceProviderId',
        {
          serviceProviderId,
        },
      );

    try {
      const [items, total] = await query.getManyAndCount();

      this.logger.trace({ items, total });

      return {
        total,
        items,
      };
    } catch (error) {
      this.logger.trace({ error });
      throw new PartnerServiceProviderConfigurationFetchException();
    }
  }

  async addForServiceProvider(
    id: uuid,
  ): Promise<ServiceProviderConfigurationItemInterface> {
    try {
      const item =
        await this.serviceProviderConfigurationRepository.manager.transaction(
          async (transactionalEntityManager) => {
            const { configurationNumberIncrement } =
              await transactionalEntityManager
                .createQueryBuilder()
                .select('configurationNumberIncrement')
                .from(ServiceProvider, 'configurationNumberIncrement')
                .where('id = :serviceProviderId', {
                  serviceProviderId: id,
                })
                .getOne();
            const updatedIncrement = configurationNumberIncrement + 1;
            await transactionalEntityManager
              .createQueryBuilder()
              .update(ServiceProvider)
              .set({
                configurationNumberIncrement: updatedIncrement,
              })
              .where('id = :serviceProviderId', {
                serviceProviderId: id,
              })
              .execute();
            const configuration = transactionalEntityManager.create(
              ServiceProviderConfiguration,
              {
                name: `Configuration de test N°${updatedIncrement}`,
                environment: EnvironmentEnum.SANDBOX,
                serviceProvider: { id },
              },
            );
            return await transactionalEntityManager.save(configuration);
          },
        );
      this.logger.trace({ res: item });
      return item;
    } catch (error) {
      this.logger.trace({ error });
      throw new PartnerServiceProviderConfigurationPostException();
    }
  }
}
