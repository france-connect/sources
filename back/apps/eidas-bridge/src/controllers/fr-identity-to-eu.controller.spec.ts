import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { EidasAttributes, EidasRequest } from '@fc/eidas';
import { EidasCountries } from '@fc/eidas-country';
import {
  AcrValues,
  EidasToOidcService,
  OidcToEidasService,
} from '@fc/eidas-oidc-mapper';
import { LoggerService } from '@fc/logger-legacy';
import {
  OidcClientConfigService,
  OidcClientService,
  TokenParams,
} from '@fc/oidc-client';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getSessionServiceMock } from '@mocks/session';

import { EidasBridgeIdentityDto } from '../dto';
import { EidasBridgeInvalidFRIdentityException } from '../exceptions';
import { FrIdentityToEuController } from './fr-identity-to-eu.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('FrIdentityToEuController', () => {
  let frIdentityToEuController: FrIdentityToEuController;

  const oidcClientServiceMock = {
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    utils: {
      buildAuthorizeParameters: jest.fn(),
      getAuthorizeUrl: jest.fn(),
      getTokenSet: jest.fn(),
      getUserInfo: jest.fn(),
      wellKnownKeys: jest.fn(),
    },
  };

  const oidcClientConfigServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const eidasToOidcServiceMock = {
    mapPartialRequest: jest.fn(),
  };

  const oidcToEidasServiceMock = {
    mapPartialResponseFailure: jest.fn(),
    mapPartialResponseSuccess: jest.fn(),
  };

  const sessionServiceOidcMock = getSessionServiceMock();

  const sessionServiceEidasMock = getSessionServiceMock();

  const oidcErrorMock = {
    error: 'error',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    error_description: 'error_description',
  };

  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'eidas2';
  const idpIdMock = Symbol('idpIdMock');
  const randomStringMock = 'randomStringMockValue';
  const stateMock = randomStringMock;
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMockValue';

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const cryptographyEidasMock = {
    computeSubV1: jest.fn(),
  };

  const sessionMockValue = {
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
  };

  const req = {
    body: {
      country: 'BE',
    },
    fc: {
      interactionId: interactionIdMock,
    },
    params: {
      uid: '1234456',
    },
  } as unknown as Request;

  const trackingServiceMock = {
    track: jest.fn(),
    trackExceptionIfNeeded: jest.fn(),
    TrackedEventsMap: {},
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [FrIdentityToEuController],
      providers: [
        OidcClientService,
        OidcClientConfigService,
        ConfigService,
        LoggerService,
        SessionService,
        CryptographyService,
        CryptographyEidasService,
        EidasToOidcService,
        OidcToEidasService,
        TrackingService,
      ],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(OidcClientConfigService)
      .useValue(oidcClientConfigServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceOidcMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(CryptographyEidasService)
      .useValue(cryptographyEidasMock)
      .overrideProvider(EidasToOidcService)
      .useValue(eidasToOidcServiceMock)
      .overrideProvider(OidcToEidasService)
      .useValue(oidcToEidasServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    frIdentityToEuController = await app.get<FrIdentityToEuController>(
      FrIdentityToEuController,
    );

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      nonce: idpNonceMock,
      state: stateMock,
    });

    sessionServiceOidcMock.get.mockResolvedValue(sessionMockValue);

    cryptographyMock.genRandomString.mockReturnValue(randomStringMock);
  });

  describe('initSession', () => {
    beforeEach(() => {
      oidcClientConfigServiceMock.get.mockReturnValue({ stateLength: 32 });
      frIdentityToEuController['getIdpId'] = jest
        .fn()
        .mockReturnValue(idpIdMock);
    });

    it('should call oidc config', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);

      // action
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // assertion
      expect(oidcClientConfigServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('Should generate a random state of 32 characters', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);
      const randSize = 32;

      // action
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // assert
      expect(cryptographyMock.genRandomString).toHaveBeenCalledTimes(1);
      expect(cryptographyMock.genRandomString).toHaveBeenCalledWith(randSize);
    });

    it('should get IdP id from app config', async () => {
      // When
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // Then
      expect(frIdentityToEuController['getIdpId']).toHaveBeenCalledTimes(1);
      expect(frIdentityToEuController['getIdpId']).toHaveBeenCalledWith();
    });

    it('Should init the session', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);
      cryptographyMock.genRandomString.mockReturnValueOnce('random');

      // action
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // assert
      expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.set).toHaveBeenCalledWith({
        idpId: idpIdMock,
        idpState: 'random',
      });
    });

    it('should return the redirect url with a 302 status code', async () => {
      // setup
      const expected = {
        statusCode: 302,
        url: '/oidc-client/redirect-to-fc-authorize',
      };

      // action
      const result = await frIdentityToEuController.initSession(
        sessionServiceOidcMock,
      );

      // expect
      expect(result).toEqual(expected);
    });
  });

  describe('redirectToFcAuthorize()', () => {
    const eidasRequestMock = {
      id: 'id',
      levelOfAssurance: 'levelOfAssurance',
      relayState: 'relayState',
    };
    const oidcRequestMock = {
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: AcrValues.EIDAS2,
      scope: ['openid', 'given_name'],
    };
    const authorizeUrlMock = 'https://my-authentication-openid-url.com';

    const mapPartialRequestMock = jest.fn();

    beforeEach(() => {
      sessionServiceEidasMock.get.mockResolvedValueOnce({
        eidasRequest: eidasRequestMock,
      });
      eidasToOidcServiceMock.mapPartialRequest =
        mapPartialRequestMock.mockReturnValueOnce(oidcRequestMock);
      oidcClientServiceMock.utils.getAuthorizeUrl.mockReturnValueOnce(
        authorizeUrlMock,
      );
      frIdentityToEuController['getIdpId'] = jest
        .fn()
        .mockReturnValue(idpIdMock);
    });

    it('Should get the eidas request from the session', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce('randomStringMockValue');
      // action
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // assert
      expect(sessionServiceEidasMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceEidasMock.get).toHaveBeenCalledWith();
    });

    it('Should map eIdas request to Oidc request', async () => {
      // Given
      // When
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );
      // Then
      expect(eidasToOidcServiceMock.mapPartialRequest).toHaveBeenCalledTimes(1);
      expect(eidasToOidcServiceMock.mapPartialRequest).toHaveBeenCalledWith(
        eidasRequestMock,
      );
    });

    it('Should build the authorize parameters with the oidc params', async () => {
      sessionServiceOidcMock.set.mockResolvedValueOnce('randomStringMockValue');

      // action
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // assert
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toHaveBeenCalledWith();
    });

    it('Should call oidc-client-service to retrieve authorize url', async () => {
      const authorizeParametersMock = {
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: oidcRequestMock.acr_values,
        nonce: idpNonceMock,
        idpId: idpIdMock,
        scope: oidcRequestMock.scope.join(' '),
        state: 'state',
      };
      oidcClientServiceMock.utils.buildAuthorizeParameters.mockResolvedValueOnce(
        authorizeParametersMock,
      );
      sessionServiceOidcMock.set.mockResolvedValueOnce('randomStringMockValue');

      // action
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // assert
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: authorizeParametersMock.acr_values,
        nonce: authorizeParametersMock.nonce,
        idpId: authorizeParametersMock.idpId,
        scope: authorizeParametersMock.scope,
        state: authorizeParametersMock.state,
      });
    });

    it('should get IdP id from app config', async () => {
      // When
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(frIdentityToEuController['getIdpId']).toHaveBeenCalledTimes(1);
      expect(frIdentityToEuController['getIdpId']).toHaveBeenCalledWith();
    });

    it('Should patch the session', async () => {
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);

      // action
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.set).toHaveBeenCalledWith({
        idpState: stateMock,
        idpNonce: idpNonceMock,
      });
    });

    it("Should throw if the session can't be patched", async () => {
      sessionServiceOidcMock.set.mockRejectedValueOnce(new Error('test'));

      // expect
      await expect(
        frIdentityToEuController.redirectToFcAuthorize(
          req,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        ),
      ).rejects.toThrow();
    });

    it('Should return the authorize url with a 302 status code', async () => {
      // setup
      const expected = { statusCode: 302, url: authorizeUrlMock };
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);

      // action
      const result = await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('redirectToEidasResponseProxy', () => {
    describe('query contains an oidc error', () => {
      const query = { ...oidcErrorMock };

      it('should call mapPartialResponseFailure', async () => {
        // action
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // expect
        expect(
          oidcToEidasServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledTimes(1);
        expect(
          oidcToEidasServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledWith(oidcErrorMock);
      });

      it('should set the session with the eidas partial failure reponse', async () => {
        // setup
        const eidasPartialFailureResponseMock = {
          status: {
            failure: true,
          },
        };
        oidcToEidasServiceMock.mapPartialResponseFailure.mockReturnValueOnce(
          eidasPartialFailureResponseMock,
        );

        // action
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // expect
        expect(sessionServiceEidasMock.set).toHaveBeenCalledTimes(1);
        expect(sessionServiceEidasMock.set).toHaveBeenCalledWith(
          'partialEidasResponse',
          eidasPartialFailureResponseMock,
        );
      });

      it('should return the eidas client response proxy url alongside a 302 status code', async () => {
        // setup
        const expected = {
          statusCode: 302,
          url: '/eidas-provider/response-proxy',
        };

        // action
        const result =
          await frIdentityToEuController.redirectToEidasResponseProxy(
            req,
            query,
            sessionServiceEidasMock,
            sessionServiceOidcMock,
          );

        // expect
        expect(result).toStrictEqual(expected);
      });
    });

    describe('query does not contains an error', () => {
      const query = {};
      const requestedAttributesMock = [EidasAttributes.PERSON_IDENTIFIER];

      let accessTokenMock;
      let validateIdentityMock;
      beforeEach(() => {
        sessionServiceOidcMock.get.mockResolvedValueOnce({
          idpNonce: idpNonceMock,
          idpState: idpStateMock,
        });
        sessionServiceEidasMock.get.mockResolvedValueOnce({
          requestedAttributes: requestedAttributesMock,
        });

        accessTokenMock = Symbol('accessTokenMock');

        oidcClientServiceMock.getTokenFromProvider.mockResolvedValueOnce({
          accessToken: accessTokenMock,
          acr: acrMock,
        });

        validateIdentityMock = jest.spyOn<FrIdentityToEuController, any>(
          frIdentityToEuController,
          'validateIdentity',
        );
        validateIdentityMock.mockResolvedValueOnce();
      });

      it('should set the session with the eidas partial failure reponse if an oidc call rejects', async () => {
        // setup
        const errorMock = new Error('oops');
        oidcClientServiceMock.getUserInfosFromProvider.mockRejectedValueOnce(
          errorMock,
        );
        const eidasPartialFailureResponseMock = {
          status: {
            failure: true,
          },
        };
        oidcToEidasServiceMock.mapPartialResponseFailure.mockReturnValueOnce(
          eidasPartialFailureResponseMock,
        );

        // action
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // expect
        expect(sessionServiceEidasMock.set).toHaveBeenCalledTimes(1);
        expect(sessionServiceEidasMock.set).toHaveBeenCalledWith(
          'partialEidasResponse',
          eidasPartialFailureResponseMock,
        );
      });

      it('should failed if identity validation failed', async () => {
        // setup
        const errorMock = new Error('Unknown Error');
        validateIdentityMock.mockReset().mockRejectedValueOnce(errorMock);
        // action

        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );
        // expect
        expect(
          oidcToEidasServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledTimes(1);
        expect(
          oidcToEidasServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledWith(errorMock);
      });
    });
  });

  describe('handleOidcCallbackAuthCode', () => {
    const requestedAttributesMock = [EidasAttributes.PERSON_IDENTIFIER];
    const countryCodeMock = EidasCountries.FRANCE;
    const tokenParamsMock: TokenParams = {
      nonce: idpNonceMock,
      state: idpStateMock,
    };

    const userInfosMock = Object.freeze({
      sub: 'sub',
    });
    const subPairwisedMock = 'subPairwiseValue';

    let accessTokenMock;
    let validateIdentityMock;
    let computePairwisedSubMock;

    const requestMock: Partial<EidasRequest> = {
      requestedAttributes: requestedAttributesMock,
      spCountryCode: countryCodeMock,
    };
    beforeEach(() => {
      sessionServiceEidasMock.get.mockResolvedValueOnce(requestMock);

      accessTokenMock = Symbol('accessTokenMock');

      oidcClientServiceMock.getTokenFromProvider.mockResolvedValueOnce({
        accessToken: accessTokenMock,
        acr: acrMock,
      });

      validateIdentityMock = jest.spyOn<FrIdentityToEuController, any>(
        frIdentityToEuController,
        'validateIdentity',
      );
      validateIdentityMock.mockResolvedValueOnce();

      computePairwisedSubMock = jest.spyOn<FrIdentityToEuController, any>(
        frIdentityToEuController,
        'computePairwisedSub',
      );

      computePairwisedSubMock.mockReturnValueOnce(subPairwisedMock);

      oidcClientServiceMock.getUserInfosFromProvider.mockResolvedValueOnce({
        ...userInfosMock,
      });
    });

    it('should throw an exception if the oidc session is not defined', async () => {
      // setup
      sessionServiceOidcMock.get.mockReset().mockResolvedValueOnce(undefined);

      // action
      await expect(
        frIdentityToEuController['handleOidcCallbackAuthCode'](
          req,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        ),
      ).rejects.toThrow(SessionNotFoundException);

      // assert
      expect(sessionServiceOidcMock.get).toHaveBeenCalledTimes(1);
    });

    it('should get the session with the session id', async () => {
      // action
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(sessionServiceOidcMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.get).toHaveBeenCalledWith();
    });

    it('should get the token set from the idp', async () => {
      // action
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      expect(oidcClientServiceMock.getTokenFromProvider).toHaveBeenCalledTimes(
        1,
      );

      expect(oidcClientServiceMock.getTokenFromProvider).toHaveBeenCalledWith(
        sessionMockValue.idpId,
        tokenParamsMock,
        req,
      );
    });

    it('should get userInfo from token response', async () => {
      const userInfoParamsMock = {
        accessToken: accessTokenMock,
        idpId: sessionMockValue.idpId,
      };

      // action
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledWith(userInfoParamsMock, req);
    });

    it('should get the eidas request from the session for userinfo', async () => {
      // action
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(sessionServiceEidasMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceEidasMock.get).toHaveBeenCalledWith('eidasRequest');
    });

    it('should modify identity sub based on country code', async () => {
      // action
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(computePairwisedSubMock).toHaveBeenCalledTimes(1);
      expect(computePairwisedSubMock).toHaveBeenCalledWith(
        userInfosMock.sub,
        countryCodeMock,
      );
    });

    it('should call mapPartialResponseSuccess with the idp identity, the idp acr and the requested eidas attributes', async () => {
      // action
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(
        oidcToEidasServiceMock.mapPartialResponseSuccess,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcToEidasServiceMock.mapPartialResponseSuccess,
      ).toHaveBeenCalledWith(
        { sub: subPairwisedMock },
        acrMock,
        requestedAttributesMock,
      );
    });
  });

  describe('validateIdentity', () => {
    let validateDtoMock;
    let identityMock;
    beforeEach(() => {
      identityMock = {
        // Oidc naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        family_name: 'family_nameValue',
        // Oidc naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        given_name: 'given_nameValue',
      };
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should succeed to validate identity', async () => {
      // arrange
      validateDtoMock.mockResolvedValueOnce([]);

      // action
      await frIdentityToEuController['validateIdentity'](identityMock);

      // assert
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        identityMock,
        EidasBridgeIdentityDto,
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
        frIdentityToEuController['validateIdentity'](identityMock),
        // assert
      ).rejects.toThrow(EidasBridgeInvalidFRIdentityException);
    });
  });

  describe('computePairwisedSub()', () => {
    const countryMock = 'FR';
    const idpSubMock = 'subMockValue';
    const subComputedMock = Symbol('subv1');

    beforeEach(() => {
      cryptographyEidasMock.computeSubV1.mockReturnValueOnce(subComputedMock);
    });

    it('should compute Sub with Identityhash and country', () => {
      // When
      frIdentityToEuController['computePairwisedSub'](idpSubMock, countryMock);

      // Then
      expect(cryptographyEidasMock.computeSubV1).toHaveBeenCalledTimes(1);
      expect(cryptographyEidasMock.computeSubV1).toHaveBeenCalledWith(
        countryMock,
        idpSubMock,
      );
    });

    it('should return a pairwised sub based on original idp sub and country code', () => {
      // When
      const result = frIdentityToEuController['computePairwisedSub'](
        idpSubMock,
        countryMock,
      );

      // Then
      expect(result).toBe(subComputedMock);
    });
  });

  describe('getIdpId()', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        idpId: idpIdMock,
      });
    });

    it('should get the idpId from the config', () => {
      // When
      frIdentityToEuController['getIdpId']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should return the idpId from the config', () => {
      // When
      const result = frIdentityToEuController['getIdpId']();

      // Then
      expect(result).toBe(idpIdMock);
    });
  });
});
