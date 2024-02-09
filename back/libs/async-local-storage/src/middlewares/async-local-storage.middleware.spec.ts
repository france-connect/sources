import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '../async-local-storage.service';
import { AsyncLocalStorageMiddleware } from './async-local-storage.middleware';

describe('AsyncLocalStorageMiddleware', () => {
  let middleware: AsyncLocalStorageMiddleware;

  const asyncLocalStorageMock = {
    run: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AsyncLocalStorageMiddleware, AsyncLocalStorageService],
    })
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageMock)
      .compile();

    middleware = module.get<AsyncLocalStorageMiddleware>(
      AsyncLocalStorageMiddleware,
    );
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use', () => {
    const reqMock = {
      test: 'test',
    } as unknown as Request;
    const nextMock = jest.fn();

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it('should call asyncLocalStorage.run', () => {
      // When
      middleware.use(reqMock as any, null, nextMock);

      // Then
      expect(asyncLocalStorageMock.run).toHaveBeenCalledTimes(1);
      expect(asyncLocalStorageMock.run).toHaveBeenCalledWith(
        expect.any(Function),
      );
    });

    it('should call next', () => {
      // Given
      middleware.use(reqMock, null, nextMock);
      const runCallback = asyncLocalStorageMock.run.mock.calls[0][0];

      // When
      runCallback();

      // Then
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith();
    });
  });
});
