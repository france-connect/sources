import { encode } from 'querystring';
import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerService } from '@fc/logger';
import { OidcClientService } from '@fc/oidc-client';
import {
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { UserDashboardFrontRoutes } from '../enums';
import { UserDashboardTokenRevocationException } from '../exceptions';
import { OidcClientController } from './oidc-client.controller';

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
    utils: {
      buildAuthorizeParameters: jest.fn(),
      checkCsrfTokenValidity: jest.fn(),
      getAuthorizeUrl: jest.fn(),
      revokeToken: jest.fn(),
      wellKnownKeys: jest.fn(),
    },
  };

  const interactionIdMock = 'interactionIdMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const oidcErrorMock = {
    error: 'error',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    error_description: 'error_description',
  };

  const loggerServiceMock = {
    businessEvent: jest.fn(),
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
    verbose: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const sessionCsrfServiceMock = {
    get: jest.fn(),
    save: jest.fn(),
    validate: jest.fn(),
  };

  const identityProviderServiceMock = {
    getById: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
  };

  const appConfigMock = {
    urlPrefix: '/api/v2',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const providerIdMock = 'providerIdMockValue';
  const idpIdMock = 'idpIdMockValue';
  const queryStringEncodeMock = mocked(encode);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcClientController],
      providers: [
        OidcClientService,
        LoggerService,
        SessionService,
        SessionCsrfService,
        TrackingService,
        ConfigService,
        IdentityProviderAdapterEnvService,
      ],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionCsrfService)
      .useValue(sessionCsrfServiceMock)
      .overrideProvider(IdentityProviderAdapterEnvService)
      .useValue(identityProviderServiceMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);

    configServiceMock.get.mockReturnValue(appConfigMock);
    res = {
      redirect: jest.fn(),
    };

    req = {
      fc: {
        interactionId: interactionIdMock,
      },
    };

    identityProviderServiceMock.getById.mockReturnValue({ name: 'foo' });
    sessionServiceMock.get.mockResolvedValue({
      idpNonce: idpNonceMock,
      idpState: idpStateMock,
      idpId: idpIdMock,
    });

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
      nonce: idpNonceMock,
      providerUid: providerIdMock,
      scope: 'scopeMock',
      state: idpStateMock,
    });

    configServiceMock.get.mockReturnValue(appConfigMock);
    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    it('should call oidc-client-service to retrieve authorize url', async () => {
      // setup
      const body = {
        csrfToken: 'csrfMockValue',
      };

      configServiceMock.get.mockReturnValueOnce({
        acr: 'eidas3',
        scope: 'openid',
      });

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      const expectedGetAuthorizeCallParameter = {
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        nonce: idpNonceMock,
        idpId: 'envIssuer',
        scope: 'openid',
        state: idpStateMock,
      };

      // action
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // assert
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        expectedGetAuthorizeCallParameter,
      );
    });

    it('should call res.redirect() with the authorizeUrl', async () => {
      // setup
      const body = {
        csrfToken: 'csrfMockValue',
      };

      configServiceMock.get.mockReturnValueOnce({
        acr: 'eidas3',
        scope: 'openid',
      });

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });

    it('should store state and nonce in session', async () => {
      // setup
      const body = {
        csrfToken: 'csrfMockValue',
      };

      configServiceMock.get.mockResolvedValue({
        acr: 'eidas3',
        scope: 'openid',
      });

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        idpId: 'envIssuer',
        idpName: 'foo',
        idpNonce: idpNonceMock,
        idpState: idpStateMock,
      });
    });

    it('should resolve even if no spId are fetchable', async () => {
      // setup
      const body = {
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
        nonce: idpNonceMock,
        providerUid: providerIdMock,
        scope: 'openid',
      };
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw new Error();
      });

      // action
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the two CSRF tokens (provided in request and previously stored in session) are not the same.', async () => {
      // setup
      const body = {
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
        nonce: idpNonceMock,
        providerUid: providerIdMock,
        scope: 'openid',
      };
      sessionServiceMock.get.mockReturnValueOnce('spId');
      sessionCsrfServiceMock.validate.mockReset().mockImplementation(() => {
        throw new Error(
          'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
        );
      });
      // action / assert
      await expect(
        controller.redirectToIdp(res, body, sessionServiceMock),
      ).rejects.toThrow(SessionInvalidCsrfSelectIdpException);
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
    it('should redirect on the home page', async () => {
      // action
      await controller.logoutCallback(res);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('getLegacyOidcCallback', () => {
    it('should extract urlPrefix from app config', async () => {
      // When
      await controller.getLegacyOidcCallback(req.query, req.params);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should build redirect url with encode from querystring', async () => {
      // When
      await controller.getLegacyOidcCallback(req.query, req.params);
      // Then
      expect(queryStringEncodeMock).toHaveBeenCalledTimes(1);
      expect(queryStringEncodeMock).toHaveBeenCalledWith(req.query);
    });

    it('should redrect to the built oidc callback url', async () => {
      // Given
      const queryMock = 'first-query-param=first&second-query-param=second';
      queryStringEncodeMock.mockReturnValueOnce(queryMock);
      const redirectOidcCallbackUrl = `${appConfigMock.urlPrefix}/oidc-callback?${queryMock}`;
      // When
      const result = await controller.getLegacyOidcCallback(
        req.query,
        req.params,
      );
      // Then
      expect(result).toEqual({
        statusCode: 302,
        url: redirectOidcCallbackUrl,
      });
    });
  });

  describe('getOidcCallback()', () => {
    const accessTokenMock = Symbol('accesToken');
    const acrMock = Symbol('acr');
    const identityMock = {
      // oidc spec defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
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

    const redirectMock = UserDashboardFrontRoutes.MES_TRACES;

    beforeEach(() => {
      res = {
        redirect: jest.fn(),
      };

      oidcClientServiceMock.getTokenFromProvider.mockReturnValueOnce({
        // oidc spec defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        accessToken: accessTokenMock,
        // oidc spec defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr: acrMock,
      });
      oidcClientServiceMock.getUserInfosFromProvider.mockReturnValueOnce(
        identityMock,
      );
    });

    it('should throw an error if the session is not found', async () => {
      // setup
      sessionServiceMock.get.mockReset().mockResolvedValueOnce(undefined);

      // action/assertion
      await expect(
        controller.getOidcCallback(req, res, sessionServiceMock),
      ).rejects.toThrow(SessionNotFoundException);
    });

    it('should call token with providerId', async () => {
      // action
      await controller.getOidcCallback(req, res, sessionServiceMock);

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
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // assert
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledWith(userInfoParamsMock, req);
    });

    it('should set session with identity result.', async () => {
      // action
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(identityExchangeMock);
    });

    it('should redirect user after token and userinfo received and saved', async () => {
      // action
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(redirectMock);
    });
  });

  describe('logout()', () => {
    it('should redirect on the logout callback controller', async () => {
      // action
      await controller.logout(res);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/logout-callback');
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

    it('Should throw mock service provider revoke token exception if error is not an instance of OPError', () => {
      // setup
      const unknowError = { foo: 'bar' };
      const body = { accessToken: 'access_token' };
      oidcClientServiceMock.utils.revokeToken.mockRejectedValue(unknowError);

      // assert
      expect(
        async () => await controller.revocationToken(res, body),
      ).rejects.toThrow(UserDashboardTokenRevocationException);
    });
  });
});
