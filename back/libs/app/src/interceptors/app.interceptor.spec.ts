import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { AppInterceptor } from './app.interceptor';

describe('AppInterceptor', () => {
  let interceptor: AppInterceptor;

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const rpcContextMock = {
    getData: jest.fn(),
  };

  const contextMock = {
    getType: jest.fn(),
    switchToHttp: () => httpContextMock,
    switchToRpc: () => rpcContextMock,
  };

  const reqMock = {
    fc: { interactionId: '42' },
    ip: '123.123.123.123',
    method: 'GET',
    path: '/some/path',
  };

  const messageMock = {
    type: 'message',
    meta: {},
    payload: {},
  };

  const nextMock = {
    handle: jest.fn(),
    pipe: jest.fn(),
  };

  const loggerMock = getLoggerMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppInterceptor, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    interceptor = module.get<AppInterceptor>(AppInterceptor);

    jest.resetAllMocks();
    nextMock.handle.mockReturnThis();
    httpContextMock.getRequest.mockReturnValue(reqMock);
    rpcContextMock.getData.mockReturnValue(messageMock);
    contextMock.getType.mockReturnValue('http');
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    beforeEach(() => {
      interceptor['interceptHttp'] = jest.fn();
      interceptor['interceptRpc'] = jest.fn();
    });

    it('should call interceptHttp if type is http', () => {
      // When
      interceptor.intercept(
        contextMock as unknown as ExecutionContext,
        nextMock,
      );

      // Then
      expect(interceptor['interceptHttp']).toHaveBeenCalledExactlyOnceWith(
        contextMock,
      );
    });

    it('should call interceptRpc if type is rpc', () => {
      // Given
      contextMock.getType.mockReturnValue('rpc');

      // When
      interceptor.intercept(
        contextMock as unknown as ExecutionContext,
        nextMock,
      );

      // Then
      expect(interceptor['interceptRpc']).toHaveBeenCalledExactlyOnceWith(
        contextMock,
      );
    });

    it('should call next.handle', () => {
      // When
      interceptor.intercept(
        contextMock as unknown as ExecutionContext,
        nextMock,
      );

      // Then
      expect(nextMock.handle).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe('interceptHttp', () => {
    it('should log request', () => {
      // When
      interceptor['interceptHttp'](contextMock as unknown as ExecutionContext);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `${reqMock.method} ${reqMock.path}`,
      );
    });
  });

  describe('interceptRpc', () => {
    it('should log message', () => {
      // When
      interceptor['interceptRpc'](contextMock as unknown as ExecutionContext);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith({
        msg: `Ms:ReceiveMessage:${messageMock.type}`,
        message: messageMock,
      });
    });
  });
});
