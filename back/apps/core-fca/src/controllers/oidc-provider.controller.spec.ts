import { Test, TestingModule } from '@nestjs/testing';

import { CoreMissingIdentityException } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceMock = {
    reset: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  };

  const oidcProviderServiceMock = {
    finishInteraction: jest.fn(),
    getInteraction: jest.fn(),
  };

  const sessionIdMock = 'session-id-mock';

  const reqMock = Symbol('req');
  const resMock = Symbol('res');

  const randomStringMock = 'randomStringMockValue';
  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const spIdMock = 'spIdMockValue';
  const spNameMock = 'some SP';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdMock = 'idpIdMockValue';
  const interactionFinishedValue = Symbol('interactionFinishedValue');

  const oidcClientSessionDataMock: OidcClientSession = {
    csrfToken: randomStringMock,
    spId: spIdMock,
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,
    spAcr: acrMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
  };

  const interactionDetailsResolved = {
    params: {
      scope: 'toto titi',
    },
    prompt: Symbol('prompt'),
    uid: Symbol('uid'),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [LoggerService, OidcProviderService, SessionService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .compile();

    oidcProviderController = await app.get<OidcProviderController>(
      OidcProviderController,
    );
    oidcProviderServiceMock.finishInteraction.mockReturnValue(
      interactionFinishedValue,
    );
    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsResolved,
    );

    sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);
    sessionServiceMock.reset.mockResolvedValueOnce(sessionIdMock);
  });

  describe('getAuthorize()', () => {
    it('should call next', async () => {
      // Given
      const nextMock = jest.fn();
      const queryMock = {} as AuthorizeParamsDto;
      // When
      await oidcProviderController.getAuthorize(
        reqMock,
        resMock,
        nextMock,
        queryMock,
      );
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('postAuthorize()', () => {
    it('should call next', async () => {
      // Given
      const nextMock = jest.fn();
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      await oidcProviderController.postAuthorize(
        reqMock,
        resMock,
        nextMock,
        bodyMock,
      );
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('getLogin()', () => {
    it('should throw an exception if no identity in session', async () => {
      // Given
      const next = jest.fn();
      sessionServiceMock.get.mockResolvedValue({
        csrfToken: randomStringMock,
        interactionId: interactionIdMock,
        spAcr: acrMock,
        spName: spNameMock,
      });
      // Then
      expect(
        oidcProviderController.getLogin(reqMock, next, sessionServiceMock),
      ).rejects.toThrow(CoreMissingIdentityException);
    });

    it('should call next', async () => {
      // Given
      const res = {};
      // When
      await oidcProviderController.getLogin(reqMock, res, sessionServiceMock);
      // Then
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledWith(
        reqMock,
        res,
        oidcClientSessionDataMock,
      );
    });

    it('should return result from controller.oidcProvider.finishInteraction()', async () => {
      // Given
      const res = {};
      // When
      const result = await oidcProviderController.getLogin(
        reqMock,
        res,
        sessionServiceMock,
      );
      // Then
      expect(result).toBe(interactionFinishedValue);
    });
  });
});
