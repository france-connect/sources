import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FlowStepsService } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger-legacy';
import { atHashFromAccessToken } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientRoutes } from '@fc/oidc-client';
import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { getSessionServiceMock } from '@mocks/session';

import { CoreClaimAmrException, CoreIdpHintException } from '../exceptions';
import { CORE_SERVICE } from '../tokens';
import { pickAcr } from '../transforms';
import { CoreOidcProviderMiddlewareService } from './core-oidc-provider-middleware.service';

jest.mock('../transforms');

jest.mock('@fc/oidc');

describe('CoreOidcProviderMiddlewareService', () => {
  let service: CoreOidcProviderMiddlewareService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const atHashFromAccessTokenMock = jest.mocked(atHashFromAccessToken);

  const oidcProviderServiceMock = {
    getInteractionIdFromCtx: jest.fn(),
    registerMiddleware: jest.fn(),
    clearCookies: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
    getList: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_AUTHORIZE_INITIATED: {},
      SP_REQUESTED_FC_TOKEN: {},
      SP_REQUESTED_FC_USERINFO: {},
      FC_SSO_INITIATED: {},
      FC_REDIRECTED_TO_HINTED_IDP: {},
    },
  };

  const interactionIdValueMock = '42';
  const eventContextMock = {
    fc: {
      interactionId: interactionIdValueMock,
    },
  };
  const oidcProviderErrorServiceMock = {
    throwError: jest.fn(),
    handleRedirectableError: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const oidcAcrServiceMock = {
    getKnownAcrValues: jest.fn(),
    isAcrValid: jest.fn(),
  };

  const atHashMock = 'atHashMock value';
  const sessionIdMock = 'session-id-mock';
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
    sessionId: sessionIdMock,
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    query: { acr_values: spAcrMock, client_id: spIdMock },
  };
  const resMock = {
    redirect: jest.fn(),
  };

  const coreServiceMock = {
    redirectToIdp: jest.fn(),
  };

  const flowStepsMock = {
    setStep: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreOidcProviderMiddlewareService,
        LoggerService,
        SessionService,
        OidcProviderService,
        TrackingService,
        ConfigService,
        OidcAcrService,
        ServiceProviderAdapterMongoService,
        OidcProviderErrorService,
        {
          provide: CORE_SERVICE,
          useValue: coreServiceMock,
        },
        FlowStepsService,
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
      .overrideProvider(FlowStepsService)
      .useValue(flowStepsMock)
      .compile();

    service = module.get<CoreOidcProviderMiddlewareService>(
      CoreOidcProviderMiddlewareService,
    );

    atHashFromAccessTokenMock.mockReturnValue(atHashMock);

    SessionService.getBoundSession = jest
      .fn()
      .mockReturnValue(sessionServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

  describe('trackAuthorize', () => {
    it('should call tracking.track()', async () => {
      // Given
      const ctxMock = {} as unknown as OidcCtx;
      const eventContextMock = {};
      service['getEventContext'] = jest
        .fn()
        .mockReturnValueOnce(eventContextMock);
      // When
      await service['trackAuthorize'](ctxMock);
      // Then
      expect(service['tracking'].track).toHaveBeenCalledTimes(1);
      expect(service['tracking'].track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.FC_AUTHORIZE_INITIATED,
        eventContextMock,
      );
    });
  });

  describe('buildSessionWithNewInteraction', () => {
    const ctxMock = {
      oidc: {
        // oidc naming style
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params: { acr_values: 'acr_values', client_id: 'client_id' },
      },
      isSso: true,
    } as unknown as OidcCtx;

    serviceProviderServiceMock.getById.mockResolvedValue({ name: 'name' });

    it('should call serviceProvider.getById()', async () => {
      // given
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        name: 'name',
      });
      // When
      await service['buildSessionWithNewInteraction'](
        ctxMock,
        eventContextMock,
      );
      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(
        ctxMock.oidc.params.client_id,
      );
    });

    it('should return session properties', async () => {
      // given
      const expected = {
        interactionId: '42',
        spAcr: 'acr_values',
        spId: 'client_id',
        spName: 'name',
        isSso: true,
        stepRoute: '/authorize',
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        name: 'name',
      });
      // When
      const result = await service['buildSessionWithNewInteraction'](
        ctxMock,
        eventContextMock,
      );
      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('beforeAuthorizeMiddleware', () => {
    it('should set cookies to nothing if cookies do not exist', () => {
      // Given
      const ctxMock: any = {
        req: { headers: { foo: 'bar' } },
      };

      // When
      service['beforeAuthorizeMiddleware'](ctxMock);

      // Then
      expect(ctxMock).toEqual({
        req: { headers: { foo: 'bar', cookie: '' } },
      });
    });

    it('should set cookies to nothing if cookies exist', () => {
      // Given
      const ctxMock: any = {
        req: {
          headers: {
            cookie: {
              _interaction: '123',
              // eslint-disable-next-line @typescript-eslint/naming-convention
              session_id: 'test',
            },
          },
        },
      };

      // When
      service['beforeAuthorizeMiddleware'](ctxMock);

      // Then
      expect(ctxMock).toEqual({
        req: { headers: { cookie: '' } },
      });
    });
  });

  describe('overrideClaimAmrMiddleware()', () => {
    it('should throw an error if service provider not authorized to request amr claim', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          claims: { id_token: { amr: { essential: true } } },
        },
        req: reqMock,
        res: resMock,
      };
      const errorMock = new CoreClaimAmrException();

      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: [],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(spIdMock);

      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenNthCalledWith(
        1,
        ctxMock,
        errorMock,
      );
    });

    it('should not throw if amr claim not requested and not authorized for sp', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          claims: {},
        },
        req: reqMock,
        res: resMock,
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: [],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(0);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(0);
    });

    it('should not throw if amr claim not requested by service provider but authorized for sp', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          claims: {},
        },
        req: reqMock,
        res: resMock,
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: ['amr'],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(0);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(0);
    });

    it('should not throw if amr claim is authorized to request by the service provider', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          claims: { id_token: { amr: { essential: true } } },
        },
        req: reqMock,
        res: resMock,
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: ['amr'],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(spIdMock);

      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(0);
    });
  });

  describe('overrideClaimAmrMiddleware()', () => {
    it('should throw an error if service provider not authorized to request amr claim', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          claims: { id_token: { amr: { essential: true } } },
        },
        req: reqMock,
        res: resMock,
      };
      const errorMock = new CoreClaimAmrException();

      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: [],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(spIdMock);

      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenNthCalledWith(
        1,
        ctxMock,
        errorMock,
      );
    });

    it('should not throw if amr claim not requested and not authorized for sp', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          claims: {},
        },
        req: reqMock,
        res: resMock,
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: [],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(0);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(0);
    });

    it('should not throw if amr claim not requested by service provider but authorized for sp', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          claims: {},
        },
        req: reqMock,
        res: resMock,
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: ['amr'],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(0);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(0);
    });

    it('should not throw if amr claim is authorized to request by the service provider', async () => {
      // Given
      const ctxMock = {
        oidc: {
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          params: { acr_values: spAcrMock, client_id: spIdMock },
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          claims: { id_token: { amr: { essential: true } } },
        },
        req: reqMock,
        res: resMock,
      };
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        claims: ['amr'],
      });

      // When
      await service['overrideClaimAmrMiddleware'](ctxMock);

      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(spIdMock);

      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenCalledTimes(0);
    });
  });

  describe('overrideAuthorizePrompt()', () => {
    it('should set prompt parameter on query', () => {
      // Given
      const ctxMock = {
        method: 'GET',
        query: {},
      } as OidcCtx;
      const overridePrompt = 'test';
      configServiceMock.get.mockReturnValue({
        forcedPrompt: ['test'],
      });
      // When
      service['overrideAuthorizePrompt'](ctxMock);
      // Then
      expect(ctxMock.query.prompt).toBe(overridePrompt);
      expect(ctxMock.body).toBeUndefined();
    });

    it('should set prompt parameter on body', () => {
      // Given
      const ctxMock: OidcCtx = {
        method: 'POST',
        req: { body: {} },
      } as unknown as OidcCtx;
      const overridePrompt = 'test';
      configServiceMock.get.mockReturnValue({
        forcedPrompt: ['test'],
      });
      // When
      service['overrideAuthorizePrompt'](ctxMock);
      // Then
      expect(ctxMock.req.body.prompt).toBe(overridePrompt);
      expect(ctxMock.query).toBeUndefined();
    });

    it('should not do anything but log if there is no method declared', () => {
      // Given
      const ctxMock = {} as OidcCtx;
      configServiceMock.get.mockReturnValue({
        forcedPrompt: ['login'],
      });
      // When
      service['overrideAuthorizePrompt'](ctxMock);
      // Then
      expect(ctxMock).toEqual({});
      expect(loggerServiceMock.warn).toHaveBeenCalledTimes(1);
    });

    it('should not do anything but log if method is not handled', () => {
      // Given
      const ctxMock = { method: 'DELETE' } as OidcCtx;
      configServiceMock.get.mockReturnValue({
        forcedPrompt: ['login'],
      });
      // When
      service['overrideAuthorizePrompt'](ctxMock);
      // Then
      expect(ctxMock).toEqual({ method: 'DELETE' });
      expect(loggerServiceMock.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('overrideAuthorizeAcrValues()', () => {
    const overrideAcr = 'boots';

    beforeEach(() => {
      configServiceMock.get.mockReturnValue({
        defaultAcrValue: 'eidas3',
      });
      oidcAcrServiceMock.getKnownAcrValues.mockReturnValue([
        'boots',
        'clothes',
        'motorcycle',
      ]);
      const pickAcrMock = mocked(pickAcr);
      pickAcrMock.mockReturnValueOnce(overrideAcr);
    });

    it('should set acr values parameter on query', () => {
      // Given
      const ctxMock = {
        method: 'GET',
        // Oidc Naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        query: { acr_values: 'boots' },
      } as unknown as OidcCtx;
      // When
      service['overrideAuthorizeAcrValues'](ctxMock);
      // Then
      expect(ctxMock.query.acr_values).toBe(overrideAcr);
      expect(ctxMock.body).toBeUndefined();
    });

    it('should set acr values parameter on body', () => {
      // Given
      const ctxMock = {
        method: 'POST',
        // Oidc Naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        req: { body: { acr_values: 'boots' } },
      } as unknown as OidcCtx;
      // When
      service['overrideAuthorizeAcrValues'](ctxMock);
      // Then
      expect(ctxMock.req.body.acr_values).toBe(overrideAcr);
      expect(ctxMock.query).toBeUndefined();
    });

    it('should not do anything but log if there is no method declared', () => {
      // Given
      const ctxMock = {} as OidcCtx;
      // When
      service['overrideAuthorizeAcrValues'](ctxMock);
      // Then
      expect(ctxMock).toEqual({});
      expect(loggerServiceMock.warn).toHaveBeenCalledTimes(1);
    });

    it('should not do anything but log if method is not handled', () => {
      // Given
      const ctxMock = { method: 'DELETE' } as OidcCtx;
      // When
      service['overrideAuthorizeAcrValues'](ctxMock);
      // Then
      expect(ctxMock).toEqual({ method: 'DELETE' });
      expect(loggerServiceMock.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('tokenMiddleware()', () => {
    // Given
    const eventCtxMock: TrackedEventContextInterface = {
      fc: { interactionId: interactionIdValueMock },
      headers: {
        'x-forwarded-for': '123.123.123.123',
        'x-forwarded-source-port': '443',
        'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
      },
    };
    const ctxMock = {
      req: {
        headers: {
          'x-forwarded-for': '123.123.123.123',
          'x-forwarded-source-port': '443',
          'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
        },
        // oidc
        // eslint-disable-next-line @typescript-eslint/naming-convention
        query: { acr_values: 'eidas3', client_id: 'foo' },
      },
      res: {},
      oidc: {
        entities: {},
      },
    } as unknown as OidcCtx;

    beforeEach(() => {
      service['bindSessionId'] = jest.fn();
    });

    it('should create a session alias based on at_hash', async () => {
      // Given
      service['getEventContext'] = jest
        .fn()
        .mockReturnValue(eventCtxMock as TrackedEventContextInterface);

      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        name: 'name',
      });

      // When
      await service['tokenMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.setAlias).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.setAlias).toHaveBeenCalledWith(atHashMock);
    });

    it('should publish a token event', async () => {
      // Given
      service['getEventContext'] = jest
        .fn()
        .mockReturnValue(eventCtxMock as TrackedEventContextInterface);

      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        name: 'name',
      });
      // When
      await service['tokenMiddleware'](ctxMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['getEventContext']).toHaveBeenLastCalledWith(ctxMock);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.SP_REQUESTED_FC_TOKEN,
        eventCtxMock,
      );
    });

    it('should call throwError if getEventContext failed', async () => {
      // Given
      const errorMock = new Error('unknowError');

      service['getEventContext'] = jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      await service['tokenMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenNthCalledWith(1, ctxMock);
      expect(oidcProviderErrorServiceMock.throwError).toHaveBeenNthCalledWith(
        1,
        ctxMock,
        errorMock,
      );
    });

    it('should call throwError if tracking.track throw an error', async () => {
      // Given
      const unknownError = new Error('Unknown Error');

      trackingMock.track.mockImplementationOnce(() => {
        throw unknownError;
      });
      service['oidcErrorService']['throwError'] = jest.fn();
      // When
      await service['tokenMiddleware'](ctxMock);
      // Then
      expect(service['oidcErrorService']['throwError']).toHaveBeenCalledTimes(
        1,
      );
      expect(service['oidcErrorService']['throwError']).toHaveBeenCalledWith(
        ctxMock,
        expect.any(Error),
      );
    });
  });

  describe('userinfoMiddleware()', () => {
    beforeEach(() => {
      service['bindSessionId'] = jest.fn();
    });
    it('should publish a token event', async () => {
      // Given
      const ctxMock = {
        req: {
          headers: { 'x-forwarded-for': '123.123.123.123' },
          // oidc
          // eslint-disable-next-line @typescript-eslint/naming-convention
          query: { acr_values: 'eidas3', client_id: 'foo' },
        },
        res: {},
      };
      service['getEventContext'] = jest.fn().mockReturnValueOnce({
        fc: {
          interactionId: '42',
        },
        headers: {
          'x-forwarded-for': '123.123.123.123',
          'x-forwarded-source-port': '443',
          'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
        },
      });
      // When
      await service['userinfoMiddleware'](ctxMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.SP_REQUESTED_FC_USERINFO,
        expect.any(Object),
      );
    });

    it('should set oidc error if getEventContext failed', async () => {
      // Given
      const ctxMock: any = {
        oidc: {},
        not: 'altered',
        req: {
          headers: {
            'x-forwarded-for': '123.123.123.123',
            'x-forwarded-source-port': '443',
            'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
          },
        },
      };

      const errorMock = new Error('unknowError');

      service['getEventContext'] = jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['userinfoMiddleware'](ctxMock);
      // Then
      expect(ctxMock.oidc.isError).toBe(true);
    });

    it('should call throwError if getEventContext fail', async () => {
      // Given
      const ctxMock: any = {
        oidc: {},
        not: 'altered',
        req: {
          headers: {
            'x-forwarded-for': '123.123.123.123',
            'x-forwarded-source-port': '443',
            'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
          },
        },
      };

      const errorMock = new Error('unknowError');

      service['getEventContext'] = jest.fn().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['userinfoMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['oidcErrorService']['throwError']).toHaveBeenNthCalledWith(
        1,
        ctxMock,
        errorMock,
      );
    });

    it('should call throwError if tracking.track throw an error', async () => {
      // Given
      const ctxMock: any = {
        oidc: {},
        not: 'altered',
        req: {
          headers: {
            'x-forwarded-for': '123.123.123.123',
            'x-forwarded-source-port': '443',
            'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
          },
        },
      };

      service['getEventContext'] = jest.fn();

      const errorMock = new Error('Unknown Error');

      trackingMock.track.mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await service['userinfoMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['oidcErrorService']['throwError']).toHaveBeenNthCalledWith(
        1,
        ctxMock,
        errorMock,
      );
    });
  });

  describe('isSsoAvailable', () => {
    const idpAcrMock = 'eidas2';

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        allowedSsoAcrs: ['eidas2'],
        enableSso: true,
      });

      sessionServiceMock.get.mockResolvedValueOnce({
        idpAcr: idpAcrMock,
        spIdentity: 'mockSpIdentity',
      });
    });
    it('should call session.get()', async () => {
      // When
      await service['isSsoAvailable'](sessionServiceMock, spAcrMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call isAcrValid', async () => {
      // When
      await service['isSsoAvailable'](sessionServiceMock, spAcrMock);
      // Then
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(1);
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledWith(
        idpAcrMock,
        spAcrMock,
      );
    });

    it('should call ssoCanBeUsed', async () => {
      // Given
      service['ssoCanBeUsed'] = jest.fn();

      oidcAcrServiceMock.isAcrValid.mockReturnValue(true);
      // When
      await service['isSsoAvailable'](sessionServiceMock, spAcrMock);
      // Then
      expect(service['ssoCanBeUsed']).toHaveBeenCalledTimes(1);
      expect(service['ssoCanBeUsed']).toHaveBeenCalledWith(
        true,
        false,
        true,
        true,
      );
    });

    it('should defined spIdentity and idpAcr to undefined if destructure method is impossible', async () => {
      // Given
      service['ssoCanBeUsed'] = jest.fn();

      sessionServiceMock.get.mockReset().mockResolvedValueOnce(null);
      oidcAcrServiceMock.isAcrValid.mockReturnValue(false);
      // When
      await service['isSsoAvailable'](sessionServiceMock, spAcrMock);
      // Then
      expect(service['ssoCanBeUsed']).toHaveBeenCalledTimes(1);
      expect(service['ssoCanBeUsed']).toHaveBeenCalledWith(
        true,
        false,
        false,
        false,
      );
    });

    it('should return `true` if ssoCanBeUsed return true', async () => {
      // Given
      service['ssoCanBeUsed'] = jest.fn().mockReturnValue(true);
      // When
      const result = await service['isSsoAvailable'](
        sessionServiceMock,
        spAcrMock,
      );
      // Then
      expect(result).toBe(true);
    });

    it('should return `false` if ssoCanBeUsed return false', async () => {
      // Given
      service['ssoCanBeUsed'] = jest.fn().mockReturnValue(false);
      // When
      const result = await service['isSsoAvailable'](
        sessionServiceMock,
        spAcrMock,
      );
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
      await service['trackSso'](ctxMock);
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

  describe('checkRedirectToSso()', () => {
    it('should call `redirectToSso()` if ctx.isSso = true', async () => {
      // Given
      const ctxMock = {
        isSso: true,
      } as unknown as OidcCtx;
      service['redirectToSso'] = jest.fn();
      // When
      await service['checkRedirectToSso'](ctxMock);
      // Then
      expect(service['redirectToSso']).toHaveBeenCalledTimes(1);
      expect(service['redirectToSso']).toHaveBeenCalledWith(ctxMock);
    });

    it('should not call `redirectToSso()` if ctx.isSso = false', async () => {
      // Given
      const ctxMock = {
        isSso: false,
      } as unknown as OidcCtx;
      service['redirectToSso'] = jest.fn();

      // When
      await service['checkRedirectToSso'](ctxMock);

      // Then
      expect(service['redirectToSso']).not.toHaveBeenCalled();
    });
  });

  describe('bindSessionId', () => {
    it('should affect sessionId from service.getEventContext() to req', () => {
      // Given
      const ctxMock = {
        req: {},
      } as unknown as OidcCtx;

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

  describe('redirectToHintedIdpMiddleware', () => {
    // Given
    const idpHintMock = Symbol('idpHintMock');
    const ctxMock = {
      req: {
        query: {
          // OIDC fashion variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          idp_hint: idpHintMock,
        },
      },
      oidc: {
        params: {
          // OIDC fashion variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: Symbol('acr'),
        },
      },
    } as unknown as OidcCtx;

    const idpHintConfigMock = {
      allowedIdpHints: [idpHintMock, 'foo'],
    };

    beforeEach(() => {
      configServiceMock.get.mockReturnValue(idpHintConfigMock);
    });

    it('should call oidcErrorService.handleRedirectableError if an idp hint was provided but is NOT valid', async () => {
      // Given
      const invalidIdpHintCtx = {
        ...ctxMock,
        req: {
          query: {
            // OIDC fashion variable name
            // eslint-disable-next-line @typescript-eslint/naming-convention
            idp_hint: 'invalidIdpHint',
          },
        },
      } as unknown as OidcCtx;

      // When
      await service['redirectToHintedIdpMiddleware'](invalidIdpHintCtx);

      // Then
      expect(
        oidcProviderErrorServiceMock.handleRedirectableError,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcProviderErrorServiceMock.handleRedirectableError,
      ).toHaveBeenCalledWith(
        invalidIdpHintCtx,
        expect.any(CoreIdpHintException),
      );
    });

    it('should call flowStep.setStep if an idp hint was provided and is valid', async () => {
      // When
      await service['redirectToHintedIdpMiddleware'](ctxMock);

      // Then
      expect(flowStepsMock.setStep).toHaveBeenCalledTimes(1);
      expect(flowStepsMock.setStep).toHaveBeenCalledWith(
        ctxMock.req,
        OidcClientRoutes.REDIRECT_TO_IDP,
      );
    });

    it('should call tracking.track() if a valid idp_hint was provided', async () => {
      // Given
      service['getEventContext'] = jest
        .fn()
        .mockReturnValueOnce(eventContextMock);

      // When
      await service['redirectToHintedIdpMiddleware'](ctxMock);

      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.FC_REDIRECTED_TO_HINTED_IDP,
        eventContextMock,
      );
    });

    it('should call core.redirectToIdp() if a valid idp_hint was provided', async () => {
      // When
      await service['redirectToHintedIdpMiddleware'](ctxMock);

      // Then
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledWith(
        ctxMock.res,
        ctxMock.oidc.params.acr_values,
        idpHintMock,
        sessionServiceMock,
      );
    });

    it('should not do anything if no idp_hint was provided', async () => {
      // Given
      const noIdpHintCtx = {
        ...ctxMock,
        req: { query: {} },
      } as unknown as OidcCtx;

      // When
      await service['redirectToHintedIdpMiddleware'](noIdpHintCtx);

      // Then
      expect(
        oidcProviderErrorServiceMock.handleRedirectableError,
      ).not.toHaveBeenCalled();
      expect(flowStepsMock.setStep).not.toHaveBeenCalled();
      expect(trackingMock.track).not.toHaveBeenCalled();
      expect(coreServiceMock.redirectToIdp).not.toHaveBeenCalled();
    });

    it('should not do anything if ctx.isSso is true', async () => {
      // Given
      const noIdpHintCtx = {
        ...ctxMock,
        isSso: true,
      } as unknown as OidcCtx;

      // When
      await service['redirectToHintedIdpMiddleware'](noIdpHintCtx);

      // Then
      expect(
        oidcProviderErrorServiceMock.handleRedirectableError,
      ).not.toHaveBeenCalled();
      expect(flowStepsMock.setStep).not.toHaveBeenCalled();
      expect(trackingMock.track).not.toHaveBeenCalled();
      expect(coreServiceMock.redirectToIdp).not.toHaveBeenCalled();
    });
  });

  describe('ssoCanBeUsed', () => {
    it('should return true if all params are true', () => {
      // Given
      const enableSsoMock = true;
      const hasAuthorizedAcrMock = true;
      const hasSufficientAcrMock = true;
      const hasSpIdentityMock = true;
      // When
      const result = service['ssoCanBeUsed'](
        enableSsoMock,
        hasAuthorizedAcrMock,
        hasSufficientAcrMock,
        hasSpIdentityMock,
      );
      // Then
      expect(result).toBe(true);
    });

    it('should return false if enableSso is defined to false and others to true', () => {
      // Given
      const enableSsoMock = false;
      const hasAuthorizedAcrMock = true;
      const hasSufficientAcrMock = true;
      const hasSpIdentityMock = true;
      // When
      const result = service['ssoCanBeUsed'](
        enableSsoMock,
        hasAuthorizedAcrMock,
        hasSufficientAcrMock,
        hasSpIdentityMock,
      );
      // Then
      expect(result).toBe(false);
    });

    it('should return false if hasAuthorizedAcr is defined to false and others to true', () => {
      // Given
      const enableSsoMock = true;
      const hasAuthorizedAcrMock = false;
      const hasSufficientAcrMock = true;
      const hasSpIdentityMock = true;
      // When
      const result = service['ssoCanBeUsed'](
        enableSsoMock,
        hasAuthorizedAcrMock,
        hasSufficientAcrMock,
        hasSpIdentityMock,
      );
      // Then
      expect(result).toBe(false);
    });

    it('should return false if hasSufficientAcr is defined to false and others to true', () => {
      // Given
      const enableSsoMock = true;
      const hasAuthorizedAcrMock = true;
      const hasSufficientAcrMock = false;
      const hasSpIdentityMock = true;
      // When
      const result = service['ssoCanBeUsed'](
        enableSsoMock,
        hasAuthorizedAcrMock,
        hasSufficientAcrMock,
        hasSpIdentityMock,
      );
      // Then
      expect(result).toBe(false);
    });

    it('should return false if hasSpIdentity is defined to false and others to true', () => {
      // Given
      const enableSsoMock = true;
      const hasAuthorizedAcrMock = true;
      const hasSufficientAcrMock = true;
      const hasSpIdentityMock = false;
      // When
      const result = service['ssoCanBeUsed'](
        enableSsoMock,
        hasAuthorizedAcrMock,
        hasSufficientAcrMock,
        hasSpIdentityMock,
      );
      // Then
      expect(result).toBe(false);
    });
  });
});
