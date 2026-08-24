import { In, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import {
  PartnersAccountPermission,
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import { PermissionInterface, RelatedEntitiesHelper } from '@fc/access-control';
import {
  AccessControlEntity,
  AccessControlPermission,
} from '@fc/partners/enums';
import { PartnersAccountSession } from '@fc/partners-account';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';
import {
  getQueryRunnerMock,
  getRepositoryMock,
  resetRepositoryMock,
} from '@mocks/typeorm';

import { PartnersServiceProviderInstanceService } from './partners-service-provider-instance.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderInstanceService', () => {
  let service: PartnersServiceProviderInstanceService;

  const sessionServiceMock = getSessionServiceMock();
  const repositoryMock = getRepositoryMock();

  const sessionPartnersAccountDataMock = {
    identity: {
      id: 'accountId',
    },
  } as unknown as PartnersAccountSession<
    AccessControlEntity,
    AccessControlPermission
  >;

  let queryRunnerMock;

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const permissionsMock = [] as PermissionInterface<
    AccessControlEntity,
    AccessControlPermission
  >[];

  const idMock = 'id';
  const partnersServiceProvidersInstanceMock = {
    createdAt: '2022-02-21T23:00:00.000Z',
    updatedAt: '2022-02-21T23:00:00.000Z',
    id: idMock,
    name: 'instance name',
    currentVersion: { id: 'versionId', name: 'version name' },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersServiceProviderInstance])],
      providers: [
        PartnersServiceProviderInstanceService,
        Repository<PartnersServiceProviderInstance>,
        SessionService,
      ],
    })
      .overrideProvider(getRepositoryToken(PartnersServiceProviderInstance))
      .useValue(repositoryMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<PartnersServiceProviderInstanceService>(
      PartnersServiceProviderInstanceService,
    );

    resetRepositoryMock(repositoryMock);
    repositoryMock.find.mockResolvedValueOnce([
      partnersServiceProvidersInstanceMock,
    ]);
    queryRunnerMock = getQueryRunnerMock();

    sessionServiceMock.get.mockReturnValue(sessionPartnersAccountDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllowedInstances', () => {
    const accountIdMock = 'accountId';
    beforeEach(() => {
      service['getById'] = jest
        .fn()
        .mockResolvedValue(partnersServiceProvidersInstanceMock);
    });

    it('should call RelatedEntitiesHelper.get() with version entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getAllowedInstances(permissionsMock, accountIdMock);

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [AccessControlEntity.SERVICE_PROVIDER],
        },
      );
    });

    it('should call repository.find() with where clause', async () => {
      // When
      await service.getAllowedInstances(permissionsMock, accountIdMock);

      // Then
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    it('should return le last version save for an instance', async () => {
      // Given
      repositoryMock.findOne.mockResolvedValueOnce(
        partnersServiceProvidersInstanceMock,
      );

      // When
      const result = await service.getById(idMock);

      // Then
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { id: idMock, markedForDeletion: false },
        relations: ['currentVersion', 'creator', 'serviceProvider'],
        select: {
          creator: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
          },
        },
      });
      expect(result).toStrictEqual({
        ...partnersServiceProvidersInstanceMock,
        currentVersion: partnersServiceProvidersInstanceMock.currentVersion,
      });
    });

    it('should return instance if no version found', async () => {
      // Given
      const partnersSPInstanceWithoutVersionMock = {
        createdAt: '2022-02-21T23:00:00.000Z',
        updatedAt: '2022-02-21T23:00:00.000Z',
        id: idMock,
        name: 'instance name',
      };
      repositoryMock.findOne.mockResolvedValueOnce(
        partnersSPInstanceWithoutVersionMock,
      );

      // When
      const result = await service.getById(idMock);

      // Then
      expect(result).toStrictEqual({ ...partnersSPInstanceWithoutVersionMock });
    });
  });

  describe('getByIdWithQueryRunner', () => {
    it('should call queryRunner.manager.findOne', async () => {
      // Given
      queryRunnerMock.manager.findOne.mockResolvedValueOnce(
        partnersServiceProvidersInstanceMock,
      );

      // When
      await service.getByIdWithQueryRunner(queryRunnerMock, idMock);

      // Then
      expect(queryRunnerMock.manager.findOne).toHaveBeenCalledExactlyOnceWith(
        PartnersServiceProviderInstance,
        {
          where: { id: idMock, markedForDeletion: false },
          relations: ['currentVersion', 'creator', 'serviceProvider'],
          select: {
            creator: {
              id: true,
              email: true,
              firstname: true,
              lastname: true,
            },
          },
        },
      );
    });

    it('should return le last version save for an instance', async () => {
      // Given
      queryRunnerMock.manager.findOne.mockResolvedValueOnce(
        partnersServiceProvidersInstanceMock,
      );

      // When
      const result = await service.getByIdWithQueryRunner(
        queryRunnerMock,
        idMock,
      );

      // Then
      expect(result).toStrictEqual({
        ...partnersServiceProvidersInstanceMock,
        currentVersion: partnersServiceProvidersInstanceMock.currentVersion,
      });
    });

    it('should return instance if no version found', async () => {
      // Given
      const partnersSPInstanceWithoutVersionMock = {
        createdAt: '2022-02-21T23:00:00.000Z',
        updatedAt: '2022-02-21T23:00:00.000Z',
        id: idMock,
        name: 'instance name',
      };
      queryRunnerMock.manager.findOne.mockResolvedValueOnce(
        partnersSPInstanceWithoutVersionMock,
      );

      // When
      const result = await service.getByIdWithQueryRunner(
        queryRunnerMock,
        idMock,
      );

      // Then
      expect(result).toStrictEqual({ ...partnersSPInstanceWithoutVersionMock });
    });
  });

  describe('save', () => {
    it('should save instance', async () => {
      // Given
      const data = Symbol('data');
      const expected = Symbol('save result item');
      queryRunnerMock.manager.execute.mockResolvedValueOnce({
        raw: [expected],
      });

      // When
      const result = await service.save(
        queryRunnerMock,
        data as unknown as PartnersServiceProviderInstance,
      );

      // Then
      expect(result).toBe(expected);
    });
  });

  describe('getByIdsWithQueryRunner', () => {
    // Given
    const instanceIdsMock = ['id-1', 'id-2'];

    beforeEach(() => {
      queryRunnerMock.manager.find.mockResolvedValueOnce([
        partnersServiceProvidersInstanceMock,
      ]);
    });

    it('should call queryRunner.manager.find', async () => {
      // When
      await service.getByIdsWithQueryRunner(queryRunnerMock, instanceIdsMock);

      // Then
      expect(queryRunnerMock.manager.find).toHaveBeenCalledExactlyOnceWith(
        PartnersServiceProviderInstance,
        {
          where: { id: In(instanceIdsMock), markedForDeletion: false },
          relations: ['currentVersion', 'creator', 'serviceProvider'],
        },
      );
    });

    it('should return the instances found', async () => {
      // When
      const result = await service.getByIdsWithQueryRunner(
        queryRunnerMock,
        instanceIdsMock,
      );

      // Then
      expect(result).toStrictEqual([partnersServiceProvidersInstanceMock]);
    });
  });

  describe('getLinkableInstances', () => {
    const accountIdMock = 'account-id';
    const defaultSpIdMock = 'default-sp-id';

    it('should fetch instances with serviceProvider and creator filters', async () => {
      // When
      await service.getLinkableInstances(accountIdMock, defaultSpIdMock);

      // Then
      expect(repositoryMock.find).toHaveBeenCalledExactlyOnceWith({
        where: {
          serviceProvider: { id: defaultSpIdMock },
          creator: { id: accountIdMock },
          markedForDeletion: false,
        },
        order: { createdAt: 'DESC' },
        relations: ['currentVersion', 'creator', 'serviceProvider'],
      });
    });

    it('should return the detached instances', async () => {
      // When
      const result = await service.getLinkableInstances(
        accountIdMock,
        defaultSpIdMock,
      );

      // Then
      expect(result).toStrictEqual([partnersServiceProvidersInstanceMock]);
    });
  });

  describe('linkToServiceProvider', () => {
    const instanceIdsMock = ['id-1', 'id-2'];
    const serviceProviderIdMock = 'sp-id';

    let qbMock: {
      update: jest.Mock;
      set: jest.Mock;
      where: jest.Mock;
      execute: jest.Mock;
    };

    beforeEach(() => {
      qbMock = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };
      queryRunnerMock.manager.createQueryBuilder.mockReturnValue(qbMock);
    });

    it('should build the update query with the correct entity', async () => {
      // When
      await service.linkToServiceProvider(
        queryRunnerMock,
        instanceIdsMock,
        serviceProviderIdMock,
      );

      // Then
      expect(queryRunnerMock.manager.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(qbMock.update).toHaveBeenCalledExactlyOnceWith(expect.anything());
    });

    it('should set the serviceProvider relation to the new sp', async () => {
      // When
      await service.linkToServiceProvider(
        queryRunnerMock,
        instanceIdsMock,
        serviceProviderIdMock,
      );

      // Then
      expect(qbMock.set).toHaveBeenCalledExactlyOnceWith({
        serviceProvider: { id: serviceProviderIdMock },
      });
    });

    it('should filter by the given instanceIds', async () => {
      // When
      await service.linkToServiceProvider(
        queryRunnerMock,
        instanceIdsMock,
        serviceProviderIdMock,
      );

      // Then
      expect(qbMock.where).toHaveBeenCalledExactlyOnceWith({
        id: In(instanceIdsMock),
      });
    });

    it('should execute the query', async () => {
      // When
      await service.linkToServiceProvider(
        queryRunnerMock,
        instanceIdsMock,
        serviceProviderIdMock,
      );

      // Then
      expect(qbMock.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('markForDeletion', () => {
    let qbMock: {
      update: jest.Mock;
      set: jest.Mock;
      where: jest.Mock;
      execute: jest.Mock;
    };

    beforeEach(() => {
      qbMock = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };
      queryRunnerMock.manager.createQueryBuilder.mockReturnValue(qbMock);
    });

    it('should build the update query with the instance entity', async () => {
      // When
      await service.markForDeletion(queryRunnerMock, idMock);

      // Then
      expect(qbMock.update).toHaveBeenCalledExactlyOnceWith(expect.anything());
    });

    it('should set markedForDeletion to true', async () => {
      // When
      await service.markForDeletion(queryRunnerMock, idMock);

      // Then
      expect(qbMock.set).toHaveBeenCalledExactlyOnceWith({
        markedForDeletion: true,
      });
    });

    it('should filter on the given instance id', async () => {
      // When
      await service.markForDeletion(queryRunnerMock, idMock);

      // Then
      expect(qbMock.where).toHaveBeenCalledExactlyOnceWith({ id: idMock });
    });

    it('should execute the query', async () => {
      // When
      await service.markForDeletion(queryRunnerMock, idMock);

      // Then
      expect(qbMock.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearCurrentVersionWithQueryRunner', () => {
    let qbMock: {
      update: jest.Mock;
      set: jest.Mock;
      where: jest.Mock;
      execute: jest.Mock;
    };

    beforeEach(() => {
      qbMock = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(undefined),
      };
      queryRunnerMock.manager.createQueryBuilder.mockReturnValue(qbMock);
    });

    it('should build the update query with the instance entity', async () => {
      // When
      await service.clearCurrentVersionWithQueryRunner(queryRunnerMock, idMock);

      // Then
      expect(qbMock.update).toHaveBeenCalledExactlyOnceWith(expect.anything());
    });

    it('should set currentVersion to null', async () => {
      // When
      await service.clearCurrentVersionWithQueryRunner(queryRunnerMock, idMock);

      // Then
      expect(qbMock.set).toHaveBeenCalledExactlyOnceWith({
        currentVersion: null,
      });
    });

    it('should filter on the given instance id', async () => {
      // When
      await service.clearCurrentVersionWithQueryRunner(queryRunnerMock, idMock);

      // Then
      expect(qbMock.where).toHaveBeenCalledExactlyOnceWith({ id: idMock });
    });

    it('should execute the query', async () => {
      // When
      await service.clearCurrentVersionWithQueryRunner(queryRunnerMock, idMock);

      // Then
      expect(qbMock.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteWithQueryRunner', () => {
    beforeEach(() => {
      queryRunnerMock.manager.delete = jest.fn();
    });

    it('should delete the instance by id with the query runner', async () => {
      // When
      await service.deleteWithQueryRunner(queryRunnerMock, idMock);

      // Then
      expect(queryRunnerMock.manager.delete).toHaveBeenCalledExactlyOnceWith(
        PartnersServiceProviderInstance,
        { id: idMock },
      );
    });
  });

  describe('removeInstancePermissionsWithQueryRunner', () => {
    beforeEach(() => {
      queryRunnerMock.manager.delete = jest.fn();
    });

    it('should delete the instance permissions with the query runner', async () => {
      // When
      await service.removeInstancePermissionsWithQueryRunner(
        queryRunnerMock,
        idMock,
      );

      // Then
      expect(queryRunnerMock.manager.delete).toHaveBeenCalledExactlyOnceWith(
        PartnersAccountPermission,
        {
          entity: AccessControlEntity.SP_INSTANCE,
          entityId: idMock,
        },
      );
    });
  });
});
