import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { ForbidRefresh } from '../decorators';
import {
  UndefinedStepRouteException,
  UnexpectedNavigationException,
} from '../exceptions';
import { ForbidRefreshInterceptor } from './forbid-refresh.interceptor';

jest.mock('@fc/session/helper', () => ({
  SessionService: jest.fn(),
}));

jest.mock('../decorators', () => ({
  ForbidRefresh: jest.fn(),
}));

describe('ForbidRefreshInterceptor', () => {
  let interceptor: ForbidRefreshInterceptor;

  const sessionServiceMock = getSessionServiceMock();

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const reqMock = {
    route: {
      path: '/a/prefix/and/some/uri',
    },
    sessionId: 'sessionIdValue',
  };

  const SessionServiceMock = jest.mocked(SessionService);
  SessionServiceMock.getBoundSession = jest.fn();

  const ForbidRefreshMock = jest.mocked(ForbidRefresh);

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const configMock: Partial<AppConfig> = {
    urlPrefix: '/a/prefix',
  };

  const sessionMock = {
    stepRoute: '/and/some/uri',
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForbidRefreshInterceptor,
        ConfigService,
        LoggerService,
        Reflector,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    interceptor = module.get<ForbidRefreshInterceptor>(
      ForbidRefreshInterceptor,
    );

    configServiceMock.get.mockReturnValue(configMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
    sessionServiceMock.get.mockResolvedValue(sessionMock);
    SessionServiceMock.getBoundSession.mockReturnValue(sessionServiceMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('intercept', () => {
    beforeEach(() => {
      interceptor['checkRefresh'] = jest.fn();
    });

    it('should retrieve flag from ForbidRefresh decorator', async () => {
      // Given
      ForbidRefreshMock.get = jest.fn().mockReturnValueOnce(false);

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(ForbidRefreshMock.get).toHaveBeenCalledTimes(1);
    });

    describe('if flag is not set', () => {
      beforeEach(() => {
        ForbidRefreshMock.get = jest.fn().mockReturnValueOnce(false);
      });

      it('should return result from next.handle()', async () => {
        // Given
        const handleResultMock = Symbol('handleResultMock');
        nextMock.handle.mockReturnValueOnce(handleResultMock);

        // When
        const result = await interceptor.intercept(contextMock, nextMock);

        // Then
        expect(result).toBe(handleResultMock);
      });

      it('should not call interceptor.checkRefresh()', async () => {
        // Given
        const handleResultMock = { pipe: jest.fn() };
        nextMock.handle.mockReturnValueOnce(handleResultMock);

        // When
        await interceptor.intercept(contextMock, nextMock);

        // Then
        expect(interceptor['checkRefresh']).not.toHaveBeenCalled();
      });
    });

    describe('if flag is set', () => {
      it('should call checkRefresh', async () => {
        // Given
        const handleResultMock = { pipe: jest.fn() };

        nextMock.handle.mockReturnValueOnce(handleResultMock);
        ForbidRefreshMock.get = jest.fn().mockReturnValueOnce(true);

        // When
        await interceptor.intercept(contextMock, nextMock);

        // Then
        expect(interceptor['checkRefresh']).toHaveBeenCalledTimes(1);
        expect(interceptor['checkRefresh']).toHaveBeenCalledWith(contextMock);
      });
    });
  });

  describe('checkRefresh', () => {
    it('should not throw if there is no active session', async () => {
      // Given
      httpContextMock.getRequest.mockReturnValueOnce({
        req: { sessionId: undefined },
      });
      // When / Then
      await expect(
        interceptor['checkRefresh'](contextMock),
      ).resolves.not.toThrow();
    });

    it('should not call extractSession if there is no active session', async () => {
      // Given
      httpContextMock.getRequest.mockReturnValueOnce({
        sessionId: undefined,
        route: { path: '' },
      });

      // When
      await interceptor['checkRefresh'](contextMock);

      // Then
      expect(SessionServiceMock.getBoundSession).not.toHaveBeenCalled();
    });

    it('should not throw if it is not a refresh', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce({
        stepRoute: '/not/current/route',
      });

      // When
      await expect(
        interceptor['checkRefresh'](contextMock),
      ).resolves.not.toThrow();
    });

    it('should throw if it is a refresh', async () => {
      // When / Then
      await expect(interceptor['checkRefresh'](contextMock)).rejects.toThrow(
        UnexpectedNavigationException,
      );
    });

    it('should throw if no stepRoute found', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockResolvedValue(null);
      // When / Then
      await expect(interceptor['checkRefresh'](contextMock)).rejects.toThrow(
        UndefinedStepRouteException,
      );
    });
  });
});
