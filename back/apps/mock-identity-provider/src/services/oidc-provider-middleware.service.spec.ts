import { Test, TestingModule } from '@nestjs/testing';

import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { OidcProviderMiddlewareService } from './oidc-provider-middleware.service';
import { ScenariosService } from './scenarios.service';

describe('OidcProviderMiddlewareService', () => {
  let service: OidcProviderMiddlewareService;

  const oidcProviderMock = {
    registerMiddleware: jest.fn(),
    getInteractionIdFromCtx: jest.fn(),
  };

  const scenariosMock = {
    alterServerResponse: jest.fn(),
  };
  const userLoginMock = 'Malcolm';

  const appSessionMock = getSessionServiceMock();
  const sessionDataMock = {
    App: {
      userLogin: userLoginMock,
    },
  };

  const sessionIdMock = 'sessionIdMockValue';

  const oidcErrorServiceMock = {
    throwError: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderMiddlewareService,
        OidcProviderService,
        ScenariosService,
        SessionService,
        OidcProviderErrorService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderMock)
      .overrideProvider(ScenariosService)
      .useValue(scenariosMock)
      .overrideProvider(SessionService)
      .useValue(appSessionMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(oidcErrorServiceMock)
      .compile();

    service = module.get<OidcProviderMiddlewareService>(
      OidcProviderMiddlewareService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      service['registerMiddleware'] = jest.fn();
    });

    it('should register two middleware', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service['registerMiddleware']).toHaveBeenCalledTimes(1);
    });

    it('should register a userinfo after middleware', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service['registerMiddleware']).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.USERINFO,
        service['userinfoMiddleware'],
      );
    });
  });

  describe('registerMiddleware', () => {
    it('should register the given middleware', () => {
      // Given
      const middleware = () => 'Malcolm';

      // When
      service['registerMiddleware'](
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.TOKEN,
        middleware,
      );

      // Then
      expect(oidcProviderMock.registerMiddleware).toHaveBeenCalledTimes(1);
      expect(oidcProviderMock.registerMiddleware).toHaveBeenCalledWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.TOKEN,
        expect.any(Function),
      );
    });
  });

  describe('userinfoMiddleware', () => {
    const ctxMock = {
      req: {
        ip: '192.168.1.42',
      },
      oidc: {
        entities: {
          Account: {
            accountId: sessionIdMock,
          },
        },
      },
    } as unknown as OidcCtx;

    beforeEach(() => {
      appSessionMock.getDataFromBackend.mockResolvedValue(sessionDataMock);
    });

    it('should call oidcErrorService.throwError() if session.getDataFromBackend() throws', async () => {
      // Given
      const errorMock = new Error('Session not found');
      appSessionMock.getDataFromBackend
        .mockReset()
        .mockRejectedValue(errorMock);

      // When
      await service['userinfoMiddleware'](ctxMock);

      expect(oidcErrorServiceMock.throwError).toHaveBeenCalledTimes(1);
      expect(oidcErrorServiceMock.throwError).toHaveBeenCalledWith(
        ctxMock,
        expect.any(SessionNotFoundException),
      );
    });

    it('should retrieve the user login', async () => {
      // When
      await service['userinfoMiddleware'](ctxMock);

      // Then
      expect(appSessionMock.getDataFromBackend).toHaveBeenCalledTimes(1);
      expect(appSessionMock.getDataFromBackend).toHaveBeenCalledWith(
        sessionIdMock,
      );
    });

    it('should alter the server response', async () => {
      // When
      await service['userinfoMiddleware'](ctxMock);

      // Then
      expect(scenariosMock.alterServerResponse).toHaveBeenCalledTimes(1);
      expect(scenariosMock.alterServerResponse).toHaveBeenCalledWith(
        userLoginMock,
        ctxMock,
      );
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
      oidcProviderMock.getInteractionIdFromCtx.mockReturnValueOnce(
        interactionIdMock,
      );
      service['getNetworkInfoFromHeaders'] = jest
        .fn()
        .mockReturnValueOnce(netWorkInfoMock);
    });

    it('should return context object with sessionId from `oidc` object', () => {
      // Given
      const ctxMock: OidcCtx = {
        req: {},
        oidc: {
          entities: {
            Account: {
              accountId: sessionIdMock,
            },
          },
        },
      } as OidcCtx;

      // When
      const result = service['getEventContext'](ctxMock);

      // Then
      expect(result).toEqual({
        fc: {
          interactionId: interactionIdMock,
        },
        req: ctxMock.req,
        sessionId: sessionIdMock,
      });
    });

    it('should return context object with sessionId from sessionService.getId()', () => {
      // Given
      const ctxMock: OidcCtx = {
        req: {},
      } as OidcCtx;

      const sessionServiceIdMock = 'sessionServiceIdMockValue';

      appSessionMock.getId.mockReturnValueOnce(sessionServiceIdMock);

      // When
      const result = service['getEventContext'](ctxMock);

      // Then
      expect(result).toEqual({
        fc: {
          interactionId: interactionIdMock,
        },
        req: ctxMock.req,
        sessionId: sessionServiceIdMock,
      });
    });
  });
});
