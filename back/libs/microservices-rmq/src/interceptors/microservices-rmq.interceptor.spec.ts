import { Observable, Subscriber } from 'rxjs';

import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import { getAsyncLocalStorageMock } from '@mocks/async-local-storage';

import { RMQ_MESSAGE_STORE_KEY } from '../tokens';
import { MicroservicesRmqInterceptor } from './microservices-rmq.interceptor';

describe('microservicesRmqInterceptor', () => {
  let interceptor: MicroservicesRmqInterceptor;

  const rpcContextMock = {
    getData: jest.fn(),
  };

  const contextMock = {
    switchToRpc: () => rpcContextMock,
  };

  const messageMock = {
    type: 'message',
    meta: {},
    payload: {},
  };

  const nextMock = {
    handle: jest.fn(),
    subscribe: jest.fn(),
  };

  const subscriberMock = {
    next: jest.fn(),
    error: jest.fn(),
    complete: jest.fn(),
  } as unknown as Subscriber<unknown>;

  const asyncLocalStorageMock = getAsyncLocalStorageMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MicroservicesRmqInterceptor, AsyncLocalStorageService],
    })
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageMock)
      .compile();

    interceptor = module.get<MicroservicesRmqInterceptor>(
      MicroservicesRmqInterceptor,
    );

    jest.resetAllMocks();
    nextMock.handle.mockReturnThis();
    rpcContextMock.getData.mockReturnValue(messageMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should return an Observable', () => {
      const result = interceptor.intercept(
        contextMock as unknown as ExecutionContext,
        nextMock as CallHandler,
      );

      expect(result).toBeInstanceOf(Observable);
    });
  });

  describe('setContext', () => {
    it('should call asyncLocalStorage.run', () => {
      // When
      interceptor['setContext'](nextMock, messageMock, subscriberMock);

      // Then
      expect(asyncLocalStorageMock.run).toHaveBeenCalledExactlyOnceWith(
        expect.any(Function),
      );
    });
  });

  describe('handle', () => {
    it('should set message to async local storage', () => {
      // When
      interceptor['handle'](nextMock, messageMock, subscriberMock);

      // Then
      expect(asyncLocalStorageMock.set).toHaveBeenCalledExactlyOnceWith(
        RMQ_MESSAGE_STORE_KEY,
        { message: messageMock },
      );
    });

    it('should call next.handle', () => {
      // When
      interceptor['handle'](nextMock, messageMock, subscriberMock);

      // Then
      expect(nextMock.handle).toHaveBeenCalled();
    });
  });
});
