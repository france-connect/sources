import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { ConfigMessageDto } from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';

import { ConfigPostgresAdapterService } from './config-postgres-adapter.service';

describe('ConfigPostgresAdapterService', () => {
  let service: ConfigPostgresAdapterService;

  const instancesMock = {
    getById: jest.fn(),
    save: jest.fn(),
  };

  const versionsMock = {
    getById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
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
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instancesMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionsMock)
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

      service['save'] = jest.fn().mockResolvedValue(saveResult);

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

      service['save'] = jest.fn().mockResolvedValue(saveResult);

      // When
      const result = await service.update(messageMock);

      // Then
      expect(result).toBe(saveResult);
    });
  });

  describe('save', () => {
    it('should update version publication status', async () => {
      // Given
      const instance = Symbol('instance');
      const version = {
        publicationStatus: Symbol('ExistingPublicationStatus'),
      };

      service['getInstance'] = jest.fn().mockResolvedValue(instance);
      service['getVersion'] = jest.fn().mockResolvedValue(version);

      // When
      await service['save'](messageMock);

      // Then
      expect(versionsMock.updateStatus).toHaveBeenCalledWith(version);
    });

    it('should return result with version id', async () => {
      // Given
      const instance = Symbol('instance');
      const version = {
        id: Symbol('versionId'),
        publicationStatus: Symbol('ExistingPublicationStatus'),
      };

      service['getInstance'] = jest.fn().mockResolvedValue(instance);
      service['getVersion'] = jest.fn().mockResolvedValue(version);

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

      instancesMock.getById.mockReturnValue(instance);

      // When
      const result = await service['getInstance'](messageMock);

      // Then
      expect(result).toBe(instance);
    });

    it('should create instance if not found', async () => {
      // Given
      const instance = Symbol('instance');

      instancesMock.getById.mockReturnValue(null);
      instancesMock.save.mockReturnValue(instance);

      // When
      const result = await service['getInstance'](messageMock);

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
      versionsMock.getById.mockReturnValue(version);

      // When
      const result = await service['getVersion'](messageMock, instance);

      // Then
      expect(result).toBe(version);
    });

    it('should create version if not found', async () => {
      // Given
      versionsMock.getById.mockReturnValue(null);
      versionsMock.create.mockReturnValue(version);

      // When
      const result = await service['getVersion'](messageMock, instance);

      // Then
      expect(result).toBe(version);
    });
  });
});
