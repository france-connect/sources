import { Request } from 'express';
import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { CryptographyService } from '@fc/cryptography';
import { EidasAttributes } from '@fc/eidas';
import { EidasToOidcService, OidcToEidasService } from '@fc/eidas-oidc-mapper';
import { LoggerService } from '@fc/logger';
import { AcrValues } from '@fc/oidc';
import {
  OidcClientConfigService,
  OidcClientService,
  TokenParams,
} from '@fc/oidc-client';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { EidasBridgeIdentityDto } from '../dto';
import { IDP_ID } from '../enums';
import { EidasBridgeInvalidIdentityException } from '../exceptions';
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
    trace: jest.fn(),
  } as unknown as LoggerService;

  const eidasToOidcServiceMock = {
    mapPartialRequest: jest.fn(),
  };

  const oidcToEidasServiceMock = {
    mapPartialResponseFailure: jest.fn(),
    mapPartialResponseSuccess: jest.fn(),
  };

  const sessionServiceOidcMock = {
    get: jest.fn(),
    getId: jest.fn(),
    set: jest.fn(),
  };

  const sessionServiceEidasMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const oidcErrorMock = {
    error: 'error',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    error_description: 'error_description',
  };

  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'eidas2';
  const providerUidMock = 'envIssuer';
  const randomStringMock = 'randomStringMockValue';
  const stateMock = randomStringMock;
  const sessionIdMock = randomStringMock;
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMockValue';

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const sessionMockValue = {
    idpId: providerUidMock,
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

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FrIdentityToEuController],
      providers: [
        OidcClientService,
        OidcClientConfigService,
        LoggerService,
        SessionService,
        CryptographyService,
        EidasToOidcService,
        OidcToEidasService,
      ],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(OidcClientConfigService)
      .useValue(oidcClientConfigServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceOidcMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(EidasToOidcService)
      .useValue(eidasToOidcServiceMock)
      .overrideProvider(OidcToEidasService)
      .useValue(oidcToEidasServiceMock)
      .compile();

    frIdentityToEuController = await app.get<FrIdentityToEuController>(
      FrIdentityToEuController,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      nonce: idpNonceMock,
      state: stateMock,
    });

    sessionServiceOidcMock.get.mockResolvedValue(sessionMockValue);
    sessionServiceOidcMock.getId.mockReturnValue(sessionIdMock);

    cryptographyMock.genRandomString.mockReturnValue(randomStringMock);
  });

  describe('initSession', () => {
    beforeEach(() => {
      oidcClientConfigServiceMock.get.mockReturnValue({ stateLength: 32 });
    });

    it('should call oidc config', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);

      // action
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // assertion
      expect(oidcClientConfigServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('Should generate a random sessionId and state of 32 characters', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);
      const randSize = 32;

      // action
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // assert
      expect(cryptographyMock.genRandomString).toHaveBeenCalledTimes(2);
      expect(cryptographyMock.genRandomString).toHaveBeenNthCalledWith(
        1,
        randSize,
      );
      expect(cryptographyMock.genRandomString).toHaveBeenNthCalledWith(
        2,
        randSize,
      );
    });

    it('Should init the session', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);
      cryptographyMock.genRandomString
        .mockReturnValueOnce('random1')
        .mockReturnValueOnce('random2');

      // action
      await frIdentityToEuController.initSession(sessionServiceOidcMock);

      // assert
      expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceOidcMock.set).toHaveBeenCalledWith({
        idpId: IDP_ID,
        idpState: 'random2',
        sessionId: 'random1',
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
    });

    it('Should get the eidas request from the session', async () => {
      // setup
      sessionServiceOidcMock.set.mockResolvedValueOnce('randomStringMockValue');
      // action
      await frIdentityToEuController.redirectToFcAuthorize(
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
        idpId: IDP_ID,
        scope: oidcRequestMock.scope.join(' '),
        state: 'state',
      };
      oidcClientServiceMock.utils.buildAuthorizeParameters.mockResolvedValueOnce(
        authorizeParametersMock,
      );
      sessionServiceOidcMock.set.mockResolvedValueOnce('randomStringMockValue');

      // action
      await frIdentityToEuController.redirectToFcAuthorize(
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

    it('Should patch the session', async () => {
      sessionServiceOidcMock.set.mockResolvedValueOnce(undefined);

      // action
      await frIdentityToEuController.redirectToFcAuthorize(
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

    const tokenParamsMock: TokenParams = {
      nonce: idpNonceMock,
      state: idpStateMock,
    };

    let accessTokenMock;
    let validateIdentityMock;
    beforeEach(() => {
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

    it('should call mapPartialResponseSuccess with the idp identity, the idp acr and the requested eidas attributes', async () => {
      // setup
      const userInfosMock = {
        sub: 'sub',
      };
      oidcClientServiceMock.getUserInfosFromProvider.mockResolvedValueOnce(
        userInfosMock,
      );

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
      ).toHaveBeenCalledWith(userInfosMock, acrMock, requestedAttributesMock);
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
      validateDtoMock = mocked(validateDto);
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
      ).rejects.toThrow(EidasBridgeInvalidIdentityException);
    });
  });
});
