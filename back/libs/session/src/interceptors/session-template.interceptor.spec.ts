import { mocked } from 'ts-jest/utils';

import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { extractSessionFromRequest } from '../decorators';
import { SessionConfig } from '../dto';
import { SessionService } from '../services';
import { SessionTemplateInterceptor } from './session-template.interceptor';

jest.mock('../decorators', () => ({
  extractSessionFromRequest: jest.fn(),
}));

const loggerServiceMock = {
  setContext: jest.fn(),
  trace: jest.fn(),
};

const configServiceMock = {
  get: jest.fn(),
};

const sessionServiceMock = {
  get: jest.fn(),
  set: jest.fn(),
  shouldHandleSession: jest.fn(),
};

async function genInterceptor() {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SessionTemplateInterceptor,
      ConfigService,
      LoggerService,
      SessionService,
    ],
  })
    .overrideProvider(ConfigService)
    .useValue(configServiceMock)
    .overrideProvider(LoggerService)
    .useValue(loggerServiceMock)
    .overrideProvider(SessionService)
    .useValue(sessionServiceMock)
    .compile();

  const interceptor = module.get<SessionTemplateInterceptor>(
    SessionTemplateInterceptor,
  );
  return interceptor;
}

describe('SessionTemplateInterceptor', () => {
  let interceptor: SessionTemplateInterceptor;

  const extractSessionFromRequestMock = mocked(extractSessionFromRequest, true);

  const resMock = {
    locals: {
      session: {},
    },
  };

  const reqMock = {
    route: {
      path: {},
    },
  };

  const oidcClientMock = { foo: true, bar: true };

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
    excludedRoutes: ['/route/66', /excluded\/.*/],
    templateExposed: { oidcClient: oidcClientMock },
  };

  const sessionMock = {
    spId: 'mockSpId',
    spName: 'mockSpName',
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

  beforeEach(async () => {
    jest.resetAllMocks();

    configServiceMock.get.mockReturnValue(configMock);
    httpContextMock.getResponse.mockReturnValue(resMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
    sessionServiceMock.get.mockResolvedValue(sessionMock);
    extractSessionFromRequestMock.mockReturnValue(sessionServiceMock);
  });

  it('should be defined', async () => {
    interceptor = await genInterceptor();

    expect(interceptor).toBeDefined();
    expect(configServiceMock.get).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('intercept', () => {
    it('should check if it should handle the session for this route', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);
      interceptor = await genInterceptor();

      // action
      await interceptor.intercept(contextMock, nextMock);

      // expect
      expect(sessionServiceMock.shouldHandleSession).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.shouldHandleSession).toHaveBeenCalledWith(
        reqMock.route.path,
        configMock.excludedRoutes,
      );
    });

    it('should call next.handle() if no handle session', async () => {
      // Given
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);
      interceptor = await genInterceptor();
      interceptor['getSessionParts'] = jest.fn();

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        'SessionTemplateInterceptor',
      );
      expect(interceptor['getSessionParts']).toHaveBeenCalledTimes(0);
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });

    it('should call next.handle() if no config provided', async () => {
      // Given
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(true);
      configServiceMock.get.mockReset().mockReturnValue({});
      interceptor = await genInterceptor();
      interceptor['getSessionParts'] = jest.fn();

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        'SessionTemplateInterceptor',
      );
      expect(interceptor['getSessionParts']).toHaveBeenCalledTimes(0);
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });

    it('should call getSessionParts before next.handle()', async () => {
      // Given
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(true);
      interceptor = await genInterceptor();
      interceptor['getSessionParts'] = jest.fn();

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.trace).toHaveBeenCalledWith(
        'SessionTemplateInterceptor',
      );
      expect(interceptor['getSessionParts']).toHaveBeenCalledTimes(1);
      expect(interceptor['getSessionParts']).toHaveBeenCalledWith(
        { oidcClient: { foo: true, bar: true } },
        contextMock,
      );
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });
  });

  describe('fillObject', () => {
    beforeEach(async () => {
      interceptor = await genInterceptor();
    });

    it('should return partial object', async () => {
      // Given
      const source = {
        bar: 'barValue',
        baz: 'bazValue',
        buzz: 'buzzValue',
        wizz: 'wizzValue',
      };
      const target = { bar: true, wizz: true };

      // When
      const result = interceptor['fillObject'](target, source);
      // Then
      expect(result).toEqual({ bar: 'barValue', wizz: 'wizzValue' });
    });
  });

  describe('getSessionParts()', () => {
    beforeEach(async () => {
      interceptor = await genInterceptor();
    });
    // Given
    const contextMock = {};
    it('should return values from session excluding non listed properties', async () => {
      // Given
      const parts = {
        OidcClient: { spName: true },
      };
      // When
      const result = await interceptor['getSessionParts'](parts, contextMock);
      // Then
      expect(result).toEqual({
        OidcClient: {
          spName: sessionMock.spName,
        },
      });
    });

    it('should return empty object if no session was found', async () => {
      // Given
      const parts = {
        OidcClient: { spName: true },
      };

      sessionServiceMock.get.mockResolvedValue(undefined);
      // When
      const result = await interceptor['getSessionParts'](parts, contextMock);
      // Then
      expect(result).toEqual({});
    });

    it('should return values from session even from multiple session sections', async () => {
      // Given
      const parts = {
        Fizz: { buzz: true },
        Foo: { baz: true },
      };
      sessionServiceMock.get.mockResolvedValue({
        buzz: 'buzzValue',
        wizz: 'wizzValue',
        bar: 'barValue',
        baz: 'bazValue',
      });

      // When
      const result = await interceptor['getSessionParts'](parts, contextMock);
      // Then
      expect(result).toEqual({
        Fizz: {
          buzz: 'buzzValue',
        },
        Foo: {
          baz: 'bazValue',
        },
      });
    });
  });
});
