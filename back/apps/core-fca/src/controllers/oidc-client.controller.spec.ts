import { cloneDeep } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { CsrfTokenGuard } from '@fc/csrf';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata, IOidcIdentity } from '@fc/oidc';
import {
  OidcClientConfigService,
  OidcClientService,
  OidcClientSession,
  TokenParams,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { GetOidcCallbackSessionDto, OidcIdentityDto } from '../dto';
import { CoreFcaInvalidIdentityException } from '../exceptions';
import { CoreFcaService } from '../services';
import { OidcClientController } from './oidc-client.controller';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  cloneDeep: jest.fn(),
}));

jest.mock('querystring', () => ({
  encode: jest.fn(),
}));

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
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
      checkIdpDisabled: jest.fn(),
    },
    getEndSessionUrlFromProvider: jest.fn(),
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

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

  const sessionServiceMock = getSessionServiceMock();

  const identityProviderServiceMock = {
    getById: jest.fn(),
    isActiveById: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
  };

  const configMock = {
    configuration: { acrValues: ['eidas1'] },
    defaultRedirectUri: 'https://hogwartsconnect.gouv.fr',
    scope: 'some scope',
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

  const identityMock = {
    // oidc spec defined property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'given_name',
    sub: '1',
  };

  const oidcClientSessionDataMock: OidcClientSession = {
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

  const coreServiceMock: Record<
    keyof InstanceType<typeof CoreFcaService>,
    jest.Mock
  > = {
    getFqdnFromEmail: jest.fn(),
    getIdpIdForEmail: jest.fn(),
    getIdentityProvidersByIds: jest.fn(),
    redirectToIdp: jest.fn(),
  };

  const oidcClientConfigServiceMock = {
    get: jest.fn(),
  };

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const csrfTokenGuardMock = {
    canActivate: () => true,
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
        TrackingService,
        ConfigService,
        IdentityProviderAdapterMongoService,
        OidcProviderService,
        TrackingService,
        CoreFcaService,
        OidcClientConfigService,
        CryptographyService,
      ],
    })
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfTokenGuardMock)
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
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(CoreFcaService)
      .useValue(coreServiceMock)
      .overrideProvider(OidcClientConfigService)
      .useValue(oidcClientConfigServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);

    req = {
      method: 'GET',
      statusCode: 200,
      params,
    };
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
    };

    const idpMock: Partial<IdentityProviderMetadata> = {
      name: 'nameValue',
      title: 'titleValue',
    };

    identityProviderServiceMock.getById.mockReturnValue(idpMock);
    sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      state: stateMock,
      nonce: nonceMock,
      scope: 'scopeMock',
      providerUid: providerIdMock,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
    });

    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsResolved,
    );

    configServiceMock.get.mockReturnValue(configMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getIdentityProviderSelection()', () => {
    it('should render identity providers interaction page', async () => {
      // Given
      const hogwartsProviders = [
        'gryffindor_provider_id',
        'slytherin_provider_id',
      ];

      sessionServiceMock.get.mockReturnValueOnce({
        ...oidcClientSessionDataMock,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: 'harry.potter@hogwarts.uk',
      });
      coreServiceMock.getIdpIdForEmail.mockResolvedValueOnce(hogwartsProviders);
      coreServiceMock.getIdentityProvidersByIds.mockResolvedValueOnce([
        {
          uid: 'gryffindor_provider_id',
        },
        { uid: 'slytherin_provider_id' },
      ]);

      // When
      await controller.getIdentityProviderSelection(
        'csrfMockValue',
        res,
        sessionServiceMock,
      );

      // Then
      expect(coreServiceMock.getIdentityProvidersByIds).toHaveBeenCalledTimes(
        1,
      );
      expect(coreServiceMock.getIdentityProvidersByIds).toHaveBeenCalledWith(
        ...hogwartsProviders,
      );

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('interaction-identity-provider', {
        csrfToken: 'csrfMockValue',
        email: 'harry.potter@hogwarts.uk',
        providers: [
          { uid: 'gryffindor_provider_id' },
          { uid: 'slytherin_provider_id' },
        ],
      });
    });
  });

  describe('redirectToIdp()', () => {
    it('should redirect to a given identity provider', async () => {
      // Given
      const body = {
        identityProviderUid: providerIdMock,
        csrfToken: 'csrfMockValue',
        email: 'harry.potter@hogwarts.uk',
      };

      // When
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // Then
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledWith(
        res,
        providerIdMock,
        {
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: interactionDetailsResolved.params.acr_values,
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: body.email,
        },
      );
    });

    it('should redirect to the unique identity provider', async () => {
      // Given
      const body = {
        csrfToken: 'csrfMockValue',
        email: 'harry.potter@hogwarts.uk',
      };

      coreServiceMock.getIdpIdForEmail.mockResolvedValueOnce([providerIdMock]);

      // When
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // Then
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.redirectToIdp).toHaveBeenCalledWith(
        res,
        providerIdMock,
        {
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: interactionDetailsResolved.params.acr_values,
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: body.email,
        },
      );
    });

    it('should redirect to identity provider selection page when no email was provided', async () => {
      // Given
      const body = {
        csrfToken: 'csrfMockValue',
        email: 'harry.potter@hogwarts.uk',
      };

      coreServiceMock.getIdpIdForEmail.mockResolvedValueOnce([
        'gryffindor_provider_id',
        'slytherin_provider_id',
      ]);

      // When
      await controller.redirectToIdp(req, res, body, sessionServiceMock);

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        '/api/v2/interaction/identity/select',
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

  describe('logoutFromIdp', () => {
    const endsessionurlMock =
      'https://endsessionurl?id_token_hint=ureadable0123string&post_logout_redirect_uri=https://redirect-me-amigo-logout-callback&state=second-unreadble_string';
    beforeEach(() => {
      oidcClientServiceMock.getEndSessionUrlFromProvider.mockReturnValueOnce(
        endsessionurlMock,
      );

      oidcClientConfigServiceMock.get.mockReturnValue({ stateLength: 32 });
      cryptographyMock.genRandomString.mockReturnValueOnce(stateMock);
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
      expect(sessionServiceMock.destroy).toHaveBeenCalledWith(res);
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

    it('should duplicate current session', async () => {
      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);
      // Then
      expect(sessionServiceMock.duplicate).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.duplicate).toHaveBeenCalledWith(
        res,
        GetOidcCallbackSessionDto,
      );
    });

    it('should call token with providerId', async () => {
      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // Then
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
      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // Then
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

      // When
      await expect(
        controller.getOidcCallback(req, res, sessionServiceMock),
      ).rejects.toThrow(errorMock);

      // Then
      expect(validateIdentityMock).toHaveBeenCalledTimes(1);
      expect(validateIdentityMock).toHaveBeenCalledWith(
        idpIdMock,
        identityMock,
      );
    });

    it('should create an object with cloned values', async () => {
      // Given
      const cloneDeepMock = jest.mocked(cloneDeep);

      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // Then
      expect(cloneDeepMock).toHaveBeenCalledTimes(1);
      expect(cloneDeepMock).toHaveBeenLastCalledWith(identityExchangeMock);
    });

    it('should set session with identity result.', async () => {
      // Given
      const clonedIdentityMock = Symbol();
      jest.mocked(cloneDeep).mockReturnValueOnce(clonedIdentityMock);

      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // assert
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(clonedIdentityMock);
    });

    it('should redirect user after token and userinfo received and saved', async () => {
      // When
      await controller.getOidcCallback(req, res, sessionServiceMock);

      // Then
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

      // When
      await controller['validateIdentity'](idpIdMock, identityMock);

      // Then
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
        // When
        controller['validateIdentity'](idpIdMock, identityMock),
        // Then
      ).rejects.toThrow(CoreFcaInvalidIdentityException);
    });
  });
});
