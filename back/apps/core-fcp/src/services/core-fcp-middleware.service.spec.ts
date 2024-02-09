import { ValidationError } from 'class-validator';
import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CORE_SERVICE } from '@fc/core';
import { FlowStepsService } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger';
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

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  GetAuthorizeOidcClientSsoSession,
  GetAuthorizeSessionDto,
} from '../dto';
import { CoreFcpMiddlewareService } from './core-fcp-middleware.service';

jest.mock('uuid');
jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
  stringToArray: jest.fn(),
}));

describe('CoreFcpMiddlewareService', () => {
  let service: CoreFcpMiddlewareService;

  const uuidMock = jest.mocked(uuid);

  const loggerServiceMock = getLoggerMock();

  const oidcProviderServiceMock = {
    registerMiddleware: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

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
  const browsingSessionId = 'browsingSessionId';
  const spNameMock = 'my SP';
  const spAcrMock = 'eidas3';
  const spIdMock = 'spIdValue';
  const spScopeMock = ['openid', 'givenName', 'gender'];
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
  const coreFcpServiceMock = {};

  const FlowStepsServiceMock = {};
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
        {
          provide: CORE_SERVICE,
          useValue: coreFcpServiceMock,
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
      .useValue(FlowStepsServiceMock)
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
      expect(service['registerMiddleware']).toHaveBeenCalledTimes(8);
    });

    it('should register 8 events', () => {
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
          params: {
            // oidc param
            // eslint-disable-next-line @typescript-eslint/naming-convention
            acr_values: spAcrMock,
            // oidc param
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: spIdMock,
            scope: 'openid givenName gender',
          },
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
      browsingSessionId,
      spAcr: spAcrMock,
      spId: spIdMock,
      spName: spNameMock,
      spScope: spScopeMock,
    };

    const getBoundSessionMock = jest.spyOn(SessionService, 'getBoundSession');

    beforeEach(() => {
      jest.resetAllMocks();

      getBoundSessionMock.mockReturnValue(
        sessionServiceMock as unknown as ISessionService<unknown>,
      );

      service['isSsoAvailable'] = jest.fn();
      service['checkRedirectToSso'] = jest.fn();
      service['buildSessionWithNewInteraction'] = jest.fn();
      service['trackAuthorize'] = jest.fn();
      service['renewSession'] = jest.fn();
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

    it('should call renewSession()', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(service['renewSession']).toHaveBeenCalledTimes(1);
      expect(service['renewSession']).toHaveBeenCalledWith(ctxMock, spAcrMock);
    });

    it('should get three bound session services', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledTimes(3);
    });

    it('should get bound AppSession service', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledWith(
        ctxMock.req,
        'App',
      );
    });

    it('should get bound OidcClientSession service', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledWith(
        ctxMock.req,
        'OidcClient',
      );
    });

    it('should get bound CoreSessionDto service when sso is enabled and in a sso context', async () => {
      // Given
      const ctxMock = getCtxMock();
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledWith(
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

    it('should call session.commit() one time', async () => {
      // Given
      const ctxMock = getCtxMock();

      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockReturnValueOnce(sessionPropertiesMock);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);

      // When
      await service['afterAuthorizeMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.commit).toHaveBeenCalledTimes(1);
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
      service['getBrowsingSessionId'] = jest
        .fn()
        .mockReturnValueOnce(browsingSessionId);

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
      service['getBrowsingSessionId'] = jest
        .fn()
        .mockResolvedValueOnce(browsingSessionId);
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
        browsingSessionId,
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
        spScope: ['openid', 'givenName', 'gender'],
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
        ctxMock.oidc.params.acr_values,
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

    it('should be isSso = true when isSsoAvailable = true', async () => {
      // Given
      const ctxMock = getCtxMock();
      const isSsoMock = true;
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

  describe('isFinishedInteractionSession', () => {
    // Given
    const ctxMock = {
      oidc: {},
      req: reqMock,
      res: resMock,
    } as unknown as OidcCtx;

    const validateDtoMock = jest.mocked(validateDto);
    const validationWithErrorsMock = [
      Symbol('error'),
    ] as unknown as ValidationError[];

    const validationWithoutErrorsMock = [
      Symbol('error'),
    ] as unknown as ValidationError[];
    beforeEach(() => {
      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValue(sessionServiceMock);

      validateDtoMock.mockResolvedValueOnce(validationWithoutErrorsMock);
    });

    it('should call session.get() with the sessionService', async () => {
      // When
      await service['isFinishedInteractionSession'](ctxMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call validateDto() with the data from session', async () => {
      // Given
      const sessionDataMock = Symbol('sessionData');
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
      // When
      await service['isFinishedInteractionSession'](ctxMock);
      // Then
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        sessionDataMock,
        GetAuthorizeOidcClientSsoSession,
        { forbidNonWhitelisted: true },
      );
    });

    it('should return false if there are validation errors', async () => {
      // Given
      validateDtoMock
        .mockReset()
        .mockResolvedValueOnce(validationWithErrorsMock);

      // When
      const result = await service['isFinishedInteractionSession'](ctxMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return false there is no session', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(undefined);
      // When
      const result = await service['isFinishedInteractionSession'](ctxMock);
      // Then
      expect(result).toBe(false);
    });

    it('should not try to validate if there is no session', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(undefined);
      // When
      await service['isFinishedInteractionSession'](ctxMock);
      // Then
      expect(validateDtoMock).not.toHaveBeenCalled();
    });

    it('should return true if there are no validation errors', async () => {
      // Given
      const sessionDataMock = Symbol('sessionData');
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
      const validationErrorsMock = [] as unknown as ValidationError[];
      validateDtoMock.mockReset().mockResolvedValueOnce(validationErrorsMock);
      // When
      const result = await service['isFinishedInteractionSession'](ctxMock);
      // Then
      expect(result).toBe(true);
    });
  });

  describe('renewSession', () => {
    // Given
    const ctxMock = {
      oidc: {
        // OIDC defined variable names
        // eslint-disable-next-line @typescript-eslint/naming-convention
        params: { acr_values: spAcrMock, client_id: spIdMock },
      },
      req: reqMock,
      res: resMock,
    } as unknown as OidcCtx;

    beforeEach(() => {
      SessionService.getBoundSession = jest
        .fn()
        .mockReturnValue(sessionServiceMock);
      service['isFinishedInteractionSession'] = jest.fn().mockReturnValue(true);

      configServiceMock.get.mockReturnValueOnce({
        enableSso: true,
        allowedSsoAcrs: ['eidas3'],
      });
    });

    it('should call session.reset() if sso is disabled', async () => {
      // Given
      configServiceMock.get.mockReset().mockReturnValueOnce({
        enableSso: false,
        allowedSsoAcrs: ['eidas3'],
      });
      // When
      await service['renewSession'](ctxMock, spAcrMock);
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should call session.reset() if acr is authorized for sso', async () => {
      // Given
      configServiceMock.get.mockReset().mockReturnValueOnce({
        enableSso: true,
        allowedSsoAcrs: ['eidas2'],
      });
      // When
      await service['renewSession'](ctxMock, spAcrMock);
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should check if session is SSO compliant with isFinishedInteractionSession()', async () => {
      // When
      await service['renewSession'](ctxMock, spAcrMock);
      // Then
      expect(service['isFinishedInteractionSession']).toHaveBeenCalledTimes(1);
      expect(service['isFinishedInteractionSession']).toHaveBeenCalledWith(
        ctxMock,
      );
    });

    it('should call sessionService.duplicate if sso is enabled, spIdentity is present and sso authorized for acr', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(true);
      // When
      await service['renewSession'](ctxMock, spAcrMock);
      // Then
      expect(sessionServiceMock.duplicate).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.duplicate).toHaveBeenCalledWith(
        reqMock,
        resMock,
        GetAuthorizeSessionDto,
      );
    });
  });

  describe('getBrowsingSessionId', () => {
    it('should return browsingSessionId from session if it exists', async () => {
      // Given
      const sessionBrowsingSessionId = Symbol('sessionBrowsingSessionId');
      sessionServiceMock.get.mockResolvedValueOnce(sessionBrowsingSessionId);
      // When
      const result = await service['getBrowsingSessionId'](sessionServiceMock);
      // Then
      expect(result).toBe(sessionBrowsingSessionId);
    });

    it('should return new browsingSessionId from uuid execution if it does not exists in session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      const newBrowsingSessionId = Symbol('newBrowsingSessionId');
      uuidMock.mockReturnValueOnce(newBrowsingSessionId);
      // When
      const result = await service['getBrowsingSessionId'](sessionServiceMock);
      // Then
      expect(result).toBe(newBrowsingSessionId);
    });
  });
});
