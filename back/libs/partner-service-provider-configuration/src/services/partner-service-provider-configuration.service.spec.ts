import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { ServiceProviderConfiguration } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';
import { PartnerServiceProviderService } from '@fc/partner-service-provider';

import {
  PartnerServiceProviderConfigurationFetchException,
  PartnerServiceProviderConfigurationPostException,
} from '../exceptions';
import { PartnerServiceProviderConfigurationService } from './partner-service-provider-configuration.service';

describe('PartnerServiceProviderConfigurationService', () => {
  let service: PartnerServiceProviderConfigurationService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    error: jest.fn(),
    trace: jest.fn(),
  };

  const partnerServiceProviderMock = {
    updateIncrementConfigurationNumber: jest.fn(),
  };

  const serviceProviderConfigurationRepositoryMock = {
    createQueryBuilder: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
    getManyAndCount: jest.fn(),
    groupBy: jest.fn(),
    orderBy: jest.fn(),
    getQuery: jest.fn(),
    getOne: jest.fn(),
    subQuery: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    manager: {
      transaction: jest.fn(),
    },
    update: jest.fn(),
    set: jest.fn(),
    execute: jest.fn(),
  };

  const getManyAndCountResolvedMock = [Symbol('getManyAndCountResolvedMock')];
  const serviceProviderConfigurationIncrementedMock = {
    environment: 'SANDBOX',
    name: 'Configuration de test N°2',
    serviceProvider: {
      id: 'some-uuid-v4-value',
    },
  };
  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([ServiceProviderConfiguration])],
      providers: [
        LoggerService,
        PartnerServiceProviderService,
        PartnerServiceProviderConfigurationService,
        Repository<ServiceProviderConfiguration>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(PartnerServiceProviderService)
      .useValue(partnerServiceProviderMock)
      .overrideProvider(getRepositoryToken(ServiceProviderConfiguration))
      .useValue(serviceProviderConfigurationRepositoryMock)
      .compile();

    service = module.get<PartnerServiceProviderConfigurationService>(
      PartnerServiceProviderConfigurationService,
    );

    serviceProviderConfigurationRepositoryMock.createQueryBuilder.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.update.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );

    serviceProviderConfigurationRepositoryMock.execute.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.set.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.leftJoinAndSelect.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.where.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.andWhere.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.select.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.getOne.mockReturnValue({
      configurationNumberIncrement: 1,
    });
    serviceProviderConfigurationRepositoryMock.from.mockReturnValue(
      serviceProviderConfigurationRepositoryMock,
    );
    serviceProviderConfigurationRepositoryMock.getManyAndCount.mockReturnValue(
      getManyAndCountResolvedMock,
    );
    serviceProviderConfigurationRepositoryMock.save.mockResolvedValue(true);
    serviceProviderConfigurationRepositoryMock.create.mockReturnValue(
      serviceProviderConfigurationIncrementedMock,
    );
    serviceProviderConfigurationRepositoryMock.manager.transaction.mockImplementationOnce(
      (cb) => cb(serviceProviderConfigurationRepositoryMock),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call logger.setContext', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      PartnerServiceProviderConfigurationService.name,
    );
  });

  describe('getByServiceProvider', () => {
    // Given
    const serviceProviderId = 'some-uuid-v4-value';

    it('should call queryBuilder with where clause contains service provider id', async () => {
      // when
      await service.getByServiceProvider(serviceProviderId);

      // then
      expect(
        serviceProviderConfigurationRepositoryMock.where,
      ).toHaveBeenCalledTimes(1);
      expect(
        serviceProviderConfigurationRepositoryMock.where,
      ).toHaveBeenCalledWith(
        'ServiceProviderConfiguration.serviceProviderId = :serviceProviderId',
        { serviceProviderId },
      );
    });

    it('should return a payload with items total inside', async () => {
      // given
      const [items, total] = getManyAndCountResolvedMock;
      const expected = { items, total };

      // when
      const result = await service.getByServiceProvider(serviceProviderId);
      // then
      expect(result).toEqual(expected);
    });

    it('should throw PartnerServiceProviderConfigurationFetchException call when getManyAndCount throws', async () => {
      // given
      const errorMock = new Error('some error');

      serviceProviderConfigurationRepositoryMock.getManyAndCount.mockImplementationOnce(
        () => {
          throw errorMock;
        },
      );

      // when / then
      await expect(
        service.getByServiceProvider(serviceProviderId),
      ).rejects.toThrow(PartnerServiceProviderConfigurationFetchException);
    });
  });
  describe('addForServiceProvider', () => {
    // Given
    const serviceProviderId = 'some-uuid-v4-value';

    it('should call this.serviceProviderConfigurationRepository.createQueryBuilder()', async () => {
      // when
      await service.addForServiceProvider(serviceProviderId);
      // then
      expect(
        serviceProviderConfigurationRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalledTimes(2);
    });
    it('should call this.serviceProviderConfigurationRepository.update()', async () => {
      // when
      await service.addForServiceProvider(serviceProviderId);
      // then
      expect(
        serviceProviderConfigurationRepositoryMock.update,
      ).toHaveBeenCalledTimes(1);
    });
    it('should call this.serviceProviderConfigurationRepository.set() with incremented value', async () => {
      // when
      await service.addForServiceProvider(serviceProviderId);
      // then
      expect(
        serviceProviderConfigurationRepositoryMock.set,
      ).toHaveBeenCalledTimes(1);
      expect(
        serviceProviderConfigurationRepositoryMock.set,
      ).toHaveBeenCalledWith({ configurationNumberIncrement: 2 });
    });
    it('should call this.serviceProviderConfigurationRepository.where() with serviceProviderId', async () => {
      // when
      await service.addForServiceProvider(serviceProviderId);
      // then
      expect(
        serviceProviderConfigurationRepositoryMock.where,
      ).toHaveBeenCalledTimes(2);
      expect(
        serviceProviderConfigurationRepositoryMock.where,
      ).toHaveBeenCalledWith('id = :serviceProviderId', {
        serviceProviderId: 'some-uuid-v4-value',
      });
    });
    it('should call this.serviceProviderConfigurationRepository.execute()', async () => {
      // when
      await service.addForServiceProvider(serviceProviderId);
      // then
      expect(
        serviceProviderConfigurationRepositoryMock.execute,
      ).toHaveBeenCalledTimes(1);
    });
    it('should call this.serviceProviderConfigurationRepository.save() with data', async () => {
      // when
      await service.addForServiceProvider(serviceProviderId);
      // then
      expect(
        serviceProviderConfigurationRepositoryMock.save,
      ).toHaveBeenCalledTimes(1);
      expect(
        serviceProviderConfigurationRepositoryMock.save,
      ).toHaveBeenCalledWith(serviceProviderConfigurationIncrementedMock);
    });

    it('should throw PartnerServiceProviderConfigurationPostException when error on save', async () => {
      // given
      const errorMock = new Error('some error');
      const serviceProviderId = 'some-uuid-v4-value';
      serviceProviderConfigurationRepositoryMock.save.mockImplementationOnce(
        () => {
          throw errorMock;
        },
      );

      // when / then
      await expect(
        service.addForServiceProvider(serviceProviderId),
      ).rejects.toThrow(PartnerServiceProviderConfigurationPostException);
    });
  });
});
