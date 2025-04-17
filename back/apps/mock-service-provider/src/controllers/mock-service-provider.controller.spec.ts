import { encode } from 'querystring';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { AppMode } from '../enums';
import {
  MockServiceProviderTokenRevocationException,
  MockServiceProviderUserinfoException,
} from '../exceptions';
import { AuthRedirectInterceptor } from '../interceptors';
import { MockServiceProviderService } from '../services';
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
      refreshTokens: jest.fn(),
    },
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    getEndSessionUrlFromProvider: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  const oidcErrorMock = {
    error: 'error',
    error_description: 'error_description',
  };

  const sessionServiceMock = getSessionServiceMock();
  const sessionOidcServiceMock = getSessionServiceMock();
  const sessionAppServiceMock = getSessionServiceMock();

  const nonceMock = 'nonceMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMockValue';
  const idpIdentityMock = 'idpIdentityValue';
  const idpIdTokenMock = 'idpIdTokenMockValue';
  const idpAccessTokenMock = 'idpAccessTokenValue';
  const idpRefreshTokenMock = 'idpRefreshTokenValue';
  const idpIdMock = 'idpIdMockValue';

  const sessionOidcDataMock = {
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    idpIdentity: idpIdentityMock,
    idpIdToken: idpIdTokenMock,
    idpAccessToken: idpAccessTokenMock,
    idpRefreshToken: idpRefreshTokenMock,
    idpId: idpIdMock,
  };

  const configServiceMock = {
    get: jest.fn(),
  };
  const scopeMock = 'openid profile';
  const acrMock = 'acrMock';
  const claimsMock = 'claimsMock';

  const configMock = {
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

  const mockServiceProviderServiceMock = {
    getData: jest.fn(),
  };

  const authRedirectInterceptorMock = {
    intercept: jest.fn(),
  };

  const identityProviderMinimum = {
    client: {
      redirect_uris: ['https://foo.bar.com/buz'],
      uid: 'providerUidMock',
      client_id: 'mock client_id',
    },
  };

  const identityProviderFull = {
    uid: 'providerUidMock',
    title: 'envIssuer Title',
    name: 'envIssuer',
    display: true,
    active: true,
    discovery: true,
    discoveryUrl:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
    issuer: {
      jwks_uri: 'https://fsp1v2.docker.dev-franceconnect.fr/jwks_uri',
    },
    client: {
      client_id: 'mock client_id',
      client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
      id_token_signed_response_alg: 'ES256',
      post_logout_redirect_uris: [
        'https://fsp1v2.docker.dev-franceconnect.fr/logout-callback',
      ],
      redirect_uris: ['https://foo.bar.com/buz'],
      response_types: ['code'],
      token_endpoint_auth_method: 'client_secret_post',
      revocation_endpoint_auth_method: 'client_secret_post',
      id_token_encrypted_response_alg: 'RSA-OAEP',
      id_token_encrypted_response_enc: 'A256GCM',
      userinfo_encrypted_response_alg: 'RSA-OAEP',
      userinfo_encrypted_response_enc: 'A256GCM',
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
        MockServiceProviderService,
        SessionService,
        AuthRedirectInterceptor,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(IdentityProviderAdapterEnvService)
      .useValue(identityProviderMock)
      .overrideProvider(MockServiceProviderService)
      .useValue(mockServiceProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(AuthRedirectInterceptor)
      .useValue(authRedirectInterceptorMock)
      .compile();

    controller = module.get<MockServiceProviderController>(
      MockServiceProviderController,
    );

    res = {
      redirect: jest.fn(),
      render: jest.fn(),
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
      acr_values: 'acrMock',
      claims: 'claimsMock',
    });

    sessionOidcServiceMock.get.mockReturnValue(sessionOidcDataMock);

    configServiceMock.get.mockReturnValue(configMock);
    identityProviderMock.getList.mockResolvedValue(identityProviderList);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return nothing', () => {
      // When / Then
      expect(controller.index()).toBeNil();
    });
  });

  describe('login', () => {
    beforeEach(() => {
      controller['getInteractionParameters'] = jest
        .fn()
        .mockResolvedValue(interactionParametersMock);
    });

    it("should throw if the oidc session can't be initialized", async () => {
      // Given
      sessionOidcServiceMock.set.mockImplementationOnce(() => {
        throw new Error('test');
      });

      // When / Then
      await expect(
        controller.login(sessionOidcServiceMock, sessionAppServiceMock),
      ).rejects.toThrow();
    });

    it('should return front title', async () => {
      // Given
      sessionOidcServiceMock.set.mockResolvedValueOnce(undefined);
      // When
      const result = await controller.login(
        sessionOidcServiceMock,
        sessionAppServiceMock,
      );
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          titleFront: 'Mock Service Provider',
        }),
      );
    });

    it('should return default ACR value', async () => {
      // Given
      sessionOidcServiceMock.set.mockResolvedValueOnce(undefined);
      // When
      const result = await controller.login(
        sessionOidcServiceMock,
        sessionAppServiceMock,
      );
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          defaultAcrValue: 'eidas2',
        }),
      );
    });

    it('should return isAdvancedMode false if no current mode defined', async () => {
      // Given
      sessionAppServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      const result = await controller.login(
        sessionOidcServiceMock,
        sessionAppServiceMock,
      );
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          isAdvancedMode: false,
        }),
      );
    });

    it('should return isAdvancedMode false if current mode is basic', async () => {
      // Given
      sessionAppServiceMock.get.mockResolvedValueOnce({
        mode: AppMode.BASIC,
      });
      // When
      const result = await controller.login(
        sessionOidcServiceMock,
        sessionAppServiceMock,
      );
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          isAdvancedMode: false,
        }),
      );
    });

    it('should return isAdvancedMode true if current mode is advanced', async () => {
      // Given
      sessionAppServiceMock.get.mockReturnValueOnce({
        mode: AppMode.ADVANCED,
      });
      // When
      const result = await controller.login(
        sessionOidcServiceMock,
        sessionAppServiceMock,
      );
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          isAdvancedMode: true,
        }),
      );
    });
  });

  describe('verify', () => {
    it('should call session.get', () => {
      // When
      controller.getVerify(sessionOidcServiceMock);
      // Then
      expect(sessionOidcServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionOidcServiceMock.get).toHaveBeenCalledWith();
    });

    it('should return session data and hardcoded title', () => {
      // When
      const result = controller.getVerify(sessionOidcServiceMock);

      // Then
      expect(result).toEqual({
        titleFront: 'Mock Service Provider - Login Callback',
        accessToken: 'idpAccessTokenValue',
        dataApiActive: false,
        ...sessionOidcDataMock,
      });
    });
  });

  describe('error', () => {
    it('should return error', () => {
      // Given
      const queryMock = {
        error: 'error',
        error_description: 'Error description',
      };
      // When
      const result = controller.error(queryMock);

      // Then
      expect(result).toEqual({
        titleFront: "Mock service provider - Erreur lors de l'authentification",
        error: 'error',
        error_description: 'Error description',
      });
    });
  });

  describe('logout', () => {
    const postLogoutRedirectUriMock = 'https://postLogoutRedirectUriMock';
    const endSessionUrlMock = `https://endSessionUrlMockMock?id_token_hint=${idpIdTokenMock}&post_logout_redirect_uri=${postLogoutRedirectUriMock}&state=${idpStateMock}`;

    beforeEach(() => {
      sessionOidcServiceMock.get.mockReturnValueOnce(sessionOidcDataMock);
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockResolvedValueOnce(
        endSessionUrlMock,
      );
    });

    it('should call session.get() to retrieves idp current cinematic informations', async () => {
      // When
      await controller.logout(
        res,
        sessionOidcServiceMock,
        postLogoutRedirectUriMock,
      );

      // Then
      expect(sessionOidcServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionOidcServiceMock.get).toHaveBeenCalledWith();
    });

    it('should call clientService.getEndSessionUrlFromProvider() to build the endSessionUrl', async () => {
      // When
      await controller.logout(
        res,
        sessionOidcServiceMock,
        postLogoutRedirectUriMock,
      );

      // Then
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
      // When
      await controller.logout(
        res,
        sessionOidcServiceMock,
        postLogoutRedirectUriMock,
      );

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(endSessionUrlMock);
    });
  });

  describe('revocationToken', () => {
    describe('without refresh token', () => {
      beforeEach(() => {
        controller['getIdpId'] = jest.fn().mockReturnValue(configMock.idpId);
        sessionOidcServiceMock.get.mockReturnValueOnce(undefined);
      });

      it('should get the idpId from the app config', async () => {
        // Given
        const body = { accessToken: 'access_token' };

        // When
        await controller.revocationToken(res, body, sessionOidcServiceMock);

        // Then
        expect(controller['getIdpId']).toHaveBeenCalledTimes(1);
        expect(controller['getIdpId']).toHaveBeenCalledWith();
      });

      it('should display success page when token is revoked', async () => {
        // Given
        const body = { accessToken: 'access_token' };
        // When
        const result = await controller.revocationToken(
          res,
          body,
          sessionOidcServiceMock,
        );

        // Then
        expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledTimes(
          1,
        );
        expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledWith(
          body.accessToken,
          configMock.idpId,
        );
        expect(result).toEqual({
          accessToken: 'access_token',
          titleFront: 'Mock Service Provider - Token révoqué',
          dataApiActive: false,
        });
      });

      it('should redirect to the error page if revokeToken throw an error', async () => {
        // Given
        oidcClientServiceMock.utils.revokeToken.mockRejectedValue(
          oidcErrorMock,
        );
        const body = { accessToken: 'access_token' };

        // When
        await controller.revocationToken(res, body, sessionOidcServiceMock);

        // Then
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(
          '/error?error=error&error_description=error_description',
        );
      });

      it('should throw mock service provider revoke token exception if error is not an instance of OPError', async () => {
        // Given
        const unknowError = { foo: 'bar' };
        const body = { accessToken: 'access_token' };
        oidcClientServiceMock.utils.revokeToken.mockRejectedValue(unknowError);

        // When / Then
        await expect(
          controller.revocationToken(res, body, sessionOidcServiceMock),
        ).rejects.toThrow(MockServiceProviderTokenRevocationException);
      });
    });

    describe('with refresh token', () => {
      beforeEach(() => {
        controller['getIdpId'] = jest.fn().mockReturnValue(configMock.idpId);
        sessionOidcServiceMock.get.mockReturnValueOnce(idpRefreshTokenMock);
      });

      it('should display success page when token is revoked', async () => {
        // Given
        const body = { accessToken: 'access_token' };
        // When
        const result = await controller.revocationToken(
          res,
          body,
          sessionOidcServiceMock,
        );

        // Then
        expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledTimes(
          1,
        );
        expect(oidcClientServiceMock.utils.revokeToken).toHaveBeenCalledWith(
          idpRefreshTokenMock,
          configMock.idpId,
        );
        expect(result).toEqual({
          accessToken: 'access_token',
          titleFront: 'Mock Service Provider - Token révoqué',
          dataApiActive: false,
        });
        expect(sessionOidcServiceMock.set).toHaveBeenCalledWith(
          'idpRefreshToken',
          undefined,
        );
      });
    });
  });

  describe('retrieveUserinfo', () => {
    const idpIdTokenMock =
      'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikhlcm1hbiIsImZpcnN0X25hbWUiOiJTdMOpcGhhbmUiLCJpYXQiOjE1MTYyMzkwMjJ9.EWgP3XF8uccp5uokOJV9MFgOwGzcXOW1PlNnAoo1D1ScMB6rv352kFdWORzllA2oJqrpvlY4yI_NpyI5FDQzyQ';

    describe('with refresh token', () => {
      beforeEach(() => {
        sessionOidcServiceMock.get.mockReturnValueOnce(idpRefreshTokenMock);
        sessionOidcServiceMock.get.mockReturnValueOnce(idpIdTokenMock);
        oidcClientServiceMock.utils.refreshTokens.mockReturnValueOnce({
          access_token: idpAccessTokenMock,
        });
      });

      it('should retrieve and display userinfo as well as cinematic information on userinfo page', async () => {
        // Given
        const body = { accessToken: 'access_token' };
        oidcClientServiceMock.utils.getUserInfo.mockReturnValueOnce({
          sub: '1',
          given_name: 'given_name',
        });
        const expectedOutput = {
          accessToken: idpAccessTokenMock,
          titleFront: 'Mock Service Provider - Userinfo',
          idpIdentity: {
            sub: '1',
            given_name: 'given_name',
          },
          idpIdToken: idpIdTokenMock,
          dataApiActive: false,
          idpRefreshToken: idpRefreshTokenMock,
        };

        // When
        await controller.retrieveUserinfo(res, body, sessionOidcServiceMock);

        // Then
        expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledTimes(
          1,
        );
        expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledWith(
          idpAccessTokenMock,
          configMock.idpId,
        );
        expect(res.render).toHaveBeenCalledExactlyOnceWith(
          'login-callback',
          expectedOutput,
        );
      });
    });
    describe('without refresh token', () => {
      beforeEach(() => {
        sessionOidcServiceMock.get.mockReturnValueOnce(null);
        sessionOidcServiceMock.get.mockReturnValueOnce(idpIdTokenMock);
      });

      it('should retrieve and display userinfo as well as cinematic information on userinfo page', async () => {
        // Given
        const body = { accessToken: 'access_token' };
        oidcClientServiceMock.utils.getUserInfo.mockReturnValueOnce({
          sub: '1',
          given_name: 'given_name',
        });
        const expectedOutput = {
          accessToken: 'access_token',
          titleFront: 'Mock Service Provider - Userinfo',
          idpIdentity: {
            sub: '1',
            given_name: 'given_name',
          },
          idpIdToken: idpIdTokenMock,
          dataApiActive: false,
        };

        // When
        await controller.retrieveUserinfo(res, body, sessionOidcServiceMock);

        // Then
        expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledTimes(
          1,
        );
        expect(oidcClientServiceMock.utils.getUserInfo).toHaveBeenCalledWith(
          body.accessToken,
          configMock.idpId,
        );
        expect(res.render).toHaveBeenCalledExactlyOnceWith(
          'login-callback',
          expectedOutput,
        );
      });

      it('should redirect to the error page if getUserInfo throw an error', async () => {
        // Given
        const body = { accessToken: 'access_token' };
        oidcClientServiceMock.utils.getUserInfo.mockRejectedValue(
          oidcErrorMock,
        );

        // When
        await controller.retrieveUserinfo(res, body, sessionOidcServiceMock);

        // Then
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(
          '/error?error=error&error_description=error_description',
        );
      });

      it('should throw mock service provider userinfo exception if error is not an instance of OPError', async () => {
        // Given
        oidcClientServiceMock.utils.getUserInfo.mockRejectedValue({});
        const body = { accessToken: 'access_token' };

        // When / Then
        await expect(
          controller.retrieveUserinfo(res, body, sessionOidcServiceMock),
        ).rejects.toThrow(MockServiceProviderUserinfoException);
      });
    });
  });

  describe('getAllData', () => {
    const resMock = {
      status: jest.fn(),
      redirect: jest.fn(),
      render: jest.fn(),
    };

    const dataApiMock = {
      name: 'dataApiMock',
      url: 'dataApiUrlMock',
      secret: 'secretMock',
    };
    const dataApiMock2 = {
      name: 'dataApiMock2',
      url: 'dataApiUrlMock2',
      secret: 'secretMock2',
    };
    const dataApiMock3 = {
      name: 'dataApiMock3',
      url: 'dataApiUrlMock3',
      secret: 'secretMock3',
    };
    const dataApisMock = [dataApiMock, dataApiMock2, dataApiMock3];

    beforeEach(() => {
      configServiceMock.get.mockReturnValue({
        dataApis: dataApisMock,
      });
    });

    it('should retrieve the App configuration', async () => {
      // When
      await controller.getAllData(resMock, sessionOidcServiceMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should redirect to error if there is no api configured', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({});
      const expectedErrorUriMock = `/error?error=no_data_provider&error_description=${encodeURIComponent(
        'No data provider configured.',
      )}`;

      // When
      await controller.getAllData(resMock, sessionOidcServiceMock);

      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(expectedErrorUriMock);
    });

    it('should retrieve the access token from the session', async () => {
      // When
      await controller.getAllData(resMock, sessionOidcServiceMock);

      // Then
      expect(sessionOidcServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionOidcServiceMock.get).toHaveBeenCalledWith();
    });

    it('should get data for each api', async () => {
      // When
      await controller.getAllData(resMock, sessionOidcServiceMock);

      // Then
      expect(mockServiceProviderServiceMock.getData).toHaveBeenCalledTimes(
        dataApisMock.length,
      );
      expect(mockServiceProviderServiceMock.getData).toHaveBeenNthCalledWith(
        1,
        dataApiMock.url,
        sessionOidcDataMock.idpAccessToken,
        dataApiMock.secret,
      );
      expect(mockServiceProviderServiceMock.getData).toHaveBeenNthCalledWith(
        2,
        dataApiMock2.url,
        sessionOidcDataMock.idpAccessToken,
        dataApiMock2.secret,
      );
      expect(mockServiceProviderServiceMock.getData).toHaveBeenNthCalledWith(
        3,
        dataApiMock3.url,
        sessionOidcDataMock.idpAccessToken,
        dataApiMock3.secret,
      );
    });

    it('should render the data page with the data', async () => {
      // Given
      const dataMock = {
        data: 'dataMock',
      };
      mockServiceProviderServiceMock.getData.mockResolvedValue(dataMock);
      const expectedResponseMock = {
        accessToken: 'idpAccessTokenValue',
        data: [
          {
            name: 'dataApiMock',
            response: {
              data: 'dataMock',
            },
          },
          {
            name: 'dataApiMock2',
            response: {
              data: 'dataMock',
            },
          },
          {
            name: 'dataApiMock3',
            response: {
              data: 'dataMock',
            },
          },
        ],
        dataApiActive: true,
        idpIdentity: 'idpIdentityValue',
        titleFront: 'Mock Service Provider - UserData',
      };

      // When
      await controller.getAllData(resMock, sessionOidcServiceMock);

      // Then
      expect(resMock.render).toHaveBeenCalledTimes(1);
      expect(resMock.render).toHaveBeenCalledWith('data', expectedResponseMock);
    });
  });

  describe('getInteractionParameters', () => {
    const provider = identityProviderFull as IdentityProviderMetadata;
    const urlMock = 'https://somewhere.com/foo';
    const providerUidMock = 'providerUidMock';

    beforeEach(() => {
      // Given
      oidcClientServiceMock.utils.getAuthorizeUrl.mockResolvedValue(urlMock);
    });

    it('should call config.get twice', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(2);
    });

    it('should get OidcAcr config', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcAcr');
    });

    it('should get OidcClient config', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should call oidcClient.buildAuthorizeParameters', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toHaveBeenCalledTimes(1);
    });

    it('should call oidcClient.getAuthorizeUrl', async () => {
      // When
      await controller['getInteractionParameters'](provider);
      // Then
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        providerUidMock,
        {
          state: idpStateMock,
          prompt: 'login consent',
          scope: scopeMock,
          acr_values: 'eidas2',
          nonce: nonceMock,
          claims: 'claimsMock',
        },
      );
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
          redirect_uri: ['redirect', 'uri'],
          scope: scopeMock,
          authorization_endpoint: 'https://somewhere.com/foo',
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
        accessToken: accessTokenMock,
        acr: acrMock,
        amr: amrMock,
      });

      oidcClientServiceMock.getUserInfosFromProvider.mockReturnValueOnce(
        identityMock,
      );
    });

    it('should call res.redirect with an error if the query contains an error', async () => {
      // Given
      const queryMock = {
        error: 'toto',
      };
      const errorQueryMock = 'error=toto';
      queryStringEncodeMock.mockReturnValueOnce(errorQueryMock);
      const expectedErrorUriMock = `/error?${errorQueryMock}`;

      // When
      await controller.getOidcCallback(
        req,
        res,
        queryMock,
        sessionOidcServiceMock,
      );

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(expectedErrorUriMock);
    });

    it('should call res.redirect with an error and error_description if the query contains an error and error_description', async () => {
      // Given
      const queryMock = {
        error: 'toto',
        error_description: 'toto42',
      };
      const errorQueryMock = 'error=toto&error_description=toto42';
      queryStringEncodeMock.mockReturnValueOnce(errorQueryMock);
      const expectedErrorUriMock = `/error?${errorQueryMock}`;

      // When
      await controller.getOidcCallback(
        req,
        res,
        queryMock,
        sessionOidcServiceMock,
      );

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(expectedErrorUriMock);
    });

    it('should throw an error if the session is not found', async () => {
      // Given
      sessionOidcServiceMock.get.mockReset().mockReturnValueOnce(undefined);

      // When / Then
      await expect(
        controller.getOidcCallback(req, res, query, sessionOidcServiceMock),
      ).rejects.toThrow(SessionNotFoundException);
    });

    it('should not call getTokenFromProvider if the query contains an error', async () => {
      // Given
      const queryMock = {
        error: 'toto',
        error_description: 'toto42',
      };

      // When
      await controller.getOidcCallback(
        req,
        res,
        queryMock,
        sessionOidcServiceMock,
      );

      // Then
      expect(oidcClientServiceMock.getTokenFromProvider).toHaveBeenCalledTimes(
        0,
      );
    });

    it('should call token with providerId', async () => {
      // When
      await controller.getOidcCallback(req, res, query, sessionOidcServiceMock);

      // Then
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
      // When
      await controller.getOidcCallback(req, res, query, sessionOidcServiceMock);

      // Then
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledWith(userInfoParamsMock, req);
    });

    it('should set session with identity result.', async () => {
      // When
      await controller.getOidcCallback(req, res, query, sessionOidcServiceMock);

      // Then
      expect(sessionOidcServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionOidcServiceMock.set).toHaveBeenCalledWith(
        identityExchangeMock,
      );
    });

    it('should redirect user after token and userinfo received and saved', async () => {
      // When
      await controller.getOidcCallback(req, res, query, sessionOidcServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(redirectMock);
    });
  });

  describe('getIdpId', () => {
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

  describe('getData', () => {
    const dataApiMock = {
      name: 'dataApiMock',
      url: 'dataApiUrlMock',
      secret: 'dataApiMock',
    };
    const dataMock = {
      data: 'dataMock',
    };

    beforeEach(() => {
      mockServiceProviderServiceMock.getData.mockResolvedValue(dataMock);
    });

    it('should call getData with the api url, the api secret and the access token', async () => {
      // When
      await controller['getData'](
        dataApiMock,
        sessionOidcDataMock.idpAccessToken,
      );

      // Then
      expect(mockServiceProviderServiceMock.getData).toHaveBeenCalledTimes(1);
      expect(mockServiceProviderServiceMock.getData).toHaveBeenCalledWith(
        dataApiMock.url,
        sessionOidcDataMock.idpAccessToken,
        dataApiMock.secret,
      );
    });

    it('should return the data', async () => {
      // When
      const result = await controller['getData'](
        dataApiMock,
        sessionOidcDataMock.idpAccessToken,
      );

      // Then
      expect(result).toStrictEqual(dataMock);
    });

    it('should return an error if the data api call fails', async () => {
      // Given
      const errorMock = new Error('error');
      mockServiceProviderServiceMock.getData.mockRejectedValue(errorMock);

      // When
      const result = await controller['getData'](
        dataApiMock,
        sessionOidcDataMock.idpAccessToken,
      );

      // Then
      expect(result).toStrictEqual(errorMock);
    });
  });
});
