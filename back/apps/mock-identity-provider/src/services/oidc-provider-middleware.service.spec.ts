import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import {
  OidcCtx,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { OidcProviderMiddlewareService } from './oidc-provider-middleware.service';
import { ScenariosService } from './scenarios.service';

describe('OidcProviderConfigAppService', () => {
  let service: OidcProviderMiddlewareService;

  const loggerMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

  const oidcProviderMock = {
    registerMiddleware: jest.fn(),
    getInteractionIdFromCtx: jest.fn(),
  };

  const scenariosMock = {
    alterServerResponse: jest.fn(),
  };

  const appSessionMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderMiddlewareService,
        LoggerService,
        OidcProviderService,
        ScenariosService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderMock)
      .overrideProvider(ScenariosService)
      .useValue(scenariosMock)
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
    } as unknown as OidcCtx;
    const userLoginMock = 'Malcolm';

    beforeEach(() => {
      service['bindSessionId'] = jest.fn();

      jest
        .spyOn(SessionService, 'getBoundedSession')
        .mockReturnValue(appSessionMock);

      appSessionMock.get.mockResolvedValue(userLoginMock);
    });

    it('should bind the session id to the given context', async () => {
      // When
      await service['userinfoMiddleware'](ctxMock);

      // Then
      expect(service['bindSessionId']).toHaveBeenCalledTimes(1);
      expect(service['bindSessionId']).toHaveBeenCalledWith(ctxMock);
    });

    it('should get the app session service', async () => {
      // When
      await service['userinfoMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundedSession).toHaveBeenCalledTimes(1);
      expect(SessionService.getBoundedSession).toHaveBeenCalledWith(
        ctxMock.req,
        'App',
      );
    });

    it('should retrieve the user login', async () => {
      // When
      await service['userinfoMiddleware'](ctxMock);

      // Then
      expect(appSessionMock.get).toHaveBeenCalledTimes(1);
      expect(appSessionMock.get).toHaveBeenCalledWith('userLogin');
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

    it('should return context object with sessionId from `req` if no oidc accountId', () => {
      // Given
      const ctxMock: OidcCtx = {
        req: {
          sessionId: 'sessionIdValue',
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
        sessionId: ctxMock.req.sessionId,
      });
    });

    it('should return context object with sessionId from `oidc` object', () => {
      // Given
      const ctxMock: OidcCtx = {
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
      } as OidcCtx;

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
      } as OidcCtx;

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

  describe('bindSessionId', () => {
    const ctxMock = {
      req: {},
    } as OidcCtx;

    beforeEach(() => {
      service['getEventContext'] = jest.fn().mockReturnValueOnce({});
    });

    it('should get the event context from the given context', () => {
      // When
      service['bindSessionId'](ctxMock);

      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(1);
      expect(service['getEventContext']).toHaveBeenCalledWith(ctxMock);
    });
  });
});
