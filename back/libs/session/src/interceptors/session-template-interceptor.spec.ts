import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { SessionTemplateService } from '../services';
import { SessionTemplateInterceptor } from './session-template.interceptor';

jest.mock('../helper', () => ({
  extractSessionFromRequest: jest.fn(),
}));

const loggerServiceMock = {
  setContext: jest.fn(),
  trace: jest.fn(),
};

describe('SessionTemplateInterceptor', () => {
  let interceptor: SessionTemplateInterceptor;

  const resMock = {
    locals: {
      session: {},
    },
  };

  const reqMock = {
    route: {
      path: {},
    },
    sessionId: 'sessionIdValue',
  };

  const httpContextMock = {
    getResponse: jest.fn(),
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  } as CallHandler;

  const sessionTemplateServiceMock = {
    bindSessionToRes: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionTemplateInterceptor,
        LoggerService,
        SessionTemplateService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionTemplateService)
      .useValue(sessionTemplateServiceMock)
      .compile();

    interceptor = module.get<SessionTemplateInterceptor>(
      SessionTemplateInterceptor,
    );

    httpContextMock.getResponse.mockReturnValue(resMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('intercept', () => {
    it('should call next.handle() if no handle session', async () => {
      // Given
      httpContextMock.getRequest.mockReturnValueOnce({
        sessionId: undefined,
      });

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        'SessionTemplateInterceptor',
      );
      expect(sessionTemplateServiceMock.bindSessionToRes).toHaveBeenCalledTimes(
        0,
      );
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });

    it('should call getSessionParts before next.handle()', async () => {
      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        'SessionTemplateInterceptor',
      );
      expect(sessionTemplateServiceMock.bindSessionToRes).toHaveBeenCalledTimes(
        1,
      );
      expect(sessionTemplateServiceMock.bindSessionToRes).toHaveBeenCalledWith(
        reqMock,
        resMock,
      );
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });
  });
});
