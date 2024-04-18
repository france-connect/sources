import { Test, TestingModule } from '@nestjs/testing';

import { CoreMissingIdentityException } from '@fc/core';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  const sessionServiceMock = getSessionServiceMock();

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const sessionIdMock = 'session-id-mock';

  const reqMock = Symbol('req');

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
      providers: [OidcProviderService, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );
    oidcProviderServiceMock.finishInteraction.mockReturnValue(
      interactionFinishedValue,
    );
    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsResolved,
    );

    sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);
    sessionServiceMock.reset.mockResolvedValueOnce(sessionIdMock);
  });

  describe('getAuthorize()', () => {
    it('should call next', () => {
      // Given
      const nextMock = jest.fn();
      const queryMock = {} as AuthorizeParamsDto;
      // When
      oidcProviderController.getAuthorize(nextMock, queryMock);
      // Then
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('postAuthorize()', () => {
    it('should call next', () => {
      // Given
      const nextMock = jest.fn();
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      oidcProviderController.postAuthorize(nextMock, bodyMock);
      // Then
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('getLogin()', () => {
    it('should throw an exception if no identity in session', () => {
      // Given
      const next = jest.fn();
      sessionServiceMock.get.mockReturnValueOnce({
        csrfToken: randomStringMock,
        interactionId: interactionIdMock,
        spAcr: acrMock,
        spName: spNameMock,
      });
      // Then
      expect(() =>
        oidcProviderController.getLogin(reqMock, next, sessionServiceMock),
      ).toThrow(CoreMissingIdentityException);
    });

    it('should call next', () => {
      // Given
      const res = {};
      // When
      oidcProviderController.getLogin(reqMock, res, sessionServiceMock);
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

    it('should return result from controller.oidcProvider.finishInteraction()', () => {
      // Given
      const res = {};
      // When
      const result = oidcProviderController.getLogin(
        reqMock,
        res,
        sessionServiceMock,
      );
      // Then
      expect(result).toBe(interactionFinishedValue);
    });
  });
});
