import { Repository, SelectQueryBuilder } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { ServiceProvider } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { PostgresConnectionFailure } from './exceptions';
import { PartnerServiceProviderService } from './partner-service-provider.service';

describe('PartnerServiceProviderService', () => {
  let service: PartnerServiceProviderService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    error: jest.fn(),
    trace: jest.fn(),
  };

  const serviceProviderRepositoryMock = {
    createQueryBuilder: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    andWhere: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
    getMany: jest.fn(),
    groupBy: jest.fn(),
    orderBy: jest.fn(),
    getQuery: jest.fn(),
    subQuery: jest.fn(),
    getCount: jest.fn(),
    execute: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
  };

  const getQueryReturnedMock = 'getQueryReturnyMockValue';

  const getCountResolvedMock = Symbol('getCountResolvedMock');
  const getManyResolvedMock = [Symbol('getManyResolvedMock')];
  const offset = 0;
  const size = 10;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([ServiceProvider])],
      providers: [
        LoggerService,
        PartnerServiceProviderService,
        Repository<ServiceProvider>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(ServiceProvider))
      .useValue(serviceProviderRepositoryMock)
      .compile();

    service = module.get<PartnerServiceProviderService>(
      PartnerServiceProviderService,
    );

    serviceProviderRepositoryMock.createQueryBuilder.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.execute.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.update.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.set.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.leftJoinAndSelect.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.where.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.andWhere.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.select.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.from.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.limit.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.offset.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.groupBy.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.orderBy.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.subQuery.mockReturnValue(
      serviceProviderRepositoryMock,
    );
    serviceProviderRepositoryMock.getMany.mockReturnValue(getManyResolvedMock);

    serviceProviderRepositoryMock.getQuery.mockReturnValue(
      getQueryReturnedMock,
    );
    serviceProviderRepositoryMock.getCount.mockResolvedValue(
      getCountResolvedMock,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call logger.setContext', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      PartnerServiceProviderService.name,
    );
  });

  describe('getById', () => {
    // Given
    const dataMock = {};
    const idMock = 'some-uuid-v4-value';

    beforeEach(() => {
      service['getByIds'] = jest
        .fn()
        .mockResolvedValueOnce({ items: [dataMock] });
    });

    it('should call service.getByIds() with an array containing only given id and select only first result', async () => {
      // When
      await service.getById(idMock);
      // Then
      expect(service.getByIds).toBeCalledTimes(1);
      expect(service.getByIds).toBeCalledWith([idMock], 0, 1);
    });

    it('should return the unique item of the array returned by call to service.getByIds()', async () => {
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toBe(dataMock);
    });
  });

  describe('getByIds', () => {
    beforeEach(() => {
      service['getLastRemoteId'] = jest
        .fn()
        .mockResolvedValueOnce('sub query string');
    });

    it('should call queryBuilder with where clause containing concatenated id list', async () => {
      // given
      const ids = ['foo', 'bar'];
      // when
      await service.getByIds(ids, offset, size);
      // then
      expect(serviceProviderRepositoryMock.where).toHaveBeenCalledWith(
        'serviceProvider.id IN(:...ids)',
        { ids },
      );
    });

    it('should call queryBuilder with pagination parameters', async () => {
      // given
      const ids = ['foo', 'bar'];
      // when
      await service.getByIds(ids, offset, size);
      // then
      expect(serviceProviderRepositoryMock.offset).toHaveBeenCalledWith(offset);
      expect(serviceProviderRepositoryMock.limit).toHaveBeenCalledWith(size);
    });

    it('should return a payload with items total inside', async () => {
      // given
      const expected = {
        total: getCountResolvedMock,
        items: getManyResolvedMock,
      };

      const ids = ['foo', 'bar'];
      // when
      const result = await service.getByIds(ids, offset, size);
      // then
      expect(result).toEqual(expected);
    });

    it('should throw PostgresConnectionFailure call to getMany throws', async () => {
      // given
      const errorMock = new Error('some error');
      const ids = ['foo', 'bar'];
      serviceProviderRepositoryMock.getMany.mockImplementationOnce(() => {
        throw errorMock;
      });

      // when / then
      await expect(service.getByIds(ids, offset, size)).rejects.toThrow(
        PostgresConnectionFailure,
      );
    });

    it('should throw PostgresConnectionFailure call to getCount throws', async () => {
      // given
      const errorMock = new Error('some error');
      const ids = ['foo', 'bar'];
      serviceProviderRepositoryMock.getCount.mockImplementationOnce(() => {
        throw errorMock;
      });

      // when / then
      await expect(service.getByIds(ids, offset, size)).rejects.toThrow(
        PostgresConnectionFailure,
      );
    });
  });

  describe('getLastRemoteId', () => {
    it('should return a remoteId', async () => {
      // given
      const subQueryResponse = `datapass.remoteId = ${getQueryReturnedMock}`;

      // when
      const result = await service['getLastRemoteId'](
        serviceProviderRepositoryMock as unknown as SelectQueryBuilder<ServiceProvider>,
      );
      // then
      expect(result).toEqual(subQueryResponse);
    });
  });
});
