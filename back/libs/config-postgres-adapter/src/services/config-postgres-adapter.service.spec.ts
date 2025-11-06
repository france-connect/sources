import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { ConfigMessageDto } from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';
import { TypeormService } from '@fc/typeorm';

import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { ConfigPostgresAdapterService } from './config-postgres-adapter.service';

describe('ConfigPostgresAdapterService', () => {
  let service: ConfigPostgresAdapterService;

  const queryRunnerMock = getQueryRunnerMock();
  const typeormServiceMock = getTypeormServiceMock();

  const instancesMock = {
    getByIdWithQueryRunner: jest.fn(),
    save: jest.fn(),
  };

  const versionsMock = {
    getByIdWithQueryRunner: jest.fn(),
    create: jest.fn(),
    updateStatusWithQueryRunner: jest.fn(),
  };

  const messageMock = {
    payload: { publicationStatus: Symbol('publicationStatus') },
    meta: {
      instanceId: Symbol('instanceId'),
      versionId: Symbol('versionId'),
    },
  } as unknown as ConfigMessageDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigPostgresAdapterService,
        PartnersServiceProviderInstanceService,
        PartnersServiceProviderInstanceVersionService,
        TypeormService,
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instancesMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionsMock)
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .compile();

    service = module.get<ConfigPostgresAdapterService>(
      ConfigPostgresAdapterService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should forward call to save() method', async () => {
      // Given
      const saveResult = Symbol('saveResult');

      service['save'] = jest.fn().mockResolvedValueOnce(saveResult);

      // When
      const result = await service.create(messageMock);

      // Then
      expect(result).toBe(saveResult);
    });
  });

  describe('update', () => {
    it('should forward call to save() method', async () => {
      // Given
      const saveResult = Symbol('saveResult');

      service['save'] = jest.fn().mockResolvedValueOnce(saveResult);

      // When
      const result = await service.update(messageMock);

      // Then
      expect(result).toBe(saveResult);
    });
  });

  describe('save', () => {
    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementationOnce((callback) =>
        callback(queryRunnerMock),
      );
    });

    it('should update version publication status', async () => {
      // Given
      const instance = Symbol('instance');
      const version = {
        publicationStatus: Symbol('ExistingPublicationStatus'),
      };

      service['getInstance'] = jest.fn().mockResolvedValueOnce(instance);
      service['getVersion'] = jest.fn().mockResolvedValueOnce(version);

      // When
      await service['save'](messageMock);

      // Then
      expect(versionsMock.updateStatusWithQueryRunner).toHaveBeenCalledWith(
        queryRunnerMock,
        version,
      );
    });

    it('should return result with version id', async () => {
      // Given
      const instance = Symbol('instance');
      const version = {
        id: Symbol('versionId'),
        publicationStatus: Symbol('ExistingPublicationStatus'),
      };

      service['getInstance'] = jest.fn().mockResolvedValueOnce(instance);
      service['getVersion'] = jest.fn().mockResolvedValueOnce(version);

      // When
      const result = await service['save'](messageMock);

      // Then
      expect(result).toEqual({
        id: version.id,
      });
    });
  });

  describe('getInstance', () => {
    it('should return instance by id', async () => {
      // Given
      const instance = Symbol('instance');

      instancesMock.getByIdWithQueryRunner.mockResolvedValueOnce(instance);

      // When
      const result = await service['getInstance'](queryRunnerMock, messageMock);

      // Then
      expect(result).toBe(instance);
    });

    it('should create instance if not found', async () => {
      // Given
      const instance = Symbol('instance');

      instancesMock.getByIdWithQueryRunner.mockResolvedValueOnce(null);
      instancesMock.save.mockResolvedValueOnce(instance);

      // When
      await service['getInstance'](queryRunnerMock, messageMock);

      // Then
      expect(instancesMock.save).toHaveBeenCalledWith(queryRunnerMock, {
        id: messageMock.meta.instanceId,
        ...messageMock.payload,
      });
    });

    it('should return instance if not found', async () => {
      // Given
      const instance = Symbol('instance');

      instancesMock.getByIdWithQueryRunner.mockResolvedValueOnce(null);
      instancesMock.save.mockResolvedValueOnce(instance);

      // When
      const result = await service['getInstance'](queryRunnerMock, messageMock);

      // Then
      expect(result).toBe(instance);
    });
  });

  describe('getVersion', () => {
    const version = Symbol('version');
    const instance = {
      id: Symbol('instanceId'),
    } as unknown as PartnersServiceProviderInstance;

    it('should return version by id', async () => {
      // Given
      versionsMock.getByIdWithQueryRunner.mockResolvedValueOnce(version);

      // When
      const result = await service['getVersion'](
        queryRunnerMock,
        messageMock,
        instance,
      );

      // Then
      expect(result).toBe(version);
    });

    it('should create version if not found', async () => {
      // Given
      versionsMock.getByIdWithQueryRunner.mockResolvedValueOnce(null);
      versionsMock.create.mockResolvedValueOnce(version);

      // When
      const result = await service['getVersion'](
        queryRunnerMock,
        messageMock,
        instance,
      );

      // Then
      expect(result).toBe(version);
    });
  });
});
