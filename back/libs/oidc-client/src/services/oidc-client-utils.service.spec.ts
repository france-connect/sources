/**
 * @TODO update Jose version to 3.X
 * For now openid-client panva's library does not support jose 3.X but
 * it will be available in a neer future. So once it's done we just
 * need to remove this hack in the package.json
 */
import { JWK } from 'jose-openid-client';

import { Test, TestingModule } from '@nestjs/testing';

import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc';

import {
  OidcClientGetEndSessionUrlException,
  OidcClientIdpBlacklistedException,
  OidcClientInvalidStateException,
  OidcClientMissingCodeException,
  OidcClientMissingStateException,
  OidcClientTokenFailedException,
} from '../exceptions';
import { TokenParams } from '../interfaces';
import { OidcClientConfigService } from './oidc-client-config.service';
import { OidcClientIssuerService } from './oidc-client-issuer.service';
import { OidcClientUtilsService } from './oidc-client-utils.service';

describe('OidcClientUtilsService', () => {
  let service: OidcClientUtilsService;

  const postLogoutRedirectUriMock = 'https://postLogoutRedirectUriMock';

  const providerUidMock = 'providerUidMockValue';
  const stateMock = 'stateMockValue';
  const idTokenMock = 'idTokenMockValue';
  const endSessionUrlWithParamsMock = `https://endSessionUrlMockMock?id_token_hint=${idTokenMock}&post_logout_redirect_uri=${postLogoutRedirectUriMock}&state=${stateMock}`;

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    businessEvent: jest.fn(),
  } as unknown as LoggerService;

  const IdentityProviderServiceMock = { getList: jest.fn() };

  const IssuerClientMock = jest.fn();
  const cryptoServiceMock = {
    genRandomString: jest.fn(),
  };

  const randomStringMock = 'randomStringMockValue';

  const IssuerProxyMock = {
    discover: jest.fn(),
  } as any;

  const oidcClientIssuerServiceMock = {
    getClient: jest.fn(),
  };

  const oidcClientConfigServiceMock = {
    get: jest.fn(),
    reload: jest.fn(),
  };

  const authorizationUrlMock = jest.fn();
  const callbackParamsMock = jest.fn();
  const callbackMock = jest.fn();
  const userinfoMock = jest.fn();
  const revokeMock = jest.fn();
  const endSessionUrlMock = jest.fn();
  const clientMock = {
    authorizationUrl: authorizationUrlMock,
    callbackParams: callbackParamsMock,
    callback: callbackMock,
    userinfo: userinfoMock,
    revoke: revokeMock,
    endSessionUrl: endSessionUrlMock,
    metadata: {
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uris: ['redirect', 'uris'],
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_types: ['response', 'types'],
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      discoveryUrl: 'mock well-known url',
    },
  };

  const createOidcClientMock = jest.fn();

  const serviceProviderServiceMock = {
    shouldExcludeIdp: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcClientUtilsService,
        LoggerService,
        CryptographyService,
        OidcClientConfigService,
        OidcClientIssuerService,
        {
          provide: SERVICE_PROVIDER_SERVICE_TOKEN,
          useValue: serviceProviderServiceMock,
        },
      ],
    })
      .overrideProvider(OidcClientIssuerService)
      .useValue(oidcClientIssuerServiceMock)

      .overrideProvider(OidcClientConfigService)
      .useValue(oidcClientConfigServiceMock)

      .overrideProvider(CryptographyService)
      .useValue(cryptoServiceMock)

      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)

      .compile();

    service = module.get<OidcClientUtilsService>(OidcClientUtilsService);

    jest.resetAllMocks();

    IdentityProviderServiceMock.getList.mockResolvedValue(
      'IdentityProviderServiceMock Resolve Value',
    );
    authorizationUrlMock.mockResolvedValue(
      'authorizationUrlMock Resolve Value',
    );
    callbackParamsMock.mockResolvedValue({
      state: 'callbackParamsState',
      code: 'callbackParamsCode',
    });

    callbackMock.mockResolvedValue('callbackMock Resolve Value');
    userinfoMock.mockResolvedValue('userinfoMock Resolve Value');
    revokeMock.mockResolvedValue(void 0);

    IssuerProxyMock.discover.mockResolvedValue({
      Client: IssuerClientMock,
    });

    oidcClientIssuerServiceMock.getClient.mockResolvedValue(clientMock);

    oidcClientConfigServiceMock.get.mockResolvedValue({
      issuer: 'http://foo.bar',
      configuration: {},
      jwks: { keys: [] },
    });

    cryptoServiceMock.genRandomString.mockReturnValue(randomStringMock);
  });

  describe('constructor()', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getAuthorizeUrl()', () => {
    it('should call authorizationUrl', async () => {
      // Given
      const state = 'someState';
      const nonce = 'someNonce';
      const scope = 'foo_scope bar_scope';
      const providerId = 'myidp';
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const acr_values = 'eidas1';
      service['createOidcClient'] = createOidcClientMock;
      // When
      await service.getAuthorizeUrl({
        state,
        scope,
        idpId: providerId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
      });
      // Then
      expect(authorizationUrlMock).toHaveBeenCalledTimes(1);
    });

    it('should call authorizationUrl without claims parameters', async () => {
      // Given
      const state = 'someState';
      const nonce = 'someNonce';
      const scope = 'foo_scope bar_scope';
      const providerId = 'myidp';
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const acr_values = 'eidas1';
      service['createOidcClient'] = createOidcClientMock;
      // When
      await service.getAuthorizeUrl({
        state,
        scope,
        idpId: providerId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
      });
      // Then
      expect(authorizationUrlMock).toHaveBeenCalledWith({
        prompt: 'login',
        state,
        scope,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
        claims: undefined,
      });
    });

    it('should call authorizationUrl with claims parameters', async () => {
      // Given
      const state = 'someState';
      const nonce = 'someNonce';
      const scope = 'foo_scope bar_scope';
      const providerId = 'myidp';
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const acr_values = 'eidas1';
      const claims = '{ id_token: { amr: { essential: true } } }';
      service['createOidcClient'] = createOidcClientMock;
      // When
      await service.getAuthorizeUrl({
        state,
        scope,
        idpId: providerId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
        claims,
      });
      // Then
      expect(authorizationUrlMock).toHaveBeenCalledWith({
        prompt: 'login',
        state,
        scope,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
        claims,
      });
    });

    it('should resolve to object containing state & authorizationUrl', async () => {
      // Given
      const state = 'randomStateMock';
      const nonce = 'randomNonceMock';
      const scope = 'foo_scope bar_scope';
      const providerId = 'myidp';
      // oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const acr_values = 'eidas1';
      service['createOidcClient'] = createOidcClientMock;

      // When
      const url = await service.getAuthorizeUrl({
        state,
        scope,
        idpId: providerId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        nonce,
      });
      // Then
      expect(state).toEqual('randomStateMock');
      expect(url).toBe('authorizationUrlMock Resolve Value');
    });
  });

  describe('wellKnownKeys()', () => {
    it('should return keys', async () => {
      // Given
      const JwkKeyMock = {
        toJWK: jest.fn().mockReturnValueOnce('a').mockReturnValueOnce('b'),
      };
      const spy = jest.spyOn(JWK, 'asKey').mockReturnValue(JwkKeyMock as any);

      oidcClientConfigServiceMock.get.mockReturnValueOnce({
        jwks: { keys: ['foo', 'bar'] },
      });

      // When
      const result = await service.wellKnownKeys();
      // Then
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('foo');
      expect(spy).toHaveBeenCalledWith('bar');
      expect(JwkKeyMock.toJWK).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ keys: ['a', 'b'] });
    });
  });

  describe('buildAuthorizeParameters()', () => {
    it('should call crypto to generate state', async () => {
      // When
      const result = await service.buildAuthorizeParameters();
      // Then
      expect(result.state).toBeDefined();
      expect(result.state).toBe(randomStringMock);
    });
    it('should return parameters + generated state', async () => {
      // When
      const result = await service.buildAuthorizeParameters();
      // Then
      expect(result).toEqual({
        state: randomStringMock,
        nonce: randomStringMock,
      });
    });
  });

  describe('buildExtraParameters', () => {
    it('should return empty object', () => {
      // Given
      const parametersMock = undefined;
      const expected = {};
      // When
      const result = service['buildExtraParameters'](parametersMock);
      // Then
      expect(result).toEqual(expected);
    });

    it('should return object with argument in exchangeBody property', () => {
      // Given
      const parametersMock = { foo: 'bar' };
      const expected = { exchangeBody: parametersMock };
      // When
      const result = service['buildExtraParameters'](parametersMock);
      // Then
      expect(result).toEqual(expected);
    });
  });

  describe('getTokenSet()', () => {
    const req = { session: { codeVerifier: 'codeVerifierValue' } };
    const providerId = 'foo';
    const params: TokenParams = {
      state: 'callbackParamsState',
      nonce: 'callbackParamsNonce',
    };

    it('should call extractParams with callbackParams', async () => {
      // Given
      const extraParamsMockedReturn = { mock: 'value' };
      service['buildExtraParameters'] = jest
        .fn()
        .mockReturnValue(extraParamsMockedReturn);
      // When
      await service.getTokenSet(req, providerId, params);
      // Then
      expect(callbackMock).toHaveBeenCalled();
      expect(callbackMock).toHaveBeenCalledWith(
        'redirect,uris',
        {
          code: 'callbackParamsCode',
          state: 'callbackParamsState',
        },
        {
          // oidc defined variable name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          response_type: 'response,types',
          state: 'callbackParamsState',
          nonce: 'callbackParamsNonce',
        },
        extraParamsMockedReturn,
      );
    });

    it('should return resolve value of client.callback', async () => {
      // When
      const result = await service.getTokenSet(req, providerId, params);
      // Then
      expect(result).toBe('callbackMock Resolve Value');
    });

    it('should throw if something unexpected goes wrong in extractParams', async () => {
      // Given
      const errorMock = new Error('lol');
      callbackMock.mockRejectedValueOnce(errorMock);
      // Then
      expect(service.getTokenSet(req, providerId, params)).rejects.toThrow(
        OidcClientTokenFailedException,
      );
    });
  });

  describe('extractParams()', () => {
    const req = { session: { codeVerifier: 'codeVerifierValue' } };
    const state = 'callbackParamsState';

    it('should throw if code is not provided in url', async () => {
      callbackParamsMock.mockResolvedValueOnce({
        state: 'callbackParamsState',
      });
      // Then
      expect(service['extractParams'](req, clientMock, state)).rejects.toThrow(
        OidcClientMissingCodeException,
      );
    });
    it('should throw if state is not provided in url', async () => {
      // Given
      callbackParamsMock.mockResolvedValueOnce({
        code: 'callbackParamsCode',
      });
      // Then
      expect(service['extractParams'](req, clientMock, state)).rejects.toThrow(
        OidcClientMissingStateException,
      );
    });
    it('should throw if state in url does not match state in session', async () => {
      // Given
      callbackParamsMock.mockResolvedValueOnce({
        state: 'callbackParamsState',
        code: 'callbackParamsCode',
      });
      const invalidState = 'notTheSameStateAsInRequest';
      // Then
      expect(
        service['extractParams'](req, clientMock, invalidState),
      ).rejects.toThrow(OidcClientInvalidStateException);
    });
  });

  describe('revokeToken()', () => {
    it('should call client.revoke', async () => {
      // Given
      const accessToken = 'accessTokenValue';
      const providerId = 'providerIdValue';
      // When
      await service.revokeToken(accessToken, providerId);
      // Then
      expect(revokeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserInfo()', () => {
    it('should return client.userinfo result', async () => {
      // Given
      const accessToken = 'accessTokenValue';
      const providerId = 'providerIdValue';
      service['createOidcClient'] = createOidcClientMock;
      // When
      const result = await service.getUserInfo(accessToken, providerId);
      // Then
      expect(result).toBe('userinfoMock Resolve Value');
    });
  });

  describe('getEndSessionUrl()', () => {
    beforeEach(() => {
      oidcClientIssuerServiceMock.getClient.mockResolvedValueOnce(clientMock);
      clientMock.endSessionUrl.mockReturnValueOnce(endSessionUrlWithParamsMock);
    });

    it('should retrieves the client instance by calling utils.getClient()', async () => {
      // When
      await service.getEndSessionUrl(
        providerUidMock,
        stateMock,
        idTokenMock,
        postLogoutRedirectUriMock,
      );

      // Then
      expect(oidcClientIssuerServiceMock.getClient).toHaveBeenCalledTimes(1);
      expect(oidcClientIssuerServiceMock.getClient).toHaveBeenCalledWith(
        providerUidMock,
      );
    });

    it('should call client.endSessionUrl() with given parameters', async () => {
      // When
      await service.getEndSessionUrl(
        providerUidMock,
        stateMock,
        idTokenMock,
        postLogoutRedirectUriMock,
      );

      // Then
      expect(clientMock.endSessionUrl).toHaveBeenCalledTimes(1);
      expect(clientMock.endSessionUrl).toHaveBeenCalledWith({
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token_hint: idTokenMock,
        state: stateMock,
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        post_logout_redirect_uri: postLogoutRedirectUriMock,
      });
    });

    it('should returns the endSessionUrl', async () => {
      // When
      const result = await service.getEndSessionUrl(
        providerUidMock,
        stateMock,
        idTokenMock,
        postLogoutRedirectUriMock,
      );

      // Then
      expect(result).toStrictEqual(endSessionUrlWithParamsMock);
    });

    it('should throw an OidcClientGetEndSessionUrlException', async () => {
      // given
      clientMock.endSessionUrl.mockReset().mockImplementationOnce(() => {
        throw new Error('Unknown Error');
      });
      const expectedError = new OidcClientGetEndSessionUrlException();

      // When / Then
      await expect(() =>
        service.getEndSessionUrl(
          providerUidMock,
          stateMock,
          idTokenMock,
          postLogoutRedirectUriMock,
        ),
      ).rejects.toThrow(expectedError);
    });
  });

  describe('checkIdpBlacklisted()', () => {
    it('should return OidcClientRuntimeException isIdpBlacklist throw an error', async () => {
      // setup
      const errorMock = new Error(
        'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
      );
      // action
      serviceProviderServiceMock.shouldExcludeIdp.mockRejectedValueOnce(
        errorMock,
      );

      // assert
      await expect(
        service.checkIdpBlacklisted('spId', 'idpId'),
      ).rejects.toThrow(errorMock);
    });

    it('should throw OidcClientIdpBlacklistedException because identity provider is blacklisted', async () => {
      // setup
      const errorMock = new OidcClientIdpBlacklistedException();
      // action
      serviceProviderServiceMock.shouldExcludeIdp.mockReturnValueOnce(true);

      // assert
      await expect(
        service.checkIdpBlacklisted('spId', 'idpId'),
      ).rejects.toThrow(errorMock);
    });

    it('should return false because identity provider is not blacklisted', async () => {
      serviceProviderServiceMock.shouldExcludeIdp.mockReturnValueOnce(false);

      const result = await service.checkIdpBlacklisted('spId', 'idpId');
      expect(result).toBeFalsy();
    });
  });
});
