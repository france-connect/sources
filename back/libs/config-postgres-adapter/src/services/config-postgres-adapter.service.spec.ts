import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import {
  ConfigCreateMessageDto,
  ConfigDeleteMessageDto,
  ConfigMessageDto,
  ConfigUpdateMessageDto,
} from '@fc/csmr-config-client';
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
    removeInstancePermissionsWithQueryRunner: jest.fn(),
    clearCurrentVersionWithQueryRunner: jest.fn(),
    deleteWithQueryRunner: jest.fn(),
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

  const createMessageMock = messageMock as ConfigCreateMessageDto;
  const updateMessageMock = messageMock as ConfigUpdateMessageDto;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

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
      const result = await service.create(createMessageMock);

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
      const result = await service.update(updateMessageMock);

      // Then
      expect(result).toBe(saveResult);
    });
  });

  describe('delete', () => {
    const instanceId = Symbol('instanceId');
    const deleteMessageMock = {
      meta: { instanceId },
    } as unknown as ConfigDeleteMessageDto;

    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementationOnce((callback) =>
        callback(queryRunnerMock),
      );
    });

    it('should remove the instance permissions within the transaction', async () => {
      // When
      await service.delete(deleteMessageMock);

      // Then
      expect(
        instancesMock.removeInstancePermissionsWithQueryRunner,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceId);
    });

    it('should clear the current version within the transaction', async () => {
      // When
      await service.delete(deleteMessageMock);

      // Then
      expect(
        instancesMock.clearCurrentVersionWithQueryRunner,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceId);
    });

    it('should delete the instance within the transaction', async () => {
      // When
      await service.delete(deleteMessageMock);

      // Then
      expect(
        instancesMock.deleteWithQueryRunner,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceId);
    });

    it('should clear the current version before deleting the instance', async () => {
      // When
      await service.delete(deleteMessageMock);

      // Then
      const clearOrder =
        instancesMock.clearCurrentVersionWithQueryRunner.mock
          .invocationCallOrder[0];
      const deleteOrder =
        instancesMock.deleteWithQueryRunner.mock.invocationCallOrder[0];
      expect(clearOrder).toBeLessThan(deleteOrder);
    });

    it('should return the deleted instanceId as id', async () => {
      // When
      const result = await service.delete(deleteMessageMock);

      // Then
      expect(result).toEqual({ id: instanceId });
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

    it('should not update version publication status if unchanged', async () => {
      // Given
      const instance = Symbol('instance');
      const publicationStatus = Symbol('ExistingPublicationStatus');
      const version = {
        publicationStatus,
      };

      // Use a fresh message object to avoid nested mutation issues
      const sameMessageMock = {
        payload: { publicationStatus },
        meta: {
          instanceId: messageMock.meta.instanceId,
          versionId: messageMock.meta.versionId,
          publicationStatus,
        },
      } as unknown as ConfigMessageDto;

      service['getInstance'] = jest.fn().mockResolvedValueOnce(instance);
      service['getVersion'] = jest.fn().mockResolvedValueOnce(version);

      // When
      await service['save'](sameMessageMock);

      // Then
      expect(versionsMock.updateStatusWithQueryRunner).not.toHaveBeenCalled();
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
