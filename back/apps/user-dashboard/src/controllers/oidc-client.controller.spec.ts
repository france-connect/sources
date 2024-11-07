import { cloneDeep } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { PartialDeep } from '@fc/common';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { UserDashboardFrontRoutes } from '../enums';
import { UserDashboardTokenRevocationException } from '../exceptions';
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
  let res;
  let req;

  const oidcClientServiceMock = {
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    getEndSessionUrlFromProvider: jest.fn(),
    utils: {
      buildAuthorizeParameters: jest.fn(),
      getAuthorizeUrl: jest.fn(),
      revokeToken: jest.fn(),
      wellKnownKeys: jest.fn(),
    },
  };

  const interactionIdMock = 'interactionIdMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdTokenMock = 'idpIdToken';
  const oidcErrorMock = {
    error: 'error',
    error_description: 'error_description',
  };

  const oidcSessionServiceMock = getSessionServiceMock();

  const appSessionServiceMock = getSessionServiceMock();

  const sessionServiceMock = getSessionServiceMock();

  const identityProviderServiceMock = {
    getById: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
  };

  const idpIdMock = 'idpIdMockValue';
  const configMock = {
    urlPrefix: '/api/v2',
    defaultAcrValue: 'eidas3',
    scope: 'openid',
    idpId: idpIdMock,
  };

  const configServiceMock = getConfigMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcClientController],
      providers: [
        OidcClientService,
        SessionService,
        TrackingService,
        ConfigService,
        IdentityProviderAdapterEnvService,
      ],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(IdentityProviderAdapterEnvService)
      .useValue(identityProviderServiceMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);

    configServiceMock.get.mockReturnValue(configMock);
    res = {
      redirect: jest.fn(),
    };

    req = {
      fc: {
        interactionId: interactionIdMock,
      },
    };

    const idpMock: PartialDeep<IdentityProviderMetadata> = {
      name: 'nameValue',
      title: 'titleValue',
      client: {
        post_logout_redirect_uris: ['any-post_logout_redirect_uris-mock'],
      },
    };

    identityProviderServiceMock.getById.mockReturnValue(idpMock);

    oidcSessionServiceMock.get.mockReturnValue({
      idpNonce: idpNonceMock,
      idpState: idpStateMock,
      idpId: idpIdMock,
      idpIdToken: idpIdTokenMock,
    });

    appSessionServiceMock.get.mockReturnValue(undefined);

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      acr_values: 'acrMock',
      nonce: idpNonceMock,
      providerUid: configMock.idpId,
      scope: 'scopeMock',
      state: idpStateMock,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    beforeEach(() => {
      controller['getIdpId'] = jest.fn().mockReturnValue(configMock.idpId);
    });

    it('should call oidc-client-service to retrieve authorize url', async () => {
      // setup
      const query = {};

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';
      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      const expectedGetAuthorizeCallParameter = {
        acr_values: 'eidas3',
        nonce: idpNonceMock,
        scope: 'openid',
        state: idpStateMock,
        prompt: 'login',
      };

      // action
      await controller.redirectToIdp(
        res,
        query,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        configMock.idpId,
        expectedGetAuthorizeCallParameter,
      );
    });

    it('should call res.redirect() with the authorizeUrl', async () => {
      // setup
      const query = {};

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';
      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(
        res,
        query,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });

    it('should store state and nonce in oidc session', async () => {
      // setup
      const query = {};

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';
      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(
        res,
        query,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(oidcSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcSessionServiceMock.set).toHaveBeenCalledWith({
        idpId: configMock.idpId,
        idpName: 'nameValue',
        idpLabel: 'titleValue',
        idpNonce: idpNonceMock,
        idpState: idpStateMock,
      });
    });

    it('should store redirectUrl in app session', async () => {
      // setup
      const query = {
        redirectUrl: '/route?query-param',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';
      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(
        res,
        query,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(appSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(appSessionServiceMock.set).toHaveBeenCalledWith({
        redirectUrl: '/route?query-param',
      });
    });
  });

  describe('getWellKnownKeys()', () => {
    it('should call oidc-client-service for wellKnownKeys', async () => {
      // When
      await controller.getWellKnownKeys();
      // Then
      expect(oidcClientServiceMock.utils.wellKnownKeys).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('logoutCallback()', () => {
    it('should redirect to the index page if no redirectUrl', async () => {
      // action
      await controller.logoutCallback(req, res, appSessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should redirect to the redirectUrl', async () => {
      // setup
      appSessionServiceMock.get
        .mockReset()
        .mockReturnValueOnce('/route?query-param');

      // action
      await controller.logoutCallback(req, res, appSessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/route?query-param');
    });
  });

  describe('getOidcCallback()', () => {
    const accessTokenMock = Symbol('accesToken');
    const acrMock = Symbol('acr');
    const identityMock = {
      given_name: 'given_name',
      sub: '1',
    };

    const tokenParamsMock = {
      nonce: idpNonceMock,
      state: idpStateMock,
    };

    const userInfoParamsMock = {
      accessToken: accessTokenMock,
      idpId: idpIdMock,
    };

    const identityExchangeMock = {
      idpAccessToken: accessTokenMock,
      idpAcr: acrMock,
      idpIdentity: identityMock,
    };

    beforeEach(() => {
      res = {
        redirect: jest.fn(),
      };

      oidcClientServiceMock.getTokenFromProvider.mockReturnValueOnce({
        accessToken: accessTokenMock,
        acr: acrMock,
      });
      oidcClientServiceMock.getUserInfosFromProvider.mockReturnValueOnce(
        identityMock,
      );

      controller['getRedirectUrl'] = jest
        .fn()
        .mockReturnValue(UserDashboardFrontRoutes.HISTORY);
    });

    it('should throw an error if the session is not found', async () => {
      // setup
      oidcSessionServiceMock.get.mockReset().mockReturnValueOnce(undefined);

      // action/assertion
      await expect(
        controller.getOidcCallback(
          req,
          res,
          oidcSessionServiceMock,
          appSessionServiceMock,
        ),
      ).rejects.toThrow(SessionNotFoundException);
    });

    it('should call token with providerId', async () => {
      // action
      await controller.getOidcCallback(
        req,
        res,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(oidcClientServiceMock.getTokenFromProvider).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.getTokenFromProvider).toHaveBeenCalledWith(
        idpIdMock,
        tokenParamsMock,
        req,
      );
    });

    it('should call userinfo with acesstoken, dto and context', async () => {
      // arrange

      // action
      await controller.getOidcCallback(
        req,
        res,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledWith(userInfoParamsMock, req);
    });

    it('should create an object with cloned values', async () => {
      // Given
      const cloneDeepMock = jest.mocked(cloneDeep);

      // When
      await controller.getOidcCallback(
        req,
        res,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // Then
      expect(cloneDeepMock).toHaveBeenCalledTimes(1);
      expect(cloneDeepMock).toHaveBeenLastCalledWith(identityExchangeMock);
    });

    it('should set session with identity result.', async () => {
      // setup
      const clonedIdentityMock = Symbol();
      jest.mocked(cloneDeep).mockReturnValueOnce(clonedIdentityMock);

      // action
      await controller.getOidcCallback(
        req,
        res,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(oidcSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(oidcSessionServiceMock.set).toHaveBeenCalledWith(
        clonedIdentityMock,
      );
    });

    it('should redirect user to redirectUrl', async () => {
      // setup
      appSessionServiceMock.get
        .mockReset()
        .mockReturnValueOnce('/route?query-param');

      // action
      await controller.getOidcCallback(
        req,
        res,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/route?query-param');
    });

    it('should redirect user to history page if no redirectUrl', async () => {
      // action
      await controller.getOidcCallback(
        req,
        res,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/history');
    });
  });

  describe('logout()', () => {
    it('should redirect on the logout callback controller', async () => {
      // given
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockReturnValueOnce(
        '/logout-callback',
      );
      // action
      await controller.logout(res, oidcSessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/logout-callback');
    });

    it('should call res.redirect with "/" if session is undefined', async () => {
      // given
      const resMock = {
        redirect: jest.fn(),
      };

      const redirectUrl = '/';

      oidcSessionServiceMock.get.mockResolvedValue(undefined);

      await controller.logout(resMock, oidcSessionServiceMock);

      // assert
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(redirectUrl);
    });

    it('should call res.redirect with "/" if idpIdToken is not defined', async () => {
      // given
      const resMock = {
        redirect: jest.fn(),
      };
      const redirectUrl = '/';

      oidcSessionServiceMock.get.mockResolvedValue({
        idpState: 'idpState',
        idpId: 'idpId',
      });

      // action
      await controller.logout(resMock, oidcSessionServiceMock);

      // assert
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(redirectUrl);
    });
  });

  describe('revocationToken()', () => {
    it('should display success page when token is revoked', async () => {
      // setup
      const providerUid = 'core-fcp-high';
      const body = { accessToken: 'access_token' };
      // action
      const result = await controller.revocationToken(res, body);

      // assert
      expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledTimes(1);
      expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledWith(
        body.accessToken,
        providerUid,
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        titleFront: 'Mock Service Provider - Token révoqué',
      });
    });

    it('should redirect to the error page if revokeToken throw an error', async () => {
      // setup
      oidcClientServiceMock.utils.revokeToken.mockRejectedValue(oidcErrorMock);
      const body = { accessToken: 'access_token' };

      // action
      await controller.revocationToken(res, body);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        '/error?error=error&error_description=error_description',
      );
    });

    it('Should throw mock service provider revoke token exception if error is not an instance of OPError', async () => {
      // setup
      const unknowError = { foo: 'bar' };
      const body = { accessToken: 'access_token' };
      oidcClientServiceMock.utils.revokeToken.mockRejectedValue(unknowError);

      // assert
      await expect(controller.revocationToken(res, body)).rejects.toThrow(
        UserDashboardTokenRevocationException,
      );
    });
  });

  describe('getIdpId()', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        idpId: idpIdMock,
      });
    });

    it('should get the idpId from the config', () => {
      // When
      controller['getIdpId']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should return the idpId from the config', () => {
      // When
      const result = controller['getIdpId']();

      // Then
      expect(result).toBe(idpIdMock);
    });
  });
});
