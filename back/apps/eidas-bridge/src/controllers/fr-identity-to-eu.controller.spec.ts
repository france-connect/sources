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
import { LoggerService } from '@fc/logger';
import {
  OidcClientConfigService,
  OidcClientService,
  TokenParams,
} from '@fc/oidc-client';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
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

  const loggerServiceMock = getLoggerMock();

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

  const configServiceMock = getConfigMock();

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

    frIdentityToEuController = app.get<FrIdentityToEuController>(
      FrIdentityToEuController,
    );

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      nonce: idpNonceMock,
      state: stateMock,
    });

    sessionServiceOidcMock.get.mockReturnValue(sessionMockValue);

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
      // Given
      sessionServiceOidcMock.set.mockReturnValue(undefined);

      // When
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // Then
      expect(oidcClientConfigServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should generate a random state of 32 characters', async () => {
      // Given
      sessionServiceOidcMock.set.mockReturnValue(undefined);
      const randSize = 32;

      // When
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // Then
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

    it('should init the session', async () => {
      // Given
      sessionServiceOidcMock.set.mockReturnValue(undefined);
      cryptographyMock.genRandomString.mockReturnValueOnce('random');

      // When
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // Then
      expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.set).toHaveBeenCalledWith({
        idpId: idpIdMock,
        idpState: 'random',
      });
    });

    it('should return the redirect url with a 302 status code', async () => {
      // Given
      const expected = {
        statusCode: 302,
        url: '/oidc-client/redirect-to-fc-authorize',
      };

      // When
      const result = await frIdentityToEuController.initSession(
        sessionServiceOidcMock,
      );

      // Then
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
      acr_values: AcrValues.EIDAS2,
      scope: ['openid', 'given_name'],
    };
    const authorizeUrlMock = 'https://my-authentication-openid-url.com';

    const mapPartialRequestMock = jest.fn();

    beforeEach(() => {
      sessionServiceEidasMock.get.mockReturnValue({
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

    it('should get the eidas request from the session', async () => {
      // Given
      sessionServiceOidcMock.set.mockReturnValueOnce('randomStringMockValue');
      // When
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(sessionServiceEidasMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceEidasMock.get).toHaveBeenCalledWith();
    });

    it('should map eIdas request to Oidc request', async () => {
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

    it('should build the authorize parameters with the oidc params', async () => {
      sessionServiceOidcMock.set.mockReturnValueOnce('randomStringMockValue');

      // When
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toHaveBeenCalledWith();
    });

    it('should call oidc-client-service to retrieve authorize url', async () => {
      const authorizeParametersMock = {
        acr_values: oidcRequestMock.acr_values,
        nonce: idpNonceMock,
        scope: oidcRequestMock.scope.join(' '),
        state: 'state',
      };
      oidcClientServiceMock.utils.buildAuthorizeParameters.mockResolvedValueOnce(
        authorizeParametersMock,
      );
      sessionServiceOidcMock.set.mockReturnValueOnce('randomStringMockValue');

      // When
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        idpIdMock,
        {
          acr_values: authorizeParametersMock.acr_values,
          nonce: authorizeParametersMock.nonce,
          scope: authorizeParametersMock.scope,
          state: authorizeParametersMock.state,
        },
      );
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

    it('should patch the session', async () => {
      sessionServiceOidcMock.set.mockReturnValueOnce(undefined);

      // When
      await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.set).toHaveBeenCalledWith({
        idpState: stateMock,
        idpNonce: idpNonceMock,
      });
    });

    it("Should throw if the session can't be patched", async () => {
      sessionServiceOidcMock.set.mockImplementationOnce(() => {
        throw new Error('test');
      });

      // Then
      await expect(
        frIdentityToEuController.redirectToFcAuthorize(
          req,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        ),
      ).rejects.toThrow();
    });

    it('should return the authorize url with a 302 status code', async () => {
      // Given
      const expected = { statusCode: 302, url: authorizeUrlMock };
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);

      // When
      const result = await frIdentityToEuController.redirectToFcAuthorize(
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('redirectToEidasResponseProxy', () => {
    describe('query contains an oidc error', () => {
      const query = { ...oidcErrorMock };

      it('should log the error', async () => {
        // When
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // Then
        expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
        expect(loggerServiceMock.err).toHaveBeenCalledWith(
          { error: query.error },
          query.error_description,
        );
      });

      it('should call mapPartialResponseFailure', async () => {
        // When
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // Then
        expect(
          oidcToEidasServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledTimes(1);
        expect(
          oidcToEidasServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledWith(oidcErrorMock);
      });

      it('should set the session with the eidas partial failure reponse', async () => {
        // Given
        const eidasPartialFailureResponseMock = {
          status: {
            failure: true,
          },
        };
        oidcToEidasServiceMock.mapPartialResponseFailure.mockReturnValueOnce(
          eidasPartialFailureResponseMock,
        );

        // When
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // Then
        expect(sessionServiceEidasMock.set).toHaveBeenCalledTimes(1);
        expect(sessionServiceEidasMock.set).toHaveBeenCalledWith(
          'partialEidasResponse',
          eidasPartialFailureResponseMock,
        );
      });

      it('should return the eidas client response proxy url alongside a 302 status code', async () => {
        // Given
        const expected = {
          statusCode: 302,
          url: '/eidas-provider/response-proxy',
        };

        // When
        const result =
          await frIdentityToEuController.redirectToEidasResponseProxy(
            req,
            query,
            sessionServiceEidasMock,
            sessionServiceOidcMock,
          );

        // Then
        expect(result).toStrictEqual(expected);
      });
    });

    describe('query does not contains an error', () => {
      const query = {};
      const requestedAttributesMock = [EidasAttributes.PERSON_IDENTIFIER];

      let accessTokenMock;
      let validateIdentityMock;
      beforeEach(() => {
        sessionServiceOidcMock.get.mockReturnValue({
          idpNonce: idpNonceMock,
          idpState: idpStateMock,
        });
        sessionServiceEidasMock.get.mockReturnValue({
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

      it('should log an error if the oidc call rejects', async () => {
        // Given
        const errorMock = new Error('oops');
        oidcClientServiceMock.getUserInfosFromProvider.mockRejectedValueOnce(
          errorMock,
        );

        // When
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // Then
        expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
        expect(loggerServiceMock.err).toHaveBeenCalledWith(errorMock);
      });

      it('should set the session with the eidas partial failure reponse if an oidc call rejects', async () => {
        // Given
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

        // When
        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );

        // Then
        expect(sessionServiceEidasMock.set).toHaveBeenCalledTimes(1);
        expect(sessionServiceEidasMock.set).toHaveBeenCalledWith(
          'partialEidasResponse',
          eidasPartialFailureResponseMock,
        );
      });

      it('should failed if identity validation failed', async () => {
        // Given
        const errorMock = new Error('Unknown Error');
        validateIdentityMock.mockReset().mockRejectedValueOnce(errorMock);
        // When

        await frIdentityToEuController.redirectToEidasResponseProxy(
          req,
          query,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
        );
        // Then
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
      sessionServiceEidasMock.get.mockReturnValue(requestMock);

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
      // Given
      sessionServiceOidcMock.get.mockReset().mockReturnValueOnce(undefined);

      // When
      await expect(
        frIdentityToEuController['handleOidcCallbackAuthCode'](
          req,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        ),
      ).rejects.toThrow(SessionNotFoundException);

      // Then
      expect(sessionServiceOidcMock.get).toHaveBeenCalledTimes(1);
    });

    it('should get the session with the session id', async () => {
      // When
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(sessionServiceOidcMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.get).toHaveBeenCalledWith();
    });

    it('should get the token set from the idp', async () => {
      // When
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

      // When
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.getUserInfosFromProvider,
      ).toHaveBeenCalledWith(userInfoParamsMock, req);
    });

    it('should get the eidas request from the session for userinfo', async () => {
      // When
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(sessionServiceEidasMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceEidasMock.get).toHaveBeenCalledWith('eidasRequest');
    });

    it('should modify identity sub based on country code', async () => {
      // When
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
      expect(computePairwisedSubMock).toHaveBeenCalledTimes(1);
      expect(computePairwisedSubMock).toHaveBeenCalledWith(
        userInfosMock.sub,
        countryCodeMock,
      );
    });

    it('should call mapPartialResponseSuccess with the idp identity, the idp acr and the requested eidas attributes', async () => {
      // When
      await frIdentityToEuController['handleOidcCallbackAuthCode'](
        req,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // Then
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
        family_name: 'family_nameValue',
        given_name: 'given_nameValue',
      };
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should succeed to validate identity', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await frIdentityToEuController['validateIdentity'](identityMock);

      // Then
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
      // Given
      validateDtoMock.mockResolvedValueOnce(['Unknown Error']);

      await expect(
        // When
        frIdentityToEuController['validateIdentity'](identityMock),
        // Then
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
