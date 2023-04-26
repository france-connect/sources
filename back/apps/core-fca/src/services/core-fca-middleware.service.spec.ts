import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreFcaMiddlewareService } from './core-fca-middleware.service';

describe('CoreFcaMiddlewareService', () => {
  let service: CoreFcaMiddlewareService;

  const loggerServiceMock = {
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const oidcProviderServiceMock = {
    registerMiddleware: jest.fn(),
    getInteractionIdFromCtx: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    reset: jest.fn(),
    set: jest.fn(),
    getSessionIdFromCookie: jest.fn(),
    init: jest.fn(),
    bindToRequest: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_AUTHORIZE_INITIATED: {},
      SP_REQUESTED_FC_TOKEN: {},
      SP_REQUESTED_FC_USERINFO: {},
      FC_SSO_INITIATED: {},
    },
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const oidcProviderErrorServiceMock = {
    throwError: jest.fn(),
  };

  const oidcAcrServiceMock = {
    getKnownAcrValues: jest.fn(),
  };

  const spIdentityMock = {
    email: 'eteach@fqdn.ext',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    sub: '42',
  };

  const idpIdentityMock = {
    sub: 'some idpSub',
  };

  const sessionDataMock: OidcSession = {
    idpAcr: 'eidas3',
    idpId: '42',
    idpIdentity: idpIdentityMock,
    idpName: 'my favorite Idp',
    idpLabel: 'my favorite Idp Title',
    spAcr: 'eidas3',
    spId: 'sp_id',
    spIdentity: spIdentityMock,
    spName: 'my great SP',
  };

  const interactionIdValueMock = '42';
  const sessionIdMockValue = '42';
  const spAcrMock = 'eidas3';
  const spIdMock = 'spIdValue';
  const ipMock = '123.123.123.123';
  const spNameMock = 'Mon SP';
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123,124.124.124.124';
  const reqMock = {
    headers: {
      'x-forwarded-for': ipMock,
      'x-forwarded-source-port': sourcePortMock,
      'x-forwarded-for-original': xForwardedForOriginalMock,
    },
    sessionId: sessionIdMockValue,
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    query: { acr_values: spAcrMock, client_id: spIdMock },
  };
  const resMock = {
    redirect: jest.fn(),
  };

  const eventCtxMock: TrackedEventContextInterface = {
    fc: {
      interactionId: interactionIdValueMock,
    },
    req: reqMock,
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaMiddlewareService,
        LoggerService,
        OidcProviderService,
        ConfigService,
        SessionService,
        TrackingService,
        ServiceProviderAdapterMongoService,
        OidcAcrService,
        OidcProviderErrorService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(oidcProviderErrorServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrServiceMock)
      .compile();

    service = module.get<CoreFcaMiddlewareService>(CoreFcaMiddlewareService);

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    it('should register ovrrideAuthorizePrompt middleware', () => {
      // Given
      service['registerMiddleware'] = jest.fn();
      // When
      service.onModuleInit();
      // Then
      expect(service['registerMiddleware']).toHaveBeenCalledTimes(7);
    });

    it('should register 7 events', () => {
      // Given
      service['overrideAuthorizePrompt'] = jest.fn();
      service['overrideAuthorizeAcrValues'] = jest.fn();
      service['overrideClaimAmrMiddleware'] = jest.fn();
      service['afterAuthorizeMiddleware'] = jest.fn();
      service['beforeAuthorizeMiddleware'] = jest.fn();
      service['tokenMiddleware'] = jest.fn();
      service['userinfoMiddleware'] = jest.fn();
      // When
      service.onModuleInit();
      // Then
      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.BEFORE,
        OidcProviderRoutes.AUTHORIZATION,
        expect.any(Function),
      );

      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.AUTHORIZATION,
        expect.any(Function),
      );

      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.TOKEN,
        expect.any(Function),
      );

      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.USERINFO,
        expect.any(Function),
      );
    });
  });

  describe('afterAuthorizeMiddleware()', () => {
    const getCtxMock = (hasError = false) => {
      return {
        oidc: {
          isError: hasError,
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
        },
        req: reqMock,
        res: resMock,
      } as unknown as OidcCtx;
    };

    const getBoundedSessionMock = jest.spyOn(
      SessionService,
      'getBoundedSession',
    );

    const sessionPropertiesMock = {
      interactionId: interactionIdValueMock,
      spAcr: spAcrMock,
      spName: spNameMock,
      spId: spIdMock,
    };

    beforeEach(() => {
      jest.resetAllMocks();

      service['isSsoAvailable'] = jest.fn();
      service['buildSessionWithNewInteraction'] = jest.fn();
      service['trackAuthorize'] = jest.fn();
      service['redirectToSso'] = jest.fn();
      service['getEventContext'] = jest.fn();
      getBoundedSessionMock.mockReturnValue(
        sessionServiceMock as unknown as ISessionService<unknown>,
      );

      configServiceMock.get.mockReturnValueOnce({ enableSso: false });
    });

    it('should abort middleware execution if the request is flagged with an error', async () => {
      // Given
      const ctxMock = getCtxMock(true);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(0);
      expect(configServiceMock.get).toHaveBeenCalledTimes(0);
      expect(getBoundedSessionMock).toHaveBeenCalledTimes(0);
      expect(service['isSsoAvailable']).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(0);
      expect(service['isSsoAvailable']).toHaveBeenCalledTimes(0);
      expect(service['trackAuthorize']).toHaveBeenCalledTimes(0);
      expect(service['redirectToSso']).toHaveBeenCalledTimes(0);
    });

    it('should call isSsoAvailable() with the sessionService', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      service['isSsoAvailable'] = jest.fn().mockResolvedValue(true);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['isSsoAvailable']).toHaveBeenCalledTimes(1);
      expect(service['isSsoAvailable']).toHaveBeenCalledWith(
        sessionServiceMock,
      );
    });

    it('should call buildSessionWithNewInteraction() with the sessionService and ctx', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      service['isSsoAvailable'] = jest.fn().mockResolvedValue(true);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['buildSessionWithNewInteraction']).toHaveBeenCalledTimes(
        1,
      );
      expect(service['buildSessionWithNewInteraction']).toHaveBeenCalledWith(
        ctxMock,
        eventCtxMock,
      );
    });

    it('should call trackAuthorize() with ctx', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      const expected = {
        fc: {
          interactionId: '42',
        },
        req: {
          headers: {
            'x-forwarded-for': '123.123.123.123',
            'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
            'x-forwarded-source-port': '443',
          },
          query: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            acr_values: 'eidas3',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: 'spIdValue',
          },
          sessionId: '42',
        },
      };
      service['isSsoAvailable'] = jest.fn().mockResolvedValue(true);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['trackAuthorize']).toHaveBeenCalledTimes(1);
      expect(service['trackAuthorize']).toHaveBeenCalledWith(expected);
    });

    it('should call `redirectToSso()` if `isSsoAvailable()` returns `true` and configuration `enableSso` returns true', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce({ enableSso: true });
      service['isSsoAvailable'] = jest.fn().mockResolvedValue(true);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['redirectToSso']).toHaveBeenCalledTimes(1);
      expect(service['redirectToSso']).toHaveBeenCalledWith(ctxMock);
    });

    it('should NOT call `redirectToSso()` if `isSsoAvailable()` returns `true` and configuration `enableSso` returns `false`', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      service['isSsoAvailable'] = jest.fn().mockResolvedValueOnce(true);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['redirectToSso']).not.toHaveBeenCalled();
    });

    it('should NOT call `redirectToSso()` if `isSsoAvailable()` returns `false` and configuration `enableSso` returns `false`', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      service['isSsoAvailable'] = jest.fn().mockResolvedValueOnce(false);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['redirectToSso']).not.toHaveBeenCalled();
    });
  });

  describe('isSsoAvailable', () => {
    it('should call session.get()', async () => {
      // When
      await service['isSsoAvailable'](sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('spIdentity');
    });

    it('should return `true` if spIdentity exists in session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce({});
      // When
      const result = await service['isSsoAvailable'](sessionServiceMock);
      // Then
      expect(result).toBe(true);
    });

    it('should return `false` if spIdentity does not exist in session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      const result = await service['isSsoAvailable'](sessionServiceMock);
      // Then
      expect(result).toBe(false);
    });
  });

  describe('trackSso', () => {
    it('should call tracking.track()', async () => {
      // Given
      const ctxMock = {} as unknown as OidcCtx;
      const eventContextMock = {};
      service['getEventContext'] = jest
        .fn()
        .mockReturnValueOnce(eventContextMock);
      // When
      service['trackSso'](ctxMock);
      // Then
      expect(service['tracking'].track).toHaveBeenCalledTimes(1);
      expect(service['tracking'].track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.FC_SSO_INITIATED,
        eventContextMock,
      );
    });
  });

  describe('redirectToSso', () => {
    const ctxMock = { res: resMock } as unknown as OidcCtx;
    const urlPrefixMock = 'urlPrefixMock';

    beforeEach(() => {
      service['trackSso'] = jest.fn();
      service['getInteractionFromCtx'] = jest.fn();

      configServiceMock.get.mockReturnValueOnce({ urlPrefix: urlPrefixMock });
    });

    it('should call getInteractionIdFromCtx()', async () => {
      // When
      await service['redirectToSso'](ctxMock);
      // Then
      expect(
        oidcProviderServiceMock.getInteractionIdFromCtx,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcProviderServiceMock.getInteractionIdFromCtx,
      ).toHaveBeenCalledWith(ctxMock);
    });

    it('should call trackSso with ctx', async () => {
      // given
      oidcProviderServiceMock.getInteractionIdFromCtx.mockReturnValue(
        interactionIdValueMock,
      );
      // When
      await service['redirectToSso'](ctxMock);
      // Then
      expect(service['trackSso']).toHaveBeenCalledTimes(1);
      expect(service['trackSso']).toHaveBeenCalledWith(ctxMock);
    });

    it('should call res.redirect', async () => {
      // given
      oidcProviderServiceMock.getInteractionIdFromCtx.mockReturnValue(
        interactionIdValueMock,
      );
      // When
      await service['redirectToSso'](ctxMock);
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
    });
  });
});
