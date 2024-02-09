import { ValidationError } from 'class-validator';
import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CORE_SERVICE } from '@fc/core';
import { FlowStepsService } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger';
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

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  GetAuthorizeOidcClientSsoSession,
  GetAuthorizeSessionDto,
} from '../dto';
import { CoreFcaMiddlewareService } from './core-fca-middleware.service';

jest.mock('uuid');
jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
}));

describe('CoreFcaMiddlewareService', () => {
  let service: CoreFcaMiddlewareService;

  const uuidMock = jest.mocked(uuid);

  const loggerServiceMock = getLoggerMock();

  const oidcProviderServiceMock = {
    registerMiddleware: jest.fn(),
    getInteractionIdFromCtx: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

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

  const coreFcaServiceMock = {};

  const FlowStepsServiceMock = {};

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
        {
          provide: CORE_SERVICE,
          useValue: coreFcaServiceMock,
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
      expect(service['registerMiddleware']).toHaveBeenCalledTimes(8);
    });

    it('should register 8 events', () => {
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

    const getBoundSessionMock = jest.spyOn(SessionService, 'getBoundSession');

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
      service['checkRedirectToSso'] = jest.fn();
      service['getEventContext'] = jest.fn();
      service['renewSession'] = jest.fn();
      getBoundSessionMock.mockReturnValue(
        sessionServiceMock as unknown as ISessionService<unknown>,
      );
    });

    it('should abort middleware execution if the request is flagged with an error', async () => {
      // Given
      const ctxMock = getCtxMock(true);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(service['getEventContext']).toHaveBeenCalledTimes(0);
      expect(configServiceMock.get).toHaveBeenCalledTimes(0);
      expect(getBoundSessionMock).toHaveBeenCalledTimes(0);
      expect(service['isSsoAvailable']).toHaveBeenCalledTimes(0);
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(0);
      expect(service['isSsoAvailable']).toHaveBeenCalledTimes(0);
      expect(service['trackAuthorize']).toHaveBeenCalledTimes(0);
      expect(service['checkRedirectToSso']).toHaveBeenCalledTimes(0);
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
      expect(service['renewSession']).toHaveBeenCalledWith(ctxMock);
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
        ctxMock.oidc.params.acr_values,
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

    it('should call `checkRedirectToSso()` with ctx with isSso = true', async () => {
      // Given
      const ctxMock = getCtxMock(false);
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
      expect(service['checkRedirectToSso']).toHaveBeenCalledTimes(1);
      expect(service['checkRedirectToSso']).toHaveBeenCalledWith(ctxMock);
    });

    it('should call `redirectToSso()` with params ctx with isSso = false', async () => {
      // Given
      const ctxMock = getCtxMock(false);
      const isSsoMock = false;
      service['isSsoAvailable'] = jest.fn().mockResolvedValueOnce(false);
      service['getEventContext'] = jest.fn().mockReturnValueOnce(eventCtxMock);
      service['buildSessionWithNewInteraction'] = jest
        .fn()
        .mockResolvedValue(sessionPropertiesMock);
      // When
      await service['afterAuthorizeMiddleware'](ctxMock);
      // Then
      expect(ctxMock.isSso).toBe(isSsoMock);
      expect(service['checkRedirectToSso']).toHaveBeenCalledTimes(1);
      expect(service['checkRedirectToSso']).toHaveBeenCalledWith(ctxMock);
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
  });

  describe('isSsoSession', () => {
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
      await service['isSsoSession'](ctxMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should skip DTO validation if sessionService returns undefined', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockResolvedValueOnce(undefined);

      // When
      await service['isSsoSession'](ctxMock);

      // Then
      expect(validateDtoMock).not.toHaveBeenCalled();
    });

    it('should return false if sessionService returns undefined', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockResolvedValueOnce(undefined);

      // When
      const result = await service['isSsoSession'](ctxMock);

      // Then
      expect(result).toBe(false);
    });

    it('should call validateDto() with the data from session', async () => {
      // Given
      const sessionDataMock = Symbol('sessionData');
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
      // When
      await service['isSsoSession'](ctxMock);
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
      const result = await service['isSsoSession'](ctxMock);
      // Then
      expect(result).toBe(false);
    });

    it('should return true if there are no validation errors', async () => {
      // Given
      const validationErrorsMock = [] as unknown as ValidationError[];
      validateDtoMock.mockReset().mockResolvedValueOnce(validationErrorsMock);
      // When
      const result = await service['isSsoSession'](ctxMock);
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
      service['isSsoSession'] = jest.fn().mockReturnValue(true);

      configServiceMock.get.mockReturnValueOnce({ enableSso: true });
    });

    it('should call session.reset() if no sso', async () => {
      // Given
      configServiceMock.get
        .mockReset()
        .mockReturnValueOnce({ enableSso: false });
      // When
      await service['renewSession'](ctxMock);
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(reqMock, resMock);
    });

    it('should check if session is SSO compliant with isSsoSession()', async () => {
      // When
      await service['renewSession'](ctxMock);
      // Then
      expect(service['isSsoSession']).toHaveBeenCalledTimes(1);
      expect(service['isSsoSession']).toHaveBeenCalledWith(ctxMock);
    });

    it('should call sessionService.duplicate if sso is enabled and spIdentity is present', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(true);
      // When
      await service['renewSession'](ctxMock);
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
