import { Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersServiceProviderInstanceVersion } from '@entities/typeorm';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';
import { getRepositoryMock, resetRepositoryMock } from '@mocks/typeorm';

import { ServiceProviderInstanceVersionDto } from '../dto';
import { PartnersServiceProviderInstanceVersionService } from './partners-service-provider-instance-version.service';

jest.mock('@fc/access-control');

describe('PartnersServiceProviderInstanceVersionService', () => {
  let service: PartnersServiceProviderInstanceVersionService;

  const loggerServiceMock = getLoggerMock();

  const repositoryMock = getRepositoryMock();

  const idMock = 'id';
  const versionMock = {} as unknown as ServiceProviderInstanceVersionDto;

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
      };
      const expected = Symbol('save result item');
      repositoryMock.save.mockResolvedValue(expected);

      // When
      const result = await service.create(versionMock, idMock);

      // Then
      expect(repositoryMock.save).toHaveBeenCalledExactlyOnceWith(dataMock);
      expect(result).toBe(expected);
    });
  });
});
