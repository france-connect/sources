import { encode } from 'querystring';
import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { SessionNotFoundException, SessionService } from '@fc/session';

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

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const randomStringMock = 'randomStringMockValue';
  const interactionIdMock = 'interactionIdMockValue';
  const nonceMock = randomStringMock;
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMockValue';
  const idpIdTokenMock = 'idpIdTokenMockValue';
  const idpIdMock = 'idpIdMockValue';

  const sessionDataMock = {
    interactionId: interactionIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    idpIdToken: idpIdTokenMock,
    idpId: idpIdMock,
  };

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };
  const scopeMock = 'openid profile';
  const acrMock = 'acrMock';
  const claimsMock = 'claimsMock';

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

  const queryStringEncodeMock = mocked(encode);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockServiceProviderController],
      providers: [
        OidcClientService,
        LoggerService,
        SessionService,
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
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
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
      fc: {
        interactionId: interactionIdMock,
      },
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

    cryptographyMock.genRandomString.mockReturnValue(randomStringMock);
    configMock.get.mockReturnValue({
      scope: scopeMock,
      acr: acrMock,
      claims: claimsMock,
      urlPrefix: '/api/v2',
      defaultAcrValue: 'eidas2',
    });
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
    it('Should generate a random sessionId of 32 characters', async () => {
      // setup
      sessionServiceMock.set.mockResolvedValueOnce(undefined);

      // action
      const randSize = 32;
      await controller.index(sessionServiceMock);

      // assert
      expect(cryptographyMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyMock.genRandomString).toHaveBeenCalledWith(randSize);
    });

    it('Should init the session', async () => {
      // setup
      sessionServiceMock.set.mockResolvedValueOnce(undefined);

      // action
      await controller.index(sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        sessionId: randomStringMock,
        idpState: interactionParametersMock.params.state,
        idpNonce: interactionParametersMock.params.nonce,
      });
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
      await controller.getVerify(sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('Should return session data and hardcoded title', async () => {
      // When
      const result = await controller.getVerify(sessionServiceMock);
      // Then
      expect(result).toEqual({
        titleFront: 'Mock Service Provider - Login Callback',
        ...sessionDataMock,
      });
    });
  });

  describe('error', () => {
    it('Should return error', async () => {
      // setup
      const queryMock = {
        error: 'error',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Error description',
      };
      // action
      const result = await controller.error(queryMock);

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
    it('should display success page when token is revoked', async () => {
      // setup
      const providerUid = 'envIssuer';
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
      ).rejects.toThrow(MockServiceProviderTokenRevocationException);
    });
  });

  describe('retrieveUserinfo', () => {
    it('should retrieve and display userinfo on userinfo page', async () => {
      // setup
      const providerUid = 'envIssuer';
      const body = { accessToken: 'access_token' };
      oidcClientServiceMock.utils.getUserInfo.mockReturnValueOnce({
        sub: '1',
        // oidc spec defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        given_name: 'given_name',
      });
      // action
      const result = await controller.retrieveUserinfo(res, body);

      // assert
      expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledTimes(1);
      expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledWith(
        body.accessToken,
        providerUid,
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        titleFront: 'Mock Service Provider - Userinfo',
        idpIdentity: {
          sub: '1',
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: 'given_name',
        },
      });
    });

    it('should redirect to the error page if getUserInfo throw an error', async () => {
      // setup
      const body = { accessToken: 'access_token' };
      oidcClientServiceMock.utils.getUserInfo.mockRejectedValue(oidcErrorMock);

      // action
      await controller.retrieveUserinfo(res, body);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        '/error?error=error&error_description=error_description',
      );
    });

    it('Should throw mock service provider userinfo exception if error is not an instance of OPError', () => {
      // setup
      oidcClientServiceMock.utils.getUserInfo.mockRejectedValue({});
      const body = { accessToken: 'access_token' };

      // assert
      expect(
        async () => await controller.retrieveUserinfo(res, body),
      ).rejects.toThrow(MockServiceProviderUserinfoException);
    });
  });

  describe('logoutCallback', () => {
    it('should redirect on the home page', async () => {
      // action
      await controller.logoutCallback(res);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
    });
  });

  describe('getInteractionParameters', () => {
    const provider = identityProviderFull as IdentityProviderMetadata;
    const urlMock = 'https://somewhere.com/foo';

    beforeEach(() => {
      // Given
      oidcClientServiceMock.utils.getAuthorizeUrl.mockResolvedValue(urlMock);
    });

    it('should call config.get', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configMock.get).toBeCalledTimes(1);
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
        scope: scopeMock,
        idpId: 'providerUidMock',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acrMock',
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
          acr: 'acrMock',
          claims: 'claimsMock',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: idp.client.redirect_uris[0],
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
    const redirectMock = `/api/v2/interaction/${interactionIdMock}/verify`;

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
});
