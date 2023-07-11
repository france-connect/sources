import { tap } from 'rxjs';

import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { SessionService } from '@fc/session';

import { IsStep } from '../decorators';
import { IsStepInterceptor } from './is-step.interceptor';

jest.mock('@fc/session/helper', () => ({
  SessionService: jest.fn(),
}));

jest.mock('../decorators', () => ({
  IsStep: jest.fn(),
}));

jest.mock('rxjs', () => ({
  tap: jest.fn(),
}));

describe('IsStepInterceptor', () => {
  let interceptor: IsStepInterceptor;

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    shouldHandleSession: jest.fn(),
  };

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
  SessionServiceMock.getBoundedSession = jest.fn();

  const IsStepMock = jest.mocked(IsStep);

  const tapMock = jest.mocked(tap);

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
    spId: 'mockSpId',
    spName: 'mockSpName',
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [IsStepInterceptor, ConfigService, LoggerService, Reflector],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    interceptor = module.get<IsStepInterceptor>(IsStepInterceptor);

    configServiceMock.get.mockReturnValue(configMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
    sessionServiceMock.get.mockResolvedValue(sessionMock);
    SessionServiceMock.getBoundedSession.mockReturnValue(sessionServiceMock);
  });

  it('should be defined', async () => {
    expect(interceptor).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('intercept', () => {
    it('should retrieve flag from IsStep decorator', async () => {
      // Given
      IsStepMock.get = jest.fn().mockReturnValueOnce(false);

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(IsStepMock.get).toHaveBeenCalledTimes(1);
    });

    describe('if flag is not set', () => {
      beforeEach(() => {
        IsStepMock.get = jest.fn().mockReturnValueOnce(false);
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

      it('should not call handle().pipe()', async () => {
        // Given
        const handleResultMock = { pipe: jest.fn() };
        nextMock.handle.mockReturnValueOnce(handleResultMock);

        // When
        await interceptor.intercept(contextMock, nextMock);

        // Then
        expect(handleResultMock.pipe).not.toHaveBeenCalled();
      });
    });

    describe('if flag is set', () => {
      // Given
      const handleResultMock = { pipe: jest.fn() };

      beforeEach(() => {
        // Given
        nextMock.handle.mockReturnValueOnce(handleResultMock);
        IsStepMock.get = jest.fn().mockReturnValueOnce(true);
      });

      it('should call handle().pipe()', async () => {
        // When
        await interceptor.intercept(contextMock, nextMock);

        // Then
        expect(handleResultMock.pipe).toHaveBeenCalledTimes(1);
      });

      it('should call tap()', async () => {
        // When
        await interceptor.intercept(contextMock, nextMock);

        // Then
        expect(tapMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('setStep', () => {
    it('should not call extractSession if there is no active session', async () => {
      // Given
      httpContextMock.getRequest.mockReturnValueOnce({
        sessionId: undefined,
        route: { path: '' },
      });

      // When
      await interceptor['setStep'](contextMock);

      // Then
      expect(SessionServiceMock.getBoundedSession).not.toHaveBeenCalled();
    });

    it('should set stepRoute in session', async () => {
      // When
      await interceptor['setStep'](contextMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'stepRoute',
        '/and/some/uri',
      );
    });
  });
});
