import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { MinistriesService } from '@fc/ministries';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientService, OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import {
  SessionBadFormatException,
  SessionCsrfService,
  SessionNotFoundException,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { CoreFcaService, CoreService } from '../services';
import { CoreFcaController } from './core-fca.controller';

describe('CoreFcaController', () => {
  let coreController: CoreFcaController;

  const params = { uid: 'abcdefghijklmnopqrstuvwxyz0123456789' };
  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const spIdMock = 'spIdMockValue';
  const spNameMock = 'some SP';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdMock = 'idpIdMockValue';

  let res;
  const req = {
    fc: {
      interactionId: interactionIdMock,
    },
    query: {
      firstQueryParam: 'first',
      secondQueryParam: 'second',
    },
  };

  const interactionDetailsResolved = {
    params: {
      scope: 'toto titi',
    },
    prompt: Symbol('prompt'),
    uid: Symbol('uid'),
  };

  const interactionFinishedValue = Symbol('interactionFinishedValue');
  const providerMock = {
    interactionDetails: jest.fn(),
    interactionFinished: jest.fn(),
  };

  const oidcProviderServiceMock = {
    finishInteraction: jest.fn(),
    getInteraction: jest.fn(),
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const coreServiceMock = {
    getConsent: jest.fn(),
    verify: jest.fn(),
  };

  const libCoreServiceMock = {
    rejectInvalidAcr: jest.fn(),
    isAcrValid: jest.fn(),
  };

  const ministriesServiceMock = {
    getList: jest.fn(),
  };

  const identityProviderServiceMock = {
    getFilteredList: jest.fn(),
    getList: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    setAlias: jest.fn(),
  };

  const sessionCsrfServiceMock = {
    get: jest.fn(),
    save: jest.fn(),
    validate: jest.fn(),
  };

  const randomStringMock = 'randomStringMockValue';
  const cryptographyServiceMock = {
    genRandomString: jest.fn(),
  };

  const appConfigMock = {
    configuration: { acrValues: ['eidas1'] },
    urlPrefix: '/api/v2',
  };
  const configServiceMock = {
    get: jest.fn(),
  };

  const oidcClientServiceMock = {
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    utils: {
      checkIdpBlacklisted: jest.fn(),
    },
  };

  const oidcClientSessionDataMock: OidcClientSession = {
    csrfToken: randomStringMock,
    spId: spIdMock,
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,
    spAcr: acrMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
  };

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      IDP_CALLEDBACK: {},
    },
  } as unknown as TrackingService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreFcaController],
      providers: [
        LoggerService,
        OidcProviderService,
        MinistriesService,
        CoreFcaService,
        CoreService,
        IdentityProviderAdapterMongoService,
        ServiceProviderAdapterMongoService,
        CryptographyService,
        ConfigService,
        OidcClientService,
        SessionCsrfService,
        TrackingService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(MinistriesService)
      .useValue(ministriesServiceMock)
      .overrideProvider(CoreFcaService)
      .useValue(coreServiceMock)
      .overrideProvider(CoreService)
      .useValue(libCoreServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(SessionCsrfService)
      .useValue(sessionCsrfServiceMock)
      .compile();

    coreController = await app.get<CoreFcaController>(CoreFcaController);

    jest.resetAllMocks();
    jest.restoreAllMocks();

    providerMock.interactionDetails.mockResolvedValue(
      interactionDetailsResolved,
    );
    oidcProviderServiceMock.finishInteraction.mockReturnValue(
      interactionFinishedValue,
    );
    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsResolved,
    );
    coreServiceMock.verify.mockResolvedValue(interactionDetailsResolved);
    libCoreServiceMock.rejectInvalidAcr.mockResolvedValue(false);

    serviceProviderServiceMock.getById.mockResolvedValue({
      name: spNameMock,
    });
    sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);

    sessionServiceMock.set.mockResolvedValueOnce(undefined);
    cryptographyServiceMock.genRandomString.mockReturnValue(randomStringMock);
    configServiceMock.get.mockReturnValue(appConfigMock);

    sessionCsrfServiceMock.get.mockReturnValueOnce(randomStringMock);
    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);
  });

  describe('getDefault()', () => {
    it('should redirect to configured url', () => {
      // Given
      const configuredValueMock = 'fooBar';
      configServiceMock.get.mockReturnValue({
        defaultRedirectUri: configuredValueMock,
      });
      const resMock = {
        redirect: jest.fn(),
      };
      // When
      coreController.getDefault(resMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Core');
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(301, configuredValueMock);
    });
  });

  describe('getFrontHistoryBackURL()', () => {
    // Given
    const res = { json: jest.fn() };

    it('should call `session.get()`', async () => {
      // when
      await coreController.getFrontHistoryBackURL(req, res, sessionServiceMock);
      // then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should return a SessionBadFormatException if no session is found', async () => {
      // given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // then
      expect(
        coreController.getFrontHistoryBackURL(req, res, sessionServiceMock),
      ).rejects.toThrow(SessionBadFormatException);
    });

    it('should return a SessionBadFormatException session do not contains spName', async () => {
      // given
      sessionServiceMock.get.mockResolvedValueOnce({});
      // then
      expect(
        coreController.getFrontHistoryBackURL(req, res, sessionServiceMock),
      ).rejects.toThrow(SessionBadFormatException);
    });

    it('should call `oidcProvider.getInteraction()`', async () => {
      // Given
      jest.spyOn(oidcProviderServiceMock, 'getInteraction');
      // when
      await coreController.getFrontHistoryBackURL(req, res, sessionServiceMock);
      // then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should call `res.json()`', async () => {
      // given
      oidcProviderServiceMock.getInteraction.mockResolvedValueOnce({
        params: {
          state: 'mocked state',
          // Oidc name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: 'https://youre-redirected',
        },
      });
      // when
      await coreController.getFrontHistoryBackURL(req, res, sessionServiceMock);
      // then
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        spName: 'some SP',
        redirectURIQuery: {
          state: 'mocked state',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          error_description: 'User auth aborted',
          error: 'access_denied',
        },
        redirectURI: 'https://youre-redirected',
      });
    });
  });

  describe('getFrontData()', () => {
    // Given
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };
    const idps = [
      { active: true, display: true, title: 'toto', uid: '12345' },
      { active: true, display: true, title: 'tata', uid: '12354' },
    ];
    const ministries = [
      {
        id: 'mock-ministry-id',
        identityProviders: ['12345'],
        name: 'mocked ministry',
      },
    ];

    beforeEach(() => {
      oidcProviderServiceMock.getInteraction.mockResolvedValueOnce({
        params: {
          // Oidc name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: 'eidas2',
          // Oidc name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: 'https://youre-redirected',
          // Oidc name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          response_type: 'success',
        },
      });

      res.status.mockReturnValueOnce(res);
      ministriesServiceMock.getList.mockResolvedValueOnce(ministries);
      identityProviderServiceMock.getFilteredList.mockResolvedValueOnce(idps);
    });

    it('should call `oidcProvider.getInteraction()`', async () => {
      // Given
      jest.spyOn(oidcProviderServiceMock, 'getInteraction');
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);

      // Then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should call `config.get()`', async () => {
      // Given
      jest.spyOn(configServiceMock, 'get');
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(2);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should call identityProviderGetFilteredList', async () => {
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);

      // Then
      expect(identityProviderServiceMock.getFilteredList).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should call `session.get()`', async () => {
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should call `this.csrfService.get()` and this.csrfService.save()', async () => {
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);
      // Then
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledWith();
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledWith(
        sessionServiceMock,
        randomStringMock,
      );
    });

    it('should call `res.json()`', async () => {
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);

      // Then
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should return object containing needed data', async () => {
      // When
      await coreController.getFrontData(req, res, sessionServiceMock);
      // Then
      const expected = expect.objectContaining({
        identityProviders: expect.any(Array),
        ministries: expect.any(Array),
        redirectToIdentityProviderInputs: expect.any(Object),
        redirectURL: expect.any(String),
        serviceProviderName: expect.any(String),
      });
      expect(res.json).toHaveBeenCalledWith(expected);
    });

    it('should return a SessionBadFormatException if no session is found', async () => {
      // given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      const expectedError = new Error(
        'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
      );
      // then
      await coreController.getFrontData(req, res, sessionServiceMock);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });

    it('should return a SessionBadFormatException session do not contains spName', async () => {
      // given
      sessionServiceMock.get.mockResolvedValueOnce({});
      const expectedError = new Error(
        'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
      );
      // then
      await coreController.getFrontData(req, res, sessionServiceMock);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });

  describe('getInteraction()', () => {
    /*
     * @Todo #486 rework test missing assertion or not complete ones
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/486
     */
    it('should return nothing, stop interaction, when acr value is not an allowedAcrValue', async () => {
      // Given
      const req = {
        fc: { interactionId: interactionIdMock },
      };
      const res = {
        render: jest.fn(),
      };
      oidcProviderServiceMock.getInteraction.mockResolvedValue({
        params: 'params',
        prompt: 'prompt',
        uid: 'uid',
      });
      libCoreServiceMock.rejectInvalidAcr.mockResolvedValue(true);
      // When
      const result = await coreController.getInteraction(
        req,
        res,
        sessionServiceMock,
      );
      // Then
      expect(result).toBeUndefined();
    });

    it('should return empty object', async () => {
      // Given
      oidcProviderServiceMock.getInteraction.mockResolvedValue({
        params: 'params',
        prompt: 'prompt',
        uid: 'uid',
      });
      // When
      const result = await coreController.getInteraction(
        req,
        res,
        sessionServiceMock,
      );
      // Then
      expect(result).toEqual({});
    });

    it('should throw if session is not found', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      await expect(
        coreController.getInteraction(req, res, sessionServiceMock),
      ).rejects.toThrow(SessionNotFoundException);
      // Then
    });
  });

  describe('getVerify()', () => {
    // Given
    const res = {
      redirect: jest.fn(),
    };

    it('should throw if session is not found', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(null);

      // When / Then
      await expect(() =>
        coreController.getVerify(res, params, sessionServiceMock),
      ).rejects.toThrow(SessionNotFoundException);
    });

    describe('Idp blacklisted scenario for get oidc callback', () => {
      let isBlacklistedMock;
      beforeEach(() => {
        isBlacklistedMock = oidcClientServiceMock.utils.checkIdpBlacklisted;
        isBlacklistedMock.mockReset();
      });

      it('idp is blacklisted', async () => {
        // setup
        const errorMock = new Error('New Error');
        sessionServiceMock.get.mockReturnValueOnce({ spId: 'spIdValue' });
        isBlacklistedMock.mockRejectedValueOnce(errorMock);

        // action / assert
        await expect(() =>
          coreController.getVerify(res, params, sessionServiceMock),
        ).rejects.toThrow(errorMock);
      });

      it('idp is not blacklisted', async () => {
        // setup
        sessionServiceMock.get.mockReturnValueOnce({ spId: 'spIdValue' });
        isBlacklistedMock.mockReturnValueOnce(false);

        // action
        await coreController.getVerify(res, params, sessionServiceMock);

        // assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should call coreService', async () => {
      // When
      await coreController.getVerify(res, params, sessionServiceMock);
      // Then
      expect(coreServiceMock.verify).toHaveBeenCalledTimes(1);
    });

    it('should redirect to /login URL', async () => {
      // When
      await coreController.getVerify(res, params, sessionServiceMock);
      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(`/api/v2/login`);
    });
  });
});
