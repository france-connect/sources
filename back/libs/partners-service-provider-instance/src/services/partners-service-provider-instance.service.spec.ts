import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';
import {
  getQueryRunnerMock,
  getRepositoryMock,
  resetRepositoryMock,
} from '@mocks/typeorm';

import { PartnersServiceProviderInstanceService } from './partners-service-provider-instance.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderInstanceService', () => {
  let service: PartnersServiceProviderInstanceService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();
  let queryRunnerMock;

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const permissionsMock = [] as PermissionInterface[];

  const idMock = 'id';
  const instanceIds = ['instanceId1', 'instanceId2'];
  const partnersServiceProvidersInstanceMock = {
    createdAt: '2022-02-21T23:00:00.000Z',
    updatedAt: '2022-02-21T23:00:00.000Z',
    id: idMock,
    name: 'instance name',
    versions: [
      { id: 'versionId', name: 'version name' },
      { id: 'versionId', name: 'version name' },
    ],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersServiceProviderInstance])],
      providers: [
        LoggerService,
        PartnersServiceProviderInstanceService,
        Repository<PartnersServiceProviderInstance>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(PartnersServiceProviderInstance))
      .useValue(repositoryMock)
      .compile();

    service = module.get<PartnersServiceProviderInstanceService>(
      PartnersServiceProviderInstanceService,
    );

    resetRepositoryMock(repositoryMock);
    queryRunnerMock = getQueryRunnerMock();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllowedInstances', () => {
    beforeEach(() => {
      service['getById'] = jest
        .fn()
        .mockResolvedValue(partnersServiceProvidersInstanceMock);
    });

    it('should call RelatedEntitiesHelper.get() with version entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getAllowedInstances(permissionsMock);

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [EntityType.SP_INSTANCE],
        },
      );
    });

    it('should call getById() and return result', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(instanceIds);

      // When
      const result = await service.getAllowedInstances(permissionsMock);

      // Then
      expect(service['getById']).toHaveBeenCalledTimes(2);
      expect(service['getById']).toHaveBeenNthCalledWith(1, instanceIds[0]);
      expect(service['getById']).toHaveBeenNthCalledWith(2, instanceIds[1]);
      expect(result).toStrictEqual([
        { ...partnersServiceProvidersInstanceMock },
        { ...partnersServiceProvidersInstanceMock },
      ]);
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
        where: { id: idMock },
        relations: ['versions'],
        order: {
          versions: {
            createdAt: 'DESC',
          },
        },
      });
      expect(result).toStrictEqual({
        ...partnersServiceProvidersInstanceMock,
        versions: [partnersServiceProvidersInstanceMock.versions[0]],
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
          where: { id: idMock },
          relations: ['versions'],
          order: {
            versions: {
              createdAt: 'DESC',
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
        versions: [partnersServiceProvidersInstanceMock.versions[0]],
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

  describe('delete', () => {
    it('should delete instance by id', async () => {
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
