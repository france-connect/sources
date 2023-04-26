import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { CoreVerifyService } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { TrackingService } from '@fc/tracking';

import { CoreFcaVerifyService } from './core-fca-verify.service';

describe('CoreFcaController', () => {
  let service: CoreFcaVerifyService;

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const coreVerifyServiceMock = {
    verify: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      IDP_CALLEDBACK: {},
      FC_VERIFIED: {},
      FC_BLACKLISTED: {},
    },
  } as unknown as TrackingService;

  const interactionIdMock = 'interactionIdMockValue';

  const req = {
    fc: {
      interactionId: interactionIdMock,
    },
    query: {
      firstQueryParam: 'first',
      secondQueryParam: 'second',
    },
  } as unknown as Request;

  const params = {
    urlPrefix: 'urlPrefixValue',
    interactionId: 'interactionId',
    sessionOidc: sessionServiceMock,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaVerifyService,
        LoggerService,
        CoreVerifyService,
        TrackingService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CoreVerifyService)
      .useValue(coreVerifyServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    service = await app.get<CoreFcaVerifyService>(CoreFcaVerifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleVerify()', () => {
    beforeEach(() => {
      service['trackVerified'] = jest.fn();
    });

    it('should call core.verify()', async () => {
      // When
      await service['handleVerifyIdentity'](req, params);
      // Then
      expect(coreVerifyServiceMock.verify).toHaveBeenCalledTimes(1);
      expect(coreVerifyServiceMock.verify).toHaveBeenCalledWith(
        sessionServiceMock,
        { req },
      );
    });

    it('should call trackVerified()', async () => {
      // When
      await service['handleVerifyIdentity'](req, params);
      // Then
      expect(service['trackVerified']).toHaveBeenCalledTimes(1);
      expect(service['trackVerified']).toHaveBeenCalledWith(req);
    });

    it('should return url result', async () => {
      // Given
      const expected = 'urlPrefixValue/login';
      // When
      const result = await service['handleVerifyIdentity'](req, params);
      // Then
      expect(result).toBe(expected);
    });
  });

  describe('handleBlacklisted()', () => {
    beforeEach(() => {
      service['trackBlackListed'] = jest.fn();
    });

    it('should call session.set()', async () => {
      // When
      await service['handleBlacklisted'](req, params);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith('isSso', false);
    });

    it('should call trackBlackListed', async () => {
      // When
      await service['handleBlacklisted'](req, params);
      // Then
      expect(service['trackBlackListed']).toHaveBeenCalledTimes(1);
      expect(service['trackBlackListed']).toHaveBeenCalledWith(req);
    });

    it('should return url result', async () => {
      // Given
      const expected = 'urlPrefixValue/interaction/interactionId';
      // When
      const result = await service['handleBlacklisted'](req, params);
      // Then
      expect(result).toBe(expected);
    });
  });

  describe('trackVerified', () => {
    it('should call tracking.track()', async () => {
      // When
      await service['trackVerified'](req);
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.FC_VERIFIED,
        { req },
      );
    });
  });

  describe('trackBlackListed', () => {
    it('should call tracking.track()', async () => {
      // When
      await service['trackBlackListed'](req);
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.FC_BLACKLISTED,
        { req },
      );
    });
  });
});
