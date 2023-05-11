import { Request } from 'express';

import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import { TrackingService } from '@fc/tracking';

import { ProcessCore } from '../enums';
import { CoreIdentityProviderNotFoundException } from '../exceptions';
import { IVerifyFeatureHandler } from '../interfaces';
import { CoreVerifyService } from './core-verify.service';

describe('CoreVerifyService', () => {
  let service: CoreVerifyService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const spIdentityMock = {
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
  } as IOidcIdentity;

  const idpIdentityMock = {
    sub: 'some idpSub',
  } as PartialExcept<IOidcIdentity, 'sub'>;

  const sessionDataMock: OidcSession = {
    idpId: '42',
    idpAcr: 'eidas3',
    idpName: 'my favorite Idp',
    idpIdentity: idpIdentityMock,

    spId: 'sp_id',
    spAcr: 'eidas3',
    spName: 'my great SP',
    spIdentity: spIdentityMock,
  };

  let featureHandlerGetSpy;

  const featureHandlerServiceMock = {
    handle: jest.fn(),
  };

  const moduleRefMock = {
    get: jest.fn(),
  };

  const IdentityProviderMock = {
    getById: jest.fn(),
  };

  const interactionIdMock = 'interactionIdMockValue';

  const reqMock = {};

  const coreVerifyMock = 'core-fcp-default-verify';
  const authenticationEmailMock = 'core-fcp-send-email';

  const idpIdentityCheckMock = 'core-fcp-eidas-identity-check';

  const identityProviderResultMock = {
    featureHandlers: {
      coreVerify: coreVerifyMock,
      authenticationEmail: authenticationEmailMock,
      idpIdentityCheck: idpIdentityCheckMock,
    },
  } as unknown as IdentityProviderMetadata;

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      IDP_CALLEDBACK: {},
      FC_VERIFIED: {},
      FC_BLACKLISTED: {},
    },
  } as unknown as TrackingService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreVerifyService,
        LoggerService,
        IdentityProviderAdapterMongoService,
        TrackingService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(IdentityProviderMock)
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    service = module.get<CoreVerifyService>(CoreVerifyService);

    featureHandlerGetSpy = jest.spyOn(FeatureHandler, 'get');

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    featureHandlerGetSpy.mockReturnValueOnce(featureHandlerServiceMock);
    IdentityProviderMock.getById.mockResolvedValue(identityProviderResultMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verify()', () => {
    it('should return a promise', async () => {
      // action
      const result = service.verify(sessionServiceMock, reqMock);
      await result;
      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('Should call session.get() with `interactionId`', async () => {
      // Given
      // When
      await service.verify(sessionServiceMock, reqMock);
      // Then
      expect(sessionServiceMock.get).toBeCalledTimes(1);
      expect(sessionServiceMock.get).toBeCalledWith();
    });

    it('Should call `getFeature` to get instantiated featureHandler class', async () => {
      // Given
      const getFeatureMock = jest.spyOn<CoreVerifyService, any>(
        service,
        'getFeature',
      );
      // When
      await service.verify(sessionServiceMock, reqMock);
      // Then
      expect(getFeatureMock).toBeCalledTimes(1);
      expect(getFeatureMock).toBeCalledWith(
        sessionDataMock.idpId,
        ProcessCore.CORE_VERIFY,
      );
    });

    it('Should call featureHandle.handle() with `sessionService`', async () => {
      // Given
      const handlerArgument = {
        sessionOidc: sessionServiceMock,
        trackingContext: reqMock,
      };
      // When
      await service.verify(sessionServiceMock, reqMock);
      // Then
      expect(featureHandlerServiceMock.handle).toBeCalledTimes(1);
      expect(featureHandlerServiceMock.handle).toBeCalledWith(handlerArgument);
    });
  });

  describe('getFeature()', () => {
    it('should return class for specific process', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toStrictEqual(featureHandlerServiceMock);
    });

    it('should have called log when feature is required', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toBeDefined();
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        `getFeature idpIdentityCheck for provider: 42`,
      );
    });

    it('should have search idp when feature is required', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toBeDefined();
      expect(IdentityProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(IdentityProviderMock.getById).toHaveBeenCalledWith(
        sessionDataMock.idpId,
      );
    });

    it('should have extract class from class id when feature is required', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toBeDefined();
      expect(featureHandlerGetSpy).toHaveBeenCalledTimes(1);
      expect(featureHandlerGetSpy).toHaveBeenCalledWith(
        identityProviderResultMock.featureHandlers.idpIdentityCheck,
        service,
      );
    });

    it('should failed if process is unknown from idp feature list', async () => {
      // Given
      const errorMock = new Error('Undefined Feature');
      featureHandlerGetSpy.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await expect(
        () =>
          service.getFeature<IVerifyFeatureHandler>(
            sessionDataMock.idpId,
            'Tzeentch' as unknown as ProcessCore,
          ),
        // Then
      ).rejects.toThrow(errorMock);
    });

    it('should throw CoreIdentityProviderNotFoundException if idp is undefined', async () => {
      // Given
      IdentityProviderMock.getById.mockReset().mockResolvedValue(undefined);
      // When
      await expect(
        () =>
          service.getFeature<IVerifyFeatureHandler>(
            sessionDataMock.idpId,
            ProcessCore.ID_CHECK,
          ),
        // Then
      ).rejects.toThrow(CoreIdentityProviderNotFoundException);
    });
  });

  describe('handleBlacklisted()', () => {
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
    const req = {
      fc: {
        interactionId: interactionIdMock,
      },
      query: {
        firstQueryParam: 'first',
        secondQueryParam: 'second',
      },
    } as unknown as Request;

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
    const req = {
      fc: {
        interactionId: interactionIdMock,
      },
      query: {
        firstQueryParam: 'first',
        secondQueryParam: 'second',
      },
    } as unknown as Request;

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
