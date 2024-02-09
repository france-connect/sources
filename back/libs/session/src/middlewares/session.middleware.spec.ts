import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';

import { getAsyncLocalStorageMock } from '@mocks/async-local-storage';
import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { SessionConfig } from '../dto';
import { ISessionRequest } from '../interfaces';
import { SessionService } from '../services';
import { SESSION_STORE_KEY } from '../tokens';
import { SessionMiddleware } from './session.middleware';

describe('session.middleware', () => {
  let middleware: SessionMiddleware;

  const configServiceMock = getConfigMock();
  const sessionServiceMock = getSessionServiceMock();
  const asyncLocalStorageServiceMock = getAsyncLocalStorageMock();

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
    slidingExpiration: true,
  };

  const reqMock = {
    signedCookies: {
      [configMock.sessionCookieName]: 'sessionIdValue',
    },
    sessionId: 'sessionId',
    sessionService: sessionServiceMock,
  } as unknown as ISessionRequest;

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
        ConfigService,
        AsyncLocalStorageService,
        SessionService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageServiceMock)
      .compile();

    middleware = module.get<SessionMiddleware>(SessionMiddleware);

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use()', () => {
    it('should initialize asyncLocalStorage', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(asyncLocalStorageServiceMock.set).toHaveBeenCalledTimes(1);
      expect(asyncLocalStorageServiceMock.set).toHaveBeenCalledWith(
        SESSION_STORE_KEY,
        {
          data: null,
          sync: false,
          id: null,
        },
      );
    });

    it('should call handleSession', async () => {
      // Given
      middleware['handleSession'] = jest.fn();

      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(middleware['handleSession']).toHaveBeenCalledTimes(1);
    });

    it('should call next', async () => {
      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSession()', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce(configMock);
    });

    it('should call `sessionService.init()` if slidingExpiration is true and no session cookie has been found in request signed cookies', async () => {
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

    it('should call `sessionService.refresh()` if slidingExpiration is true and a session cookie has been found in request signed cookies', async () => {
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

    it('should call bindToRequest if slidingExpiration is false and a session cookie has been found in request signed cookies', async () => {
      // Given
      const cookieSessionIdMock = 'cookieSession';
      const noSlidingExpiration = {
        slidingExpiration: false,
      };
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(
        cookieSessionIdMock,
      );
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce(noSlidingExpiration);
      // When
      await middleware['handleSession'](reqMock, resMock);
      // Then
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.bindToRequest).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.bindToRequest).toHaveBeenCalledWith(
        reqMock,
        cookieSessionIdMock,
      );
    });
  });
});
