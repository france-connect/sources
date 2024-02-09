import { AsyncLocalStorage } from 'async_hooks';

import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from './async-local-storage.service';
import { AsyncLocalStorageNotFoundException } from './exceptions';

describe('AsyncLocalStorageService', () => {
  let service: AsyncLocalStorageService<{ key: unknown }>;

  const mapMock = {
    set: jest.fn(),
    get: jest.fn(),
  } as unknown as Map<string, unknown>;

  const asyncLocalStorageMock = {
    run: jest.fn(),
    getStore: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AsyncLocalStorageService],
    }).compile();

    service = module.get<AsyncLocalStorageService<{ key: unknown }>>(
      AsyncLocalStorageService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should instanciate an AsyncLocalStorageService', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service['storage']).toBeInstanceOf(AsyncLocalStorage);
    });
  });

  describe('Mocked Storage', () => {
    beforeEach(() => {
      asyncLocalStorageMock.getStore.mockReturnValue(mapMock);

      service['storage'] =
        asyncLocalStorageMock as unknown as AsyncLocalStorage<
          Map<string, unknown>
        >;
    });

    describe('run', () => {
      it('should call AsyncLocalStorage run method with a map and the given callback', () => {
        // Given
        const callback = () => {};

        // When
        service.run(callback);

        // Then
        expect(asyncLocalStorageMock.run).toHaveBeenCalledTimes(1);
        expect(asyncLocalStorageMock.run).toHaveBeenCalledWith(
          expect.any(Map),
          callback,
        );
      });
    });

    describe('mandatory', () => {
      it('should throw an AsyncLocalStorageNotFoundException if the storage is not found', () => {
        // Given
        service['storage'] = undefined;

        // When / Then
        expect(() => service.mandatory).toThrowError(
          AsyncLocalStorageNotFoundException,
        );
      });

      it('should return the service if the storage is found', () => {
        // When
        const result = service.mandatory;

        // Then
        expect(result).toEqual(service);
      });
    });

    describe('get', () => {
      it('should call AsyncLocalStorage getStore method', () => {
        // When
        service.get('key');

        // Then
        expect(asyncLocalStorageMock.getStore).toHaveBeenCalledTimes(1);
      });

      it('should call Map get method with the given key', () => {
        // Given
        const key = 'key';

        // When
        service.get(key);

        // Then
        expect(mapMock.get).toHaveBeenCalledTimes(1);
        expect(mapMock.get).toHaveBeenCalledWith(key);
      });

      it('should return the value returned by the Map get method', () => {
        // Given
        const value = 'value';
        jest.mocked(mapMock.get).mockReturnValueOnce(value);

        // When
        const result = service.get('key');

        // Then
        expect(result).toEqual(value);
      });

      it('should return undefined if the store is not found', () => {
        // Given
        service['getStore'] = jest.fn().mockReturnValueOnce(undefined);

        // When
        const result = service.get('key');

        // Then
        expect(result).toBeUndefined();
      });

      it('should return undefined if the key is not found', () => {
        // Given
        jest.mocked(mapMock.get).mockReturnValueOnce(undefined);

        // When
        const result = service.get('key');

        // Then
        expect(result).toBeUndefined();
      });
    });

    describe('set', () => {
      it('should call AsyncLocalStorage getStore method', () => {
        // When
        service.set('key', 'value');

        // Then
        expect(asyncLocalStorageMock.getStore).toHaveBeenCalledTimes(1);
      });

      it('should call Map set method with the given key and value', () => {
        // Given
        const key = 'key';
        const value = 'value';

        // When
        service.set(key, value);

        // Then
        expect(mapMock.set).toHaveBeenCalledTimes(1);
        expect(mapMock.set).toHaveBeenCalledWith(key, value);
      });
    });

    describe('getStore', () => {
      it('should call AsyncLocalStorage getStore method', () => {
        // When
        service['getStore']();

        // Then
        expect(asyncLocalStorageMock.getStore).toHaveBeenCalledTimes(1);
      });

      it('should return the value returned by the AsyncLocalStorage getStore method', () => {
        // Given
        const value = mapMock;
        jest.mocked(asyncLocalStorageMock.getStore).mockReturnValueOnce(value);

        // When
        const result = service['getStore']();

        // Then
        expect(result).toEqual(value);
      });

      it('should return undefined if the storage is not found', () => {
        // Given
        service['storage'] = undefined;

        // When
        const result = service['getStore']();

        // Then
        expect(result).toBeUndefined();
      });
    });
  });
});
