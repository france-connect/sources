import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { SessionConfig } from '../dto';
import { SessionService } from '../services';
import { SessionMiddleware } from './session.middleware';

describe('SessionMiddleware', () => {
  let middleware: SessionMiddleware;

  const configServiceMock = getConfigMock();
  const sessionServiceMock = getSessionServiceMock();

  const configMock: Partial<SessionConfig> = {
    slidingExpiration: true,
  };

  const reqMock = {} as Request;

  const resMock = {} as Response;

  const nextMock = jest.fn();

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionMiddleware, ConfigService, SessionService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    middleware = module.get<SessionMiddleware>(SessionMiddleware);

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('use()', () => {
    it('should call handleSession()', async () => {
      // Given
      middleware['handleSession'] = jest.fn();

      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(middleware['handleSession']).toHaveBeenCalledTimes(1);
      expect(middleware['handleSession']).toHaveBeenCalledWith(
        reqMock,
        resMock,
      );
    });
  });

  describe('handleSession()', () => {
    beforeEach(() => {
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue('sessionId');
    });

    it('should call config.get()', async () => {
      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call session.getSessionIdFromCookie()', async () => {
      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.getSessionIdFromCookie).toHaveBeenCalledTimes(
        1,
      );
      expect(sessionServiceMock.getSessionIdFromCookie).toHaveBeenCalledWith(
        reqMock,
      );
    });

    it('should call session.init() if sessionId from cookie is falsy', async () => {
      // Given
      sessionServiceMock.getSessionIdFromCookie.mockReturnValueOnce(null);

      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.init).toHaveBeenCalledWith(resMock);
    });

    it('should return the result of call to session.init() if sessionId from cookie is falsy', async () => {
      // Given
      const initResult = Symbol('init');
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(null);
      sessionServiceMock.init.mockReturnValue(initResult);

      // When
      const result = await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(result).toEqual(initResult);
    });

    it('should call session.initCache() if sessionId from cookie is truthy', async () => {
      // Given
      const getSessionIdFromCookieResult = Symbol('sessionId');
      sessionServiceMock.getSessionIdFromCookie.mockReturnValue(
        getSessionIdFromCookieResult,
      );

      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.initCache).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.initCache).toHaveBeenCalledWith(
        getSessionIdFromCookieResult,
      );
    });

    it('should call session.init() if initCache fails', async () => {
      // Given
      const errorMock = new Error('initCache error');
      sessionServiceMock.initCache.mockRejectedValue(errorMock);

      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.init).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.init).toHaveBeenCalledWith(resMock);
    });

    it('should return the result of call to session.init() if session is not valid', async () => {
      // Given
      const errorMock = new Error('initCache error');
      sessionServiceMock.initCache.mockRejectedValue(errorMock);
      const initResult = Symbol('init');
      sessionServiceMock.init.mockReturnValue(initResult);

      // When
      const result = await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(result).toEqual(initResult);
    });

    it('should call session.refresh() if session is valid and slidingExpiration is true', async () => {
      // Given
      sessionServiceMock.initCache.mockReturnValueOnce(true);

      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.refresh).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.refresh).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should NOT call session.init() if session is valid and slidingExpiration is true', async () => {
      // Given
      sessionServiceMock.initCache.mockReturnValue(true);

      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.init).not.toHaveBeenCalled();
    });

    it('should NOT call session.refresh() if session is valid and slidingExpiration is false', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({ slidingExpiration: false });
      sessionServiceMock.initCache.mockReturnValueOnce(true);

      // When
      await middleware['handleSession'](reqMock, resMock);

      // Then
      expect(sessionServiceMock.refresh).not.toHaveBeenCalled();
    });
  });
});
