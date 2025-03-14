import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { PartnersFrontRoutes } from '../enums';
import { PartnersOidcClientService } from '../services';
import { OidcClientController } from './oidc-client.controller';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  cloneDeep: jest.fn(),
}));

jest.mock('querystring', () => ({
  encode: jest.fn(),
}));

describe('OidcClient Controller', () => {
  let controller: OidcClientController;
  const res = {
    redirect: jest.fn(),
  };

  const req = {};

  const oidcClientServiceMock = {
    getAuthorizeUrl: jest.fn(),
    getIdentityFromIdp: jest.fn(),
    retrieveOrCreateAccount: jest.fn(),
    getLogoutUrl: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();
  const identityMock = {};

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcClientController],
      providers: [PartnersOidcClientService, SessionService],
    })
      .overrideProvider(PartnersOidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    it('should redirect with the result or the oidcClient.getAuthorizeUrl()', async () => {
      // Given
      const authorizationUrl = 'http://authorization.url';
      oidcClientServiceMock.getAuthorizeUrl.mockResolvedValue(authorizationUrl);

      // When
      await controller.redirectToIdp(res as unknown as Response);

      // Then
      expect(res.redirect).toHaveBeenCalledExactlyOnceWith(authorizationUrl);
    });
  });

  describe('getOidcCallback()', () => {
    it('should retrieve or create account with identity fetched from idp', async () => {
      // Given
      oidcClientServiceMock.getIdentityFromIdp.mockResolvedValue(identityMock);

      // When
      await controller.getOidcCallback(
        req as unknown as Request,
        res as unknown as Response,
      );

      // Then
      expect(
        oidcClientServiceMock.retrieveOrCreateAccount,
      ).toHaveBeenCalledExactlyOnceWith(identityMock);
    });

    it('should redirect to the home page', async () => {
      // When
      await controller.getOidcCallback(
        req as unknown as Request,
        res as unknown as Response,
      );

      // Then
      expect(res.redirect).toHaveBeenCalledExactlyOnceWith(
        PartnersFrontRoutes.INDEX,
      );
    });
  });

  describe('logout()', () => {
    it('should redirect to the url returned by oidcClient.getLogoutUrl()', async () => {
      // Given
      const endSessionUrl = 'http://end.session.url';
      oidcClientServiceMock.getLogoutUrl.mockResolvedValue(endSessionUrl);

      // When
      await controller.logout(res as unknown as Response);

      // Then
      expect(res.redirect).toHaveBeenCalledExactlyOnceWith(endSessionUrl);
    });
  });

  describe('logoutCallback()', () => {
    it('should redirect on the home page', async () => {
      // When
      await controller.logoutCallback(res as unknown as Response);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(PartnersFrontRoutes.INDEX);
    });
  });
});
