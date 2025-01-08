import { cloneDeep } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { AccountPermissionRepository } from '@fc/access-control';
import { PartialDeep } from '@fc/common';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { PartnersAccountService } from '@fc/partners-account';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { PartnersBackRoutes, PartnersFrontRoutes } from '../enums';
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
    },
  };

  const interactionIdMock = 'interactionIdMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdTokenMock = 'idpIdToken';

  const sessionServiceMock = getSessionServiceMock();
  const sessionPartnersAccountMock = getSessionServiceMock();

  const identityProviderServiceMock = {
    getById: jest.fn(),
  };

  const idpIdMock = 'idpIdMockValue';
  const configMock = {
    urlPrefix: '/api/v2',
    defaultAcrValue: 'eidas3',
    scope: 'openid',
    agentConnectIdpHint: idpIdMock,
  };

  const configServiceMock = getConfigMock();

  const partnersAccountServiceMock = {
    upsert: jest.fn(),
  };

  const partnersAccountPermissionMock = {
    init: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcClientController],
      providers: [
        OidcClientService,
        SessionService,
        ConfigService,
        IdentityProviderAdapterEnvService,
        PartnersAccountService,
        AccountPermissionRepository,
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
      .overrideProvider(AccountPermissionRepository)
      .useValue(partnersAccountPermissionMock)
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

    sessionServiceMock.get.mockReturnValue({
      idpNonce: idpNonceMock,
      idpState: idpStateMock,
      idpId: idpIdMock,
      idpIdToken: idpIdTokenMock,
    });

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      acr_values: 'acrMock',
      nonce: idpNonceMock,
      providerUid: configMock.agentConnectIdpHint,
      scope: 'scopeMock',
      state: idpStateMock,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
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
      await controller.redirectToIdp(res, sessionServiceMock);

      // Then
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        configMock.agentConnectIdpHint,
        expectedGetAuthorizeCallParameter,
      );
    });

    it('should call res.redirect() with the authorizeUrl', async () => {
      // Given
      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // When
      await controller.redirectToIdp(res, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });

    it('should store state and nonce in session', async () => {
      // Given
      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // When
      await controller.redirectToIdp(res, sessionServiceMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        idpId: configMock.agentConnectIdpHint,
        idpName: 'nameValue',
        idpLabel: 'titleValue',
        idpNonce: idpNonceMock,
        idpState: idpStateMock,
      });
    });

    it('should resolve even if no spId are fetchable', async () => {
      // Given
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw new Error();
      });

      // When
      await controller.redirectToIdp(res, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOidcCallback()', () => {
    const accessTokenMock = Symbol('accesToken');
    const acrMock = Symbol('acr');
    const identityMock = {
      given_name: 'given_name',
      usual_name: 'usual_name',
      email: 'email',
      siren: 'siren',
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

    const redirectMock = PartnersFrontRoutes.INDEX;

    const idMock = Symbol('partnersAccountIdMock');
    const partnersAccountIdMock = {
      identifiers: [{ id: idMock }],
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

      partnersAccountServiceMock.upsert.mockResolvedValue(
        partnersAccountIdMock,
      );
    });

    it('should throw an error if the session is not found', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockReturnValueOnce(undefined);

      // When / Then
      await expect(
        controller.getOidcCallback(
          req,
          res,
          sessionServiceMock,
          sessionPartnersAccountMock,
        ),
      ).rejects.toThrow(SessionNotFoundException);
    });

    it('should call token with providerId', async () => {
      // When
      await controller.getOidcCallback(
        req,
        res,
        sessionServiceMock,
        sessionPartnersAccountMock,
      );

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
      await controller.getOidcCallback(
        req,
        res,
        sessionServiceMock,
        sessionPartnersAccountMock,
      );

      // Then
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
        sessionServiceMock,
        sessionPartnersAccountMock,
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
        sessionServiceMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(clonedIdentityMock);
    });

    //
    it('should store identity in partner account and partner account session', async () => {
      // Given
      const expected = {
        sub: identityMock.sub,
        firstname: identityMock.given_name,
        lastname: identityMock.usual_name,
        email: identityMock.email,
        siren: identityMock.siren,
      };

      // When
      await controller.getOidcCallback(
        req,
        res,
        sessionServiceMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(partnersAccountServiceMock.upsert).toHaveBeenCalledTimes(1);
      expect(partnersAccountServiceMock.upsert).toHaveBeenCalledWith(expected);
      expect(sessionPartnersAccountMock.set).toHaveBeenCalledTimes(1);
      expect(sessionPartnersAccountMock.set).toHaveBeenCalledWith({
        accountId: idMock,
        ...expected,
      });
      expect(partnersAccountPermissionMock.init).toHaveBeenCalledTimes(1);
      expect(partnersAccountPermissionMock.init).toHaveBeenCalledWith(idMock);
    });

    it('should redirect user after token and userinfo received and saved', async () => {
      // When
      await controller.getOidcCallback(
        req,
        res,
        sessionServiceMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(redirectMock);
    });
  });

  describe('logout()', () => {
    it('should redirect on the logout callback controller', async () => {
      // Given
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockReturnValueOnce(
        PartnersBackRoutes.LOGOUT_CALLBACK,
      );
      // When
      await controller.logout(res, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        PartnersBackRoutes.LOGOUT_CALLBACK,
      );
    });

    it('should redirect to home page when there is no session', async () => {
      // Given
      const resMock = {
        redirect: jest.fn(),
      };

      sessionServiceMock.get.mockResolvedValue(undefined);

      // When
      await controller.logout(resMock, sessionServiceMock);

      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(PartnersFrontRoutes.INDEX);
    });

    it('should redirect to home page when there is no idpIdToken found', async () => {
      // Given
      const resMock = {
        redirect: jest.fn(),
      };

      sessionServiceMock.get.mockResolvedValue({
        idpState: 'idpState',
        idpId: 'idpId',
      });

      // When
      await controller.logout(resMock, sessionServiceMock);

      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(PartnersFrontRoutes.INDEX);
    });
  });

  describe('logoutCallback()', () => {
    it('should redirect on the home page', async () => {
      // When
      await controller.logoutCallback(res);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(PartnersFrontRoutes.INDEX);
    });
  });
});
