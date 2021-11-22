import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { AppInterceptor } from './app.interceptor';

describe('AppInterceptor', () => {
  let interceptor: AppInterceptor;

  const loggerMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
  };

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const reqMock = {
    fc: { interactionId: '42' },
    ip: '123.123.123.123',
  };

  const nextMock = {
    handle: jest.fn(),
    pipe: jest.fn(),
  };

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
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should not call log until next', async () => {
      // Given
      interceptor['log'] = jest.fn();
      // When
      await interceptor.intercept(contextMock, nextMock);
    });
  });
});
