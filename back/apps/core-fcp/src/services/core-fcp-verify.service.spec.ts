import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CORE_VERIFY_SERVICE, CoreVerifyService, ProcessCore } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { OidcProviderService } from '@fc/oidc-provider';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpInvalidIdentityException } from '../exceptions';
import { CoreFcpVerifyService } from './core-fcp-verify.service';

describe('CoreFcpVerifyService', () => {
  let service: CoreFcpVerifyService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const coreVerifyServiceMock = {
    verify: jest.fn(),
    trackVerified: jest.fn(),
    getFeature: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

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

  const trackingMock = {
    track: jest.fn(),
    TrackedEventsMap: { IDP_CALLEDBACK_WITH_ERROR: {} },
  };

  const oidcProviderServiceMock = {
    abortInteraction: jest.fn(),
  };

  const identityProviderMock = {
    getById: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcpVerifyService,
        {
          provide: CORE_VERIFY_SERVICE,
          useClass: CoreVerifyService,
        },
        ConfigService,
        CoreVerifyService,
        OidcProviderService,
        TrackingService,
        LoggerService,
        IdentityProviderAdapterMongoService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CORE_VERIFY_SERVICE)
      .useValue(coreVerifyServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderMock)
      .compile();

    service = app.get<CoreFcpVerifyService>(CoreFcpVerifyService);
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
      const expected = 'urlPrefixValue/interaction/interactionId/consent';
      // When
      const result = await service['handleVerifyIdentity'](req, params);
      // Then
      expect(result).toBe(expected);
    });
  });

  describe('handleInsufficientAcrLevel()', () => {
    beforeEach(() => {
      configServiceMock.get = jest.fn().mockReturnValue({
        urlPrefix: 'urlPrefixValue',
      });
    });

    it('should get urlPrefix from config', () => {
      // When
      service['handleInsufficientAcrLevel'](interactionIdMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should return url result', () => {
      // Given
      const expected = 'urlPrefixValue/interaction/interactionIdMockValue';
      // When
      const result = service['handleInsufficientAcrLevel'](interactionIdMock);
      // Then
      expect(result).toBe(expected);
    });
  });

  describe('handleIdpError()', () => {
    // Given
    const errorMock = {
      error: 'error',
      error_description: 'error description',
    };

    const resMock = {} as unknown as Response;

    it('should call tracking service method', async () => {
      // When
      await service.handleIdpError(req, resMock, errorMock);

      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.IDP_CALLEDBACK_WITH_ERROR,
        expect.any(Object),
      );
    });

    it('should call abortInteraction method', async () => {
      // When
      await service.handleIdpError(req, resMock, errorMock);

      // Then
      expect(oidcProviderServiceMock.abortInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.abortInteraction).toHaveBeenCalledWith(
        req,
        resMock,
        errorMock,
        true,
      );
    });
  });

  describe('validateIdentity()', () => {
    const idpIdMock = 'idpIdMockValue';
    const identityMock = {
      given_name: 'given_name',
      sub: '1',
    } as IOidcIdentity;

    let handleFnMock;
    let handlerMock;

    beforeEach(() => {
      handleFnMock = jest.fn();
      handlerMock = {
        handle: handleFnMock,
      };
      coreVerifyServiceMock.getFeature.mockResolvedValueOnce(handlerMock);
    });

    it('should succeed to get the right handler to validate identity', async () => {
      // Given
      handleFnMock.mockResolvedValueOnce([]);

      // When
      await service.validateIdentity(idpIdMock, identityMock);

      // Then
      expect(coreVerifyServiceMock.getFeature).toHaveBeenCalledTimes(1);
      expect(coreVerifyServiceMock.getFeature).toHaveBeenCalledWith(
        idpIdMock,
        ProcessCore.ID_CHECK,
      );
    });

    it('should succeed validate identity from feature handler', async () => {
      // Given
      handleFnMock.mockResolvedValueOnce([]);

      // When
      await service.validateIdentity(idpIdMock, identityMock);

      // Then
      expect(handleFnMock).toHaveBeenCalledTimes(1);
      expect(handleFnMock).toHaveBeenCalledWith(identityMock);
    });

    it('should failed to validate identity', async () => {
      // Given
      handleFnMock.mockResolvedValueOnce(['Unknown Error']);

      await expect(
        // When
        service.validateIdentity(idpIdMock, identityMock),
        // Then
      ).rejects.toThrow(CoreFcpInvalidIdentityException);
    });
  });
});
