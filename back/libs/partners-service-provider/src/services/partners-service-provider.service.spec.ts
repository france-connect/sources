import { In, QueryRunner, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  PermissionsType,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { PartnersServiceProviderService } from './partners-service-provider.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderService', () => {
  let service: PartnersServiceProviderService;

  const loggerServiceMock = getLoggerMock();
  const repositoryMock = getRepositoryMock();
  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const permissionsMock = [
    {
      permissionType: PermissionsType.VIEW,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: 'service-provider-id',
    },
  ] as PermissionInterface[];

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    organizationName: 'Test Organization',
    datapassRequestId: '12345',
    authorizedScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organisation: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const serviceProviderIdMock = 'service-provider-id';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersServiceProvider])],
      providers: [
        LoggerService,
        PartnersServiceProviderService,
        Repository<PartnersServiceProvider>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(PartnersServiceProvider))
      .useValue(repositoryMock)
      .compile();

    service = module.get<PartnersServiceProviderService>(
      PartnersServiceProviderService,
    );

    resetRepositoryMock(repositoryMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllowedServiceProviders', () => {
    beforeEach(() => {
      service.getByIds = jest.fn().mockResolvedValue([serviceProviderMock]);
    });

    it('should call RelatedEntitiesHelper.get() with SERVICE_PROVIDER entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getAllowedServiceProviders(permissionsMock);

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledExactlyOnceWith(
        permissionsMock,
        {
          entityTypes: [EntityType.SERVICE_PROVIDER],
        },
      );
    });

    it('should call getByIds() with service provider IDs and return results', async () => {
      // Given
      const serviceProviderIds = ['sp1', 'sp2'];
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(serviceProviderIds);

      // When
      const result = await service.getAllowedServiceProviders(permissionsMock);

      // Then
      expect(service.getByIds).toHaveBeenCalledExactlyOnceWith(
        serviceProviderIds,
      );
      expect(result).toEqual([serviceProviderMock]);
    });

    it('should call getByIds() with empty array when no service provider IDs', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);
      service.getByIds = jest.fn().mockResolvedValue([]);

      // When
      const result = await service.getAllowedServiceProviders(permissionsMock);

      // Then
      expect(service.getByIds).toHaveBeenCalledExactlyOnceWith([]);
      expect(result).toEqual([]);
    });
  });

  describe('getByIds', () => {
    it('should return empty array when no IDs provided', async () => {
      // When
      const result = await service.getByIds([]);

      // Then
      expect(repositoryMock.find).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should call repository.find with In operator and order by createdAt DESC', async () => {
      // Given
      const serviceProviderIds = ['sp1', 'sp2'];
      repositoryMock.find.mockResolvedValue([serviceProviderMock]);

      // When
      const result = await service.getByIds(serviceProviderIds);

      // Then
      expect(repositoryMock.find).toHaveBeenCalledExactlyOnceWith({
        where: { id: In(serviceProviderIds) },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([serviceProviderMock]);
    });
  });

  describe('upsert', () => {
    const queryRunnerMock = {
      manager: {
        createQueryBuilder: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orUpdate: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      },
    };

    const upsertResultMock = {
      generatedMaps: [serviceProviderMock],
    };

    beforeEach(() => {
      jest.resetAllMocks();
      queryRunnerMock.manager.createQueryBuilder.mockReturnThis();
      queryRunnerMock.manager.insert.mockReturnThis();
      queryRunnerMock.manager.into.mockReturnThis();
      queryRunnerMock.manager.values.mockReturnThis();
      queryRunnerMock.manager.orUpdate.mockReturnThis();
      queryRunnerMock.manager.returning.mockReturnThis();
      queryRunnerMock.manager.execute.mockResolvedValue(upsertResultMock);
    });

    it('should create queryBuilder chain with correct parameters', async () => {
      // When
      await service.upsert(
        queryRunnerMock as unknown as QueryRunner,
        serviceProviderMock,
      );

      // Then
      expect(queryRunnerMock.manager.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(queryRunnerMock.manager.insert).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.into).toHaveBeenCalledWith(
        PartnersServiceProvider,
      );
      expect(queryRunnerMock.manager.values).toHaveBeenCalledWith(
        serviceProviderMock,
      );
      expect(queryRunnerMock.manager.orUpdate).toHaveBeenCalledWith(
        ['name', 'organizationName', 'authorizedScopes'],
        ['datapassRequestId'],
      );
      expect(queryRunnerMock.manager.returning).toHaveBeenCalledWith('*');
      expect(queryRunnerMock.manager.execute).toHaveBeenCalledTimes(1);
    });

    it('should return the upserted entity from generatedMaps', async () => {
      // When
      const result = await service.upsert(
        queryRunnerMock as unknown as QueryRunner,
        serviceProviderMock,
      );

      // Then
      expect(result).toBe(serviceProviderMock);
    });

    it('should log success message with entity details', async () => {
      // When
      await service.upsert(
        queryRunnerMock as unknown as QueryRunner,
        serviceProviderMock,
      );

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledWith({
        message: 'Service Provider upserted successfully',
        serviceProviderId: serviceProviderMock.id,
        datapassRequestId: serviceProviderMock.datapassRequestId,
      });
    });

    it('should handle upsert execution and return correct entity', async () => {
      // Given
      const customServiceProvider = {
        ...serviceProviderMock,
        id: 'custom-id',
        datapassRequestId: 'custom-datapass-123',
      };
      const customUpsertResult = {
        generatedMaps: [customServiceProvider],
      };
      queryRunnerMock.manager.execute.mockResolvedValue(customUpsertResult);

      // When
      const result = await service.upsert(
        queryRunnerMock as unknown as QueryRunner,
        customServiceProvider,
      );

      // Then
      expect(result).toBe(customServiceProvider);
    });
  });

  describe('delete', () => {
    it('should call repository.delete with the ID', async () => {
      // Given
      const deleteResult = { affected: 1 };
      repositoryMock.delete.mockResolvedValue(deleteResult);

      // When
      const _result = await service.delete(serviceProviderIdMock);

      // Then
      expect(repositoryMock.delete).toHaveBeenCalledExactlyOnceWith(
        serviceProviderIdMock,
      );
    });

    it('should delete service provider by id', async () => {
      // Given
      const id = 'id';
      const affected = Symbol('1');
      repositoryMock.delete.mockResolvedValue({ affected });

      // When
      const result = await service.delete(id);

      // Then
      expect(repositoryMock.delete).toHaveBeenCalledExactlyOnceWith(id);
      expect(result).toBe(affected);
    });
  });
});
