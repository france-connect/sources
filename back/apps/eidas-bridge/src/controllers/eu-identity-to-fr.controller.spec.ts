import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  EidasLevelOfAssurances,
  EidasNameIdFormats,
  EidasResponse,
} from '@fc/eidas';
import { EidasCountryService, IEidasCountryElement } from '@fc/eidas-country';
import { EidasToOidcService, OidcToEidasService } from '@fc/eidas-oidc-mapper';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { AppConfig, EidasBridgeIdentityDto } from '../dto';
import { EidasBridgeInvalidIdentityException } from '../exceptions';
import { EuIdentityToFrController } from './eu-identity-to-fr.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

const countryListMock: IEidasCountryElement[] = [
  {
    iso: 'iso1Value',
    name: 'name1Value',
    icon: 'icon1Value',
  },
  {
    iso: 'iso2Value',
    name: 'name2Value',
    icon: 'icon2Value',
  },
];
const availableListMock: IEidasCountryElement['iso'][] = [
  'iso1Value',
  'iso2Value',
];

describe('EuIdentityToFrController', () => {
  let euIdentityToFrController: EuIdentityToFrController;

  const configMock: AppConfig = {
    apiOutputContentType: 'html',
    name: 'notUsedValue',
    urlPrefix: '',
    countryIsoList: availableListMock,
    httpsOptions: {},
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
    finishInteraction: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceOidcMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const sessionServiceEidasMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const sessionDataMock: OidcClientSession = {
    spName: 'spNameMockValue',
  };

  const res = {
    redirect: jest.fn(),
  };

  const req = {
    body: {
      country: 'BE',
    },
    fc: {
      interactionId: 'interactionIdMock',
    },
    params: {
      uid: '1234456',
    },
  };

  const interactionMock = {
    uid: Symbol('uidMockValue'),
    params: Symbol('interactionMockValue'),
  };

  const oidcToEidasServiceMock = {
    mapPartialRequest: jest.fn(),
  };

  const eidasToOidcServiceMock = {
    mapPartialResponseFailure: jest.fn(),
    mapPartialResponseSuccess: jest.fn(),
  };

  const eidasCountryServiceMock = {
    getListByIso: jest.fn(),
  };

  const sessionServiceMock = {
    setAlias: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EuIdentityToFrController],
      providers: [
        ConfigService,
        LoggerService,
        SessionService,
        OidcProviderService,
        OidcToEidasService,
        EidasToOidcService,
        EidasCountryService,
        SessionService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceOidcMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(OidcToEidasService)
      .useValue(oidcToEidasServiceMock)
      .overrideProvider(EidasToOidcService)
      .useValue(eidasToOidcServiceMock)
      .overrideProvider(EidasCountryService)
      .useValue(eidasCountryServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    euIdentityToFrController = await app.get<EuIdentityToFrController>(
      EuIdentityToFrController,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();

    configServiceMock.get.mockReturnValue(configMock);

    oidcProviderServiceMock.getInteraction.mockResolvedValue(interactionMock);
    sessionServiceOidcMock.get.mockResolvedValue(sessionDataMock);
  });

  describe('getInteraction', () => {
    beforeEach(() => {
      eidasCountryServiceMock.getListByIso.mockResolvedValueOnce(
        countryListMock,
      );
    });
    it('should call oidcProvider.getInteraction', async () => {
      // When
      await euIdentityToFrController.getInteraction(
        req,
        res,
        sessionServiceEidasMock,
        sessionServiceOidcMock,
      );

      // Then
      expect(oidcProviderServiceMock.getInteraction).toBeCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toBeCalledWith(req, res);
    });

    it('should call get the country list from the config', async () => {
      // When
      await euIdentityToFrController.getInteraction(
        req,
        res,
        sessionServiceEidasMock,
        sessionServiceOidcMock,
      );

      // Then
      expect(configServiceMock.get).toBeCalledTimes(1);
      expect(configServiceMock.get).toBeCalledWith('App');
    });

    it('should call session.get with interactionId', async () => {
      // When
      await euIdentityToFrController.getInteraction(
        req,
        res,
        sessionServiceEidasMock,
        sessionServiceOidcMock,
      );

      // Then
      expect(sessionServiceOidcMock.get).toBeCalledTimes(1);
      expect(sessionServiceOidcMock.get).toBeCalledWith();
    });

    it('should return an object with data from session and oidcProvider interaction', async () => {
      // setup

      // action
      const result = await euIdentityToFrController.getInteraction(
        req,
        res,
        sessionServiceEidasMock,
        sessionServiceOidcMock,
      );

      // expect
      expect(result).toStrictEqual({
        uid: interactionMock.uid,
        countryList: countryListMock,
        params: interactionMock.params,
        spName: sessionDataMock.spName,
      });
    });

    it('should throw an error if country service failed', async () => {
      // Given
      const errorMock = new Error('Unknown error');
      eidasCountryServiceMock.getListByIso
        .mockReset()
        .mockRejectedValueOnce(errorMock);
      // When

      await expect(
        euIdentityToFrController.getInteraction(
          req,
          res,
          sessionServiceEidasMock,
          sessionServiceOidcMock,
          // Then
        ),
      ).rejects.toThrow(errorMock);
    });
  });

  describe('finishInteraction()', () => {
    const successEidasMandatoryJsonMock: EidasResponse = {
      id: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
      inResponseToId: '1602861970744',
      issuer:
        'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
      subject: '0123456',
      subjectNameIdFormat: EidasNameIdFormats.UNSPECIFIED,
      levelOfAssurance: EidasLevelOfAssurances.SUBSTANTIAL,
      status: {
        failure: false,
      },
      attributes: {
        personIdentifier: ['BE/FR/12345'],
        currentFamilyName: ['Garcia'],
        currentGivenName: ['javier'],
        dateOfBirth: ['1964-12-31'],
      },
    };

    const successOidcJson = {
      acr: 'eidas2',
      userinfos: {
        sub: 'BE/FR/12345',
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        family_name: 'Garcia',
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        given_name: 'javier',
        birthdate: '1964-12-31',
      },
    };

    const failureEidasMandatoryJsonMock: EidasResponse = {
      id: '_BmPONbKyIB64fyNTQoyzZr_r5pXeyDGwUTS-bfo_zzhb_.Us9f.XZE2.mcqyM1u',
      inResponseToId: '1602861970744',
      issuer:
        'https://eidas-fr.docker.dev-franceconnect.fr/EidasNode/ConnectorMetadata',
      status: {
        failure: true,
      },
    };

    const failureOidcJson = {
      error: 'error',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      error_description: 'error_description',
    };

    const buildRedirectUriErrorUrlMock = jest.fn();
    const redirectUriErrorUrlMock = 'https://redirect-uri-error.url';

    let validateIdentityMock;
    beforeEach(() => {
      validateIdentityMock = jest.spyOn<EuIdentityToFrController, any>(
        euIdentityToFrController,
        'validateIdentity',
      );

      validateIdentityMock.mockResolvedValueOnce();
    });

    it('should get the eidas response from the session', async () => {
      // setup
      sessionServiceEidasMock.get.mockResolvedValue({
        eidasResponse: successEidasMandatoryJsonMock,
      });
      eidasToOidcServiceMock.mapPartialResponseSuccess.mockReturnValue(
        successOidcJson,
      );

      // action
      await euIdentityToFrController.finishInteraction(
        req,
        res,
        sessionServiceOidcMock,
        sessionServiceEidasMock,
      );

      // expect
      expect(sessionServiceEidasMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceEidasMock.get).toHaveBeenCalledWith();
    });

    describe('eidas response is a success', () => {
      beforeEach(() => {
        sessionServiceEidasMock.get.mockResolvedValueOnce({
          eidasResponse: successEidasMandatoryJsonMock,
        });
        eidasToOidcServiceMock.mapPartialResponseSuccess.mockReturnValueOnce(
          successOidcJson,
        );
      });

      it('should not call getInteraction from oidcProvider', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(oidcProviderServiceMock.getInteraction).not.toHaveBeenCalled();
      });

      it('should not call mapPartialResponseFailure from eidasToOidc', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(
          eidasToOidcServiceMock.mapPartialResponseFailure,
        ).not.toHaveBeenCalled();
      });

      it('should not call mapPartialResponseFailure from eidasToOidc', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(
          eidasToOidcServiceMock.mapPartialResponseFailure,
        ).not.toHaveBeenCalled();
      });

      it('should not call mapPartialResponseFailure from eidasToOidc', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(buildRedirectUriErrorUrlMock).not.toHaveBeenCalled();
      });

      it('should call mapPartialResponseSuccess with the eidas response to get the partial oidc response', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(
          eidasToOidcServiceMock.mapPartialResponseSuccess,
        ).toHaveBeenCalledTimes(1);
        expect(
          eidasToOidcServiceMock.mapPartialResponseSuccess,
        ).toHaveBeenCalledWith(successEidasMandatoryJsonMock);
      });

      it('should failed if userinfos are wrong and validate identity failed', async () => {
        // setup
        const errorMock = new Error('Unknown Error');
        validateIdentityMock.mockReset().mockRejectedValueOnce(errorMock);

        // action
        await expect(
          () =>
            euIdentityToFrController.finishInteraction(
              req,
              res,
              sessionServiceOidcMock,
              sessionServiceEidasMock,
            ),
          // expect
        ).rejects.toThrow('Unknown Error');

        expect(
          eidasToOidcServiceMock.mapPartialResponseSuccess,
        ).toHaveBeenCalledTimes(1);
        expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(0);
      });

      it('should `set` to update the oidc session with the identity to send to the SP', async () => {
        // setup
        const expectedUpdatedSession = {
          idpIdentity: { sub: successOidcJson.userinfos.sub },
          spAcr: successOidcJson.acr,
          spIdentity: successOidcJson.userinfos,
        };

        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(sessionServiceOidcMock.set).toHaveBeenCalledTimes(1);
        expect(sessionServiceOidcMock.set).toHaveBeenCalledWith(
          expectedUpdatedSession,
        );
      });

      it('should finish the oidc provider interaction passing req and res', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledTimes(
          1,
        );
        expect(oidcProviderServiceMock.finishInteraction).toHaveBeenCalledWith(
          req,
          res,
          sessionDataMock,
        );
      });

      it('should return the promise from the finishInteraction call', async () => {
        // setup
        const expectedPromise = new Promise((resolves) => {
          resolves(true);
        });
        oidcProviderServiceMock.finishInteraction.mockReturnValueOnce(
          expectedPromise,
        );

        // action
        const result = euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(result).toStrictEqual(expectedPromise);
      });
    });

    describe('eidas response is a failure', () => {
      const interactionMock = { params: { scope: 'openid', acr: 'eidas2' } };

      beforeEach(() => {
        sessionServiceEidasMock.get.mockResolvedValueOnce({
          eidasResponse: failureEidasMandatoryJsonMock,
        });

        oidcProviderServiceMock.getInteraction.mockResolvedValueOnce(
          interactionMock,
        );

        euIdentityToFrController['buildRedirectUriErrorUrl'] =
          buildRedirectUriErrorUrlMock;
      });

      it('should retrieves the interaction using req and res', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
        expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
          req,
          res,
        );
      });

      it('should call mapPartialResponseFailure with the eidas response to get the partial oidc response', async () => {
        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(
          eidasToOidcServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledTimes(1);
        expect(
          eidasToOidcServiceMock.mapPartialResponseFailure,
        ).toHaveBeenCalledWith(failureEidasMandatoryJsonMock);
      });

      it('should call buildRedirectUriErrorUrl with with the params from the interaction and the oidcError returned by the mapper', async () => {
        // setup
        eidasToOidcServiceMock.mapPartialResponseFailure.mockReturnValueOnce(
          failureOidcJson,
        );

        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(buildRedirectUriErrorUrlMock).toHaveBeenCalledTimes(1);
        expect(buildRedirectUriErrorUrlMock).toHaveBeenCalledWith(
          interactionMock.params,
          failureOidcJson,
        );
      });

      it('should redirect the user to the SP callback with the oidc error', async () => {
        // setup
        eidasToOidcServiceMock.mapPartialResponseFailure.mockReturnValueOnce(
          failureOidcJson,
        );
        buildRedirectUriErrorUrlMock.mockReturnValueOnce(
          redirectUriErrorUrlMock,
        );

        // action
        await euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.redirect).toHaveBeenCalledWith(redirectUriErrorUrlMock);
      });

      it('should return the promise from the res.redirect', async () => {
        // setup
        eidasToOidcServiceMock.mapPartialResponseFailure.mockReturnValueOnce(
          failureOidcJson,
        );
        const expectedPromise = new Promise((resolves) => resolves(true));
        res.redirect.mockReturnValueOnce(expectedPromise);

        // action
        const result = euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(result).toStrictEqual(expectedPromise);
      });

      it('should not call mapPartialResponseSuccess', async () => {
        // action
        euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(
          eidasToOidcServiceMock.mapPartialResponseSuccess,
        ).not.toHaveBeenCalled();
      });

      it('should not call `sessionOidc.set()`', async () => {
        // action
        euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(sessionServiceOidcMock.set).not.toHaveBeenCalled();
      });

      it('should not call finishInteraction', async () => {
        // action
        euIdentityToFrController.finishInteraction(
          req,
          res,
          sessionServiceOidcMock,
          sessionServiceEidasMock,
        );

        // expect
        expect(
          oidcProviderServiceMock.finishInteraction,
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe('validateIdentity', () => {
    let validateDtoMock;
    let identityMock;
    beforeEach(() => {
      identityMock = {
        // Oidc naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        given_name: 'given_nameValue',
        // Oidc naming convention
        // eslint-disable-next-line @typescript-eslint/naming-convention
        family_name: 'family_nameValue',
      };
      validateDtoMock = mocked(validateDto);
    });

    it('should succeed to validate identity', async () => {
      // arrange
      validateDtoMock.mockResolvedValueOnce([]);

      // action
      await euIdentityToFrController['validateIdentity'](identityMock);

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
        euIdentityToFrController['validateIdentity'](identityMock),
        // assert
      ).rejects.toThrow(EidasBridgeInvalidIdentityException);
    });
  });

  describe('buildRedirectUriErrorUrl', () => {
    it('should build a redirect uri with oidc params error', () => {
      // setup
      const oidcErrorMock = {
        error: 'error',
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'error_description',
      };
      const paramsMock = {
        // oidc param
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri: 'https://redirect.url',
        state: 'texas',
      };
      const expectedUrl =
        'https://redirect.url?error=error&error_description=error_description&state=texas';

      // action
      const result = euIdentityToFrController['buildRedirectUriErrorUrl'](
        paramsMock,
        oidcErrorMock,
      );

      // expect
      expect(result).toStrictEqual(expectedUrl);
    });
  });

  describe('redirectToFrNodeConnector', () => {
    it('should return a status code and a url', async () => {
      // When
      const result = await euIdentityToFrController.redirectToFrNodeConnector(
        req.body,
      );
      // Then
      expect(result).toEqual({
        statusCode: 302,
        url: '/eidas-client/redirect-to-fr-node-connector?country=BE',
      });
    });
  });
});
