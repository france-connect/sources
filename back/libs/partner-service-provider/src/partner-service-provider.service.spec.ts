import { mocked } from 'jest-mock';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { AccountServiceProvider } from '@entities/typeorm';

import { LoggerService } from '@fc/logger-legacy';

import { PostgresConnectionFailure } from './exceptions';
import { PartnerServiceProviderService } from './partner-service-provider.service';

describe('PartnerServiceProviderService', () => {
  let service: PartnerServiceProviderService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    error: jest.fn(),
  };

  const accountServiceProviderRepositoryMock = {
    createQueryBuilder: jest.fn(),
    leftJoinAndSelect: jest.fn(),
    where: jest.fn(),
    subQuery: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
    getQuery: jest.fn(),
    andWhere: jest.fn(),
    limit: jest.fn(),
    offset: jest.fn(),
    getMany: jest.fn(),
  };

  const qbMock = {
    subQuery: jest.fn(),
    select: jest.fn(),
    from: jest.fn(),
    where: jest.fn(),
    getQuery: jest.fn(),
  } as unknown as SelectQueryBuilder<AccountServiceProvider>;

  const createdAt = new Date();
  const updatedAt = new Date();

  const dbQueryMock = [
    {
      id: '1db73ecc-93b6-4c3b-9dff-582062154684',
      accountId: '547adf82-fe52-4659-92b3-dd2399c871e1',
      serviceProviderId: 'd7d36b81-0b68-4c26-a399-854848164f29',
      serviceProvider: {
        id: 'd7d36b81-0b68-4c26-a399-854848164f29',
        name: 'Service Provider - Sandbox',
        status: 'SANDBOX',
        createdAt,
        updatedAt,
        organisation: {
          name: 'Direction Interministerielle du Numérique',
        },
        platform: {
          name: 'FRANCE_CONNECT_LOW',
        },
        datapass: [
          {
            remoteId: '765',
          },
        ],
      },
    },
  ];

  const accountId = '123';
  const offset = 0;
  const limit = 10;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([AccountServiceProvider])],
      providers: [
        LoggerService,
        PartnerServiceProviderService,
        Repository<AccountServiceProvider>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(AccountServiceProvider))
      .useValue(accountServiceProviderRepositoryMock)
      .compile();

    service = module.get<PartnerServiceProviderService>(
      PartnerServiceProviderService,
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

  describe('getServiceProvidersListByAccount', () => {
    it('should return a payload with items total inside', async () => {
      // given
      const expected = {
        totalItems: 1,
        items: [
          {
            id: 'd7d36b81-0b68-4c26-a399-854848164f29',
            name: 'Service Provider - Sandbox',
            status: 'SANDBOX',
            createdAt,
            updatedAt,
            organisation: {
              name: 'Direction Interministerielle du Numérique',
            },
            platform: {
              name: 'FRANCE_CONNECT_LOW',
            },
            datapass: [
              {
                remoteId: '765',
              },
            ],
          },
        ],
      };
      mocked(
        accountServiceProviderRepositoryMock.createQueryBuilder,
      ).mockReturnValue(accountServiceProviderRepositoryMock);
      mocked(
        accountServiceProviderRepositoryMock.leftJoinAndSelect,
      ).mockReturnValue(accountServiceProviderRepositoryMock);
      mocked(accountServiceProviderRepositoryMock.where).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.andWhere).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.select).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.offset).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.limit).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.getMany).mockReturnValue(
        dbQueryMock,
      );

      // when
      const result = await service.getServiceProvidersListByAccount(
        accountId,
        offset,
        limit,
      );
      // then
      expect(result).toEqual(expected);
      expect(
        accountServiceProviderRepositoryMock.andWhere,
      ).toHaveBeenCalledWith(service['getLastRemoteId']);
    });

    it('should return a empty payload with items total equal 0 inside', async () => {
      // given
      const expected = {
        totalItems: 0,
        items: [],
      };
      mocked(
        accountServiceProviderRepositoryMock.createQueryBuilder,
      ).mockReturnValue(accountServiceProviderRepositoryMock);
      mocked(
        accountServiceProviderRepositoryMock.leftJoinAndSelect,
      ).mockReturnValue(accountServiceProviderRepositoryMock);
      mocked(accountServiceProviderRepositoryMock.where).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.andWhere).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.select).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.offset).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.limit).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.getMany).mockReturnValue([]);

      // when
      const result = await service.getServiceProvidersListByAccount(
        accountId,
        offset,
        limit,
      );
      // then
      expect(result).toEqual(expected);
    });

    it('should throw PostgresConnectionFailure exception if db connection is down', async () => {
      // given
      mocked(
        accountServiceProviderRepositoryMock.createQueryBuilder,
      ).mockReturnValue(accountServiceProviderRepositoryMock);
      mocked(
        accountServiceProviderRepositoryMock.leftJoinAndSelect,
      ).mockReturnValue(accountServiceProviderRepositoryMock);
      mocked(accountServiceProviderRepositoryMock.where).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.andWhere).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.select).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.offset).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.limit).mockReturnValue(
        accountServiceProviderRepositoryMock,
      );
      mocked(accountServiceProviderRepositoryMock.getMany).mockReturnValue(
        null,
      );

      // when / then
      await expect(
        service.getServiceProvidersListByAccount(accountId, offset, limit),
      ).rejects.toThrow(PostgresConnectionFailure);
    });
  });

  describe('getLastRemoteId', () => {
    it('should return a remoteId', async () => {
      // given
      const getQueryExpected = `(SELECT MAX("datapass"."remoteId") FROM "datapass" "datapass" WHERE "datapass"."serviceProviderId" = serviceProvider.id)`;
      const subQueryResponse = `datapass.remoteId = ${getQueryExpected}`;

      mocked(qbMock.subQuery).mockReturnValue(qbMock);
      mocked(qbMock.select).mockReturnValue(qbMock);
      mocked(qbMock.from).mockReturnValue(qbMock);
      mocked(qbMock.where).mockReturnValue(qbMock);
      mocked(qbMock.getQuery).mockReturnValue(getQueryExpected);
      // when
      const result = await service['getLastRemoteId'](qbMock);
      // then
      expect(result).toEqual(subQueryResponse);
    });
  });
});
