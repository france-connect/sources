import { encode } from 'querystring';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { SessionNotFoundException } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import {
  MockServiceProviderTokenRevocationException,
  MockServiceProviderUserinfoException,
} from '../exceptions';
import { MockServiceProviderController } from './mock-service-provider.controller';

jest.mock('querystring', () => ({
  encode: jest.fn(),
}));

describe('MockServiceProviderController', () => {
  let controller: MockServiceProviderController;
  let res;
  let req;
  let query;

  const oidcClientServiceMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
      getTokenSet: jest.fn(),
      getUserInfo: jest.fn(),
      wellKnownKeys: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      revokeToken: jest.fn(),
    },
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    getEndSessionUrlFromProvider: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const oidcErrorMock = {
    error: 'error',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    error_description: 'error_description',
  };

  const sessionServiceMock = getSessionServiceMock();

  const nonceMock = 'nonceMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMockValue';
  const idpIdentityMock = 'idpIdentityValue';
  const idpIdTokenMock = 'idpIdTokenMockValue';
  const idpIdMock = 'idpIdMockValue';

  const sessionDataMock = {
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    idpIdentity: idpIdentityMock,
    idpIdToken: idpIdTokenMock,
    idpId: idpIdMock,
  };

  const configMock = {
    get: jest.fn(),
  };
  const scopeMock = 'openid profile';
  const acrMock = 'acrMock';
  const claimsMock = 'claimsMock';

  const configMockValue = {
    scope: scopeMock,
    acr: acrMock,
    claims: claimsMock,
    urlPrefix: '/api/v2',
    defaultAcrValue: 'eidas2',
    redirectUri: ['redirect', 'uri'],
    idpId: 'providerUidMock',
  };

  const identityProviderMock = {
    getList: jest.fn(),
  };

  const identityProviderMinimum = {
    client: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uris: ['https://foo.bar.com/buz'],
      uid: 'providerUidMock',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'mock client_id',
    },
  };

  const identityProviderFull = {
    uid: 'providerUidMock',
    title: 'envIssuer Title',
    name: 'envIssuer',
    display: true,
    active: true,
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    discovery: true,
    discoveryUrl:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
    issuer: {
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      jwks_uri: 'https://fsp1v2.docker.dev-franceconnect.fr/jwks_uri',
    },
    client: {
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'mock client_id',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_signed_response_alg: 'ES256',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      post_logout_redirect_uris: [
        'https://fsp1v2.docker.dev-franceconnect.fr/logout-callback',
      ],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uris: ['https://foo.bar.com/buz'],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_types: ['code'],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_endpoint_auth_method: 'client_secret_post',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      revocation_endpoint_auth_method: 'client_secret_post',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_alg: 'RSA-OAEP',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_enc: 'A256GCM',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_alg: 'RSA-OAEP',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_enc: 'A256GCM',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_signed_response_alg: 'ES256',
    },
  };

  const identityProviderList = [identityProviderMinimum, identityProviderFull];

  const interactionParametersMock = {
    authorizationUrl: 'authorizationUrl',
    params: {
      state: 'stateMock',
      nonce: 'nonceMock',
    },
  };

  const queryStringEncodeMock = jest.mocked(encode);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockServiceProviderController],
      providers: [
        OidcClientService,
        LoggerService,
        CryptographyService,
        ConfigService,
        IdentityProviderAdapterEnvService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(IdentityProviderAdapterEnvService)
      .useValue(identityProviderMock)
      .compile();

    controller = module.get<MockServiceProviderController>(
      MockServiceProviderController,
    );

    res = {
      redirect: jest.fn(),
    };

    req = {
      query: {
        firstQueryParam: 'first',
        secondQueryParam: 'second',
      },
      params: {
        providerUid: 'secretProviderUid',
      },
    };

    query = {};

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      state: idpStateMock,
      nonce: nonceMock,
      providerUid: 'providerUidMock',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
      claims: 'claimsMock',
    });

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);

    configMock.get.mockReturnValue(configMockValue);
    identityProviderMock.getList.mockResolvedValue(identityProviderList);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    beforeEach(() => {
      controller['getInteractionParameters'] = jest
        .fn()
        .mockResolvedValue(interactionParametersMock);
    });

    it("Should throw if the session can't be initialized", async () => {
      // setup
      sessionServiceMock.set.mockRejectedValueOnce(new Error('test'));

      // expect
      await expect(controller.index(sessionServiceMock)).rejects.toThrow();
    });

    it('Should return front title', async () => {
      // setup
      sessionServiceMock.set.mockResolvedValueOnce(undefined);
      // action
      const result = await controller.index(sessionServiceMock);
      // assert
      expect(result).toEqual(
        expect.objectContaining({
          titleFront: 'Mock Service Provider',
        }),
      );
    });

    it('Should return default ACR value', async () => {
      // setup
      sessionServiceMock.set.mockResolvedValueOnce(undefined);
      // action
      const result = await controller.index(sessionServiceMock);
      // assert
      expect(result).toEqual(
        expect.objectContaining({
          defaultAcrValue: 'eidas2',
        }),
      );
    });
  });

  describe('verify', () => {
    it('Should call session.get', async () => {
      // When
      await controller.getVerify(res, sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('Should redirect to the home page if empty session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce({});
      // When
      await controller.getVerify(res, sessionServiceMock);
      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('Should return session data and hardcoded title', async () => {
      // When
      const result = await controller.getVerify(res, sessionServiceMock);
      // Then
      expect(result).toEqual({
        titleFront: 'Mock Service Provider - Login Callback',
        ...sessionDataMock,
      });
    });
  });

  describe('error', () => {
    it('Should return error', () => {
      // setup
      const queryMock = {
        error: 'error',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Error description',
      };
      // action
      const result = controller.error(queryMock);

      // assert
      expect(result).toEqual({
        titleFront: "Mock service provider - Erreur lors de l'authentification",
        error: 'error',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Error description',
      });
    });
  });

  describe('logout', () => {
    const postLogoutRedirectUriMock = 'https://postLogoutRedirectUriMock';
    const endSessionUrlMock = `https://endSessionUrlMockMock?id_token_hint=${idpIdTokenMock}&post_logout_redirect_uri=${postLogoutRedirectUriMock}&state=${idpStateMock}`;

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockResolvedValueOnce(
        endSessionUrlMock,
      );
    });

    it('should call session.get() to retrieves idp current cinematic informations', async () => {
      // action
      await controller.logout(
        res,
        sessionServiceMock,
        postLogoutRedirectUriMock,
      );

      // assert
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should call clientService.getEndSessionUrlFromProvider() to build the endSessionUrl', async () => {
      // action
      await controller.logout(
        res,
        sessionServiceMock,
        postLogoutRedirectUriMock,
      );

      // assert
      expect(
        oidcClientServiceMock.getEndSessionUrlFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getEndSessionUrlFromProvider,
      ).toHaveBeenCalledWith(
        idpIdMock,
        idpStateMock,
        idpIdTokenMock,
        postLogoutRedirectUriMock,
      );
    });

    it('should redirect on the logout callback controller', async () => {
      // action
      await controller.logout(
        res,
        sessionServiceMock,
        postLogoutRedirectUriMock,
      );

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(endSessionUrlMock);
    });
  });

  describe('revocationToken', () => {
    beforeEach(() => {
      controller['getIdpId'] = jest.fn().mockReturnValue(configMockValue.idpId);
    });

    it('should get the idpId from the app config', async () => {
      // Given
      const body = { accessToken: 'access_token' };

      // When
      await controller.revocationToken(res, body);

      // Then
      expect(controller['getIdpId']).toHaveBeenCalledTimes(1);
      expect(controller['getIdpId']).toHaveBeenCalledWith();
    });

    it('should display success page when token is revoked', async () => {
      // setup
      const body = { accessToken: 'access_token' };
      // action
      const result = await controller.revocationToken(res, body);

      // assert
      expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledTimes(1);
      expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledWith(
        body.accessToken,
        configMockValue.idpId,
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
        MockServiceProviderTokenRevocationException,
      );
    });
  });

  describe('retrieveUserinfo', () => {
    const idpIdTokenMock =
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikhlcm1hbiIsImZpcnN0X25hbWUiOiJTdMOpcGhhbmUiLCJpYXQiOjE1MTYyMzkwMjJ9.EWgP3XF8uccp5uokOJV9MFgOwGzcXOW1PlNnAoo1D1ScMB6rv352kFdWORzllA2oJqrpvlY4yI_NpyI5FDQzyQ';

    beforeEach(() => {
      sessionServiceMock.get.mockResolvedValueOnce(idpIdTokenMock);
    });

    it('should retrieve and display userinfo as well as cinematic information on userinfo page', async () => {
      // setup
      const body = { accessToken: 'access_token' };
      oidcClientServiceMock.utils.getUserInfo.mockReturnValueOnce({
        sub: '1',
        // oidc spec defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        given_name: 'given_name',
      });
      const expectedOutput = {
        accessToken: 'access_token',
        titleFront: 'Mock Service Provider - Userinfo',
        idpIdentity: {
          sub: '1',
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'given_name',
        },
        idpIdToken: idpIdTokenMock,
      };

      // action
      const result = await controller.retrieveUserinfo(
        res,
        body,
        sessionServiceMock,
      );

      // assert
      expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledTimes(1);
      expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledWith(
        body.accessToken,
        configMockValue.idpId,
      );
      expect(result).toEqual(expectedOutput);
    });

    it('should redirect to the error page if getUserInfo throw an error', async () => {
      // setup
      const body = { accessToken: 'access_token' };
      oidcClientServiceMock.utils.getUserInfo.mockRejectedValue(oidcErrorMock);

      // action
      await controller.retrieveUserinfo(res, body, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        '/error?error=error&error_description=error_description',
      );
    });

    it('Should throw mock service provider userinfo exception if error is not an instance of OPError', async () => {
      // setup
      oidcClientServiceMock.utils.getUserInfo.mockRejectedValue({});
      const body = { accessToken: 'access_token' };

      // assert
      await expect(
        controller.retrieveUserinfo(res, body, sessionServiceMock),
      ).rejects.toThrow(MockServiceProviderUserinfoException);
    });
  });

  describe('getInteractionParameters', () => {
    const provider = identityProviderFull as IdentityProviderMetadata;
    const urlMock = 'https://somewhere.com/foo';

    beforeEach(() => {
      // Given
      oidcClientServiceMock.utils.getAuthorizeUrl.mockResolvedValue(urlMock);
    });

    it('should call config.get twice', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configMock.get).toBeCalledTimes(2);
    });

    it('should get OidcAcr config', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configMock.get).toBeCalledWith('OidcAcr');
    });

    it('should get OidcClient config', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configMock.get).toBeCalledWith('OidcClient');
    });

    it('should call oidcClient.buildAuthorizeParameters', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toBeCalledTimes(1);
    });

    it('should call oidcClient.getAuthorizeUrl', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toBeCalledTimes(1);
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toBeCalledWith({
        state: idpStateMock,
        prompt: 'login consent',
        scope: scopeMock,
        idpId: 'providerUidMock',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas2',
        nonce: nonceMock,
        claims: 'claimsMock',
      });
    });

    it('should return object containing results from various calls', async () => {
      // Given
      const idp = identityProviderMinimum;
      // When
      const result = await controller['getInteractionParameters'](provider);
      // Then
      expect(result).toEqual({
        params: {
          state: idpStateMock,
          nonce: nonceMock,
          uid: 'providerUidMock',
          acr: 'eidas2',
          claims: 'claimsMock',
          prompt: ['login', 'consent'],
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: ['redirect', 'uri'],
          scope: scopeMock,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          authorization_endpoint: 'https://somewhere.com/foo',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: idp.client.client_id,
        },
        authorizationUrl: urlMock,
      });
    });
  });

  describe('getOidcCallback', () => {
    const accessTokenMock = Symbol('accesToken');
    const amrMock = Symbol('amr');
    const identityMock = {
      sub: '1',
      // oidc spec defined property
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'given_name',
    };
    const tokenParamsMock = {
      state: idpStateMock,
      nonce: idpNonceMock,
    };

    const userInfoParamsMock = {
      accessToken: accessTokenMock,
      idpId: idpIdMock,
    };

    const identityExchangeMock = {
      idpIdentity: identityMock,
      idpAcr: acrMock,
      amr: amrMock,
      idpAccessToken: accessTokenMock,
    };
    const redirectMock = `/api/v2/interaction/verify`;

    beforeEach(() => {
      oidcClientServiceMock.getTokenFromProvider.mockReturnValueOnce({
        // oidc spec defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        accessToken: accessTokenMock,
        // oidc spec defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr: acrMock,
        amr: amrMock,
      });

      oidcClientServiceMock.getUserInfosFromProvider.mockReturnValueOnce(
        identityMock,
      );
    });

    it('should call res.redirect with an error if the query contains an error', async () => {
      // setup
      const queryMock = {
        error: 'toto',
      };
      const errorQueryMock = 'error=toto';
      queryStringEncodeMock.mockReturnValueOnce(errorQueryMock);
      const expectedErrorUriMock = `/error?${errorQueryMock}`;

      // action
      await controller.getOidcCallback(req, res, queryMock, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(expectedErrorUriMock);
    });

    it('should call res.redirect with an error and error_description if the query contains an error and error_description', async () => {
      // setup
      const queryMock = {
        error: 'toto',
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'toto42',
      };
      const errorQueryMock = 'error=toto&error_description=toto42';
      queryStringEncodeMock.mockReturnValueOnce(errorQueryMock);
      const expectedErrorUriMock = `/error?${errorQueryMock}`;

      // action
      await controller.getOidcCallback(req, res, queryMock, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(expectedErrorUriMock);
    });

    it('should throw an error if the session is not found', async () => {
      // setup
      sessionServiceMock.get.mockReset().mockResolvedValueOnce(undefined);

      // action/assertion
      await expect(
        controller.getOidcCallback(req, res, query, sessionServiceMock),
      ).rejects.toThrow(SessionNotFoundException);
    });

    it('should not call getTokenFromProvider if the query contains an error', async () => {
      // setup
      const queryMock = {
        error: 'toto',
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'toto42',
      };

      // action
      await controller.getOidcCallback(req, res, queryMock, sessionServiceMock);

      // assert
      expect(oidcClientServiceMock.getTokenFromProvider).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should call token with providerId', async () => {
      // action
      await controller.getOidcCallback(req, res, query, sessionServiceMock);

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
      await controller.getOidcCallback(req, res, query, sessionServiceMock);

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
      await controller.getOidcCallback(req, res, query, sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(identityExchangeMock);
    });

    it('should redirect user after token and userinfo received and saved', async () => {
      // action
      await controller.getOidcCallback(req, res, query, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(redirectMock);
    });
  });

  describe('getIdpId()', () => {
    beforeEach(() => {
      configMock.get.mockReturnValueOnce({
        idpId: idpIdMock,
      });
    });

    it('should get the idpId from the config', () => {
      // When
      controller['getIdpId']();

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('App');
    });

    it('should return the idpId from the config', () => {
      // When
      const result = controller['getIdpId']();

      // Then
      expect(result).toBe(idpIdMock);
    });
  });
});
