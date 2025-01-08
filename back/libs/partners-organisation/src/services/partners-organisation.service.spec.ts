import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersOrganisation } from '@entities/typeorm';

import {
  EntityType,
  PermissionInterface,
  RelatedEntitiesHelper,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import { PostgresOperationFailure } from '@fc/postgres';

import { getLoggerMock } from '@mocks/logger';
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { PartnersOrganisationService } from './partners-organisation.service';

jest.mock('@fc/access-control');

describe('PartnersOrganisationService', () => {
  let service: PartnersOrganisationService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();

  const RelatedEntitiesHelperGetMock = jest.spyOn(RelatedEntitiesHelper, 'get');

  const permissionsMock = [] as PermissionInterface[];

  const idMock = 'id';
  const organisationIds = ['org1', 'org2'];
  const partnersOrganisationMock = {
    createdAt: '2022-02-21T23:00:00.000Z',
    id: 'idMock',
    name: 'name',
    serviceProviders: [],
    updatedAt: '2022-02-21T23:00:00.000Z',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersOrganisation])],
      providers: [
        LoggerService,
        PartnersOrganisationService,
        Repository<PartnersOrganisation>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(getRepositoryToken(PartnersOrganisation))
      .useValue(repositoryMock)
      .compile();

    service = module.get<PartnersOrganisationService>(
      PartnersOrganisationService,
    );

    resetRepositoryMock(repositoryMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganisationsFromPermission', () => {
    it('should call RelatedEntitiesHelper.get() with organisation entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getOrganisationsFromPermission(permissionsMock);

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [EntityType.ORGANISATION],
        },
      );
    });

    it('should return empty array if no id found', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      const result =
        await service.getOrganisationsFromPermission(permissionsMock);

      // Then
      expect(result).toStrictEqual([]);
    });

    it('should call getServiceProvidersFromOrganisation() twice if 2 ids was found', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce(organisationIds);

      service['getServiceProvidersFromOrganisation'] = jest.fn();

      // When
      await service.getOrganisationsFromPermission(permissionsMock);

      // Then
      expect(
        service['getServiceProvidersFromOrganisation'],
      ).toHaveBeenCalledTimes(2);
      expect(
        service['getServiceProvidersFromOrganisation'],
      ).toHaveBeenNthCalledWith(1, organisationIds[0], permissionsMock);
      expect(
        service['getServiceProvidersFromOrganisation'],
      ).toHaveBeenNthCalledWith(2, organisationIds[1], permissionsMock);
    });

    it('should call getServiceProvidersFromOrganisation() once and return the result', async () => {
      // Given
      const idsMock = ['foo'];

      RelatedEntitiesHelperGetMock.mockReturnValueOnce(idsMock);

      service['getServiceProvidersFromOrganisation'] = jest
        .fn()
        .mockResolvedValueOnce(partnersOrganisationMock);

      // When
      const result =
        await service.getOrganisationsFromPermission(permissionsMock);

      // Then
      expect(result).toStrictEqual([partnersOrganisationMock]);
    });
  });

  describe('getServiceProvidersFromOrganisation', () => {
    beforeEach(() => {
      service['getByIds'] = jest
        .fn()
        .mockResolvedValue([partnersOrganisationMock]);
    });

    it('should call RelatedEntitiesHelper.get() with service provider entity', async () => {
      // Given
      RelatedEntitiesHelperGetMock.mockReturnValueOnce([]);

      // When
      await service.getServiceProvidersFromOrganisation(
        idMock,
        permissionsMock,
      );

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledTimes(1);
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledWith(
        permissionsMock,
        {
          entityTypes: [EntityType.SERVICE_PROVIDER],
        },
      );
    });

    it('should call getByIds() and return result', async () => {
      // Given
      const organisationIdMock = organisationIds[0];
      const serviceProviderIdsMock = ['sp1', 'sp2'];

      RelatedEntitiesHelperGetMock.mockReturnValueOnce(serviceProviderIdsMock);

      // When
      const result = await service.getServiceProvidersFromOrganisation(
        organisationIdMock,
        permissionsMock,
      );

      // Then
      expect(service['getByIds']).toHaveBeenCalledTimes(1);
      expect(service['getByIds']).toHaveBeenCalledWith(
        [organisationIdMock],
        serviceProviderIdsMock,
      );
      expect(result).toStrictEqual(partnersOrganisationMock);
    });
  });

  describe('getByIds', () => {
    it('should create a query and filter by organisationIds', async () => {
      // Given
      const serviceProviderIds = [];
      const mockResult = [
        { id: 'org1' },
        { id: 'org2' },
      ] as PartnersOrganisation[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        organisationIds,
        serviceProviderIds,
      );

      // Then
      expect(repositoryMock.createQueryBuilder).toHaveBeenCalledWith(
        'partnersOrganisation',
      );
      expect(repositoryMock.leftJoinAndSelect).toHaveBeenCalledWith(
        'partnersOrganisation.serviceProviders',
        'serviceProviders',
      );
      expect(repositoryMock.where).toHaveBeenCalledWith(
        'partnersOrganisation.id IN(:...organisationIds)',
        { organisationIds },
      );
      expect(repositoryMock.select).toHaveBeenCalledWith([
        'partnersOrganisation',
        'serviceProviders.id',
        'serviceProviders.name',
      ]);
      expect(repositoryMock.orderBy).toHaveBeenCalledWith(
        'partnersOrganisation.name',
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
      ] as PartnersOrganisation[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        organisationIds,
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
      ] as PartnersOrganisation[];

      repositoryMock.getMany.mockResolvedValue(mockResult);

      // When
      const result = await service.getByIds(
        organisationIds,
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
      await expect(service.getByIds(organisationIds)).rejects.toThrow(
        PostgresOperationFailure,
      );
    });
  });

  describe('upsert', () => {
    it('should upsert organisation', async () => {
      // Given
      const data = Symbol('data');
      const expected = Symbol('save result item');
      repositoryMock.save.mockResolvedValue(expected);

      // When
      const result = await service.upsert(
        data as unknown as PartnersOrganisation,
      );

      // Then
      expect(result).toBe(expected);
    });
  });

  describe('delete', () => {
    it('should delete organisation by id', async () => {
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
