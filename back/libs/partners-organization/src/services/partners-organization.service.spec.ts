import { QueryRunner, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersOrganization } from '@entities/typeorm';

import { PermissionInterface, RelatedEntitiesHelper } from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import {
  AccessControlEntity,
  AccessControlPermission,
} from '@fc/partners/enums';
import { PostgresOperationFailure } from '@fc/postgres';

import { getLoggerMock } from '@mocks/logger';
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { PartnersOrganizationService } from './partners-organization.service';

jest.mock('@fc/access-control');

describe('PartnersOrganizationService', () => {
  let service: PartnersOrganizationService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const permissionsMock = [] as PermissionInterface<
    AccessControlEntity,
    AccessControlPermission
  >[];

  const idMock = 'id';
  const organizationIds = ['org1', 'org2'];
  const partnersOrganizationMock = {
    siret: '12345678901234',
    createdAt: new Date('2022-02-21T23:00:00.000Z'),
    id: 'idMock',
    name: 'name',
    serviceProviders: [],
    updatedAt: new Date('2022-02-21T23:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersOrganization])],
      providers: [
        LoggerService,
        PartnersOrganizationService,
        Repository<PartnersOrganization>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(PartnersOrganization))
      .useValue(repositoryMock)
      .compile();

    service = module.get<PartnersOrganizationService>(
      PartnersOrganizationService,
    );

    resetRepositoryMock(repositoryMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganizationsFromPermission', () => {
    it('should call RelatedEntitiesHelper.get() with organization entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getOrganizationsFromPermission(permissionsMock);

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [AccessControlEntity.ORGANIZATION],
        },
      );
    });

    it('should return empty array if no id found', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      const result =
        await service.getOrganizationsFromPermission(permissionsMock);

      // Then
      expect(result).toStrictEqual([]);
    });

    it('should call getServiceProvidersFromOrganization() twice if 2 ids was found', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(organizationIds);

      service['getServiceProvidersFromOrganization'] = jest.fn();

      // When
      await service.getOrganizationsFromPermission(permissionsMock);

      // Then
      expect(
        service['getServiceProvidersFromOrganization'],
      ).toHaveBeenCalledTimes(2);
      expect(
        service['getServiceProvidersFromOrganization'],
      ).toHaveBeenNthCalledWith(1, organizationIds[0], permissionsMock);
      expect(
        service['getServiceProvidersFromOrganization'],
      ).toHaveBeenNthCalledWith(2, organizationIds[1], permissionsMock);
    });

    it('should call getServiceProvidersFromOrganization() once and return the result', async () => {
      // Given
      const idsMock = ['foo'];

      RelatedEntitiesHelperGetMock.mockReturnValueOnce(idsMock);

      service['getServiceProvidersFromOrganization'] = jest
        .fn()
        .mockResolvedValueOnce(partnersOrganizationMock);

      // When
      const result =
        await service.getOrganizationsFromPermission(permissionsMock);

      // Then
      expect(result).toStrictEqual([partnersOrganizationMock]);
    });
  });

  describe('getServiceProvidersFromOrganization', () => {
    beforeEach(() => {
      service['getByIds'] = jest
        .fn()
        .mockResolvedValue([partnersOrganizationMock]);
    });

    it('should call RelatedEntitiesHelper.get() with service provider entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getServiceProvidersFromOrganization(
        idMock,
        permissionsMock,
      );

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [AccessControlEntity.SERVICE_PROVIDER],
        },
      );
    });

    it('should call getByIds() and return result', async () => {
      // Given
      const organizationIdMock = organizationIds[0];
      const serviceProviderIdsMock = ['sp1', 'sp2'];

      RelatedEntitiesHelperGetMock.mockReturnValueOnce(serviceProviderIdsMock);

      // When
      const result = await service.getServiceProvidersFromOrganization(
        organizationIdMock,
        permissionsMock,
      );

      // Then
      expect(service['getByIds']).toHaveBeenCalledTimes(1);
      expect(service['getByIds']).toHaveBeenCalledWith(
        [organizationIdMock],
        serviceProviderIdsMock,
      );
      expect(result).toStrictEqual(partnersOrganizationMock);
    });
  });

  describe('getByIds', () => {
    it('should create a query and filter by organizationIds', async () => {
      // Given
      const serviceProviderIds = [];
      const mockResult = [
        { id: 'org1' },
        { id: 'org2' },
      ] as PartnersOrganization[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        organizationIds,
        serviceProviderIds,
      );

      // Then
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'partnersOrganization',
      );
      expect(repositoryMock.leftJoinAndSelect).toHaveBeenCalledWith(
        'partnersOrganization.serviceProviders',
        'serviceProviders',
      );
      expect(repositoryMock.where).toHaveBeenCalledWith(
        'partnersOrganization.id IN(:...organizationIds)',
        { organizationIds },
      );
      expect(repositoryMock.select).toHaveBeenCalledWith([
        'partnersOrganization',
        'serviceProviders.id',
        'serviceProviders.name',
      ]);
      expect(repositoryMock.orderBy).toHaveBeenCalledWith(
        'partnersOrganization.name',
        'ASC',
      );
      expect(repositoryMock.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should add "andWhere" clause for serviceProviderIds when provided', async () => {
      // Given
      const serviceProviderIds = ['sp1', 'sp2'];
      const mockResult = [
        { id: 'org1' },
        { id: 'org2' },
      ] as PartnersOrganization[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        organizationIds,
        serviceProviderIds,
      );

      // Then
      expect(repositoryMock.andWhere).toHaveBeenCalledWith(
        'serviceProviders.id IN (:...serviceProviderIds)',
        { serviceProviderIds },
      );
      expect(result).toEqual(mockResult);
    });

    it('should not add "andWhere" clause when serviceProviderIds is empty', async () => {
      // Given
      const serviceProviderIds: string[] = [];
      const mockResult = [
        { id: 'org1' },
        { id: 'org2' },
      ] as PartnersOrganization[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        organizationIds,
        serviceProviderIds,
      );

      // Then
      expect(repositoryMock.andWhere).not.toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should throw PostgresConnectionFailure call to getMany throws', async () => {
      // Given
      const errorMock = new Error('some error');
      repositoryMock.getMany.mockImplementationOnce(() => {
        throw errorMock;
      });

      // When / Then
      await expect(service.getByIds(organizationIds)).rejects.toThrow(
        PostgresOperationFailure,
      );
    });
  });

  describe('upsert', () => {
    // Given
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
      generatedMaps: [partnersOrganizationMock],
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

    it('should upsert organization', async () => {
      // When
      await service.upsert(
        queryRunnerMock as unknown as QueryRunner,
        partnersOrganizationMock,
      );

      // Then
      expect(queryRunnerMock.manager.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(queryRunnerMock.manager.insert).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.into).toHaveBeenCalledWith(
        PartnersOrganization,
      );
      expect(queryRunnerMock.manager.values).toHaveBeenCalledWith(
        partnersOrganizationMock,
      );
      expect(queryRunnerMock.manager.orUpdate).toHaveBeenCalledWith(
        ['name'],
        ['siret'],
      );
      expect(queryRunnerMock.manager.returning).toHaveBeenCalledWith('*');
      expect(queryRunnerMock.manager.execute).toHaveBeenCalledTimes(1);
    });

    it('should return the upserted entity from generatedMaps', async () => {
      // Given
      const data = Symbol('data');

      // When
      const result = await service.upsert(
        queryRunnerMock as unknown as QueryRunner,
        data as unknown as PartnersOrganization,
      );

      // Then
      expect(result).toBe(partnersOrganizationMock);
    });
  });

  describe('delete', () => {
    it('should delete organization by id', async () => {
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
