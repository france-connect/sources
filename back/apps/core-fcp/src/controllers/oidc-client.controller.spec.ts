import { encode } from 'querystring';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcClientService, TokenParams } from '@fc/oidc-client';
import {
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionService,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { ProcessCore } from '../enums';
import { CoreFcpInvalidIdentityException } from '../exceptions';
import { CoreFcpService } from '../services';
import { OidcClientController } from './oidc-client.controller';

jest.mock('querystring', () => ({
  encode: jest.fn(),
}));

describe('OidcClient Controller', () => {
  let controller: OidcClientController;
  let res;

  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdMock = 'idpIdMockValue';

  const providerIdMock = 'providerIdMockValue';

  const identityMock = {
    // oidc spec defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'given_name',
    sub: '1',
  } as IOidcIdentity;

  const req = {
    query: {
      firstQueryParam: 'first',
      secondQueryParam: 'second',
    },
    params: {
      providerUid: 'secretProviderUid',
    },
  };

  const oidcClientServiceMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
      wellKnownKeys: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      checkIdpBlacklisted: jest.fn(),
      checkCsrfTokenValidity: jest.fn(),
    },
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    businessEvent: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
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
    TrackedEventsMap: {
      FC_DATATRANSFER_CONSENT_IDENTITY: {},
      FC_DATATRANSFER_INFORMATION_IDENTITY: {},
      FC_DATATRANSFER_INFORMATION_ANONYMOUS: {},
    },
  };

  const appConfigMock = {
    urlPrefix: '/api/v2',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const queryStringEncodeMock = jest.mocked(encode);

  const coreServiceMock = {
    getFeature: jest.fn(),
  };
  const randomStringMock = 'randomStringMockValue';
  const spIdMock = 'spIdMockValue';
  const spNameMock = 'some SP';

  const sessionDataMock: OidcSession = {
    csrfToken: randomStringMock,
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,

    spAcr: acrMock,
    spId: spIdMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
  };

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
        IdentityProviderAdapterMongoService,
        CoreFcpService,
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
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(CoreFcpService)
      .useValue(coreServiceMock)
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
    sessionServiceMock.get.mockResolvedValue(sessionDataMock);

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      state: idpStateMock,
      nonce: idpNonceMock,
      scope: 'scopeMock',
      idpId: providerIdMock,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
    });

    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);

    configServiceMock.get.mockReturnValue(appConfigMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    it('should call oidc-client-service for retrieve authorize url', async () => {
      // setup
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: idpNonceMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      const expectedGetAuthorizeCallParameter = {
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: idpNonceMock,
        idpId: 'providerIdMockValue',
        scope: 'openid',
        state: idpStateMock,
        prompt: 'login',
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
        scope: 'openid',
        providerUid: providerIdMock,
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: idpNonceMock,
        csrfToken: 'csrfMockValue',
      };

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
        scope: 'openid',
        providerUid: providerIdMock,
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        claims: 'json_stringified',
        nonce: idpNonceMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        idpId: body.providerUid,
        idpName: 'nameValue',
        idpLabel: 'titleValue',
        idpState: idpStateMock,
        idpNonce: idpNonceMock,
      });
    });

    it('should throw if no spId are fetchable', async () => {
      // setup
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        nonce: idpNonceMock,
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
      };
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw new Error();
      });

      // action
      await expect(
        controller.redirectToIdp(res, body, sessionServiceMock),
      ).rejects.toThrow();

      // assert
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should throw an error because idp is blacklisted', async () => {
      // Given
      const csrfTokenBody = 'invalidCsrfMockValue';
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        nonce: idpNonceMock,
        claims: 'any_formatted_json_string',
        csrfToken: csrfTokenBody,
      };
      sessionServiceMock.get.mockReturnValueOnce('spId');
      sessionCsrfServiceMock.validate.mockReset().mockImplementation(() => {
        throw new Error(
          'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
        );
      });
      // When/Then
      await expect(
        controller.redirectToIdp(res, body, sessionServiceMock),
      ).rejects.toThrow(SessionInvalidCsrfSelectIdpException);
    });

    it('should throw an error if the two CSRF tokens (provided in request and previously stored in session) are not the same.', async () => {
      // setup
      const body = {
        scope: 'openid',
        providerUid: providerIdMock,
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'eidas3',
        nonce: idpNonceMock,
        claims: 'any_formatted_json_string',
        csrfToken: 'csrfMockValue',
      };
      sessionServiceMock.get.mockReturnValueOnce('spId');

      // action
      await controller.redirectToIdp(res, body, sessionServiceMock);

      // assert
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
        // setup
        const body = {
          scope: 'openid',
          providerUid: providerIdMock,
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: 'eidas3',
          nonce: idpNonceMock,
          claims: 'any_formatted_json_string',
          csrfToken: 'csrfMockValue',
        };
        const errorMock = new Error('New Error');
        sessionServiceMock.get.mockReturnValueOnce({
          spId: 'spIdValue',
        });
        isBlacklistedMock.mockRejectedValueOnce(errorMock);

        // action / assert
        await expect(() =>
          controller.redirectToIdp(res, body, sessionServiceMock),
        ).rejects.toThrow(errorMock);
        expect(sessionServiceMock.get).toHaveBeenLastCalledWith();
      });

      it('idp is not blacklisted', async () => {
        // setup
        const body = {
          scope: 'openid',
          providerUid: providerIdMock,
          // oidc param
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: 'eidas3',
          nonce: idpNonceMock,
          claims: 'any_formatted_json_string',
          csrfToken: 'csrfMockValue',
        };
        sessionServiceMock.get.mockReturnValueOnce({
          spId: 'spIdValue',
        });
        isBlacklistedMock.mockReturnValueOnce(false);

        // action
        await controller.redirectToIdp(res, body, sessionServiceMock);

        // assert
        expect(sessionServiceMock.get).toHaveBeenLastCalledWith();
        expect(res.redirect).toHaveBeenCalledTimes(1);
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
    const amrMock = Symbol('amr');

    const tokenParamsMock: TokenParams = {
      state: idpStateMock,
      nonce: idpNonceMock,
    };

    const userInfoParamsMock = {
      accessToken: accessTokenMock,
      idpId: idpIdMock,
    };

    const identityExchangeMock = {
      amr: amrMock,
      idpAccessToken: accessTokenMock,
      idpAcr: acrMock,
      idpIdentity: identityMock,
    };
    const redirectMock = `/api/v2/interaction/${interactionIdMock}/verify`;

    let validateIdentityMock;
    beforeEach(() => {
      oidcClientServiceMock.getTokenFromProvider.mockReturnValueOnce({
        accessToken: accessTokenMock,
        acr: acrMock,
        amr: amrMock,
      });
      oidcClientServiceMock.getUserInfosFromProvider.mockReturnValueOnce(
        identityMock,
      );
      validateIdentityMock = jest.spyOn<OidcClientController, any>(
        controller,
        'validateIdentity',
      );

      validateIdentityMock.mockResolvedValueOnce();
      oidcClientServiceMock.utils.checkIdpBlacklisted.mockResolvedValueOnce(
        false,
      );
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

    it('should failed to get identity if validation failed', async () => {
      // arrange
      const errorMock = new Error('Unknown Error');
      validateIdentityMock.mockReset().mockRejectedValueOnce(errorMock);

      // action
      await expect(
        controller.getOidcCallback(req, res, sessionServiceMock),
      ).rejects.toThrow(errorMock);

      // assert
      expect(validateIdentityMock).toHaveBeenCalledTimes(1);
      expect(validateIdentityMock).toHaveBeenCalledWith(
        idpIdMock,
        identityMock,
      );
    });

    it('should set session with identity result and interaction ID', async () => {
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

  describe('validateIdentity()', () => {
    let handleFnMock;
    let handlerMock;

    beforeEach(() => {
      handleFnMock = jest.fn();
      handlerMock = {
        handle: handleFnMock,
      };
      coreServiceMock.getFeature.mockResolvedValueOnce(handlerMock);
    });

    it('should succeed to get the right handler to validate identity', async () => {
      // arrange
      handleFnMock.mockResolvedValueOnce([]);
      // action
      await controller['validateIdentity'](idpIdMock, identityMock);
      // expect
      expect(coreServiceMock.getFeature).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.getFeature).toHaveBeenCalledWith(
        idpIdMock,
        ProcessCore.ID_CHECK,
      );
    });

    it('should succeed validate identity from feature handler', async () => {
      // arrange
      handleFnMock.mockResolvedValueOnce([]);
      // action
      await controller['validateIdentity'](idpIdMock, identityMock);
      // expect
      expect(handleFnMock).toHaveBeenCalledTimes(1);
      expect(handleFnMock).toHaveBeenCalledWith(identityMock);
    });

    it('should failed to validate identity', async () => {
      // arrange
      handleFnMock.mockResolvedValueOnce(['Unknown Error']);

      await expect(
        // action
        controller['validateIdentity'](idpIdMock, identityMock),
        // expect
      ).rejects.toThrow(CoreFcpInvalidIdentityException);
    });
  });
});
