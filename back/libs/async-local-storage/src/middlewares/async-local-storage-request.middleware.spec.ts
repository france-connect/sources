import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '../async-local-storage.service';
import { AsyncLocalStorageRequestMiddleware } from './async-local-storage-request.middleware';

describe('AsyncLocalStorageRequestMiddleware', () => {
  let middleware: AsyncLocalStorageRequestMiddleware;

  const asyncLocalStorageMock = {
    run: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AsyncLocalStorageRequestMiddleware, AsyncLocalStorageService],
    })
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageMock)
      .compile();

    middleware = module.get<AsyncLocalStorageRequestMiddleware>(
      AsyncLocalStorageRequestMiddleware,
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

    it('should set the request in asyncLocalStorage', () => {
      // When
      middleware.use(reqMock, null, nextMock);

      // Then
      expect(asyncLocalStorageMock.set).toHaveBeenCalledTimes(1);
      expect(asyncLocalStorageMock.set).toHaveBeenCalledWith(
        'request',
        reqMock,
      );
    });

    it('should call next', () => {
      // When
      middleware.use(reqMock, null, nextMock);

      // Then
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveBeenCalledWith();
    });
  });
});
