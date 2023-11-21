import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreVerifyService } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaVerifyService } from './core-fca-verify.service';

describe('CoreFcaVerifyService', () => {
  let service: CoreFcaVerifyService;

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const coreVerifyServiceMock = {
    verify: jest.fn(),
    trackVerified: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      SP_DISABLED_SSO: {},
    },
  } as unknown as TrackingService;

  const serviceProviderAdapterMongoService = {};

  const configServiceMock = {
    get: jest.fn(),
  };

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

  const eventContext = { req };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaVerifyService,
        LoggerService,
        TrackingService,
        CoreVerifyService,
        ConfigService,
        SessionService,
      ],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(CoreVerifyService)
      .useValue(coreVerifyServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderAdapterMongoService)
      .compile();

    sessionServiceMock.get.mockResolvedValue(sessionServiceMock);

    service = app.get<CoreFcaVerifyService>(CoreFcaVerifyService);
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
      expect(coreVerifyServiceMock.trackVerified).toHaveBeenCalledTimes(1);
      expect(coreVerifyServiceMock.trackVerified).toHaveBeenCalledWith(req);
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

  describe('trackSsoDisabled()', () => {
    it('should track service provider with sso disallowed', async () => {
      // When
      await service['trackSsoDisabled'](eventContext);

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.SP_DISABLED_SSO,
        eventContext,
      );
    });
  });

  describe('handleSsoDisabled()', () => {
    it('should call session.set()', async () => {
      // When
      await service['handleSsoDisabled'](req, params);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith('isSso', false);
    });

    it('should call trackSsoDisabled()', async () => {
      // Given
      const urlPrefixMock = 'urlPrefixMock';
      const isSsoMock = true;
      const oidcClientSessionDataMock = {
        isSso: isSsoMock,
        set: jest.fn(),
      } as unknown as ISessionService<OidcClientSession>;
      service['trackSsoDisabled'] = jest.fn();

      // When
      await service['handleSsoDisabled'](req, {
        urlPrefix: urlPrefixMock,
        interactionId: interactionIdMock,
        sessionOidc: oidcClientSessionDataMock,
      });

      // Then
      expect(service['trackSsoDisabled']).toHaveBeenCalledTimes(1);
      expect(service['trackSsoDisabled']).toHaveBeenCalledWith(eventContext);
    });
  });
});
