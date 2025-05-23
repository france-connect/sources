import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc/tokens';
import { OidcProviderService } from '@fc/oidc-provider';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { LogoutParamsDto, RevocationTokenParamsDTO } from './dto';
import { OidcProviderRenderedJsonExceptionFilter } from './filters';
import { OidcProviderController } from './oidc-provider.controller';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';

const interactionIdMock = 'interactionIdMockValue';
const acrMock = 'acrMockValue';
const spNameMock = 'spNameValue';
const idpStateMock = 'idpStateMockValue';
const idpNonceMock = 'idpNonceMock';

const oidcSessionDataMock: OidcSession = {
  interactionId: interactionIdMock,
  spAcr: acrMock,
  spIdentity: {} as PartialExcept<IOidcIdentity, 'sub'>,
  spName: spNameMock,
  idpState: idpStateMock,
  idpNonce: idpNonceMock,
};

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  const reqMock = {};

  const loggerMock = getLoggerMock();

  const providerMock = {
    interactionDetails: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getProvider: () => providerMock,
    wellKnownKeys: jest.fn(),
    decodeAuthorizationHeader: jest.fn(),
  };

  const serviceProviderServiceMock = {
    isActive: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const oidcProviderConfigAppMock = {
    finishInteraction: jest.fn(),
  };

  const jsonExceptionFilterMock = {
    catch: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [
        OidcProviderService,
        {
          provide: SERVICE_PROVIDER_SERVICE_TOKEN,
          useValue: serviceProviderServiceMock,
        },
        {
          provide: OIDC_PROVIDER_CONFIG_APP_TOKEN,
          useValue: oidcProviderConfigAppMock,
        },
        LoggerService,
      ],
    })
      .overrideFilter(OidcProviderRenderedJsonExceptionFilter)
      .useValue(jsonExceptionFilterMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );

    serviceProviderServiceMock.isActive.mockResolvedValue(true);

    jest.resetAllMocks();
  });

  describe('getUserInfo()', () => {
    it('should call identity service', () => {
      // Given
      const next = jest.fn();

      // When
      oidcProviderController.getUserInfo(next, reqMock);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLogin()', () => {
    it('should call service.finishInteraction', async () => {
      // Given
      const req = {};
      const res = {};
      sessionServiceMock.get.mockReturnValueOnce(oidcSessionDataMock);
      // When
      await oidcProviderController.getLogin(req, res, sessionServiceMock);
      // Then
      expect(oidcProviderConfigAppMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderConfigAppMock.finishInteraction).toHaveBeenCalledWith(
        req,
        res,
        oidcSessionDataMock,
      );
    });
  });

  describe('postToken()', () => {
    it('should call next()', () => {
      // Given
      const next = jest.fn();
      // When
      oidcProviderController.postToken(next, reqMock);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEndSession()', () => {
    it('should call logout service', () => {
      // Given
      const next = jest.fn();
      const queryMock = {} as LogoutParamsDto;

      // When
      oidcProviderController.getEndSession(next, queryMock);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('revokeToken()', () => {
    it('should call next()', () => {
      // Given
      const next = jest.fn();
      const bodyMock = {} as RevocationTokenParamsDTO;
      // When
      oidcProviderController.revokeToken(next, bodyMock);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJwks()', () => {
    it('should call next()', () => {
      // Given
      const next = jest.fn();
      // When
      oidcProviderController.getJwks(next);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOpenidConfiguration()', () => {
    it('should call next()', () => {
      // Given
      const next = jest.fn();
      // When
      oidcProviderController.getOpenidConfiguration(next);
      // Then
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
