import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { getSessionServiceMock } from '@mocks/session';

import { PartnersFrontRoutes } from '../enums';
import { PartnersController } from './partners.controller';

describe('PartnersController', () => {
  let controller: PartnersController;

  const resMock = {
    json: jest.fn(),
    redirect: jest.fn(),
    status: jest.fn(),
    send: jest.fn(),
  };

  const sessionPartnersAccountMock = getSessionServiceMock();

  const redirectMock = PartnersFrontRoutes.INDEX;

  const userInfoMock = {
    identity: {
      email: 'email@email.fr',
      given_name: 'givenName',
      usual_name: 'usualName',
      siret: 'siret',
      sub: 'identityMock.sub value',
      id: 'id mock',
    },
    accessControl: [],
  };

  const response = {
    email: 'email@email.fr',
    given_name: 'givenName',
    usual_name: 'usualName',
    siret: 'siret',
    sub: 'identityMock.sub value',
    accountId: 'id mock',
    accessControl: [],
    id: undefined,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [PartnersController],
    }).compile();

    resMock.json.mockImplementationOnce((arg) => arg);

    controller = app.get<PartnersController>(PartnersController);

    sessionPartnersAccountMock.get.mockReturnValue(userInfoMock);

    resMock.json.mockImplementationOnce((arg) => arg);
    jest.mocked(resMock.status).mockReturnValue(resMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCsrfToken', () => {
    const csrfTokenMock = 'csrfTokenMock';

    it('should return csrfToken', () => {
      // When
      const result = controller.getCsrfToken(csrfTokenMock);

      // Then
      expect(result).toEqual({ csrfToken: csrfTokenMock });
    });
  });

  describe('getUserInfo', () => {
    it('should fetch idpIdentity in oidc session', async () => {
      // When
      await controller.getUserInfo(resMock, sessionPartnersAccountMock);

      // Then
      expect(sessionPartnersAccountMock.get).toHaveBeenCalledTimes(1);
    });

    it('should return a 401 if no session', async () => {
      // Given
      sessionPartnersAccountMock.get.mockReturnValueOnce(undefined);

      // When
      await controller.getUserInfo(resMock, sessionPartnersAccountMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith({ code: 'INVALID_SESSION' });
    });

    it('should return an object with lastname, firstname, email and siret used for the connection props', async () => {
      // When
      const result = await controller.getUserInfo(
        resMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(result).toStrictEqual(response);
    });
  });

  describe('getLogin', () => {
    it('should redirect to the homepage', () => {
      // When
      controller.getIndex(resMock);
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(redirectMock);
    });
  });
});
