import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import { PostgresOperationFailure } from '@fc/postgres';

import { getLoggerMock } from '@mocks/logger';
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { PartnersServiceProviderService } from './partners-service-provider.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderService', () => {
  let service: PartnersServiceProviderService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const permissionsMock = [] as PermissionInterface[];

  const idMock = 'id';
  const serviceProviderIds = ['sp1', 'sp2'];
  const partnersServiceProvidersMock = {
    createdAt: '2022-02-21T23:00:00.000Z',
    updatedAt: '2022-02-21T23:00:00.000Z',
    id: idMock,
    name: 'sp name',
    instances: [{ id: 'instanceId', name: 'instance name' }],
    organisation: { id: 'organisationId', name: 'organisation name' },
  };

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

  describe('getInstancesFromServiceProvider', () => {
    beforeEach(() => {
      service['getByIds'] = jest
        .fn()
        .mockResolvedValue([partnersServiceProvidersMock]);
    });

    it('should call RelatedEntitiesHelper.get() with instance entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getInstancesFromServiceProvider(idMock, permissionsMock);

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [EntityType.SP_INSTANCE],
        },
      );
    });

    it('should call getByIds() and return result', async () => {
      // Given
      const spIdMock = serviceProviderIds[0];
      const instanceIdsMock = ['instanceId1', 'instanceId2'];

      RelatedEntitiesHelperGetMock.mockReturnValueOnce(instanceIdsMock);

      // When
      const result = await service.getInstancesFromServiceProvider(
        spIdMock,
        permissionsMock,
      );

      // Then
      expect(service['getByIds']).toHaveBeenCalledTimes(1);
      expect(service['getByIds']).toHaveBeenCalledWith(
        [spIdMock],
        instanceIdsMock,
      );
      expect(result).toStrictEqual(partnersServiceProvidersMock);
    });
  });

  describe('getByIds', () => {
    it('should create a query and filter by serviceProviderIds', async () => {
      // Given
      const instancesIds = [];
      const mockResult = [
        { id: 'org1' },
        { id: 'org2' },
      ] as PartnersServiceProvider[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(serviceProviderIds, instancesIds);

      // Then
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'partnersServiceProvider',
      );
      expect(repositoryMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
        1,
        'partnersServiceProvider.instances',
        'instances',
      );
      expect(repositoryMock.leftJoinAndSelect).toHaveBeenNthCalledWith(
        2,
        'partnersServiceProvider.organisation',
        'organisation',
      );
      expect(repositoryMock.where).toHaveBeenCalledWith(
        'partnersServiceProvider.id IN(:...serviceProviderIds)',
        { serviceProviderIds },
      );
      expect(repositoryMock.select).toHaveBeenCalledWith([
        'partnersServiceProvider',
        'instances.id',
        'instances.name',
        'organisation.id',
        'organisation.name',
      ]);
      expect(repositoryMock.orderBy).toHaveBeenCalledWith(
        'partnersServiceProvider.name',
        'ASC',
      );
      expect(repositoryMock.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should add "andWhere" clause for instanceIds when provided', async () => {
      // Given
      const instancesIds = ['instanceId1', 'instanceId2'];
      const mockResult = [
        { id: 'sp1' },
        { id: 'sp2' },
      ] as PartnersServiceProvider[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(serviceProviderIds, instancesIds);

      // Then
      expect(repositoryMock.andWhere).toHaveBeenCalledWith(
        'instances.id IN (:...instancesIds)',
        { instancesIds },
      );
      expect(result).toEqual(mockResult);
    });

    it('should not add "andWhere" clause when serviceProviderIds is empty', async () => {
      // Given
      const serviceProviderIds: string[] = [];
      const mockResult = [
        { id: 'sp1' },
        { id: 'sp2' },
      ] as PartnersServiceProvider[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        serviceProviderIds,
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
      await expect(service.getByIds(serviceProviderIds)).rejects.toThrow(
        PostgresOperationFailure,
      );
    });
  });

  describe('upsert', () => {
    it('should upsert service provider', async () => {
      // Given
      const data = Symbol('data');
      const expected = Symbol('save result item');
      repositoryMock.save.mockResolvedValue(expected);

      // When
      const result = await service.upsert(
        data as unknown as PartnersServiceProvider,
      );

      // Then
      expect(result).toBe(expected);
    });
  });

  describe('delete', () => {
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
