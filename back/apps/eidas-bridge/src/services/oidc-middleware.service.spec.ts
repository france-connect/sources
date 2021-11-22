import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';

import { OidcMiddlewareService } from './oidc-middleware.service';

describe('MockIdentityProviderFcaService', () => {
  let service: OidcMiddlewareService;

  const loggerMock = {
    debug: jest.fn(),
    fatal: jest.fn(),
    setContext: jest.fn(),
  };

  const sessionServiceMock = {
    set: {
      bind: jest.fn(),
    },
    setAlias: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        OidcProviderService,
        OidcMiddlewareService,
        ServiceProviderAdapterEnvService,
        SessionService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(ServiceProviderAdapterEnvService)
      .useValue(serviceProviderEnvServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<OidcMiddlewareService>(OidcMiddlewareService);

    jest.resetAllMocks();
  });

  describe('onModuleInit()', () => {
    it('should call loadDatabase', () => {
      // When
      service.onModuleInit();
      // Then
      expect(oidcProviderServiceMock.registerMiddleware).toHaveBeenCalledTimes(
        1,
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

    it('should abort middleware execution if request if flagged as erroring', () => {
      // Given
      const ctxMock = getCtxMock(true);
      service['getInteractionIdFromCtx'] = jest.fn();

      // When
      service['authorizationMiddleware'](ctxMock);

      // Then
      expect(service['getInteractionIdFromCtx']).toHaveBeenCalledTimes(0);
      expect(serviceProviderEnvServiceMock.getById).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.set.bind).toHaveBeenCalledTimes(0);
    });

    it('should call session.setAlias()', async () => {
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

      // When
      await service['authorizationMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.setAlias).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.setAlias).toHaveBeenCalledWith(
        sessionIdValueMock,
        interactionIdValueMock,
      );
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
});
