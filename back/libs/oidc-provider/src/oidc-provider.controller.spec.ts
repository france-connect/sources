import { Request, Response } from 'express';

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

  const reqMock = {} as Request;
  const resMock = {} as Response;

  const loggerMock = getLoggerMock();

  const providerMock = {
    interactionDetails: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getProvider: () => providerMock,
    wellKnownKeys: jest.fn(),
    decodeAuthorizationHeader: jest.fn(),
    callback: jest.fn(),
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

  describe('getAuthorize', () => {
    it('should call oidcProvider.callback', async () => {
      // When
      await oidcProviderController.getAuthorize(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
      );
    });
  });

  describe('getUserInfo()', () => {
    it('should call identity service', async () => {
      // When
      await oidcProviderController.getUserInfo(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLogin()', () => {
    it('should call service.finishInteraction', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(oidcSessionDataMock);

      // When
      await oidcProviderController.getLogin(
        reqMock,
        resMock,
        sessionServiceMock,
      );

      // Then
      expect(oidcProviderConfigAppMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderConfigAppMock.finishInteraction).toHaveBeenCalledWith(
        reqMock,
        resMock,
        oidcSessionDataMock,
      );
    });
  });

  describe('postToken()', () => {
    it('should call next()', async () => {
      // When
      await oidcProviderController.postToken(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEndSession()', () => {
    it('should call logout service', async () => {
      // Given
      const queryMock = {} as LogoutParamsDto;

      // When
      await oidcProviderController.getEndSession(reqMock, resMock, queryMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('revokeToken()', () => {
    it('should call next()', async () => {
      // Given
      const bodyMock = {} as RevocationTokenParamsDTO;

      // When
      await oidcProviderController.revokeToken(reqMock, resMock, bodyMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEndSessionConfirmation', () => {
    it('should call oidcProvider.callback', async () => {
      // When
      await oidcProviderController.getEndSessionConfirmation(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
      );
    });
  });

  describe('getEndSessionSuccess', () => {
    it('should call oidcProvider.callback', async () => {
      // When
      await oidcProviderController.getEndSessionSuccess(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
      );
    });
  });

  describe('getJwks()', () => {
    it('should call next()', async () => {
      // When
      await oidcProviderController.getJwks(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOpenidConfiguration()', () => {
    it('should call next()', async () => {
      // When
      await oidcProviderController.getOpenidConfiguration(reqMock, resMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
    });
  });
});
