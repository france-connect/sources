import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderErrorService,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { OidcMiddlewareService } from './oidc-middleware.service';

describe('MockIdentityProviderFcaService', () => {
  let service: OidcMiddlewareService;

  const loggerMock = {
    debug: jest.fn(),
    fatal: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const sessionServiceMock = {
    set: {
      bind: jest.fn(),
    },
  };

  const serviceProviderEnvServiceMock = {
    getList: jest.fn(),
    getById: jest.fn(),
  };

  const getInteractionMock = jest.fn();

  const sessionIdValueMock = '42';
  const interactionIdValueMock = '42';

  const oidcProviderServiceMock = {
    getInteraction: getInteractionMock,
    registerMiddleware: jest.fn(),
    getInteractionIdFromCtx: jest.fn(),
  };

  const oidcProviderErrorServiceMock = {
    throwError: jest.fn(),
  };

  const trackingMock = {
    TrackedEventsMap: {
      RECEIVED_CALL_ON_TOKEN: {},
      RECEIVED_CALL_ON_USERINFO: {},
    },
    track: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        OidcProviderService,
        OidcProviderErrorService,
        OidcMiddlewareService,
        ServiceProviderAdapterEnvService,
        SessionService,
        TrackingService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(oidcProviderErrorServiceMock)
      .overrideProvider(ServiceProviderAdapterEnvService)
      .useValue(serviceProviderEnvServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .compile();

    service = module.get<OidcMiddlewareService>(OidcMiddlewareService);

    jest.resetAllMocks();
  });

  describe('onModuleInit()', () => {
    it('should register middlewares', () => {
      // When
      service.onModuleInit();
      // Then
      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledTimes(
        3,
      );
    });
  });

  describe('authorizationMiddleware()', () => {
    const spIdMock = 'spIdValue';
    const spNameMock = 'spNameValue';
    const spAcrMock = 'eidas3';

    const getCtxMock = (hasError = false) => {
      return {
        req: {
          sessionId: sessionIdValueMock,
          headers: { 'x-forwarded-for': '123.123.123.123' },
        },
        oidc: {
          isError: hasError,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { client_id: spIdMock, acr_values: spAcrMock },
        },
        res: {},
      };
    };

    it('should abort middleware execution if request if flagged as erroring', async () => {
      // Given
      const ctxMock = getCtxMock(true);
      service['getInteractionIdFromCtx'] = jest.fn();

      // When
      await service['authorizationMiddleware'](ctxMock);

      // Then
      expect(service['getInteractionIdFromCtx']).toHaveBeenCalledTimes(0);
      expect(serviceProviderEnvServiceMock.getById).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.set.bind).toHaveBeenCalledTimes(0);
    });

    it('should call session.set()', async () => {
      // Given
      const ctxMock = getCtxMock();
      oidcProviderServiceMock.getInteractionIdFromCtx = jest
        .fn()
        .mockReturnValue(interactionIdValueMock);

      serviceProviderEnvServiceMock.getById.mockReturnValueOnce({
        name: spNameMock,
      });

      const bindedSessionService = jest.fn().mockResolvedValueOnce(undefined);
      sessionServiceMock.set.bind.mockReturnValueOnce(bindedSessionService);

      const sessionMock: OidcSession = {
        interactionId: interactionIdValueMock,
        spId: spIdMock,
        spAcr: spAcrMock,
        spName: spNameMock,
      };

      const boundSessionContextMock: ISessionBoundContext = {
        sessionId: sessionIdValueMock,
        moduleName: 'OidcClient',
      };

      // When
      await service['authorizationMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.set.bind).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set.bind).toHaveBeenCalledWith(
        sessionServiceMock,
        boundSessionContextMock,
      );

      expect(bindedSessionService).toHaveBeenCalledTimes(1);
      expect(bindedSessionService).toHaveBeenCalledWith(sessionMock);
    });

    it('should throw if the session initialization fails', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['getInteractionIdFromCtx'] = jest
        .fn()
        .mockReturnValue(interactionIdValueMock);

      sessionServiceMock.set.bind.mockRejectedValueOnce(new Error('test'));

      // When / Then
      await expect(
        service['authorizationMiddleware'](ctxMock),
      ).rejects.toThrow();
    });
  });

  describe('getEventContext', () => {
    const interactionIdMock = 'interactionIdMockValue';
    const netWorkInfoMock = {
      ip: 'ip',
      originalAddresses: 'originalAddresses',
      port: 'port',
    };
    beforeEach(() => {
      oidcProviderServiceMock.getInteractionIdFromCtx.mockReturnValueOnce(
        interactionIdMock,
      );
      service['getNetworkInfoFromHeaders'] = jest
        .fn()
        .mockReturnValueOnce(netWorkInfoMock);
    });

    it('should return context object with sessionId from `req` if no oidc accountId', () => {
      // Given
      const ctxMock = {
        req: {
          sessionId: 'sessionIdValue',
        },
      };
      // When
      const result = service['getEventContext'](ctxMock);
      // Then
      expect(result).toEqual({
        fc: {
          interactionId: interactionIdMock,
        },
        req: ctxMock.req,
        sessionId: ctxMock.req.sessionId,
      });
    });

    it('should return context object with sessionId from `oidc` object', () => {
      // Given
      const ctxMock = {
        req: {
          sessionId: 'sessionIdValue',
        },
        oidc: {
          entities: {
            Account: {
              accountId: 'accountIdMock',
            },
          },
        },
      };
      // When
      const result = service['getEventContext'](ctxMock);
      // Then
      expect(result).toEqual({
        fc: {
          interactionId: interactionIdMock,
        },
        req: ctxMock.req,
        sessionId: ctxMock.oidc.entities.Account.accountId,
      });
    });

    it('should return context object with sessionId from ̀`req` if `oidc` object is incomplete', () => {
      // Given
      const ctxMock = {
        req: {
          sessionId: 'sessionIdValue',
        },
        oidc: {
          entities: {},
        },
      };
      // When
      const result = service['getEventContext'](ctxMock);
      // Then
      expect(result).toEqual({
        fc: {
          interactionId: interactionIdMock,
        },
        req: ctxMock.req,
        sessionId: ctxMock.req.sessionId,
      });
    });
  });

  describe('tokenMiddleware()', () => {
    const eventCtxMock: TrackedEventContextInterface = {};
    const eventContextMock = {};
    beforeEach(() => {
      service['bindSessionId'] = jest.fn();
      service['getEventContext'] = jest.fn().mockReturnValue(eventContextMock);
    });

    it('should retrieve context', async () => {
      // When
      await service['tokenMiddleware'](eventCtxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['getEventContext']).toHaveBeenCalledWith(eventCtxMock);
    });
    it('should publish a token event', async () => {
      // When
      await service['tokenMiddleware'](eventCtxMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.RECEIVED_CALL_ON_TOKEN,
        eventCtxMock,
      );
    });

    it('should call throwError if getEventContext failed', async () => {
      // Given
      const errorMock = new Error('unknownError');
      service['getEventContext'] = jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['tokenMiddleware'](eventCtxMock);
      // Then
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(1);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledWith(
        eventCtxMock,
        errorMock,
      );
    });

    it('should call throwError if tracking.track throw an error', async () => {
      // Given
      const errorMock = new Error('unknownError');
      trackingMock.track.mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['tokenMiddleware'](eventCtxMock);
      // Then
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(1);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledWith(
        eventCtxMock,
        errorMock,
      );
    });
  });

  describe('userinfoMiddleware()', () => {
    const eventCtxMock: TrackedEventContextInterface = {};
    const eventContextMock = {};
    beforeEach(() => {
      service['bindSessionId'] = jest.fn();
      service['getEventContext'] = jest.fn().mockReturnValue(eventContextMock);
    });

    it('should retrieve context', async () => {
      // When
      await service['userinfoMiddleware'](eventCtxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['getEventContext']).toHaveBeenCalledWith(eventCtxMock);
    });
    it('should publish a token event', async () => {
      // When
      await service['userinfoMiddleware'](eventCtxMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.RECEIVED_CALL_ON_USERINFO,
        eventCtxMock,
      );
    });

    it('should call throwError if getEventContext failed', async () => {
      // Given
      const errorMock = new Error('unknownError');
      service['getEventContext'] = jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['userinfoMiddleware'](eventCtxMock);
      // Then
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(1);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledWith(
        eventCtxMock,
        errorMock,
      );
    });

    it('should call throwError if tracking.track throw an error', async () => {
      // Given
      const errorMock = new Error('unknownError');
      trackingMock.track.mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['userinfoMiddleware'](eventCtxMock);
      // Then
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(1);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledWith(
        eventCtxMock,
        errorMock,
      );
    });
  });

  describe('bindSessionId', () => {
    it('should affect sessionId from service.getEventContext() to req', () => {
      // Given
      const ctxMock = {
        req: {},
      };

      const eventContextMock = {
        sessionId: 'sessionIdValue',
      };

      service['getEventContext'] = jest.fn().mockReturnValue(eventContextMock);
      // When
      service['bindSessionId'](ctxMock);
      // Then
      expect(ctxMock.req['sessionId']).toBeDefined();
      expect(ctxMock.req['sessionId']).toBe(eventContextMock.sessionId);
    });
  });
});
