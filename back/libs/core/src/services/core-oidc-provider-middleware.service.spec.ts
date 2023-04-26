import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcAcrService } from '@fc/oidc-acr';
import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreClaimAmrException } from '../exceptions';
import { pickAcr } from '../transforms';
import { CoreOidcProviderMiddlewareService } from './core-oidc-provider-middleware.service';

jest.mock('../transforms');

describe('CoreOidcProviderMiddlewareService', () => {
  let service: CoreOidcProviderMiddlewareService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

  const sessionServiceMock = {
    reset: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getInteractionIdFromCtx: jest.fn(),
    registerMiddleware: jest.fn(),
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
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const oidcAcrServiceMock = {
    getKnownAcrValues: jest.fn(),
  };

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

    service = module.get<CoreOidcProviderMiddlewareService>(
      CoreOidcProviderMiddlewareService,
    );
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
      service['trackAuthorize'](ctxMock);
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
    beforeEach(() => {
      service['bindSessionId'] = jest.fn();
    });
    it('should publish a token event', async () => {
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
      };

      service['getEventContext'] = jest
        .fn()
        .mockReturnValue(eventCtxMock as TrackedEventContextInterface);

      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        name: 'name',
      });
      // When
      service['tokenMiddleware'](ctxMock);
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
      const ctxMock: any = {
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
      const ctxMock: any = {
        not: 'altered',
        req: {
          headers: {
            'x-forwarded-for': '123.123.123.123',
            'x-forwarded-source-port': '443',
            'x-forwarded-for-original': '123.123.123.123,124.124.124.124',
          },
        },
      };

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
    it('should publish a token event', () => {
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
      service['userinfoMiddleware'](ctxMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(1);
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.SP_REQUESTED_FC_USERINFO,
        expect.any(Object),
      );
    });

    it('should call throwError if getEventContext fail', () => {
      // Given
      const ctxMock: any = {
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
      service['userinfoMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['oidcErrorService']['throwError']).toHaveBeenNthCalledWith(
        1,
        ctxMock,
        errorMock,
      );
    });

    it('should call throwError if tracking.track throw an error', () => {
      // Given
      const ctxMock: any = {
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
      service['userinfoMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['oidcErrorService']['throwError']).toHaveBeenNthCalledWith(
        1,
        ctxMock,
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
