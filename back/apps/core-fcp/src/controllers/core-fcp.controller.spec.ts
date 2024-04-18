import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreAcrService, CoreRoutes, CoreVerifyService } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { NotificationsService } from '@fc/notifications';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientRoutes, OidcClientService } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackedEventInterface, TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpService, CoreFcpVerifyService } from '../services';
import { CoreFcpController } from './core-fcp.controller';

describe('CoreFcpController', () => {
  let coreController: CoreFcpController;

  const params = {
    uid: 'abcdefghijklmnopqrstuvwxyz0123456789',
  };
  const interactionIdMock = 'interactionIdMockValue';
  const acrMock = 'acrMockValue';
  const spNameMock = 'some SP';
  const spTitleMock = 'title SP';
  const spIdMock = 'spIdMockValue';
  const idpAcrMock = 'idpAcrMockValue';
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
  } as unknown as Request;

  const interactionDetailsMock = {
    params: {
      // oidc params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'toto titi',
      // oidc params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'client_id',
      scope: 'openid',
    },
    prompt: Symbol('prompt'),
    uid: Symbol('uid'),
  };
  const providerMock = {
    interactionDetails: jest.fn(),
    interactionFinished: jest.fn(),
  };

  const oidcAcrServiceMock = {
    isAcrValid: jest.fn(),
  };

  const coreAcrServiceMock = {
    rejectInvalidAcr: jest.fn(),
  };

  const oidcProviderServiceMock = {
    getInteraction: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  const coreFcpServiceMock = {
    getClaimsForInteraction: jest.fn(),
    getClaimsLabelsForInteraction: jest.fn(),
    getFeature: jest.fn(),
    getScopesForInteraction: jest.fn(),
    isConsentRequired: jest.fn(),
    isInsufficientAcrLevel: jest.fn(),
    sendAuthenticationMail: jest.fn(),
  };

  const coreVerifyServiceMock = {
    verify: jest.fn(),
    handleUnavailableIdp: jest.fn(),
  };

  const coreFcpVerifyServiceMock = {
    handleVerifyIdentity: jest.fn(),
    handleInsufficientAcrLevel: jest.fn(),
  };

  const scopesMock = ['toto', 'titi'];
  const claimsMock = ['foo', 'bar'];
  const claimsLabelMock = ['F o o', 'B a r'];

  const identityProviderServiceMock = {
    getFilteredList: jest.fn(),
    getList: jest.fn(),
    isActiveById: jest.fn(),
  };

  const serviceProviderServiceMock = {
    shouldExcludeIdp: jest.fn(),
    consentRequired: jest.fn(),
    getById: jest.fn(),
  };

  const oidcSessionServiceMock = getSessionServiceMock();

  const appSessionServiceMock = getSessionServiceMock();

  const randomStringMock = 'randomStringMockValue';

  const notificationsServiceMock = {
    getNotificationToDisplay: jest.fn(),
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

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_SHOWED_IDP_CHOICE: Symbol(
        'FC_SHOWED_IDP_CHOICE',
      ) as unknown as TrackedEventInterface,
      FC_IDP_INSUFFICIENT_ACR: Symbol(
        'FC_IDP_INSUFFICIENT_ACR',
      ) as unknown as TrackedEventInterface,
    },
  } as unknown as TrackingService;

  const serviceProviderMock = {
    identityConsent: false,
    name: spNameMock,
    title: spTitleMock,
    type: 'public',
  };

  const csrfToken = randomStringMock;
  const oidcSessionMock: OidcSession = {
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,

    idpAcr: idpAcrMock,
    spAcr: acrMock,
    spId: spIdMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
    stepRoute: '/some/route',
  };

  const notificationsMock = Symbol('notifications');

  const handleVerifyResult = 'urlPrefixValue/login';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreFcpController],
      providers: [
        LoggerService,
        OidcAcrService,
        OidcProviderService,
        CoreFcpService,
        IdentityProviderAdapterMongoService,
        ServiceProviderAdapterMongoService,
        SessionService,
        ConfigService,
        NotificationsService,
        OidcClientService,
        CoreAcrService,
        CoreVerifyService,
        CoreFcpVerifyService,
        TrackingService,
      ],
    })
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CoreFcpService)
      .useValue(coreFcpServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(oidcSessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(NotificationsService)
      .useValue(notificationsServiceMock)
      .overrideProvider(NotificationsService)
      .useValue(notificationsServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
      .overrideProvider(CoreVerifyService)
      .useValue(coreVerifyServiceMock)
      .overrideProvider(CoreFcpVerifyService)
      .useValue(coreFcpVerifyServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    coreController = app.get<CoreFcpController>(CoreFcpController);

    configServiceMock.get.mockReturnValue(appConfigMock);

    providerMock.interactionDetails.mockResolvedValue(interactionDetailsMock);

    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsMock,
    );
    serviceProviderServiceMock.getById.mockResolvedValue(serviceProviderMock);

    oidcSessionServiceMock.get.mockReturnValue(oidcSessionMock);

    coreVerifyServiceMock.verify.mockResolvedValue(interactionDetailsMock);
    coreFcpServiceMock.getClaimsForInteraction.mockReturnValue(claimsMock);
    coreFcpServiceMock.getScopesForInteraction.mockReturnValue(scopesMock);
    coreFcpServiceMock.isConsentRequired.mockResolvedValue(true);
    coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValue(false);
    coreFcpServiceMock.getClaimsLabelsForInteraction.mockReturnValue(
      claimsLabelMock,
    );
    coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(false);

    serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(true);

    identityProviderServiceMock.isActiveById.mockResolvedValue(true);
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
    const req = {
      fc: { interactionId: interactionIdMock },
    };

    const idpFilterExcludeMock = true;

    const aidantsConnectProviderMock = {
      maxAuthorizedAcr: 'eidas1',
      name: 'idp-aidants-connect',
      uid: 'idp-aidants-connect-uid',
      active: true,
      display: true,
    };

    const idpFilterListMock = [
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

    beforeEach(() => {
      oidcProviderServiceMock.getInteraction.mockResolvedValue(
        interactionDetailsMock,
      );
      coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(false);
      serviceProviderServiceMock.getById.mockReturnValue({
        idpFilterExclude: idpFilterExcludeMock,
        idpFilterList: idpFilterListMock,
      });
      identityProviderServiceMock.getFilteredList.mockResolvedValue(
        idpFilterListMock,
      );
      appSessionServiceMock.get.mockReturnValue(false);
      oidcAcrServiceMock.isAcrValid.mockReturnValue(true);
      coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValue(false);
      notificationsServiceMock.getNotificationToDisplay.mockResolvedValue(
        notificationsMock,
      );
    });

    it('should call sessionOidc.get', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(oidcSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(oidcSessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should call oidcProvider.getInteraction', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should retrieve get the OidcProvider config', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(configServiceMock.get).toHaveBeenNthCalledWith(1, 'OidcProvider');
    });

    it('should call coreAcrService.rejectInvalidAcr() with interaction acrValues, authorizedAcrValues, req and res', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(coreAcrServiceMock.rejectInvalidAcr).toHaveBeenCalledTimes(1);
      expect(coreAcrServiceMock.rejectInvalidAcr).toHaveBeenCalledWith(
        interactionDetailsMock.params.acr_values,
        appConfigMock.configuration.acrValues,
        { req, res },
      );
    });

    it('should not render anything and return if acr value is not an allowedAcrValue', async () => {
      // Given
      coreAcrServiceMock.rejectInvalidAcr.mockResolvedValueOnce(true);

      // When
      const result = await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(result).toBeUndefined();
      expect(res.render).not.toHaveBeenCalled();
    });

    it('should retrieve the service provider given the client_id', async () => {
      // Given

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(
        interactionDetailsMock.params.client_id,
      );
    });

    it('should retrieve the idp list given the service provider blacklist / whitelist', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(identityProviderServiceMock.getFilteredList).toHaveBeenCalledTimes(
        1,
      );
      expect(identityProviderServiceMock.getFilteredList).toHaveBeenCalledWith({
        blacklist: idpFilterExcludeMock,
        idpList: idpFilterListMock,
      });
    });

    it('should retrieve the isSuspicious status from AppSession', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(appSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(appSessionServiceMock.get).toHaveBeenCalledWith('isSuspicious');
    });

    it('should check all identity providers against requested acrValue', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(3);
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenNthCalledWith(
        1,
        idpFilterListMock[0].maxAuthorizedAcr,
        interactionDetailsMock.params.acr_values,
      );
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenNthCalledWith(
        2,
        idpFilterListMock[1].maxAuthorizedAcr,
        interactionDetailsMock.params.acr_values,
      );
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenNthCalledWith(
        3,
        idpFilterListMock[2].maxAuthorizedAcr,
        interactionDetailsMock.params.acr_values,
      );
    });

    it('should check all valid identity providers against the suspicious context', async () => {
      // Given
      oidcAcrServiceMock.isAcrValid
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenCalledTimes(
        3,
      );
      expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenNthCalledWith(
        1,
        idpFilterListMock[0].maxAuthorizedAcr,
        false,
      );
      expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenNthCalledWith(
        2,
        idpFilterListMock[1].maxAuthorizedAcr,
        false,
      );
      expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenNthCalledWith(
        3,
        idpFilterListMock[2].maxAuthorizedAcr,
        false,
      );
    });

    it('should retrieve get the App config', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(configServiceMock.get).toHaveBeenNthCalledWith(2, 'App');
    });

    it('should return aidantsConnect as undefined in response if AidantsConnect provider is not deplayed', async () => {
      // Given
      aidantsConnectProviderMock.display = false;
      aidantsConnectProviderMock.active = true;

      identityProviderServiceMock.getFilteredList.mockResolvedValue([
        aidantsConnectProviderMock,
      ]);

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('interaction', {
        csrfToken,
        notification: notificationsMock,
        params: interactionDetailsMock.params,
        providers: [aidantsConnectProviderMock],
        aidantsConnect: undefined,
        spName: oidcSessionMock.spName,
        spScope: interactionDetailsMock.params.scope,
        errorContext: { hasError: false, idpLabel: null },
      });
    });

    it('should return aidantsConnect as undefined in response if AidantsConnect provider is not active', async () => {
      // Given
      aidantsConnectProviderMock.display = true;
      aidantsConnectProviderMock.active = false;

      identityProviderServiceMock.getFilteredList.mockResolvedValue([
        aidantsConnectProviderMock,
      ]);

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('interaction', {
        csrfToken,
        notification: notificationsMock,
        params: interactionDetailsMock.params,
        providers: [aidantsConnectProviderMock],
        aidantsConnect: undefined,
        spName: oidcSessionMock.spName,
        spScope: interactionDetailsMock.params.scope,
        errorContext: { hasError: false, idpLabel: null },
      });
    });

    it('should return aidantsConnect object if AidantsConnect is defined into the provider list', async () => {
      // Given
      aidantsConnectProviderMock.display = true;
      aidantsConnectProviderMock.active = true;

      configServiceMock.get.mockReturnValue({
        ...appConfigMock,
        aidantsConnectUid: 'idp-aidants-connect-uid',
      });

      identityProviderServiceMock.getFilteredList.mockResolvedValue([
        aidantsConnectProviderMock,
      ]);

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith('interaction', {
        csrfToken,
        notification: notificationsMock,
        params: interactionDetailsMock.params,
        providers: [aidantsConnectProviderMock],
        aidantsConnect: aidantsConnectProviderMock,
        spName: oidcSessionMock.spName,
        spScope: interactionDetailsMock.params.scope,
        errorContext: { hasError: false, idpLabel: null },
      });
    });

    it('should get the notifications list', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(
        notificationsServiceMock.getNotificationToDisplay,
      ).toHaveBeenCalledTimes(1);
      expect(
        notificationsServiceMock.getNotificationToDisplay,
      ).toHaveBeenCalledWith();
    });

    it('should track the event FC_SHOWED_IDP_CHOICE', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.FC_SHOWED_IDP_CHOICE,
        { req },
      );
    });

    it('should not track the event FC_SHOWED_IDP_CHOICE if the page is refresh', async () => {
      // Given
      oidcSessionServiceMock.get.mockReturnValueOnce({
        ...oidcSessionMock,
        stepRoute: CoreRoutes.INTERACTION,
      });

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(0);
    });

    it('should call the res.render method when stepRoute is defined to OidcClientRoutes.OIDC_CALLBACK', async () => {
      // Given
      const idpLabelMock = 'idpLabel';

      oidcSessionServiceMock.get.mockReturnValueOnce({
        ...oidcSessionMock,
        stepRoute: OidcClientRoutes.OIDC_CALLBACK,
        spName: oidcSessionMock.spName,
        idpLabel: idpLabelMock,
      });

      const expectedInteractionDetails = {
        csrfToken,
        notification: notificationsMock,
        params: interactionDetailsMock.params,
        providers: idpFilterListMock,
        aidantsConnect: undefined,
        spName: oidcSessionMock.spName,
        spScope: interactionDetailsMock.params.scope,
        errorContext: { hasError: true, idpLabel: idpLabelMock },
      };

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(
        'interaction',
        expectedInteractionDetails,
      );
    });

    it("should call res.render method with default parameters when it's first time", async () => {
      // Given
      oidcSessionServiceMock.get.mockReturnValue({
        spName: oidcSessionMock.spName,
      });
      const expectedInteractionDetails = {
        csrfToken,
        notification: notificationsMock,
        params: interactionDetailsMock.params,
        providers: idpFilterListMock,
        aidantsConnect: undefined,
        spName: oidcSessionMock.spName,
        spScope: interactionDetailsMock.params.scope,
        errorContext: { hasError: false, idpLabel: null },
      };

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(
        'interaction',
        expectedInteractionDetails,
      );
    });

    it('should return the result of res.render()', async () => {
      // Given
      const renderResult = Symbol('renderResult');
      res.render.mockReturnValueOnce(renderResult);

      // When
      const result = await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
        csrfToken,
      );

      // Then
      expect(result).toStrictEqual(renderResult);
    });
  });

  describe('getVerify()', () => {
    const resMock = {
      redirect: jest.fn(),
    };

    const reqMock = {
      foo: 'bar',
    };

    const paramsMock = {
      uid: 'uidMockValue',
    };

    const oidcSessionMock = {
      idpId: 'idpIdMockValue',
      idpAcr: 'idpAcrMockValue',
      interactionId: 'interactionIdMockValue',
      spId: 'spIdMockValue',
    };

    beforeEach(() => {
      oidcSessionServiceMock.get.mockReturnValue(oidcSessionMock);
      identityProviderServiceMock.isActiveById.mockResolvedValue(true);
      serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(false);
      appSessionServiceMock.get.mockReturnValue(false);
      coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValue(false);
      coreFcpVerifyServiceMock.handleVerifyIdentity.mockResolvedValue(
        handleVerifyResult,
      );
    });

    it('should get the oidcSession', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(oidcSessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should get the App config', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should check if idp is active', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(identityProviderServiceMock.isActiveById).toHaveBeenCalledTimes(1);
      expect(identityProviderServiceMock.isActiveById).toHaveBeenCalledWith(
        oidcSessionMock.idpId,
      );
    });

    it('should check if idp is blacklisted', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(serviceProviderServiceMock.shouldExcludeIdp).toHaveBeenCalledTimes(
        1,
      );
      expect(serviceProviderServiceMock.shouldExcludeIdp).toHaveBeenCalledWith(
        oidcSessionMock.spId,
        oidcSessionMock.idpId,
      );
    });

    it('should retrieve suspicious context from AppSession', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(appSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(appSessionServiceMock.get).toHaveBeenCalledWith('isSuspicious');
    });

    it('should check if acr level is sufficient', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenCalledTimes(
        1,
      );
      expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenCalledWith(
        oidcSessionMock.idpAcr,
        false,
      );
    });

    it('should verify the identity', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(
        coreFcpVerifyServiceMock.handleVerifyIdentity,
      ).toHaveBeenCalledTimes(1);
      expect(
        coreFcpVerifyServiceMock.handleVerifyIdentity,
      ).toHaveBeenCalledWith(reqMock, {
        interactionId: oidcSessionMock.interactionId,
        sessionOidc: oidcSessionServiceMock,
        urlPrefix: appConfigMock.urlPrefix,
      });
    });

    it('should redirect to the result of coreFcpVerifyService.handleVerifyIdentity()', async () => {
      // When
      await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(handleVerifyResult);
    });

    it('should return the result of res.redirect()', async () => {
      // Given
      const redirectResult = Symbol('redirectResult');
      resMock.redirect.mockReturnValueOnce(redirectResult);

      // When
      const result = await coreController.getVerify(
        reqMock,
        resMock,
        paramsMock,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // Then
      expect(result).toStrictEqual(redirectResult);
    });

    describe('when idp is not active', () => {
      beforeEach(() => {
        identityProviderServiceMock.isActiveById.mockResolvedValue(false);
      });

      it('should call coreVerifyService.handleUnavailableIdp()', async () => {
        // Given
        const handleUnavailableIdpParamsMock = {
          interactionId: 'interactionIdMockValue',
          sessionOidc: oidcSessionServiceMock,
          urlPrefix: appConfigMock.urlPrefix,
        };

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(
          coreVerifyServiceMock.handleUnavailableIdp,
        ).toHaveBeenCalledTimes(1);
        expect(coreVerifyServiceMock.handleUnavailableIdp).toHaveBeenCalledWith(
          reqMock,
          handleUnavailableIdpParamsMock,
          true,
        );
      });

      it('should call res.redirect() with the result of coreVerifyService.handleUnavailableIdp()', async () => {
        // Given
        const expectHandleUnavailableIdpResult = Symbol(
          'expectHandleUnavailableIdpResult',
        );
        coreVerifyServiceMock.handleUnavailableIdp.mockReturnValueOnce(
          expectHandleUnavailableIdpResult,
        );

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith(
          expectHandleUnavailableIdpResult,
        );
      });

      it('should return the result of res redirect', async () => {
        // Given
        const expectedRedirect = Symbol('expectedRedirect');
        resMock.redirect.mockReturnValueOnce(expectedRedirect);

        // When
        const result = await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );

        // Then
        expect(result).toStrictEqual(expectedRedirect);
      });
    });

    describe('when idp is blacklisted', () => {
      beforeEach(() => {
        serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(true);
      });

      it('should call coreVerifyService.handleUnavailableIdp()', async () => {
        // Given
        const handleUnavailableIdpParamsMock = {
          interactionId: 'interactionIdMockValue',
          sessionOidc: oidcSessionServiceMock,
          urlPrefix: appConfigMock.urlPrefix,
        };

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(
          coreVerifyServiceMock.handleUnavailableIdp,
        ).toHaveBeenCalledTimes(1);
        expect(coreVerifyServiceMock.handleUnavailableIdp).toHaveBeenCalledWith(
          reqMock,
          handleUnavailableIdpParamsMock,
          false,
        );
      });

      it('should call res.redirect() with the result of coreVerifyService.handleUnavailableIdp()', async () => {
        // Given
        const expectHandleUnavailableIdpResult = Symbol(
          'expectHandleUnavailableIdpResult',
        );
        coreVerifyServiceMock.handleUnavailableIdp.mockReturnValueOnce(
          expectHandleUnavailableIdpResult,
        );

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith(
          expectHandleUnavailableIdpResult,
        );
      });

      it('should return the result of res redirect', async () => {
        // Given
        const expectedRedirect = Symbol('expectedRedirect');
        resMock.redirect.mockReturnValueOnce(expectedRedirect);

        // When
        const result = await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );

        // Then
        expect(result).toStrictEqual(expectedRedirect);
      });
    });

    describe('when acr level is insufficient', () => {
      beforeEach(() => {
        coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValue(true);
      });

      it('should call coreFcpVerifyService.handleInsufficientAcrLevel()', async () => {
        // Given
        const interactionIdMock = 'interactionIdMockValue';

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(
          coreFcpVerifyServiceMock.handleInsufficientAcrLevel,
        ).toHaveBeenCalledTimes(1);
        expect(
          coreFcpVerifyServiceMock.handleInsufficientAcrLevel,
        ).toHaveBeenCalledWith(interactionIdMock);
      });

      it('should terminate sso session', async () => {
        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(oidcSessionServiceMock.set).toHaveBeenCalledTimes(1);
        expect(oidcSessionServiceMock.set).toHaveBeenCalledWith('isSso', false);
      });

      it('should track the event FC_IDP_INSUFFICIENT_ACR', async () => {
        // Given
        const ctxMock = {
          req: reqMock,
        };

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
        expect(trackingServiceMock.track).toHaveBeenCalledWith(
          trackingServiceMock.TrackedEventsMap.FC_IDP_INSUFFICIENT_ACR,
          ctxMock,
        );
      });

      it('should call res.redirect() with the result of coreFcpVerifyService.handleInsufficientAcrLevel()', async () => {
        // Given
        const expectHandleInsufficientAcrLevelResult = Symbol(
          'expectHandleInsufficientAcrLevelResult',
        );
        coreFcpVerifyServiceMock.handleInsufficientAcrLevel.mockReturnValueOnce(
          expectHandleInsufficientAcrLevelResult,
        );

        // When
        await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(resMock.redirect).toHaveBeenCalledTimes(1);
        expect(resMock.redirect).toHaveBeenCalledWith(
          expectHandleInsufficientAcrLevelResult,
        );
      });

      it('should return the result of res redirect', async () => {
        // Given
        const expectedRedirect = Symbol('expectedRedirect');
        resMock.redirect.mockReturnValueOnce(expectedRedirect);

        // When
        const result = await coreController.getVerify(
          reqMock,
          resMock,
          paramsMock,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );

        // Then
        expect(result).toStrictEqual(expectedRedirect);
      });
    });
  });

  describe('getConsent()', () => {
    it('should get data from session', async () => {
      // When
      await coreController.getConsent(
        req,
        res,
        params,
        oidcSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(oidcSessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should check if consent is required', async () => {
      // When
      await coreController.getConsent(
        req,
        res,
        params,
        oidcSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(coreFcpServiceMock.isConsentRequired).toHaveBeenCalledTimes(1);
      expect(coreFcpServiceMock.isConsentRequired).toHaveBeenCalledWith(
        spIdMock,
      );
    });

    it('should get data from interaction with oidc provider', async () => {
      // When
      await coreController.getConsent(
        req,
        res,
        params,
        oidcSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
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
        oidcSessionServiceMock,
        csrfToken,
      );
      // Then
      expect(result).toStrictEqual({
        isOpenIdScope: false,
        claims: claimsLabelMock,
        consentRequired: true,
        csrfToken,
        identity: {},
        interactionId: interactionIdMock,
        scopes: scopesMock,
        spName: spNameMock,
      });
    });
  });
});
