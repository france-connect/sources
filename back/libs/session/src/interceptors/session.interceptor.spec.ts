import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';

import { SessionConfig } from '../dto';
import { ISessionRequest } from '../interfaces';
import { SessionService } from '../services';
import { SessionInterceptor } from './session.interceptor';

describe('SessionInterceptor', () => {
  let interceptor: SessionInterceptor;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
    excludedRoutes: ['/route/66', /excluded\/.*/],
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    init: jest.fn(),
    refresh: jest.fn(),
    getSessionIdFromCookie: jest.fn(),
    shouldHandleSession: jest.fn(),
  };

  const cryptographyServiceMock = {
    genRandomString: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionInterceptor,
        LoggerService,
        ConfigService,
        CryptographyService,
        SessionService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .compile();

    interceptor = module.get<SessionInterceptor>(SessionInterceptor);

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('onModuleInit()', () => {
    it('should retrieves the configuration', () => {
      // action
      interceptor.onModuleInit();

      // expect
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Session');
    });

    it('should set the "excludedRoutes" attribute retrieved from the config', () => {
      // action
      interceptor.onModuleInit();

      // expect
      expect(interceptor['excludedRoutes']).toStrictEqual(
        configMock.excludedRoutes,
      );
    });
  });

  describe('intercept()', () => {
    const executionContextMock = {
      switchToHttp: jest.fn(),
      getRequest: jest.fn(),
      getResponse: jest.fn(),
    };
    const reqMock = {
      route: {
        path: '/this-is-my-path/my-path-is-amazing',
      },
    };
    const nextMock = {
      handle: jest.fn(),
    };
    const handleSessionMock = jest.fn();

    beforeEach(() => {
      executionContextMock.switchToHttp.mockReturnValue(executionContextMock);
      executionContextMock.getRequest.mockReturnValueOnce(reqMock);
      interceptor['handleSession'] = handleSessionMock;
    });

    it('should retieve the request from the execution context', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(executionContextMock.switchToHttp).toHaveBeenCalledWith();
      expect(executionContextMock.getRequest).toHaveBeenCalledTimes(1);
      expect(executionContextMock.getRequest).toHaveBeenCalledWith();
    });

    it('should check if it should handle the session for this route', async () => {
      // setup
      interceptor.onModuleInit();
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      expect(sessionServiceMock.shouldHandleSession).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.shouldHandleSession).toHaveBeenCalledWith(
        reqMock.route.path,
        configMock.excludedRoutes,
      );
    });

    it('should not get the response from the execution context if it should not handle the session', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      // Only once for the request object !
      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(executionContextMock.switchToHttp).toHaveBeenCalledWith();
      expect(executionContextMock.getResponse).toHaveBeenCalledTimes(0);
    });

    it('should get the response from the execution context if it should handle the session', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(true);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      // Only once for the request object !
      expect(executionContextMock.switchToHttp).toHaveBeenCalledTimes(2);
      expect(executionContextMock.switchToHttp).toHaveBeenCalledWith();
      expect(executionContextMock.getResponse).toHaveBeenCalledTimes(1);
    });

    it('should not call handleSession if it should not handle the session', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      expect(handleSessionMock).toHaveBeenCalledTimes(0);
    });

    it('should call handleSession with req and res if it should handle the session', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(true);
      const resMock = {
        send: jest.fn(),
      };
      executionContextMock.getResponse.mockReturnValueOnce(resMock);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      expect(handleSessionMock).toHaveBeenCalledTimes(1);
      expect(handleSessionMock).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should call the next handler if it should the handle session', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(true);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
      expect(nextMock.handle).toHaveBeenCalledWith();
    });

    it('should call the next handler if it should not handle the session', async () => {
      // setup
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);

      // action
      await interceptor.intercept(
        executionContextMock as unknown as ExecutionContext,
        nextMock,
      );

      // expect
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
      expect(nextMock.handle).toHaveBeenCalledWith();
    });
  });

  describe('handleSession()', () => {
    const resMock = {
      send: jest.fn(),
    };

    const setCookieMock = jest.fn();

    beforeEach(() => {
      interceptor.onModuleInit();
      interceptor['setCookie'] = setCookieMock;
    });

    it('should call `sessionService.init()` if no session cookie found in request signed cookies', async () => {
      // Given
      const reqMock: ISessionRequest = {
        signedCookies: {},
      } as unknown as ISessionRequest;

      const cookieSessionIdMock = undefined;
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(
        cookieSessionIdMock,
      );
      // When
      await interceptor['handleSession'](reqMock, resMock);
      // Then
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.init).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should call `sessionService.refresh()` if cookie found in request signed cookies', async () => {
      // Given
      const reqCookieMock: ISessionRequest = {
        signedCookies: {
          [configMock.sessionCookieName]: 'sessionIdValue',
        },
      } as unknown as ISessionRequest;

      const cookieSessionIdMock = 'cookieSessionIdValue';
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(
        cookieSessionIdMock,
      );
      // When
      await interceptor['handleSession'](reqCookieMock, resMock);
      // Then
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.refresh).toHaveBeenCalledWith(
        reqCookieMock,
        resMock,
      );
    });
  });
});
