import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc/tokens';
import { OidcProviderService } from '@fc/oidc-provider';

import { RevocationTokenParamsDTO } from './dto';
import { OidcProviderController } from './oidc-provider.controller';

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

  const providerMock = {
    interactionDetails: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getProvider: () => providerMock,
    wellKnownKeys: jest.fn(),
    decodeAuthorizationHeader: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const serviceProviderServiceMock = {
    isActive: jest.fn(),
  };

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    verbose: jest.fn(),
    businessEvent: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [
        OidcProviderService,
        LoggerService,
        {
          provide: SERVICE_PROVIDER_SERVICE_TOKEN,
          useValue: serviceProviderServiceMock,
        },
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    oidcProviderController = await app.get<OidcProviderController>(
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
      oidcProviderController.getUserInfo(next);
      // Then
      expect(next).toBeCalledTimes(1);
    });
  });

  describe('getLogin()', () => {
    it('should call service.finishInteraction', async () => {
      // Given
      const req = {};
      const res = {};
      sessionServiceMock.get.mockResolvedValueOnce(oidcSessionDataMock);
      // When
      await oidcProviderController.getLogin(req, res, sessionServiceMock);
      // Then
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledWith(
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
      oidcProviderController.postToken(next);
      // Then
      expect(next).toBeCalledTimes(1);
    });
  });

  describe('setEndSession()', () => {
    it('should call logout service', () => {
      // Given
      const next = jest.fn();

      // When
      oidcProviderController.getEndSession(next);
      // Then
      expect(next).toBeCalledTimes(1);
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
      expect(next).toBeCalledTimes(1);
    });
  });
});
