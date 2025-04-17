import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { AccountPermissionService } from '@fc/access-control';
import { PartialDeep } from '@fc/common';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { PartnersAccountService } from '@fc/partners-account';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { PartnersFrontRoutes } from '../enums';
import { PartnersOidcClientService } from './partners-oidc-client.service';

jest.mock('querystring', () => ({
  encode: jest.fn(),
}));

describe('PartnersOidcClientService', () => {
  let service: PartnersOidcClientService;

  const req = {};

  const oidcClientServiceMock = {
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    getEndSessionUrlFromProvider: jest.fn(),
    utils: {
      buildAuthorizeParameters: jest.fn(),
      getAuthorizeUrl: jest.fn(),
    },
  };

  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdTokenMock = 'idpIdToken';

  const identityMock = {
    given_name: 'given_name',
    usual_name: 'usual_name',
    email: 'email',
    sub: '1',
    uid: '42',
  };

  const sessionServiceMock = getSessionServiceMock();

  const identityProviderServiceMock = {
    getById: jest.fn(),
  };

  const idpIdMock = 'idpIdMockValue';
  const configMock = {
    urlPrefix: '/api/v2',
    defaultAcrValue: 'eidas3',
    scope: 'openid',
    proConnectIdpId: idpIdMock,
  };

  const configServiceMock = getConfigMock();

  const partnersAccountServiceMock = {
    init: jest.fn(),
    updateLastConnection: jest.fn(),
  };

  const accountPermissionServiceMock = {
    addPermission: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersOidcClientService,
        OidcClientService,
        SessionService,
        ConfigService,
        IdentityProviderAdapterEnvService,
        PartnersAccountService,
        AccountPermissionService,
      ],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(IdentityProviderAdapterEnvService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(PartnersAccountService)
      .useValue(partnersAccountServiceMock)
      .overrideProvider(AccountPermissionService)
      .useValue(accountPermissionServiceMock)
      .compile();

    service = module.get<PartnersOidcClientService>(PartnersOidcClientService);

    configServiceMock.get.mockReturnValue(configMock);

    const idpMock: PartialDeep<IdentityProviderMetadata> = {
      name: 'nameValue',
      title: 'titleValue',
      client: {
        post_logout_redirect_uris: ['any-post_logout_redirect_uris-mock'],
      },
    };

    identityProviderServiceMock.getById.mockReturnValue(idpMock);

    sessionServiceMock.get.mockReturnValue({
      idpNonce: idpNonceMock,
      idpState: idpStateMock,
      idpId: idpIdMock,
      idpIdToken: idpIdTokenMock,
    });

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      acr_values: 'acrMock',
      nonce: idpNonceMock,
      providerUid: configMock.proConnectIdpId,
      scope: 'scopeMock',
      state: idpStateMock,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorizeUrl()', () => {
    it('should call oidc-client-service to retrieve authorize url', async () => {
      // Given
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

      // When
      await service.getAuthorizeUrl();

      // Then
      expect(
        oidcClientServiceMock.utils.getAuthorizeUrl,
      ).toHaveBeenCalledExactlyOnceWith(
        configMock.proConnectIdpId,
        expectedGetAuthorizeCallParameter,
      );
    });

    it('should return the authorizeUrl', async () => {
      // Given
      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // When
      const result = await service.getAuthorizeUrl();

      // Then
      expect(result).toBe(authorizeUrlMock);
    });

    it('should store state and nonce in session', async () => {
      // Given
      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // When
      await service.getAuthorizeUrl();

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith(
        'OidcClient',
        {
          idpId: configMock.proConnectIdpId,
          idpName: 'nameValue',
          idpLabel: 'titleValue',
          idpNonce: idpNonceMock,
          idpState: idpStateMock,
        },
      );
    });
  });

  describe('getIdentityFromIdp()', () => {
    const accessTokenMock = Symbol('accesToken');
    const identityMock = {
      given_name: 'given_name',
      usual_name: 'usual_name',
      email: 'email',
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
      idpIdToken: idpIdTokenMock,
      idpIdentity: identityMock,
    };

    const idMock = Symbol('partnersAccountIdMock');

    beforeEach(() => {
      oidcClientServiceMock.getTokenFromProvider.mockReturnValueOnce({
        accessToken: accessTokenMock,
        idToken: idpIdTokenMock,
      });
      oidcClientServiceMock.getUserInfosFromProvider.mockReturnValueOnce(
        identityMock,
      );

      partnersAccountServiceMock.init.mockResolvedValue(idMock);
    });

    it('should throw an error if the session is not found', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockReturnValueOnce(undefined);

      // When / Then
      await expect(service.getIdentityFromIdp(req as Request)).rejects.toThrow(
        SessionNotFoundException,
      );
    });

    it('should call token with providerId', async () => {
      // When
      await service.getIdentityFromIdp(req as Request);

      // Then
      expect(
        oidcClientServiceMock.getTokenFromProvider,
      ).toHaveBeenCalledExactlyOnceWith(idpIdMock, tokenParamsMock, req);
    });

    it('should call userinfo with acesstoken, dto and context', async () => {
      // When
      await service.getIdentityFromIdp(req as Request);

      // Then
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledExactlyOnceWith(userInfoParamsMock, req);
    });

    it('should set session with identity result.', async () => {
      // When
      await service.getIdentityFromIdp(req as Request);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith(
        'OidcClient',
        identityExchangeMock,
      );
    });
  });

  describe('retrieveOrCreateAccount()', () => {
    // Given
    const idMock = Symbol('partnersAccountIdMock');

    const partnerAccountMock = {
      sub: identityMock.sub,
      firstname: identityMock.given_name,
      lastname: identityMock.usual_name,
      email: identityMock.email,
    };

    it('should not init account if it already exists', async () => {
      // Given
      partnersAccountServiceMock.updateLastConnection.mockResolvedValue(idMock);

      // When
      await service.retrieveOrCreateAccount(identityMock);

      // Then
      expect(partnersAccountServiceMock.init).not.toHaveBeenCalled();
    });

    it('should init account with identity', async () => {
      // Given
      partnersAccountServiceMock.updateLastConnection.mockResolvedValue(
        undefined,
      );

      // When
      await service.retrieveOrCreateAccount(identityMock);

      // Then
      expect(partnersAccountServiceMock.init).toHaveBeenCalledExactlyOnceWith({
        ...partnerAccountMock,
        lastConnection: expect.any(Function),
      });
    });

    it('should store identity in session', async () => {
      // Given
      partnersAccountServiceMock.updateLastConnection.mockResolvedValue(idMock);

      // When
      await service.retrieveOrCreateAccount(identityMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledWith('PartnersAccount', {
        identity: {
          id: idMock,
          ...partnerAccountMock,
        },
      });
    });
  });

  describe('getLogoutUrl()', () => {
    it('should redirect on the logout callback service', async () => {
      // Given
      const endSessionUrlMock = 'https://my-authentication-openid-url.com';
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockReturnValueOnce(
        endSessionUrlMock,
      );
      // When
      const result = await service.getLogoutUrl();

      // Then
      expect(result).toBe(endSessionUrlMock);
    });

    it('should return the home page URL when there is no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValue(undefined);

      // When
      const result = await service.getLogoutUrl();

      // Then
      expect(result).toBe(PartnersFrontRoutes.INDEX);
    });

    it('should redirect to home page when there is no idpIdToken found', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValue({
        idpState: 'idpState',
        idpId: 'idpId',
      });

      // When
      const result = await service.getLogoutUrl();

      // Then
      expect(result).toBe(PartnersFrontRoutes.INDEX);
    });
  });
});
