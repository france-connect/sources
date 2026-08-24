import { Test, TestingModule } from '@nestjs/testing';

import { EudiPresentationId } from '@fc/eudi';
import {
  OidcCtx,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { Openid4vpService } from '@fc/openid4vp';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { OidcMiddlewareService } from './oidc-middleware.service';

const sessionServiceMock = getSessionServiceMock();

const oidcProviderServiceMock = {
  registerMiddleware: jest.fn(),
  clearCookies: jest.fn(),
};

const openid4vpServiceMock = {
  getRequestById: jest.fn(),
  createAuthorizationRequest: jest.fn(),
};

const interactionIdMock = 'interactionIdMock';

const reqMock = {
  headers: {
    cookie: 'cookieMock',
  },
};

const resMock = {
  redirect: jest.fn(),
};

const ctxMock = {
  req: reqMock,
  res: resMock,
  oidc: {
    entities: {
      Interaction: { uid: interactionIdMock },
    },
  },
} as unknown as OidcCtx;

describe('OidcMiddlewareService', () => {
  let service: OidcMiddlewareService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcMiddlewareService,
        OidcProviderService,
        SessionService,
        Openid4vpService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(Openid4vpService)
      .useValue(openid4vpServiceMock)
      .compile();

    service = module.get<OidcMiddlewareService>(OidcMiddlewareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap()', () => {
    it('should register the middlewares', () => {
      // When
      service.onApplicationBootstrap();

      // Then
      expect(
        oidcProviderServiceMock.registerMiddleware,
      ).toHaveBeenNthCalledWith(
        1,
        OidcProviderMiddlewareStep.BEFORE,
        OidcProviderRoutes.AUTHORIZATION,
        expect.any(Function),
      );

      expect(
        oidcProviderServiceMock.registerMiddleware,
      ).toHaveBeenNthCalledWith(
        2,
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.AUTHORIZATION,
        expect.any(Function),
      );
    });
  });

  describe('beforeAuthorizationMiddleware()', () => {
    it('should clear the cookies', () => {
      // When
      service['beforeAuthorizationMiddleware'](ctxMock);

      // Then
      expect(
        oidcProviderServiceMock.clearCookies,
      ).toHaveBeenCalledExactlyOnceWith(ctxMock.res);
    });

    it('should clear panva cookies', () => {
      // When
      service['beforeAuthorizationMiddleware'](ctxMock);

      // Then
      expect(ctxMock.req.headers.cookie).toBe('');
    });
  });

  describe('afterAuthorizationMiddleware()', () => {
    // Given
    const requestMock = {
      presentationId: 'presentationIdMock',
    };

    beforeEach(() => {
      openid4vpServiceMock.getRequestById.mockReturnValue(requestMock);
    });

    it('should fetch the request from the openid4vp service', async () => {
      // When
      await service['afterAuthorizationMiddleware'](ctxMock);

      // Then
      expect(
        openid4vpServiceMock.getRequestById,
      ).toHaveBeenCalledExactlyOnceWith(EudiPresentationId.PID_FC);
    });

    it('should create an authorization request with the interactionId and the request', async () => {
      // When
      await service['afterAuthorizationMiddleware'](ctxMock);

      // Then
      expect(
        openid4vpServiceMock.createAuthorizationRequest,
      ).toHaveBeenCalledExactlyOnceWith(interactionIdMock, requestMock);
    });
  });
});
