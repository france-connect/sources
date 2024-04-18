import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { ForbidRefresh } from '../decorators';
import {
  UndefinedStepRouteException,
  UnexpectedNavigationException,
} from '../exceptions';
import { ForbidRefreshInterceptor } from './forbid-refresh.interceptor';

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

  const ForbidRefreshMock = jest.mocked(ForbidRefresh);

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
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

  const reflectorMock = {};

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForbidRefreshInterceptor,
        ConfigService,
        Reflector,
        SessionService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    interceptor = module.get<ForbidRefreshInterceptor>(
      ForbidRefreshInterceptor,
    );

    configServiceMock.get.mockReturnValue(configMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
    sessionServiceMock.get.mockReturnValue(sessionMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    beforeEach(() => {
      interceptor['checkRefresh'] = jest.fn();
    });

    it('should retrieve flag from ForbidRefresh decorator', () => {
      // Given
      ForbidRefreshMock.get = jest.fn().mockReturnValueOnce(false);

      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(ForbidRefreshMock.get).toHaveBeenCalledTimes(1);
    });

    describe('if flag is not set', () => {
      beforeEach(() => {
        ForbidRefreshMock.get = jest.fn().mockReturnValueOnce(false);
      });

      it('should return result from next.handle()', () => {
        // Given
        const handleResultMock = Symbol('handleResultMock');
        nextMock.handle.mockReturnValueOnce(handleResultMock);

        // When
        const result = interceptor.intercept(contextMock, nextMock);

        // Then
        expect(result).toBe(handleResultMock);
      });

      it('should not call interceptor.checkRefresh()', () => {
        // Given
        const handleResultMock = { pipe: jest.fn() };
        nextMock.handle.mockReturnValueOnce(handleResultMock);

        // When
        interceptor.intercept(contextMock, nextMock);

        // Then
        expect(interceptor['checkRefresh']).not.toHaveBeenCalled();
      });
    });

    describe('if flag is set', () => {
      it('should call checkRefresh', () => {
        // Given
        const handleResultMock = { pipe: jest.fn() };

        nextMock.handle.mockReturnValueOnce(handleResultMock);
        ForbidRefreshMock.get = jest.fn().mockReturnValueOnce(true);

        // When
        interceptor.intercept(contextMock, nextMock);

        // Then
        expect(interceptor['checkRefresh']).toHaveBeenCalledTimes(1);
        expect(interceptor['checkRefresh']).toHaveBeenCalledWith(contextMock);
      });
    });
  });

  describe('checkRefresh', () => {
    it('should not throw if it is not a refresh', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce({
        stepRoute: '/not/current/route',
      });

      // When
      expect(() => interceptor['checkRefresh'](contextMock)).not.toThrow();
    });

    it('should throw if it is a refresh', () => {
      // When / Then
      expect(() => interceptor['checkRefresh'](contextMock)).toThrow(
        UnexpectedNavigationException,
      );
    });

    it('should throw if no stepRoute found', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(null);
      // When / Then
      expect(() => interceptor['checkRefresh'](contextMock)).toThrow(
        UndefinedStepRouteException,
      );
    });
  });
});
