import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CsrfTokenGuard } from '@fc/csrf';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { OidcClientController } from './oidc-client.controller';

describe('OidcClientController', () => {
  let controller: OidcClientController;
  let res;

  const oidcClientServiceMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
      wellKnownKeys: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      checkIdpBlacklisted: jest.fn(),
      checkCsrfTokenValidity: jest.fn(),
    },
  };

  const loggerServiceMock = getLoggerMock();

  const sessionServiceMock = getSessionServiceMock();

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
    get: () => appConfigMock,
  };

  const stateMock = 'stateMock';
  const nonceMock = 'nonceMock';

  const providerIdMock = 'providerIdMockValue';

  const guardMock = { canActivate: () => true };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcClientController],
      providers: [
        OidcClientService,
        LoggerService,
        SessionService,
        TrackingService,
        ConfigService,
        IdentityProviderAdapterEnvService,
      ],
    })
      .overrideGuard(CsrfTokenGuard)
      .useValue(guardMock)
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
      .overrideProvider(IdentityProviderAdapterEnvService)
      .useValue(identityProviderServiceMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);

    res = {
      redirect: jest.fn(),
    };

    const idpMock: Partial<IdentityProviderMetadata> = {
      name: 'nameValue',
      title: 'titleValue',
    };

    identityProviderServiceMock.getById.mockReturnValue(idpMock);
    sessionServiceMock.get.mockResolvedValue({
      idpState: stateMock,
      idpNonce: nonceMock,
    });

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      state: stateMock,
      nonce: nonceMock,
      scope: 'scopeMock',
      providerUid: providerIdMock,
      acr_values: 'acrMock',
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    it('should call oidc-client-service for retrieve authorize url', async () => {
      // Given
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: nonceMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      const expectedGetAuthorizeCallParameter = {
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: 'nonceMock',
        scope: 'openid',
        state: 'stateMock',
      };

      // When
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // Then
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        providerIdMock,
        expectedGetAuthorizeCallParameter,
      );
    });

    it('should call res.redirect() with the authorizeUrl', async () => {
      // Given
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: nonceMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // When
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });

    it('should store state and nonce in session', async () => {
      // Given
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: nonceMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // When
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        idpId: body.providerUid,
        idpName: 'nameValue',
        idpLabel: 'titleValue',
        idpState: stateMock,
        idpNonce: nonceMock,
      });
    });

    it('should resolve even if no spId are fetchable', async () => {
      // Given
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        acr_values: 'eidas3',
        nonce: nonceMock,
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
      };
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw new Error();
      });

      // When
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
    });

    it('should log error if session service threw', async () => {
      // Given
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        acr_values: 'eidas3',
        nonce: nonceMock,
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
      };
      const errorMock = new Error('error');
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.err).toHaveBeenCalledWith(errorMock);
    });

    it('should throw an error if the two CSRF tokens (provided in request and previously stored in session) are not the same.', async () => {
      // Given
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        acr_values: 'eidas3',
        nonce: nonceMock,
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
      };
      sessionServiceMock.get.mockReturnValueOnce('spId');

      // When
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenLastCalledWith();
      expect(res.redirect).toHaveBeenCalledTimes(1);
    });

    describe('Idp blacklisted scenario for redirect to idp', () => {
      let isBlacklistedMock;
      beforeEach(() => {
        isBlacklistedMock = oidcClientServiceMock.utils.checkIdpBlacklisted =
          jest.fn();
      });

      it('idp is blacklisted', async () => {
        // Given
        const body = {
          scope: 'openid',
          providerUid: providerIdMock,
          acr_values: 'eidas3',
          nonce: nonceMock,
          claims: 'any_formatted_json_string',
          csrfToken: 'csrfMockValue',
        };
        const errorMock = new Error('New Error');
        sessionServiceMock.get.mockReturnValueOnce({
          spId: 'spIdValue',
        });
        isBlacklistedMock.mockRejectedValueOnce(errorMock);

        // When / Then
        await expect(() =>
          controller.redirectToIdp(res, body, sessionServiceMock),
        ).rejects.toThrow(errorMock);
        expect(sessionServiceMock.get).toHaveBeenLastCalledWith();
      });

      it('idp is not blacklisted', async () => {
        // Given
        const body = {
          scope: 'openid',
          providerUid: providerIdMock,
          acr_values: 'eidas3',
          nonce: nonceMock,
          claims: 'any_formatted_json_string',
          csrfToken: 'csrfMockValue',
        };
        sessionServiceMock.get.mockReturnValueOnce({
          spId: 'spIdValue',
        });
        isBlacklistedMock.mockReturnValueOnce(false);

        // When
        await controller.redirectToIdp(res, body, sessionServiceMock);

        // Then
        expect(sessionServiceMock.get).toHaveBeenLastCalledWith();
        expect(res.redirect).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('logoutCallback', () => {
    it('should reset the client session', async () => {
      // When
      await controller.logoutCallback(res);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(res);
    });

    it('should keep the App session from the client session', async () => {
      // Given
      const sessionAppMock = {
        mode: 'currentMode',
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionAppMock);

      // When
      await controller.logoutCallback(res);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('App');
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'App',
        sessionAppMock,
      );
    });

    it('should redirect to the home page', async () => {
      // When
      await controller.logoutCallback(res);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith('/');
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
});
