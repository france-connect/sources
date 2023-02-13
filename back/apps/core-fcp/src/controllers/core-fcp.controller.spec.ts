import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { NotificationsService } from '@fc/notifications';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionCsrfService, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { CoreService } from '../services';
import { CoreFcpService } from '../services/core-fcp.service';
import { CoreFcpController } from './core-fcp.controller';

describe('CoreFcpController', () => {
  let coreController: CoreFcpController;

  const params = { uid: 'abcdefghijklmnopqrstuvwxyz0123456789' };
  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const spNameMock = 'some SP';
  const spTitleMock = 'title SP';
  const spIdMock = 'spIdMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';
  const idpIdMock = 'idpIdMockValue';

  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
  };

  const req = {
    fc: {
      interactionId: interactionIdMock,
    },
  };

  const interactionDetailsResolved = {
    params: {
      scope: 'toto titi',
    },
    prompt: Symbol('prompt'),
    uid: Symbol('uid'),
  };
  const providerMock = {
    interactionDetails: jest.fn(),
    interactionFinished: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const coreServiceMock = {
    getClaimsForInteraction: jest.fn(),
    getClaimsLabelsForInteraction: jest.fn(),
    getFeature: jest.fn(),
    getScopesForInteraction: jest.fn(),
    isConsentRequired: jest.fn(),
    sendAuthenticationMail: jest.fn(),
    verify: jest.fn(),
  };

  const libCoreServiceMock = {
    rejectInvalidAcr: jest.fn(),
    isAcrValid: jest.fn(),
  };

  const scopesMock = ['toto', 'titi'];
  const claimsMock = ['foo', 'bar'];
  const claimsLabelMock = ['F o o', 'B a r'];

  const identityProviderServiceMock = {
    getFilteredList: jest.fn(),
    getList: jest.fn(),
  };

  const serviceProviderServiceMock = {
    consentRequired: jest.fn(),
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

  const notificationsServiceMock = {
    getNotifications: jest.fn(),
  };

  const appConfigMock = {
    configuration: { acrValues: ['eidas2', 'eidas3'] },
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

  const serviceProviderMock = {
    identityConsent: false,
    name: spNameMock,
    title: spTitleMock,
    type: 'public',
  };

  const trackingServiceMock = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_DATATRANSFER_CONSENT_IDENTITY: {},
      FC_DATATRANSFER_INFORMATION_IDENTITY: {},
      FC_DATATRANSFER_INFORMATION_ANONYMOUS: {},
    },
  };

  const csrfMock = 'csrfMockValue';

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

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreFcpController],
      providers: [
        LoggerService,
        OidcProviderService,
        CoreFcpService,
        CoreService,
        IdentityProviderAdapterMongoService,
        ServiceProviderAdapterMongoService,
        SessionService,
        ConfigService,
        NotificationsService,
        OidcClientService,
        TrackingService,
        SessionCsrfService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CoreFcpService)
      .useValue(coreServiceMock)
      .overrideProvider(CoreService)
      .useValue(libCoreServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(NotificationsService)
      .useValue(notificationsServiceMock)
      .overrideProvider(NotificationsService)
      .useValue(notificationsServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(SessionCsrfService)
      .useValue(sessionCsrfServiceMock)
      .compile();

    coreController = await app.get<CoreFcpController>(CoreFcpController);

    configServiceMock.get.mockReturnValue(appConfigMock);

    providerMock.interactionDetails.mockResolvedValue(
      interactionDetailsResolved,
    );

    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsResolved,
    );
    serviceProviderServiceMock.getById.mockResolvedValue(serviceProviderMock);

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);

    coreServiceMock.verify.mockResolvedValue(interactionDetailsResolved);
    coreServiceMock.getClaimsForInteraction.mockReturnValue(claimsMock);
    coreServiceMock.getScopesForInteraction.mockReturnValue(scopesMock);
    coreServiceMock.isConsentRequired.mockResolvedValue(true);
    coreServiceMock.getClaimsLabelsForInteraction.mockReturnValue(
      claimsLabelMock,
    );
    libCoreServiceMock.rejectInvalidAcr.mockResolvedValue(false);

    sessionCsrfServiceMock.get.mockReturnValueOnce(csrfMock);
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
        params,
        sessionServiceMock,
      );
      // Then
      expect(result).toBeUndefined();
    });

    /*
     * @Todo #486 rework test missing assertion or not complete ones
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/486
     */
    it('should call res.render() with the interaction templates and its values', async () => {
      // Given
      const req = {
        fc: { interactionId: interactionIdMock },
      };

      const idpFilterExclude = true;

      const idpFilterList = [
        {
          maxAuthorizedAcr: 'eidas1',
          name: 'idp2',
          uid: 'idp2',
        },
        {
          maxAuthorizedAcr: 'eidas2',
          name: 'idp3',
          uid: 'idp3',
        },
        {
          maxAuthorizedAcr: 'eidas3',
          name: 'idp4',
          uid: 'idp4',
        },
      ];

      oidcProviderServiceMock.getInteraction.mockResolvedValue({
        params: {
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: 'eidas2',
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: '1234567890',
        },
        uid: 'uid',
      });

      configServiceMock.get.mockReturnValue({
        configuration: {
          acrValues: ['eidas2', 'eidas3'],
        },
      });

      libCoreServiceMock.rejectInvalidAcr.mockResolvedValue(false);

      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        idpFilterExclude,
        idpFilterList,
      });

      identityProviderServiceMock.getFilteredList.mockResolvedValueOnce(
        idpFilterList,
      );

      libCoreServiceMock.isAcrValid
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);

      const expectedProviders = [idpFilterList[1], idpFilterList[2]];
      // When
      await coreController.getInteraction(req, res, params, sessionServiceMock);
      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(
        '1234567890',
      );
      expect(identityProviderServiceMock.getFilteredList).toHaveBeenCalledTimes(
        1,
      );
      expect(identityProviderServiceMock.getFilteredList).toHaveBeenCalledWith({
        blacklist: idpFilterExclude,
        idpList: idpFilterList,
      });
      expect(libCoreServiceMock.isAcrValid).toHaveBeenCalledTimes(3);
      expect(libCoreServiceMock.isAcrValid).toHaveBeenNthCalledWith(
        1,
        idpFilterList[0].maxAuthorizedAcr,
        'eidas2',
      );
      expect(libCoreServiceMock.isAcrValid).toHaveBeenNthCalledWith(
        2,
        idpFilterList[1].maxAuthorizedAcr,
        'eidas2',
      );
      expect(libCoreServiceMock.isAcrValid).toHaveBeenNthCalledWith(
        3,
        idpFilterList[2].maxAuthorizedAcr,
        'eidas2',
      );
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('interaction', {
        csrfToken: csrfMock,
        notifications: undefined,
        params: {
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: 'eidas2',
          // oidc spec defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: '1234567890',
        },
        providers: expectedProviders,
        scope: undefined,
        spName: 'some SP',
        uid: 'uid',
      });
    });
  });

  describe('getVerify()', () => {
    describe('Idp blacklisted scenario for get oidc callback', () => {
      const res = {
        redirect: jest.fn(),
      };

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
          coreController.getVerify(req, res, params, sessionServiceMock),
        ).rejects.toThrow(errorMock);
      });

      it('idp is not blacklisted', async () => {
        // setup
        sessionServiceMock.get.mockReturnValueOnce({ spId: 'spIdValue' });
        isBlacklistedMock.mockReturnValueOnce(false);

        // action
        await coreController.getVerify(req, res, params, sessionServiceMock);

        // assert
        expect(res.redirect).toHaveBeenCalledTimes(1);
      });
    });

    it('should call coreService', async () => {
      // When
      await coreController.getVerify(req, res, params, sessionServiceMock);
      // Then
      expect(coreServiceMock.verify).toHaveBeenCalledTimes(1);
    });

    it('should redirect to /consent URL', async () => {
      // When
      await coreController.getVerify(req, res, params, sessionServiceMock);
      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(
        `/api/v2/interaction/${interactionIdMock}/consent`,
      );
    });
  });

  describe('getConsent()', () => {
    it('should get data from session', async () => {
      // When
      await coreController.getConsent(req, res, params, sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should check if consent is required', async () => {
      // When
      await coreController.getConsent(req, res, params, sessionServiceMock);
      // Then
      expect(coreServiceMock.isConsentRequired).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.isConsentRequired).toHaveBeenCalledWith(spIdMock);
    });

    it('should get data from interaction with oidc provider', async () => {
      // When
      await coreController.getConsent(req, res, params, sessionServiceMock);
      // Then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should generate a csrf token', async () => {
      // When
      await coreController.getConsent(req, res, params, sessionServiceMock);
      // Then
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledWith();
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledWith(
        sessionServiceMock,
        csrfMock,
      );
    });

    it('should return data from session for interactionId', async () => {
      // Given
      serviceProviderServiceMock.consentRequired.mockReturnValue(false);

      // When
      const result = await coreController.getConsent(
        req,
        res,
        params,
        sessionServiceMock,
      );
      // Then
      expect(result).toStrictEqual({
        claims: claimsLabelMock,
        consentRequired: true,
        csrfToken: csrfMock,
        identity: {},
        interactionId: interactionIdMock,
        scopes: scopesMock,
        spName: spNameMock,
      });
    });
  });
});
