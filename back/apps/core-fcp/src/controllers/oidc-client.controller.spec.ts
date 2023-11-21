import { Request } from 'express';
import { encode } from 'querystring';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreVerifyService, ProcessCore } from '@fc/core';
import { CryptographyService } from '@fc/cryptography';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import {
  OidcClientConfigService,
  OidcClientService,
  TokenParams,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import {
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
  SessionService,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getSessionServiceMock } from '@mocks/session';

import { GetOidcCallbackSessionDto } from '../dto';
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
  const sessionIdMock = 'sessionIdMockValue';
  const acrMock = 'acrMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdMock = 'idpIdMockValue';
  const idpLabelMock = 'idpLabelMockValue';
  const idpIdTokenMock = 'idpIdTokenMock';
  const oidcProviderLogoutFormMock =
    '<form id="idLogout" method="post" action="https://endsession"><input type="hidden" name="xsrf" value="1233456azerty"/></form>';

  const providerIdMock = 'providerIdMockValue';

  const identityMock = {
    // oidc spec defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'given_name',
    sub: '1',
  } as IOidcIdentity;

  const sessionServiceMock = getSessionServiceMock();
  const newSessionServiceMock = getSessionServiceMock();

  const req = {
    query: {
      firstQueryParam: 'first',
      secondQueryParam: 'second',
    },
    params: {
      providerUid: 'secretProviderUid',
    },
    sessionId: sessionIdMock,
    sessionService: sessionServiceMock,
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
    getEndSessionUrlFromProvider: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    businessEvent: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

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
    redirectToIdp: jest.fn(),
    getFeature: jest.fn(),
  };

  const randomStringMock = 'randomStringMockValue';
  const spIdMock = 'spIdMockValue';
  const spNameMock = 'some SP';

  const sessionDataMock: OidcSession = {
    csrfToken: randomStringMock,
    idpId: idpIdMock,
    idpLabel: idpLabelMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    idpIdToken: idpIdTokenMock,
    interactionId: interactionIdMock,

    spAcr: acrMock,
    spId: spIdMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,

    oidcProviderLogoutForm: oidcProviderLogoutFormMock,
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
  };

  const oidcClientConfigServiceMock = {
    get: jest.fn(),
  };

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const interactionMock = {
    params: {
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: Symbol('acrMock'),
    },
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
        CoreVerifyService,
        CoreFcpService,
        OidcProviderService,
        OidcClientConfigService,
        CryptographyService,
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
      .overrideProvider(CoreVerifyService)
      .useValue(coreServiceMock)
      .overrideProvider(CoreFcpService)
      .useValue(coreServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(OidcClientConfigService)
      .useValue(oidcClientConfigServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
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
    newSessionServiceMock.get.mockResolvedValue(sessionDataMock);

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
    oidcProviderServiceMock.getInteraction.mockResolvedValue(interactionMock);

    jest
      .spyOn(SessionService, 'getBoundSession')
      .mockReturnValue(newSessionServiceMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    it('should call oidcProviderService.getInteraction to retrieve dynamic parameters', async () => {
      // Given
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      // When
      await controller.redirectToIdp(
        req as unknown as Request,
        res,
        body,
        sessionServiceMock,
      );

      // Then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should throw an error if the two CSRF tokens (provided in request and previously stored in session) are not the same.', async () => {
      // Given
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };
      const error = new Error('New Error');
      sessionCsrfServiceMock.validate.mockReset().mockImplementationOnce(() => {
        throw error;
      });

      sessionServiceMock.get.mockReturnValueOnce('spId');

      // When / Then
      await expect(() =>
        controller.redirectToIdp(
          req as unknown as Request,
          res,
          body,
          sessionServiceMock,
        ),
      ).rejects.toThrow(SessionInvalidCsrfSelectIdpException);
    });

    it('should call coreService redirectToIdp', async () => {
      // Given
      const body = {
        providerUid: providerIdMock,
        csrfToken: 'csrfMockValue',
      };

      // When
      await controller.redirectToIdp(
        req as unknown as Request,
        res,
        body,
        sessionServiceMock,
      );

      // Then
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledWith(
        res,
        interactionMock.params.acr_values,
        providerIdMock,
        sessionServiceMock,
      );
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
      idpLabel: idpLabelMock,
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

    it('should detach current session', async () => {
      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);
      // Then
      expect(sessionServiceMock.detach).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.detach).toHaveBeenCalledWith(req, res);
    });

    it('should duplicate current session', async () => {
      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);
      // Then
      expect(sessionServiceMock.duplicate).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.duplicate).toHaveBeenCalledWith(
        req,
        res,
        GetOidcCallbackSessionDto,
      );
    });

    it('should call SessionService.getBoundSession', async () => {
      // setup
      const getBoundSessionMock = jest.mocked(SessionService.getBoundSession);
      // action
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // assert
      expect(getBoundSessionMock).toHaveBeenCalledTimes(1);
      expect(getBoundSessionMock).toHaveBeenCalledWith(req, 'OidcClient');
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
      expect(newSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(newSessionServiceMock.set).toHaveBeenCalledWith(
        identityExchangeMock,
      );
    });

    it('should set session on new session and not on detached one', async () => {
      // action
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // assert
      expect(newSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).not.toHaveBeenCalled();
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

  describe('logoutFromIdp', () => {
    const endsessionurlMock =
      'https://endsessionurl?id_token_hint=ureadable0123string&post_logout_redirect_uri=https://redirect-me-amigo-logout-callback&state=second-unreadble_string';
    beforeEach(() => {
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockReturnValueOnce(
        endsessionurlMock,
      );

      oidcClientConfigServiceMock.get.mockReturnValue({ stateLength: 32 });
      cryptographyMock.genRandomString.mockReturnValueOnce(idpStateMock);
    });

    it('should call oidc config', async () => {
      // When
      await controller.logoutFromIdp(res, sessionServiceMock);

      // Then
      expect(oidcClientConfigServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('Should generate a random state of 32 characters', async () => {
      // Given
      const randSize = 32;

      // When
      await controller.logoutFromIdp(res, sessionServiceMock);

      // Then
      expect(cryptographyMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyMock.genRandomString).toHaveBeenCalledWith(randSize);
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
      ).toHaveBeenCalledWith(idpIdMock, idpStateMock, idpIdTokenMock);
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
});
