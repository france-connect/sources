import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreAcrService, CoreVerifyService } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { NotificationsService } from '@fc/notifications';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientService } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionCsrfService, SessionService } from '@fc/session';

import { InsufficientAcrLevelSuspiciousContextException } from '../exceptions';
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

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

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
    handleBlacklisted: jest.fn(),
  };

  const coreFcpVerifyServiceMock = {
    handleVerifyIdentity: jest.fn(),
  };

  const scopesMock = ['toto', 'titi'];
  const claimsMock = ['foo', 'bar'];
  const claimsLabelMock = ['F o o', 'B a r'];

  const identityProviderServiceMock = {
    getFilteredList: jest.fn(),
    getList: jest.fn(),
  };

  const serviceProviderServiceMock = {
    shouldExcludeIdp: jest.fn(),
    consentRequired: jest.fn(),
    getById: jest.fn(),
  };

  const oidcSessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    setAlias: jest.fn(),
  };

  const appSessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
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

  const csrfMock = 'csrfMockValue';

  const oidcSessionMock: OidcSession = {
    csrfToken: randomStringMock,
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,

    idpAcr: idpAcrMock,
    spAcr: acrMock,
    spId: spIdMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
  };

  const notificationsMock = Symbol('notifications');

  const handleBlackListedResult = 'urlPrefixValue/interaction/interactionId';
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
        SessionCsrfService,
        CoreAcrService,
        CoreVerifyService,
        CoreFcpVerifyService,
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
      .overrideProvider(SessionCsrfService)
      .useValue(sessionCsrfServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
      .overrideProvider(CoreVerifyService)
      .useValue(coreVerifyServiceMock)
      .overrideProvider(CoreFcpVerifyService)
      .useValue(coreFcpVerifyServiceMock)
      .compile();

    coreController = await app.get<CoreFcpController>(CoreFcpController);

    configServiceMock.get.mockReturnValue(appConfigMock);

    providerMock.interactionDetails.mockResolvedValue(interactionDetailsMock);

    oidcProviderServiceMock.getInteraction.mockResolvedValue(
      interactionDetailsMock,
    );
    serviceProviderServiceMock.getById.mockResolvedValue(serviceProviderMock);

    oidcSessionServiceMock.get.mockResolvedValue(oidcSessionMock);

    coreVerifyServiceMock.verify.mockResolvedValue(interactionDetailsMock);
    coreFcpServiceMock.getClaimsForInteraction.mockReturnValue(claimsMock);
    coreFcpServiceMock.getScopesForInteraction.mockReturnValue(scopesMock);
    coreFcpServiceMock.isConsentRequired.mockResolvedValue(true);
    coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValue(false);
    coreFcpServiceMock.getClaimsLabelsForInteraction.mockReturnValue(
      claimsLabelMock,
    );
    coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(false);

    sessionCsrfServiceMock.get.mockReturnValueOnce(csrfMock);
    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);

    serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(true);
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
      appSessionServiceMock.get.mockResolvedValue(false);
      oidcAcrServiceMock.isAcrValid.mockReturnValue(true);
      coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValue(false);
      notificationsServiceMock.getNotifications.mockResolvedValue(
        notificationsMock,
      );
    });

    /*
     * @Todo #486 rework test missing assertion or not complete ones
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/486
     */
    it('should retrieve the spName from oidcSession', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(oidcSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(oidcSessionServiceMock.get).toHaveBeenCalledWith('spName');
    });

    it('should retrieve get the OidcClient config', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(configServiceMock.get).toHaveBeenNthCalledWith(1, 'OidcClient');
    });

    it('should retrieve get the OidcProvider config', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );
      // Then
      expect(configServiceMock.get).toHaveBeenNthCalledWith(2, 'OidcProvider');
    });

    it('should call coreAcrService.rejectInvalidAcr() with interaction acrValues, authorizedAcrValues, req and res', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
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

    it('should retrieve the idp list given the service provider blacklist / whitelist', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
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

    it('should retrieve csrf', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // Then
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledWith();
    });

    it('should save the csrf in oidc session', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // Then
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledWith(
        oidcSessionServiceMock,
        csrfMock,
      );
    });

    it('should get the notifications list', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
      );

      // Then
      expect(notificationsServiceMock.getNotifications).toHaveBeenCalledTimes(
        1,
      );
      expect(notificationsServiceMock.getNotifications).toHaveBeenCalledWith();
    });

    it('should get the notifications list', async () => {
      // Given
      const idpScopeMock = 'openid email';
      configServiceMock.get.mockReturnValueOnce({
        scope: idpScopeMock,
      });
      oidcSessionServiceMock.get.mockResolvedValueOnce(oidcSessionMock.spName);
      const expectedInteractionDetails = {
        csrfToken: csrfMock,
        notifications: notificationsMock,
        params: interactionDetailsMock.params,
        uid: interactionDetailsMock.uid,
        spName: oidcSessionMock.spName,
        idpScope: idpScopeMock,
        spScope: interactionDetailsMock.params.scope,
        providers: idpFilterListMock,
      };

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        oidcSessionServiceMock,
        appSessionServiceMock,
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
      );

      // Then
      expect(result).toStrictEqual(renderResult);
    });
  });

  describe('getVerify()', () => {
    const res = {
      redirect: jest.fn(),
    };

    describe('when `serviceProvider.shouldExcludeIdp()` returns `true`', () => {
      beforeEach(() => {
        coreVerifyServiceMock.handleBlacklisted.mockResolvedValue(
          handleBlackListedResult,
        );
        coreFcpVerifyServiceMock.handleVerifyIdentity.mockResolvedValue(
          handleVerifyResult,
        );
      });

      it('should call `handleBlackListed()` and not `handleVerify()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(coreVerifyServiceMock.handleBlacklisted).toHaveBeenCalledTimes(
          1,
        );
        expect(
          coreFcpVerifyServiceMock.handleVerifyIdentity,
        ).not.toHaveBeenCalled();
      });

      it('should return result from `handleBlackListed()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith(handleBlackListedResult);
      });
    });

    describe('when `serviceProvider.shouldExcludeIdp()` returns `false`', () => {
      beforeEach(() => {
        serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(false);
        coreVerifyServiceMock.handleBlacklisted.mockResolvedValue(
          handleBlackListedResult,
        );
        coreFcpVerifyServiceMock.handleVerifyIdentity.mockResolvedValue(
          handleVerifyResult,
        );
      });

      it('should call `handleVerify()` and not `handleBlackListed()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(
          coreFcpVerifyServiceMock.handleVerifyIdentity,
        ).toHaveBeenCalledTimes(1);
        expect(coreVerifyServiceMock.handleBlacklisted).not.toHaveBeenCalled();
      });

      it('should call return result from `handleVerify()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );
        // Then
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith(handleVerifyResult);
      });

      it('should get the suspicious request status from AppSession', async () => {
        // When
        await coreController.getVerify(
          req,
          res,
          params,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );

        // Then
        expect(appSessionServiceMock.get).toHaveBeenCalledTimes(1);
        expect(appSessionServiceMock.get).toHaveBeenCalledWith('isSuspicious');
      });

      it('should check if the idpAcr is sufficient for the given request suspicious status', async () => {
        // Given
        const expectedSupiciousRequest = false;
        appSessionServiceMock.get.mockResolvedValueOnce(
          expectedSupiciousRequest,
        );

        // When
        await coreController.getVerify(
          req,
          res,
          params,
          oidcSessionServiceMock,
          appSessionServiceMock,
        );

        // Then
        expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenCalledTimes(
          1,
        );
        expect(coreFcpServiceMock.isInsufficientAcrLevel).toHaveBeenCalledWith(
          oidcSessionMock.idpAcr,
          expectedSupiciousRequest,
        );
      });

      it('should throw an "InsufficientAcrLevelSuspiciousContextException" error if the used IdP is not valid and request is suspicious', async () => {
        // Given
        coreFcpServiceMock.isInsufficientAcrLevel.mockReturnValueOnce(true);

        // When / Then
        await expect(() =>
          coreController.getVerify(
            req,
            res,
            params,
            oidcSessionServiceMock,
            appSessionServiceMock,
          ),
        ).rejects.toThrow(InsufficientAcrLevelSuspiciousContextException);
      });
    });
  });

  describe('getConsent()', () => {
    it('should get data from session', async () => {
      // When
      await coreController.getConsent(req, res, params, oidcSessionServiceMock);
      // Then
      expect(oidcSessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should check if consent is required', async () => {
      // When
      await coreController.getConsent(req, res, params, oidcSessionServiceMock);
      // Then
      expect(coreFcpServiceMock.isConsentRequired).toHaveBeenCalledTimes(1);
      expect(coreFcpServiceMock.isConsentRequired).toHaveBeenCalledWith(
        spIdMock,
      );
    });

    it('should get data from interaction with oidc provider', async () => {
      // When
      await coreController.getConsent(req, res, params, oidcSessionServiceMock);
      // Then
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.getInteraction).toHaveBeenCalledWith(
        req,
        res,
      );
    });

    it('should generate a csrf token', async () => {
      // When
      await coreController.getConsent(req, res, params, oidcSessionServiceMock);
      // Then
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.get).toHaveBeenCalledWith();
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledTimes(1);
      expect(sessionCsrfServiceMock.save).toHaveBeenCalledWith(
        oidcSessionServiceMock,
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
        oidcSessionServiceMock,
      );
      // Then
      expect(result).toStrictEqual({
        isOpenIdScope: false,
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
