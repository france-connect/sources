import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { IEventMap } from '../interfaces';
import { TrackingService } from '../tracking.service';
import { TrackingInterceptor } from './tracking.interceptor';

describe('TrackingInterceptor', () => {
  let interceptor: TrackingInterceptor;

  const trackingMock = {
    log: jest.fn(),
  };

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
  };

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const reqMock = {
    ip: '123.123.123.123',
    fc: { interactionId: '42' },
  };

  const eventsMock = {
    foo: { route: '/foo', intercept: true },
    bar: { route: '/bar', intercept: true },
    wizz: { route: '/wizz', intercept: false },
  } as unknown as IEventMap;

  const nextMock = {
    handle: jest.fn(),
    pipe: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingInterceptor, TrackingService, LoggerService],
    })
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    interceptor = module.get<TrackingInterceptor>(TrackingInterceptor);

    jest.resetAllMocks();
    nextMock.handle.mockReturnThis();
    httpContextMock.getRequest.mockReturnValue(reqMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should not call log until next', async () => {
      // Given
      interceptor['log'] = jest.fn();
      // When
      await interceptor.intercept(contextMock, nextMock);
      // Then
      expect(interceptor['log']).toHaveBeenCalledTimes(0);
    });
  });

  describe('log', () => {
    it('should call TrackingService.log', () => {
      // Given
      const eventMock = {};
      interceptor['getEvent'] = jest.fn().mockReturnValue(eventMock);
      // When
      interceptor['log'](reqMock);
      // Then
      expect(trackingMock.log).toHaveBeenCalledTimes(1);
      expect(trackingMock.log).toHaveBeenCalledWith(eventMock, {
        req: reqMock,
      });
    });
    it('should not call TrackingService.log if event not found', () => {
      // Given
      const eventMock = undefined;
      interceptor['getEvent'] = jest.fn().mockReturnValue(eventMock);
      // When
      interceptor['log'](reqMock);
      // Then
      expect(trackingMock.log).toHaveBeenCalledTimes(0);
    });
  });

  describe('getEvent', () => {
    it('should deduce event from route', () => {
      // Given
      const req = { route: { path: '/bar' } };
      // When
      const result = interceptor['getEvent'](req, eventsMock);
      // Then
      expect(result).toBe(eventsMock.bar);
    });
    it('should not return event with falsy intercept', () => {
      // Given
      const req = { route: { path: '/wizz' } };
      // When
      const result = interceptor['getEvent'](req, eventsMock);
      // Then
      expect(result).toBeUndefined();
    });
    it('should not return event when there is not route match', () => {
      // Given
      const req = { route: { path: '/nowhere' } };
      // When
      const result = interceptor['getEvent'](req, eventsMock);
      // Then
      expect(result).toBeUndefined();
    });
  });
});
