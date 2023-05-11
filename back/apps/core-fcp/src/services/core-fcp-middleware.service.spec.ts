import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
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

import { CoreFcpMiddlewareService } from './core-fcp-middleware.service';

describe('CoreFcpMiddlewareService', () => {
  let service: CoreFcpMiddlewareService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const oidcProviderServiceMock = {
    registerMiddleware: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    reset: jest.fn(),
    set: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const oidcProviderErrorServiceMock = {
    throwError: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const oidcAcrServiceMock = {
    getKnownAcrValues: jest.fn(),
  };

  const interactionIdValueMock = '42';
  const sessionIdMockValue = '42';
  const spNameMock = 'my SP';
  const spAcrMock = 'eidas3';
  const spIdMock = 'spIdValue';
  const ipMock = '123.123.123.123';
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
  const resMock = {};

  const trackingMock = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_AUTHORIZE_INITIATED: {},
      SP_REQUESTED_FC_TOKEN: {},
      SP_REQUESTED_FC_USERINFO: {},
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcpMiddlewareService,
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

    service = module.get<CoreFcpMiddlewareService>(CoreFcpMiddlewareService);
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
      service['beforeAuthorizeMiddleware'] = jest.fn();
      service['afterAuthorizeMiddleware'] = jest.fn();
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

    const eventCtxMock: TrackedEventContextInterface = {
      fc: {
        interactionId: interactionIdValueMock,
      },
      req: reqMock,
    };

    const sessionPropertiesMock = {
      interactionId: interactionIdValueMock,
      spAcr: spAcrMock,
      spId: spIdMock,
      spName: spNameMock,
    };

    const getBoundedSessionMock = jest.spyOn(
      SessionService,
      'getBoundedSession',
    );

    beforeEach(() => {
      jest.resetAllMocks();

      getBoundedSessionMock.mockReturnValue(
        sessionServiceMock as unknown as ISessionService<unknown>,
      );

      service['isSsoAvailable'] = jest.fn();
      service['checkRedirectToSso'] = jest.fn();
      service['buildSessionWithNewInteraction'] = jest.fn();
      service['trackAuthorize'] = jest.fn();

      configServiceMock.get.mockReturnValueOnce({ enableSso: false });
    });

    it('should abort middleware execution if the request is flagged with an error', async () => {
      // Given
      const ctxMock = getCtxMock(true);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(0);
      expect(trackingMock.track).toHaveBeenCalledTimes(0);
    });

    it('should call session.reset()', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should get three bounded session services', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundedSession).toHaveBeenCalledTimes(3);
    });

    it('should get bounded AppSession service', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundedSession).toHaveBeenCalledWith(
        ctxMock.req,
        'App',
      );
    });

    it('should get bounded OidcClientSession service', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundedSession).toHaveBeenCalledWith(
        ctxMock.req,
        'OidcClient',
      );
    });

    it('should get bounded CoreSessionDto service when sso is enabled and in a sso context', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundedSession).toHaveBeenCalledWith(
        ctxMock.req,
        'Core',
      );
    });

    it('should call session.set() three times', async () => {
      // Given
      const ctxMock = getCtxMock();

      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(3);
    });

    it('should set suspicious request status in AppSession', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'isSuspicious',
        false,
      );
    });

    it('should set interaction status in OidcClientSession', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        sessionPropertiesMock,
      );
    });

    it('should set an empty array in sessionCore if sentNotificationsForSp is undefined', async () => {
      // Given
      const ctxMock = getCtxMock();

      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenLastCalledWith(
        'sentNotificationsForSp',
        [],
      );
    });

    it('should set an array of service provider id in sessionCore if sentNotificationsForSp exist', async () => {
      // Given
      const ctxMock = getCtxMock();
      const sentNotificationsForSpMock = ['one-sp-id'];
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      sessionServiceMock.get.mockReturnValueOnce(sentNotificationsForSpMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenLastCalledWith(
        'sentNotificationsForSp',
        ['one-sp-id'],
      );
    });

    it('should call trackAuthorize() with ctx', async () => {
      // Given
      const ctxMock = getCtxMock();
      const expected = {
        spAcr: spAcrMock,
        spId: spIdMock,
        spName: spNameMock,
        fc: { interactionId: '42' },
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
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['trackAuthorize']).toHaveBeenCalledTimes(1);
      expect(service['trackAuthorize']).toHaveBeenCalledWith(expected);
    });

    it('should call isSsoAvailable() with the sessionService', async () => {
      // Given
      const ctxMock = getCtxMock();
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
      const ctxMock = getCtxMock();
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

    it('should call `checkRedirectToSso()` with ctx', async () => {
      // Given
      const ctxMock = getCtxMock();
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
      expect(service['checkRedirectToSso']).toHaveBeenCalledTimes(1);
      expect(service['checkRedirectToSso']).toHaveBeenCalledWith(ctxMock);
    });

    it('should be isSso = true when enableSso = true and isSsoAvailable = true', async () => {
      // Given
      const ctxMock = getCtxMock();
      const isSsoMock = true;
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
      expect(ctxMock.isSso).toBe(isSsoMock);
    });

    it('should be isSso = false when enableSso = false', async () => {
      // Given
      const ctxMock = getCtxMock();
      const isSsoMock = false;
      const isSsoAvailableMock = Symbol('boolean') as unknown as boolean;
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce({ enableSso: false });
      service['isSsoAvailable'] = jest
        .fn()
        .mockResolvedValue(isSsoAvailableMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(ctxMock.isSso).toBe(isSsoMock);
    });

    it('should be isSso = false when isSsoAvailable = false', async () => {
      // Given
      const ctxMock = getCtxMock();
      const isSsoMock = false;
      const enableSsoMock = Symbol('boolean') as unknown as boolean;
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce({ enableSso: enableSsoMock });
      service['isSsoAvailable'] = jest.fn().mockResolvedValue(false);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(ctxMock.isSso).toBe(isSsoMock);
    });
  });
});
