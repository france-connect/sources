import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProviderInstanceVersion } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';
import { OidcClientInterface } from '@fc/service-provider';

import { getLoggerMock } from '@mocks/logger';
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { PartnersServiceProviderInstanceVersionService } from './partners-service-provider-instance-version.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderInstanceVersionService', () => {
  let service: PartnersServiceProviderInstanceVersionService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();

  const idMock = 'id';
  const versionMock = {} as unknown as PartnersServiceProviderInstanceVersion;
  const versionDataMock = {} as unknown as OidcClientInterface;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([PartnersServiceProviderInstanceVersion]),
      ],
      providers: [
        LoggerService,
        PartnersServiceProviderInstanceVersionService,
        Repository<PartnersServiceProviderInstanceVersion>,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(
        getRepositoryToken(PartnersServiceProviderInstanceVersion),
      )
      .useValue(repositoryMock)
      .compile();

    service = module.get<PartnersServiceProviderInstanceVersionService>(
      PartnersServiceProviderInstanceVersionService,
    );

    resetRepositoryMock(repositoryMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create version', async () => {
      // Given
      const dataMock = {
        data: { ...versionMock },
        instance: idMock,
        publicationStatus: 'DRAFT',
      };
      const expected = Symbol('save result item');
      repositoryMock.save.mockResolvedValue(expected);

      // When
      const result = await service.create(versionDataMock, idMock);

      // Then
      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith(dataMock);
      expect(result).toBe(expected);
    });
  });

  describe('getById', () => {
    it('should fetch from repository using given id', async () => {
      // Given
      const expected = Symbol('findOne result item');
      repositoryMock.findOne.mockResolvedValue(expected);

      // When
      await service.getById(idMock);

      // Then
      expect(repositoryMock.findOne).toHaveBeenCalledExactlyOnceWith({
        where: { id: idMock },
        relations: ['instance'],
      });
    });

    it('should return the fetched version', async () => {
      // Given
      const expected = Symbol('findOne result item');
      repositoryMock.findOne.mockResolvedValue(expected);

      // When
      const result = await service.getById(idMock);

      // Then
      expect(result).toBe(expected);
    });
  });

  describe('updateStatus', () => {
    it('should update version status', async () => {
      // Given
      const expected = Symbol('update result item');
      repositoryMock.update.mockResolvedValue(expected);

      // When
      const result = await service.updateStatus(versionMock);

      // Then
      expect(repositoryMock.update).toHaveBeenCalledExactlyOnceWith(
        { id: versionMock.id },
        { publicationStatus: versionMock.publicationStatus },
      );
      expect(result).toBe(expected);
    });
  });
});
