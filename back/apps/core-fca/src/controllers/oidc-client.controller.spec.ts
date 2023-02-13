import { encode } from 'querystring';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata, IOidcIdentity } from '@fc/oidc';
import {
  OidcClientService,
  OidcClientSession,
  TokenParams,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import {
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { OidcIdentityDto } from '../dto';
import { CoreFcaInvalidIdentityException } from '../exceptions';
import { OidcClientController } from './oidc-client.controller';

jest.mock('querystring', () => ({
  encode: jest.fn(),
}));

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('OidcClient Controller', () => {
  let controller: OidcClientController;
  let res;
  let req;

  const oidcClientServiceMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
      wellKnownKeys: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      checkIdpBlacklisted: jest.fn(),
      checkCsrfTokenValidity: jest.fn(),
    },
    getEndSessionUrlFromProvider: jest.fn(),
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

  const spIdMock = 'spIdMock';
  const idpIdMock = 'idpIdMock';
  const stateMock = 'stateMock';
  const nonceMock = 'nonceMock';
  const idpIdTokenMock = 'idpIdTokenMock';
  const oidcProviderLogoutFormMock =
    '<form id="idLogout" method="post" action="https://endsession"><input type="hidden" name="xsrf" value="1233456azerty"/></form>';

  const params = { uid: 'abcdefghijklmnopqrstuvwxyz0123456789' };
  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const spNameMock = 'some SP';
  const randomStringMock = 'randomStringMockValue';

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
    destroy: jest.fn(),
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

  const configMock = {
    scope: 'some scope',
    configuration: { acrValues: ['eidas1'] },
    urlPrefix: '/api/v2',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const interactionDetailsResolved = {
    params: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'interactionDetailsResolved.acr_values',
      scope: 'toto titi',
    },
    prompt: Symbol('prompt'),
    uid: Symbol('uid'),
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
  };

  const providerIdMock = 'providerIdMockValue';
  const queryStringEncodeMock = jest.mocked(encode);

  const identityMock = {
    // oidc spec defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'given_name',
    sub: '1',
  };

  const oidcClientSessionDataMock: OidcClientSession = {
    csrfToken: randomStringMock,
    spId: spIdMock,
    idpId: idpIdMock,
    idpNonce: nonceMock,
    idpState: stateMock,
    interactionId: interactionIdMock,
    spAcr: acrMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
    idpIdToken: idpIdTokenMock,
    oidcProviderLogoutForm: oidcProviderLogoutFormMock,
  };

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      IDP_CALLEDBACK: {},
    },
  } as unknown as TrackingService;

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
        OidcProviderService,
        TrackingService,
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
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);

    req = {
      method: 'GET',
      statusCode: 200,
      params,
    };
    res = {
      redirect: jest.fn(),
    };

    const idpMock: Partial<IdentityProviderMetadata> = {
      name: 'nameValue',
      title: 'titleValue',
    };

    identityProviderServiceMock.getById.mockReturnValue(idpMock);
    sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      state: stateMock,
      nonce: nonceMock,
      scope: 'scopeMock',
      providerUid: providerIdMock,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
    });

    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);
    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsResolved,
    );

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    beforeEach(() => {
      controller['appendSpIdToAuthorizeUrl'] = jest.fn();
    });

    it('shoud call config.get to retrieve configured parameters', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // assert
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should call oidcProviderService.getInteraction to retrieve dynamic parameters', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // assert
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should call oidc-client-service to retrieve authorize url', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      const expectedGetAuthorizeCallParameter = {
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: interactionDetailsResolved.params.acr_values,
        claims: '{"id_token":{"amr":{"essential":true}}}',
        nonce: 'nonceMock',
        idpId: 'providerIdMockValue',
        scope: configMock.scope,
        state: 'stateMock',
      };

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // assert
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        expectedGetAuthorizeCallParameter,
      );
    });

    it('should call appendSpIdToAuthorizeUrl with serviceProviderId and authorizationUrl from getAuthorizeUrl', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // assert
      expect(controller['appendSpIdToAuthorizeUrl']).toHaveBeenCalledTimes(1);
      expect(controller['appendSpIdToAuthorizeUrl']).toHaveBeenCalledWith(
        spIdMock,
        authorizeUrlMock,
      );
    });

    it('should call res.redirect() with the authorizeUrl and the spId as query parameter', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';
      const authorizeUrlWithSpIdMock = `${authorizeUrlMock}&sp_id=${spIdMock}`;
      controller['appendSpIdToAuthorizeUrl'] = jest
        .fn()
        .mockReturnValueOnce(authorizeUrlWithSpIdMock);

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // assert
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(authorizeUrlWithSpIdMock);
    });

    it('should store state and nonce in session', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      const authorizeUrlMock = 'https://my-authentication-openid-url.com';

      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        idpId: body.providerUid,
        idpName: 'nameValue',
        idpLabel: 'titleValue',
        idpState: stateMock,
        idpNonce: nonceMock,
      });
    });

    it('should throw if no spId are fetchable', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw new Error();
      });

      // action
      await expect(
        controller.redirectToIdp(req, res, body, sessionServiceMock),
      ).rejects.toThrow();

      // assert
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should throw an error because idp is blacklisted', async () => {
      // Given
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'invalidCsrfMockValue',
      };
      sessionServiceMock.get.mockReturnValueOnce('spId');
      sessionCsrfServiceMock.validate.mockReset().mockImplementation(() => {
        throw new Error(
          'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
        );
      });
      // When/Then
      await expect(
        controller.redirectToIdp(req, res, body, sessionServiceMock),
      ).rejects.toThrow(SessionInvalidCsrfSelectIdpException);
    });

    it('should throw an error if the two CSRF tokens (provided in request and previously stored in session) are not the same.', async () => {
      // setup
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };
      sessionServiceMock.get.mockReturnValueOnce('spId');

      // action
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

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
          nonce: nonceMock,
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
          controller.redirectToIdp(req, res, body, sessionServiceMock),
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
          nonce: nonceMock,
          claims: 'any_formatted_json_string',
          csrfToken: 'csrfMockValue',
        };
        sessionServiceMock.get.mockReturnValueOnce({
          spId: 'spIdValue',
        });
        isBlacklistedMock.mockReturnValueOnce(false);

        // action
        await controller.redirectToIdp(req, res, body, sessionServiceMock);

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

  describe('logoutFromIdp', () => {
    const endsessionurlMock =
      'https://endsessionurl?id_token_hint=ureadable0123string&post_logout_redirect_uri=https://redirect-me-amigo-logout-callback&state=second-unreadble_string';
    beforeEach(() => {
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockReturnValueOnce(
        endsessionurlMock,
      );
    });

    it('should call sessionOidc getter', async () => {
      // When
      await controller.logoutFromIdp(res, sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call oidcClient getEndSessionUrlFromProvider', async () => {
      // When
      await controller.logoutFromIdp(res, sessionServiceMock);

      // Then
      expect(
        oidcClientServiceMock.getEndSessionUrlFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getEndSessionUrlFromProvider,
      ).toHaveBeenCalledWith(idpIdMock, stateMock, idpIdTokenMock);
    });

    it('should redirect the user to the endSessionUrl', async () => {
      // When
      await controller.logoutFromIdp(res, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(endsessionurlMock);
    });
  });

  describe('redirectAfterIdpLogout', () => {
    it('should call oidc session getter', async () => {
      // When
      await controller.redirectAfterIdpLogout(req, res, sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call session destroy', async () => {
      // When
      await controller.redirectAfterIdpLogout(req, res, sessionServiceMock);

      // Then
      expect(sessionServiceMock.destroy).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.destroy).toHaveBeenCalledWith(req, res);
    });

    it('should return oidcProviderLogoutForm', async () => {
      // When
      const result = await controller.redirectAfterIdpLogout(
        req,
        res,
        sessionServiceMock,
      );

      // Then
      expect(result).toEqual({
        oidcProviderLogoutForm: oidcProviderLogoutFormMock,
      });
    });
  });

  describe('appendSpIdToAuthorizeUrl()', () => {
    it('should return the auuthorize url with the query param sp_id', () => {
      // setup
      const authorizeUrlMock = 'https://my-authentication-openid-url.com';
      const authorizeUrlWithSpIdMock = `${authorizeUrlMock}&sp_id=${spIdMock}`;

      // action
      const result = controller['appendSpIdToAuthorizeUrl'](
        spIdMock,
        authorizeUrlMock,
      );

      // expect
      expect(result).toStrictEqual(authorizeUrlWithSpIdMock);
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
      const redirectOidcCallbackUrl = `${configMock.urlPrefix}/oidc-callback?${queryMock}`;
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
    const amrMock = Symbol('amr');

    const tokenParamsMock: TokenParams = {
      state: stateMock,
      nonce: nonceMock,
    };

    const userInfoParamsMock = {
      accessToken: accessTokenMock,
      idpId: idpIdMock,
    };

    const identityExchangeMock = {
      idpAccessToken: accessTokenMock,
      idpAcr: acrMock,
      idpIdentity: identityMock,
      amr: amrMock,
    };
    const redirectMock = `/api/v2/interaction/${interactionIdMock}/verify`;

    let validateIdentityMock;
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

    it('should throw an exception if the oidc session is not defined', async () => {
      // setup
      sessionServiceMock.get.mockReset().mockResolvedValueOnce(undefined);

      // action
      await expect(
        controller.getOidcCallback(req, res, sessionServiceMock),
      ).rejects.toThrow(SessionNotFoundException);

      // assert
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
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
        // OIDC inspired parameter name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { sp_id: spIdMock },
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

  describe('validateIdentity()', () => {
    let validateDtoMock;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should succeed to validate identity', async () => {
      // arrange
      validateDtoMock.mockResolvedValueOnce([]);

      // action
      await controller['validateIdentity'](idpIdMock, identityMock);

      // assert
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        identityMock,
        OidcIdentityDto,
        {
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
          whitelist: true,
        },
        { excludeExtraneousValues: true },
      );
    });

    it('should failed to validate identity', async () => {
      // arrange
      validateDtoMock.mockResolvedValueOnce(['Unknown Error']);

      await expect(
        // action
        controller['validateIdentity'](idpIdMock, identityMock),
        // assert
      ).rejects.toThrow(CoreFcaInvalidIdentityException);
    });
  });
});
