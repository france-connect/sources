import { cloneDeep } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import { getAsyncLocalStorageMock } from '@mocks/async-local-storage';

import { SessionStoreContentInterface } from '../interfaces';
import { SESSION_STORE_KEY } from '../tokens';
import { SessionLocalStorageService } from './session-local-storage.service';

jest.mock('lodash');

describe('SessionLocalStorageService', () => {
  let service: SessionLocalStorageService;

  const asyncLocalStorageMock = getAsyncLocalStorageMock();

  const cloneDeepMock = jest.mocked(cloneDeep);

  const cloneDeepResult = { prop: 'cloneDeepResult' };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionLocalStorageService, AsyncLocalStorageService],
    })
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageMock)

      .compile();

    service = module.get<SessionLocalStorageService>(
      SessionLocalStorageService,
    );

    cloneDeepMock.mockReturnValue(cloneDeepResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSession()', () => {
    it('should call asyncLocalStorageService.get()', () => {
      // When
      service.getStore();

      // Then
      expect(asyncLocalStorageMock.get).toHaveBeenCalledTimes(1);
      expect(asyncLocalStorageMock.get).toHaveBeenCalledWith(SESSION_STORE_KEY);
    });
    it('should return default object if result of call to asyncLocalStorageService.get() is falsy', () => {
      // Given
      asyncLocalStorageMock.get.mockReturnValueOnce(undefined);

      // When
      const result = service.getStore();

      // Then
      expect(result).toEqual({
        data: {},
        id: undefined,
        sync: false,
      });
    });

    it('should return result of call to asyncLocalStorageService.get() otherwise', () => {
      // Given
      const localStorageContent = Symbol('localStorageContent');
      asyncLocalStorageMock.get.mockReturnValueOnce(localStorageContent);

      // When
      const result = service.getStore();

      // Then
      expect(result).toBe(localStorageContent);
    });
  });

  describe('getId()', () => {
    // Given
    const idMock = Symbol('idMockedValue');

    beforeEach(() => {
      service.getStore = jest.fn().mockReturnValueOnce({
        id: idMock,
      });
    });

    it('should call getSession()', () => {
      // When
      service.getId();

      // Then
      expect(service.getStore).toHaveBeenCalledTimes(1);
    });

    it('should return id property from result to call to getSession()', () => {
      // When
      const result = service.getId();

      // Then
      expect(result).toBe(idMock);
    });
  });

  describe('setStore()', () => {
    it('should call asyncLocalStorage.set()', () => {
      // Given
      const payload = Symbol(
        'payload mock',
      ) as unknown as SessionStoreContentInterface;

      // When
      service.setStore(payload);

      // Then
      expect(asyncLocalStorageMock.set).toHaveBeenCalledTimes(1);
      expect(asyncLocalStorageMock.set).toHaveBeenCalledWith(
        SESSION_STORE_KEY,
        payload,
      );
    });
  });

  describe('get', () => {
    // Given
    const moduleName = 'moduleName';
    const key = 'key';

    const sessionMock = {
      data: {
        [moduleName]: {
          [key]: Symbol('valueMock'),
        },
      },
      id: 'sessionId',
      sync: true,
    };

    beforeEach(() => {
      service.getStore = jest.fn().mockReturnValueOnce(sessionMock);
    });

    it('should call getSession()', () => {
      // When
      service.get(moduleName, key);

      // Then
      expect(service.getStore).toHaveBeenCalledTimes(1);
    });

    it('should return value corresponding to the moduleName.key if there is a key argument', () => {
      // When
      const result = service.get(moduleName, key);

      // Then
      expect(result).toBe(sessionMock.data[moduleName][key]);
    });

    it('should return value corresponding to the moduleName if there is NO key argument', () => {
      // When
      const result = service.get(moduleName);

      // Then
      expect(result).toBe(sessionMock.data[moduleName]);
    });
  });

  describe('set()', () => {
    // Given
    const moduleName = 'moduleName';
    const key = 'key';
    const data = Symbol('data mock');
    const storeMock = {
      data,
      id: 'sessionId',
      sync: true,
    };
    const setByKeyResult = Symbol('setByKey Result');
    const setModuleResult = Symbol('setModule Result');

    beforeEach(() => {
      service.getStore = jest.fn().mockReturnValueOnce(storeMock);
      service['setByKey'] = jest.fn().mockReturnValueOnce(setByKeyResult);
      service['setModule'] = jest.fn().mockReturnValueOnce(setModuleResult);

      storeMock.sync = true;
    });

    it('should call getSession()', () => {
      // When
      service.set(moduleName, key);

      // Then
      expect(service.getStore).toHaveBeenCalledTimes(1);
    });

    it('should set getSession()', () => {
      // When
      service.set(moduleName, key);

      // Then
      expect(service.getStore).toHaveBeenCalledTimes(1);
    });

    it('should set store.sync property to false', () => {
      // When
      service.set(moduleName, key);

      // Then
      expect(storeMock.sync).toBe(false);
    });

    it('should call setByKey() if there is a key', () => {
      // Given
      const inputData = Symbol('Input Data');
      // When
      service.set(moduleName, key, inputData);

      // Then
      expect(service['setByKey']).toHaveBeenCalledTimes(1);
      expect(service['setByKey']).toHaveBeenCalledWith(
        moduleName,
        data,
        key,
        inputData,
      );
    });

    it('should call setModule() if there is NO key', () => {
      // Given
      const inputData = { prop: Symbol('Input Data') };
      // When
      service.set(moduleName, inputData);

      // Then
      expect(service['setModule']).toHaveBeenCalledTimes(1);
      expect(service['setModule']).toHaveBeenCalledWith(
        moduleName,
        data,
        inputData,
      );
    });
  });

  describe('setByKey', () => {
    // Given
    const moduleName = 'moduleName';
    const key = 'key';
    const data = Symbol('dataMock');

    it('should set a key with cloned given data in existing object', () => {
      // Given
      const session = {
        otherModule: {
          someKey: 'someValue',
        },
        [moduleName]: {
          foo: 'bar',
        },
      };

      // When
      service['setByKey'](moduleName, session, key, data);

      // Then
      expect(session).toEqual({
        otherModule: {
          someKey: 'someValue',
        },
        [moduleName]: {
          foo: 'bar',
          [key]: cloneDeepResult,
        },
      });
    });

    it('should create an object with given key and cloned data', () => {
      // Given
      const session = {
        otherModule: {
          someKey: 'someValue',
        },
      };

      // When
      service['setByKey'](moduleName, session, key, data);

      // Then
      expect(session).toEqual({
        otherModule: {
          someKey: 'someValue',
        },
        [moduleName]: {
          [key]: cloneDeepResult,
        },
      });
    });
  });

  describe('setModule', () => {
    // Given
    const moduleName = 'moduleName';
    const data = { key: Symbol('dataMock') };

    it('should set a module with cloned given data in existing object', () => {
      // Given
      const session = {
        otherModule: {
          someKey: 'someValue',
        },
        [moduleName]: {
          preservedProperty: 'preserved value',
        },
      };

      // When
      service['setModule'](moduleName, session, data);

      // Then
      expect(session).toEqual({
        otherModule: {
          someKey: 'someValue',
        },
        [moduleName]: {
          preservedProperty: 'preserved value',
          ...cloneDeepResult,
        },
      });
    });

    it('should create an object with given key and cloned data', () => {
      // Given
      const session = {
        otherModule: {
          someKey: 'someValue',
        },
      };

      // When
      service['setModule'](moduleName, session, data);

      // Then
      expect(session).toEqual({
        otherModule: {
          someKey: 'someValue',
        },
        [moduleName]: cloneDeepResult,
      });
    });
  });
});
