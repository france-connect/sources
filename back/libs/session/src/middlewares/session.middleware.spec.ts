import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger-legacy';

import { SessionConfig } from '../dto';
import { ISessionRequest } from '../interfaces';
import { SessionService } from '../services';
import { SessionMiddleware } from './session.middleware';

describe('session.middleware', () => {
  let middleware: SessionMiddleware;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
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

  const reqMock = {
    signedCookies: {
      [configMock.sessionCookieName]: 'sessionIdValue',
    },
    sessionId: 'sessionId',
    sessionService: sessionServiceMock,
  } as unknown as ISessionRequest;

  const setCookieMock = jest.fn();

  const resMock = {
    locals: {},
  } as unknown as Response;

  const nextMock = jest.fn();

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionMiddleware,
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

    middleware = module.get<SessionMiddleware>(SessionMiddleware);

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('use()', () => {
    it('should call next', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should call next', async () => {
      // Given
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(false);

      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSession()', () => {
    beforeEach(() => {
      middleware['setCookie'] = setCookieMock;
    });

    it('should call `sessionService.init()` if no session cookie found in request signed cookies', async () => {
      // Given
      const cookieSessionIdMock = undefined;

      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(
        cookieSessionIdMock,
      );
      // When
      await middleware['handleSession'](reqMock, resMock);
      // Then
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.init).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should call `sessionService.refresh()` if cookie found in request signed cookies', async () => {
      // Given
      const cookieSessionIdMock = 'cookieSession';
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(
        cookieSessionIdMock,
      );
      // When
      await middleware['handleSession'](reqMock, resMock);
      // Then
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.refresh).toHaveBeenCalledWith(reqMock, resMock);
    });
  });
});
