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
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { PartnersServiceProviderInstanceService } from './partners-service-provider-instance.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderInstanceService', () => {
  let service: PartnersServiceProviderInstanceService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();

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

  describe('upsert', () => {
    it('should create instance', async () => {
      // Given
      const data = Symbol('data');
      const expected = Symbol('save result item');
      repositoryMock.save.mockResolvedValue(expected);

      // When
      const result = await service.upsert(
        data as unknown as PartnersServiceProviderInstance,
      );

      // Then
      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith(data);
      expect(result).toBe(expected);
    });

    it('should update instance', async () => {
      // Given
      const data = { name: 'instance name' };
      const expected = Symbol('save result item');
      repositoryMock.save.mockResolvedValue(expected);

      // When
      await service.upsert(
        data as unknown as PartnersServiceProviderInstance,
        idMock,
      );

      // Then
      expect(repositoryMock.update).toHaveBeenCalledExactlyOnceWith(
        { id: idMock },
        { name: data.name },
      );
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
