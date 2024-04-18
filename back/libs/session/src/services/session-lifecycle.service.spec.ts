import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { getConfigMock } from '@mocks/config';

import { SessionCannotCommitUndefinedSession } from '../exceptions';
import { SessionBackendStorageService } from './session-backend-storage.service';
import { SessionCookiesService } from './session-cookies.service';
import {
  DUPLICATE_OPTIONS,
  SessionLifecycleService,
} from './session-lifecycle.service';
import { SessionLocalStorageService } from './session-local-storage.service';

jest.mock('@fc/common');

describe('SessionLifecycleService', () => {
  let service: SessionLifecycleService;

  const getTransformedMock = jest.mocked(getTransformed);
  const getTransformedResult = Symbol('getTransformedResult');

  const configMock = getConfigMock();
  const sessionIdLength = Symbol('sessionIdLength');
  const defaultData = Symbol('defaultData');

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const randomStringValue = Symbol('randomStringValue');

  const res = {
    cookie: jest.fn(),
  } as unknown as Response;

  const req = {} as Request;

  const localStorageMock = {
    get: jest.fn(),
    setStore: jest.fn(),
    getId: jest.fn(),
    getStore: jest.fn(),
  };

  const backendStorageMock = {
    get: jest.fn(),
    expire: jest.fn(),
    setAlias: jest.fn(),
    getAlias: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  const cookiesMock = {
    set: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionLifecycleService,
        ConfigService,
        CryptographyService,
        SessionLocalStorageService,
        SessionBackendStorageService,
        SessionLifecycleService,
        SessionCookiesService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(SessionLocalStorageService)
      .useValue(localStorageMock)
      .overrideProvider(SessionBackendStorageService)
      .useValue(backendStorageMock)
      .overrideProvider(SessionCookiesService)
      .useValue(cookiesMock)
      .compile();

    service = module.get<SessionLifecycleService>(SessionLifecycleService);

    cryptographyMock.genRandomString.mockReturnValue(randomStringValue);
    configMock.get.mockReturnValue({ defaultData, sessionIdLength });

    getTransformedMock.mockReturnValue(getTransformedResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init()', () => {
    it('should call localStorage.setStore()', () => {
      // When
      service.init(res);

      // Then
      expect(localStorageMock.setStore).toHaveBeenCalledWith({
        data: defaultData,
        id: randomStringValue,
        sync: false,
      });
    });

    it('should call cookies.set()', () => {
      // When
      service.init(res);

      // Then
      expect(cookiesMock.set).toHaveBeenCalledWith(res, randomStringValue);
    });

    it('should return sessionId', () => {
      // When
      const result = service.init(res);

      // Then
      expect(result).toBe(randomStringValue);
    });
  });

  describe('initCache()', () => {
    // Given
    const sessionId = 'sessionId';
    const store = {
      id: sessionId,
      sync: false,
    };

    beforeEach(() => {
      localStorageMock.getStore.mockReturnValue(store);
    });
    it('should retrieve data from backendStorage.get() with sessionId', async () => {
      // Given
      backendStorageMock.get.mockResolvedValue(null);

      // When
      await service.initCache(sessionId);

      // Then
      expect(backendStorageMock.get).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.get).toHaveBeenCalledWith(sessionId);
    });

    it('should NOT call backendStorage.get() if store.id === sessionId and store.sync is true', async () => {
      // Given
      localStorageMock.getStore.mockReturnValueOnce({
        id: sessionId,
        sync: true,
      });

      // When
      await service.initCache(sessionId);

      // Then
      expect(backendStorageMock.get).not.toHaveBeenCalled();
    });

    it('should call localStorage.setStore() with data from backendStorage.get()', async () => {
      // Given
      const backendDataMock = {};
      backendStorageMock.get.mockResolvedValue(backendDataMock);

      // When
      await service.initCache(sessionId);

      // Then
      expect(localStorageMock.setStore).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setStore).toHaveBeenCalledWith({
        data: backendDataMock,
        id: sessionId,
        sync: true,
      });
    });
  });

  describe('reset()', () => {
    // Given
    const sessionId = 'sessionId';

    beforeEach(() => {
      localStorageMock.getStore.mockReturnValue({ id: sessionId });
      service['init'] = jest.fn().mockReturnValue(sessionId);
    });

    it('should call localStorage.getStore()', async () => {
      // When
      await service.reset(res);

      // Then
      expect(localStorageMock.getStore).toHaveBeenCalledTimes(1);
    });

    it('should call backendStorage.remove() with sessionId', async () => {
      // When
      await service.reset(res);

      // Then
      expect(backendStorageMock.remove).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.remove).toHaveBeenCalledWith(sessionId);
    });

    it('should call init()', async () => {
      // When
      await service.reset(res);

      // Then
      expect(service['init']).toHaveBeenCalledTimes(1);
      expect(service['init']).toHaveBeenCalledWith(res);
    });

    it('should return sessionId', async () => {
      // When
      const result = await service.reset(res);

      // Then
      expect(result).toBe(sessionId);
    });
  });

  describe('duplicate()', () => {
    // Given
    class SchemaMock {}

    const storeMock = {
      data: {},
    };

    const initResult = Symbol('initResult');

    beforeEach(() => {
      service.commit = jest.fn();
      service.init = jest.fn().mockReturnValue(initResult);

      localStorageMock.getStore.mockReturnValue(storeMock);
    });

    it('should call commit()', async () => {
      // When
      await service.duplicate(res, SchemaMock);

      // Then
      expect(service.commit).toHaveBeenCalledTimes(1);
    });

    it('should call localStorage.getStore()', async () => {
      // When
      await service.duplicate(res, SchemaMock);

      // Then
      expect(localStorageMock.getStore).toHaveBeenCalledTimes(1);
    });

    it('should call getTransformed()', async () => {
      // When
      await service.duplicate(res, SchemaMock);

      // Then
      expect(getTransformedMock).toHaveBeenCalledTimes(1);
      expect(getTransformedMock).toHaveBeenCalledWith(
        storeMock.data,
        SchemaMock,
        DUPLICATE_OPTIONS,
      );
    });

    it('should call session.ini()', async () => {
      // When
      await service.duplicate(res, SchemaMock);

      // Then
      expect(service.init).toHaveBeenCalledTimes(1);
      expect(service.init).toHaveBeenCalledWith(res);
    });

    it('should call localStorage.set()', async () => {
      // When
      await service.duplicate(res, SchemaMock);

      // Then
      expect(localStorageMock.setStore).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setStore).toHaveBeenCalledWith({
        data: getTransformedResult,
        id: initResult,
        sync: false,
      });
    });

    it('should return result from getTransformed', async () => {
      // When
      const result = await service.duplicate(res, SchemaMock);

      // Then
      expect(result).toBe(getTransformedResult);
    });
  });

  describe('refresh()', () => {
    // Given
    const getResult = Symbol('getResult');
    const configDataMock = { lifetime: Symbol('lifetime') };

    beforeEach(() => {
      cookiesMock.get.mockReturnValue(getResult);
      configMock.get.mockReturnValue(configDataMock);
    });

    it('should call config.get()', async () => {
      // When
      await service.refresh(req, res);

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call cookies.get()', async () => {
      // When
      await service.refresh(req, res);

      // Then
      expect(cookiesMock.get).toHaveBeenCalledTimes(1);
      expect(cookiesMock.get).toHaveBeenCalledWith(req);
    });

    it('should call backendStorage.expire()', async () => {
      // When
      await service.refresh(req, res);

      // Then
      expect(backendStorageMock.expire).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.expire).toHaveBeenCalledWith(
        getResult,
        configDataMock.lifetime,
      );
    });

    it('should call cookies.set()', async () => {
      // When
      await service.refresh(req, res);

      // Then
      expect(cookiesMock.set).toHaveBeenCalledTimes(1);
      expect(cookiesMock.set).toHaveBeenCalledWith(res, getResult);
    });

    it('should return sessionId', async () => {
      // When
      const result = await service.refresh(req, res);

      // Then
      expect(result).toBe(getResult);
    });
  });

  describe('destroy()', () => {
    // Given
    const storeMock = {
      id: Symbol('idMock'),
    };

    const removeResult = Symbol('removeResult');

    beforeEach(() => {
      localStorageMock.getStore.mockReturnValue(storeMock);
      backendStorageMock.remove.mockReturnValue(removeResult);
    });

    it('should call localStorage.getStore()', async () => {
      // When
      await service.destroy(res);
      // Then
      expect(localStorageMock.getStore).toHaveBeenCalledTimes(1);
    });

    it('should call cookies.remove()', async () => {
      // When
      await service.destroy(res);

      // Then
      expect(cookiesMock.remove).toHaveBeenCalledTimes(1);
      expect(cookiesMock.remove).toHaveBeenCalledWith(res);
    });

    it('should call backendStorage.remove()', async () => {
      // When
      await service.destroy(res);

      // Then
      expect(backendStorageMock.remove).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.remove).toHaveBeenCalledWith(storeMock.id);
    });

    it('should return result of call to backendStorage.remove()', async () => {
      // When
      const result = await service.destroy(res);

      // Then
      expect(result).toBe(removeResult);
    });
  });

  describe('detach()', () => {
    // Given
    const storeMock = {
      id: Symbol('idMock'),
    };

    beforeEach(() => {
      localStorageMock.getStore.mockReturnValue(storeMock);
    });

    it('should call localStorage.getStore()', async () => {
      // When
      await service.detach(res);

      // Then
      expect(localStorageMock.getStore).toHaveBeenCalledTimes(1);
    });

    it('should call localStorage.setStore()', async () => {
      // When
      await service.detach(res);

      // Then
      expect(localStorageMock.setStore).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setStore).toHaveBeenCalledWith({
        data: defaultData,
        id: undefined,
        sync: false,
      });
    });

    it('should call cookies.remove()', async () => {
      // When
      await service.detach(res);

      // Then
      expect(cookiesMock.remove).toHaveBeenCalledTimes(1);
      expect(cookiesMock.remove).toHaveBeenCalledWith(res);
    });

    it('should call backendStorage.expire()', async () => {
      // When
      await service.detach(res, 123);

      // Then
      expect(backendStorageMock.expire).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.expire).toHaveBeenCalledWith(storeMock.id, 123);
    });
  });

  describe('commit()', () => {
    // Given
    const storeMock = {
      id: Symbol('idMock'),
      data: Symbol('dataMock'),
      sync: false,
    };

    const saveResult = Symbol('saveResult');

    beforeEach(() => {
      localStorageMock.getStore.mockReturnValue(storeMock);
      backendStorageMock.save.mockReturnValue(saveResult);
    });

    it('should call localStorage.getStore()', async () => {
      // When
      await service.commit();

      // Then
      expect(localStorageMock.getStore).toHaveBeenCalledTimes(1);
    });

    it('should throw if session id is falsy', async () => {
      // Given
      localStorageMock.getStore.mockReturnValueOnce({ id: undefined });

      // When  / Then
      await expect(service.commit()).rejects.toThrow(
        SessionCannotCommitUndefinedSession,
      );
    });

    it('should call backendStorage.save()', async () => {
      // When
      await service.commit();

      // Then
      expect(backendStorageMock.save).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.save).toHaveBeenCalledWith(
        storeMock.id,
        storeMock.data,
      );
    });

    it('should call localStorage.setStore()', async () => {
      // When
      await service.commit();

      // Then
      expect(localStorageMock.setStore).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setStore).toHaveBeenCalledWith({
        data: storeMock.data,
        id: storeMock.id,
        sync: saveResult,
      });
    });

    it('should return result of call to backendStorage.save()', async () => {
      // When
      const result = await service.commit();

      // Then
      expect(result).toBe(saveResult);
    });

    it('should NOT call backendStorage.save() if sync is true', async () => {
      // Given
      const syncedStoreMock = {
        id: storeMock.id,
        sync: true,
      };
      localStorageMock.getStore
        .mockReset()
        .mockReturnValueOnce(syncedStoreMock);

      // When
      await service.commit();

      // Then
      expect(localStorageMock.setStore).not.toHaveBeenCalled();
      expect(backendStorageMock.save).not.toHaveBeenCalled();
    });

    it('should return true if sync is true', async () => {
      // Given
      const syncedStoreMock = {
        id: storeMock.id,
        sync: true,
      };
      localStorageMock.getStore
        .mockReset()
        .mockReturnValueOnce(syncedStoreMock);

      // When
      const result = await service.commit();

      // Then
      expect(result).toBe(true);
    });
  });
});
