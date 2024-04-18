import { ExecutionContext, RequestMethod } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { TrackedEventMapType } from '../interfaces';
import { TrackingService } from '../services';
import { TrackingInterceptor } from './tracking.interceptor';

describe('TrackingInterceptor', () => {
  let interceptor: TrackingInterceptor;

  const trackingMock = {
    track: jest.fn(),
  };

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;

  const reqMock = {
    ip: '123.123.123.123',
    fc: { interactionId: '42' },
    route: {
      path: '/mock/path',
    },
  };

  const eventsMock = {
    foo: { interceptRoutes: [{ path: '/foo', method: RequestMethod.ALL }] },
    bar: { interceptRoutes: [{ path: '/bar', method: RequestMethod.GET }] },
    wizz: { interceptRoutes: [{ path: '/wizz', method: RequestMethod.GET }] },
    bazz: {},
  } as unknown as TrackedEventMapType;

  const nextMock = {
    handle: jest.fn(),
    pipe: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };
  const urlPrefixMock = '/url/prefix';

  const configMock = {
    urlPrefix: urlPrefixMock,
  };

  const loggerMock = getLoggerMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingInterceptor,
        TrackingService,
        ConfigService,
        LoggerService,
      ],
    })
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    interceptor = module.get<TrackingInterceptor>(TrackingInterceptor);

    jest.resetAllMocks();
    nextMock.handle.mockReturnThis();
    httpContextMock.getRequest.mockReturnValue(reqMock);
    configServiceMock.get.mockReturnValueOnce(configMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should not call log until next', () => {
      // Given
      interceptor['log'] = jest.fn();
      // When
      interceptor.intercept(contextMock, nextMock);
      // Then
      expect(interceptor['log']).toHaveBeenCalledTimes(0);
    });

    it('should log a debug when intercepting', () => {
      // When
      interceptor.intercept(contextMock, nextMock);
      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerMock.debug).toHaveBeenCalledWith({
        handler: contextMock.getHandler(),
      });
    });
  });

  describe('log', () => {
    it('should call TrackingService.log', async () => {
      // Given
      const eventMock = {};
      interceptor['getEvent'] = jest.fn().mockReturnValue(eventMock);
      // When
      await interceptor['log'](reqMock, urlPrefixMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(eventMock, {
        req: reqMock,
      });
    });

    it('should not call TrackingService.log if event not found', async () => {
      // Given
      const eventMock = undefined;
      interceptor['getEvent'] = jest.fn().mockReturnValue(eventMock);
      // When
      await interceptor['log'](reqMock, urlPrefixMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(0);
    });
  });

  describe('getEvent', () => {
    it('should deduce event from route', () => {
      // Given
      const req = { method: 'GET', route: { path: `${urlPrefixMock}/bar` } };
      // When
      const result = interceptor['getEvent'](req, eventsMock, urlPrefixMock);
      // Then
      expect(result).toBe(eventsMock.bar);
    });

    it('should not return event with wrong method intercept', () => {
      // Given
      const req = { method: 'POST', route: { path: `${urlPrefixMock}/wizz` } };
      // When
      const result = interceptor['getEvent'](req, eventsMock, urlPrefixMock);
      // Then
      expect(result).toBeUndefined();
    });

    it('should not return event when there is not route match', () => {
      // Given
      const req = { method: 'POST', route: { path: `/nowhere` } };
      // When
      const result = interceptor['getEvent'](req, eventsMock, urlPrefixMock);
      // Then
      expect(result).toBeUndefined();
    });
  });
});
