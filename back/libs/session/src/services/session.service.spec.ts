import { Request, Response } from 'express';

import { Type } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from './session.service';
import { SessionBackendStorageService } from './session-backend-storage.service';
import { SessionCookiesService } from './session-cookies.service';
import { SessionLifecycleService } from './session-lifecycle.service';
import { SessionLocalStorageService } from './session-local-storage.service';

describe('SessionService', () => {
  let service: SessionService;

  const localStorageMock = {
    get: jest.fn(),
    set: jest.fn(),
    getId: jest.fn(),
  };

  const backendStorageMock = {
    get: jest.fn(),
    expire: jest.fn(),
    setAlias: jest.fn(),
    getAlias: jest.fn(),
  };

  const lifecycleMock = {
    reset: jest.fn(),
    initCache: jest.fn(),
    init: jest.fn(),
    destroy: jest.fn(),
    commit: jest.fn(),
    duplicate: jest.fn(),
    refresh: jest.fn(),
    detach: jest.fn(),
  };

  const cookiesMock = {
    get: jest.fn(),
  };

  const mocks = [
    localStorageMock,
    backendStorageMock,
    lifecycleMock,
    cookiesMock,
  ];

  const req = {} as Request;
  const res = {} as Response;
  const sessionId = 'sessionId';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        SessionLocalStorageService,
        SessionBackendStorageService,
        SessionLifecycleService,
        SessionCookiesService,
      ],
    })
      .overrideProvider(SessionLocalStorageService)
      .useValue(localStorageMock)
      .overrideProvider(SessionBackendStorageService)
      .useValue(backendStorageMock)
      .overrideProvider(SessionLifecycleService)
      .useValue(lifecycleMock)
      .overrideProvider(SessionCookiesService)
      .useValue(cookiesMock)
      .compile();

    service = module.get<SessionService>(SessionService);

    mocks.forEach((mockService) => {
      Object.entries(mockService).forEach(([methodName, methodMock]) => {
        methodMock.mockReturnValueOnce(`mockedReturnValue::${methodName}`);
      });
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get()', () => {
    // Given
    const moduleName = 'moduleName';
    const key = 'key';

    it('should forward call to localStorage.get()', () => {
      // When
      service.get(moduleName, key);

      // Then
      expect(localStorageMock.get).toHaveBeenCalledTimes(1);
      expect(localStorageMock.get).toHaveBeenCalledWith(moduleName, key);
    });

    it('should return result of call to localStorage.get()', () => {
      // When
      const result = service.get(moduleName, key);

      // Then
      expect(result).toBe('mockedReturnValue::get');
    });
  });

  describe('set()', () => {
    // Given
    const moduleName = 'moduleName';
    const key = 'key';
    const data = 'data';

    it('should forward call to localStorage.set()', () => {
      // When
      service.set(moduleName, key, data);

      // Then
      expect(localStorageMock.set).toHaveBeenCalledTimes(1);
      expect(localStorageMock.set).toHaveBeenCalledWith(moduleName, key, data);
    });

    it('should return result of call to localStorage.set()', () => {
      // When
      const result = service.set(moduleName, key, data);

      // Then
      expect(result).toBe('mockedReturnValue::set');
    });
  });

  describe('getId()', () => {
    it('should forward call to localStorage.getId()', () => {
      // When
      service.getId();

      // Then
      expect(localStorageMock.getId).toHaveBeenCalledTimes(1);
    });

    it('should return result of call to localStorage.getId()', () => {
      // When
      const result = service.getId();

      // Then
      expect(result).toBe('mockedReturnValue::getId');
    });
  });

  describe('reset()', () => {
    it('should call lifecycle.reset()', async () => {
      // When
      await service.reset(res);

      // Then
      expect(lifecycleMock.reset).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.reset).toHaveBeenCalledWith(res);
    });

    it('should return result of lifecycle.reset()', async () => {
      // When
      const result = await service.reset(res);

      // Then
      expect(result).toBe('mockedReturnValue::reset');
    });
  });

  describe('initCache()', () => {
    it('should call lifecycle.initCache()', async () => {
      // When
      await service.initCache(sessionId);

      // Then
      expect(lifecycleMock.initCache).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.initCache).toHaveBeenCalledWith(sessionId);
    });

    it('should return result of lifecycle.initCache()', async () => {
      // When
      const result = await service.initCache(sessionId);

      // Then
      expect(result).toBe('mockedReturnValue::initCache');
    });
  });

  describe('init()', () => {
    it('should call lifecycle.init()', () => {
      // When
      service.init(res);

      // Then
      expect(lifecycleMock.init).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.init).toHaveBeenCalledWith(res);
    });

    it('should return result of lifecycle.init()', () => {
      // When
      const result = service.init(res);

      // Then
      expect(result).toBe('mockedReturnValue::init');
    });
  });

  describe('destroy()', () => {
    it('should call lifecycle.destroy()', async () => {
      // When
      await service.destroy(res);

      // Then
      expect(lifecycleMock.destroy).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.destroy).toHaveBeenCalledWith(res);
    });
  });

  describe('commit()', () => {
    it('should call lifecycle.commit()', async () => {
      // When
      await service.commit();

      // Then
      expect(lifecycleMock.commit).toHaveBeenCalledTimes(1);
    });

    it('should return result of lifecycle.commit()', async () => {
      // When
      const result = await service.commit();

      // Then
      expect(result).toBe('mockedReturnValue::commit');
    });
  });

  describe('duplicate()', () => {
    it('should call lifecycle.duplicate()', async () => {
      // Given
      const schema = {} as Type<unknown>;

      // When
      await service.duplicate(res, schema);

      // Then
      expect(lifecycleMock.duplicate).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.duplicate).toHaveBeenCalledWith(res, schema);
    });

    it('should return result of lifecycle.duplicate()', async () => {
      // Given
      const schema = {} as Type<unknown>;

      // When
      const result = await service.duplicate(res, schema);

      // Then
      expect(result).toBe('mockedReturnValue::duplicate');
    });
  });

  describe('refresh()', () => {
    it('should call lifecycle.refresh()', async () => {
      // When
      await service.refresh(req, res);

      // Then
      expect(lifecycleMock.refresh).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.refresh).toHaveBeenCalledWith(req, res);
    });

    it('should return result of lifecycle.refresh()', async () => {
      // When
      const result = await service.refresh(req, res);

      // Then
      expect(result).toBe('mockedReturnValue::refresh');
    });
  });

  describe('detach()', () => {
    it('should call lifecycle.detach()', async () => {
      // When
      await service.detach(res);

      // Then
      expect(lifecycleMock.detach).toHaveBeenCalledTimes(1);
      expect(lifecycleMock.detach).toHaveBeenCalledWith(res);
    });

    it('should return result of lifecycle.detach()', async () => {
      // When
      const result = await service.detach(res);

      // Then
      expect(result).toBe('mockedReturnValue::detach');
    });
  });

  describe('getSessionIdFromCookie()', () => {
    it('should call cookies.getSessionId()', () => {
      // When
      service.getSessionIdFromCookie(req);

      // Then
      expect(cookiesMock.get).toHaveBeenCalledTimes(1);
      expect(cookiesMock.get).toHaveBeenCalledWith(req);
    });

    it('should return result of cookies.get()', () => {
      // When
      const result = service.getSessionIdFromCookie(req);

      // Then
      expect(result).toBe('mockedReturnValue::get');
    });
  });

  describe('getDataFromBackend()', () => {
    it('should call backendStorage.get()', async () => {
      // When
      await service.getDataFromBackend(sessionId);

      // Then
      expect(backendStorageMock.get).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.get).toHaveBeenCalledWith(sessionId);
    });

    it('should return result of backendStorage.get()', async () => {
      // When
      const result = await service.getDataFromBackend(sessionId);

      // Then
      expect(result).toBe('mockedReturnValue::get');
    });
  });

  describe('expire()', () => {
    it('should call backendStorage.expire()', async () => {
      // Given
      const ttl = 123;

      // When
      await service.expire(sessionId, ttl);

      // Then
      expect(backendStorageMock.expire).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.expire).toHaveBeenCalledWith(sessionId, ttl);
    });

    it('should return result of backendStorage.expire()', async () => {
      // Given
      const ttl = 123;

      // When
      const result = await service.expire(sessionId, ttl);

      // Then
      expect(result).toBe('mockedReturnValue::expire');
    });
  });

  describe('setAlias()', () => {
    it('should call backendStorage.setAlias()', async () => {
      // Given
      const alias = 'alias';

      // When
      await service.setAlias(alias, sessionId);

      // Then
      expect(backendStorageMock.setAlias).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.setAlias).toHaveBeenCalledWith(
        alias,
        sessionId,
      );
    });

    it('should return result of backendStorage.setAlias()', async () => {
      // Given
      const alias = 'alias';

      // When
      const result = await service.setAlias(alias, sessionId);

      // Then
      expect(result).toBe('mockedReturnValue::setAlias');
    });
  });

  describe('getAlias()', () => {
    it('should call backendStorage.getAlias()', async () => {
      // Given
      const key = 'key';

      // When
      await service.getAlias(key);

      // Then
      expect(backendStorageMock.getAlias).toHaveBeenCalledTimes(1);
      expect(backendStorageMock.getAlias).toHaveBeenCalledWith(key);
    });

    it('should return result of backendStorage.getAlias()', async () => {
      // Given
      const key = 'key';

      // When
      const result = await service.getAlias(key);

      // Then
      expect(result).toBe('mockedReturnValue::getAlias');
    });
  });
});
