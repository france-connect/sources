import { tap } from 'rxjs';

import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { IsStep } from '../decorators';
import { FlowStepsService } from '../services';
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

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const reqMock = {
    route: {
      path: '/a/prefix/and/some/uri',
    },
    sessionId: 'sessionIdValue',
  };

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

  const flowStepMock = {
    setStep: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsStepInterceptor,
        ConfigService,
        LoggerService,
        Reflector,
        FlowStepsService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(FlowStepsService)
      .useValue(flowStepMock)
      .compile();

    interceptor = module.get<IsStepInterceptor>(IsStepInterceptor);

    configServiceMock.get.mockReturnValue(configMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('intercept', () => {
    it('should retrieve flag from IsStep decorator', () => {
      // Given
      IsStepMock.get = jest.fn().mockReturnValueOnce(false);

      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(IsStepMock.get).toHaveBeenCalledTimes(1);
    });

    describe('if flag is not set', () => {
      beforeEach(() => {
        IsStepMock.get = jest.fn().mockReturnValueOnce(false);
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

      it('should not call handle().pipe()', () => {
        // Given
        const handleResultMock = { pipe: jest.fn() };
        nextMock.handle.mockReturnValueOnce(handleResultMock);

        // When
        interceptor.intercept(contextMock, nextMock);

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

      it('should call handle().pipe()', () => {
        // When
        interceptor.intercept(contextMock, nextMock);

        // Then
        expect(handleResultMock.pipe).toHaveBeenCalledTimes(1);
      });

      it('should call tap()', () => {
        // When
        interceptor.intercept(contextMock, nextMock);

        // Then
        expect(tapMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('setStep', () => {
    it('should not call extractSession if there is no active session', async () => {
      // Given
      const reqMock = {
        sessionId: undefined,
        route: { path: '' },
      };
      httpContextMock.getRequest.mockReturnValueOnce(reqMock);

      // When
      await interceptor['setStep'](contextMock);

      // Then
      expect(flowStepMock.setStep).not.toHaveBeenCalled();
    });

    it('should set stepRoute in session', async () => {
      // When
      await interceptor['setStep'](contextMock);

      // Then
      expect(flowStepMock.setStep).toHaveBeenCalledTimes(1);
      expect(flowStepMock.setStep).toHaveBeenCalledWith(
        reqMock,
        '/and/some/uri',
      );
    });
  });
});
