import { Request } from 'express';

import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { SessionService } from '../services';
import { SessionCommitInterceptor } from './session-commit.interceptor';

jest.mock('../helper', () => ({
  extractSessionFromRequest: jest.fn(),
}));

describe('SessionCommitInterceptor', () => {
  let interceptor: SessionCommitInterceptor;

  const reqMock = {
    route: {
      path: '/prefix/some/route',
    },
    sessionId: 'sessionIdValue',
  };

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  };

  const handleResult = {
    pipe: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();
  const configServiceMock = getConfigMock();
  const loggerMock = getLoggerMock();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionCommitInterceptor,
        SessionService,
        ConfigService,
        LoggerService,
      ],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    interceptor = module.get<SessionCommitInterceptor>(
      SessionCommitInterceptor,
    );

    httpContextMock.getRequest.mockReturnValue(reqMock);

    nextMock.handle.mockReturnValue(handleResult);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call next.handle', () => {
      // Given

      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
      expect(handleResult.pipe).toHaveBeenCalledTimes(1);
    });
  });

  describe('commit', () => {
    const routes = ['/some/route', '/some/other/route'];

    beforeEach(() => {
      interceptor['getCleanedUpRoutes'] = jest.fn().mockReturnValue(routes);
      interceptor['shouldCommitSession'] = jest.fn().mockReturnValue(true);
      configServiceMock.get
        .mockReturnValueOnce({
          urlPrefix: '/prefix',
        })
        .mockReturnValueOnce({
          excludedRoutes: [],
        });
    });

    it('should call sessionService.commit', async () => {
      // When
      await interceptor['commit'](reqMock as unknown as Request);

      // Then
      expect(sessionServiceMock.commit).toHaveBeenCalledTimes(1);
    });

    it('should not call sessionService.commit if route is not included', async () => {
      // Given
      interceptor['getCleanedUpRoutes'] = jest
        .fn()
        .mockReturnValueOnce(['/not/that/route']);
      interceptor['shouldCommitSession'] = jest.fn().mockReturnValue(false);

      // When
      await interceptor['commit'](reqMock as unknown as Request);

      // Then
      expect(sessionServiceMock.commit).not.toHaveBeenCalled();
    });

    it('should catch and log error on commit ', async () => {
      // Given
      const error = new Error('commit error');
      sessionServiceMock.commit.mockRejectedValueOnce(error);

      // When
      await interceptor['commit'](reqMock as unknown as Request);

      // Then
      expect(loggerMock.info).toHaveBeenCalledWith(
        'Could not commit session from interceptor',
      );
    });
  });

  describe('getCleanedUpRoutes', () => {
    it('should return an array of strings with $ removed', () => {
      // Given
      const routes = ['/some/route$', '/some/other/$route'];

      // When
      const result = interceptor['getCleanedUpRoutes'](routes);

      // Then
      expect(result).toEqual(['/some/route', '/some/other/route']);
    });
  });

  describe('shouldCommitSession', () => {
    it('should return true if "*" is included in allowedRoutes', () => {
      const allowedRoutes = ['*', '/route1', '/route2'];
      const currentRoute = '/not-in-list';

      const result = interceptor['shouldCommitSession'](
        allowedRoutes,
        currentRoute,
      );

      expect(result).toBe(true);
    });

    it('should return true if currentRoute is included in allowedRoutes', () => {
      const allowedRoutes = ['/route1', '/route2'];
      const currentRoute = '/route1';

      const result = interceptor['shouldCommitSession'](
        allowedRoutes,
        currentRoute,
      );

      expect(result).toBe(true);
    });

    it('should return false if neither "*" nor currentRoute is included in allowedRoutes', () => {
      const allowedRoutes = ['/route1', '/route2'];
      const currentRoute = '/not-in-list';

      const result = interceptor['shouldCommitSession'](
        allowedRoutes,
        currentRoute,
      );

      expect(result).toBe(false);
    });

    it('should return false if allowedRoutes is an empty array', () => {
      const allowedRoutes: string[] = [];
      const currentRoute = '/any-route';

      const result = interceptor['shouldCommitSession'](
        allowedRoutes,
        currentRoute,
      );

      expect(result).toBe(false);
    });

    it('should return false if allowedRoutes contains similar routes but not the exact match', () => {
      const allowedRoutes = ['/route1', '/route2/sub'];
      const currentRoute = '/route2';

      const result = interceptor['shouldCommitSession'](
        allowedRoutes,
        currentRoute,
      );

      expect(result).toBe(false);
    });
  });
});
