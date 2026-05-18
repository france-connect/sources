import { In, QueryRunner, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import {
  EnvironmentEnum,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
  PublicationStatusEnum,
} from '@entities/typeorm';

import { PermissionInterface, RelatedEntitiesHelper } from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import {
  AccessControlEntity,
  AccessControlPermission,
} from '@fc/partners/enums';
import { OidcClientInterface } from '@fc/service-provider';

import { getLoggerMock } from '@mocks/logger';
import {
  getQueryRunnerMock,
  getRepositoryMock,
  resetRepositoryMock,
} from '@mocks/typeorm';

import { PartnersServiceProviderNotFoundException } from '../exceptions';
import { PartnersServiceProviderService } from './partners-service-provider.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderService', () => {
  let service: PartnersServiceProviderService;

  const loggerServiceMock = getLoggerMock();
  const repositoryMock = getRepositoryMock();
  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  let queryRunnerMock;

  const permissionsMock = [
    {
      permissionType: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      entityId: 'service-provider-id',
    },
  ] as PermissionInterface<AccessControlEntity, AccessControlPermission>[];

  const versionMock: PartnersServiceProviderInstanceVersion = {
    id: 'version-id',
    data: {} as unknown as OidcClientInterface,
    publicationStatus: PublicationStatusEnum.DRAFT,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    instance: null,
  };

  const instanceMock: Omit<PartnersServiceProviderInstance, 'versions'> = {
    id: 'instance-id',
    environment: EnvironmentEnum.SANDBOX,
    creator: null,
    serviceProvider: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    currentVersion: versionMock,
  };

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    datapassRequestId: '12345',
    datapassAuthorizationId: '456',
    datapassEidasLevel: 'eidas_1',
    datapassScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organization: {
      id: '12345',
      name: 'Test Organization',
      siret: '12345678901234',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      serviceProviders: [],
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    instances: [instanceMock as PartnersServiceProviderInstance],
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

    repositoryMock.findOne.mockResolvedValue(serviceProviderMock);

    queryRunnerMock = getQueryRunnerMock();
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
          entityTypes: [AccessControlEntity.SERVICE_PROVIDER],
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
        relations: ['organization'],
      });
      expect(result).toEqual([serviceProviderMock]);
    });
  });

  describe('getById', () => {
    it('should call repository.findOne with platform in relations', async () => {
      // When
      await service.getById(serviceProviderIdMock);

      // Then
      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: { id: serviceProviderIdMock },
        relations: [
          'instances',
          'instances.currentVersion',
          'instances.creator',
          'organization',
          'platform',
        ],
        order: { instances: { createdAt: 'DESC' } },
      });
    });

    it('should return service provider when found', async () => {
      // Given
      repositoryMock.findOne.mockResolvedValue(serviceProviderMock);

      // When
      const result = await service.getById(serviceProviderIdMock);

      // Then
      expect(result).toEqual(serviceProviderMock);
    });

    it('should throw PartnersServiceProviderNotFoundException when service provider not found', async () => {
      // Given
      repositoryMock.findOne.mockResolvedValue(null);

      // When / Then
      await expect(service.getById(serviceProviderIdMock)).rejects.toThrow(
        PartnersServiceProviderNotFoundException,
      );
    });

    it('should return the service provider with the latest version of the instance', async () => {
      // When
      const result = await service.getById(serviceProviderIdMock);

      // Then
      expect(result).toEqual({
        ...serviceProviderMock,
        instances: [
          {
            ...instanceMock,
            currentVersion: versionMock,
          },
        ],
      });
    });
  });

  describe('getByIdTransactional', () => {
    it('should call queryRunner.manager.findOne with platform in relations', async () => {
      // Given
      queryRunnerMock.manager.findOne = jest
        .fn()
        .mockResolvedValue(serviceProviderMock);

      // When
      await service.getByIdTransactional(
        queryRunnerMock as unknown as QueryRunner,
        serviceProviderIdMock,
      );

      // Then
      expect(queryRunnerMock.manager.findOne).toHaveBeenCalledExactlyOnceWith(
        PartnersServiceProvider,
        {
          where: { id: serviceProviderIdMock },
          relations: [
            'platform',
            'instances',
            'instances.currentVersion',
            'instances.creator',
          ],
          order: {
            instances: { createdAt: 'DESC' },
          },
        },
      );
    });

    it('should return service provider when found', async () => {
      // Given
      queryRunnerMock.manager.findOne = jest
        .fn()
        .mockResolvedValue(serviceProviderMock);

      // When
      const result = await service.getByIdTransactional(
        queryRunnerMock as unknown as QueryRunner,
        serviceProviderIdMock,
      );

      // Then
      expect(result).toEqual(serviceProviderMock);
    });

    it('should throw PartnersServiceProviderNotFoundException when service provider not found', async () => {
      // Given
      queryRunnerMock.manager.findOne = jest.fn().mockResolvedValue(null);

      // When / Then
      await expect(
        service.getByIdTransactional(
          queryRunnerMock as unknown as QueryRunner,
          serviceProviderIdMock,
        ),
      ).rejects.toThrow(PartnersServiceProviderNotFoundException);
    });
  });

  describe('upsert', () => {
    const upsertResultMock = {
      generatedMaps: [serviceProviderMock],
    };

    beforeEach(() => {
      queryRunnerMock.manager.execute = jest
        .fn()
        .mockResolvedValue(upsertResultMock);
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
        [
          'name',
          'datapassScopes',
          'datapassEidasLevel',
          'datapassAuthorizationId',
          'organizationId',
        ],
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
