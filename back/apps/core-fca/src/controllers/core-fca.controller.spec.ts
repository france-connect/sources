import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreAcrService, CoreRoutes, CoreVerifyService } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { NotificationsService } from '@fc/notifications';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, SessionService } from '@fc/session';
import { TrackedEventInterface, TrackingService } from '@fc/tracking';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaVerifyService } from '../services';
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
  const idpAcrMock = 'idpAcrMockValue';

  const res = {
    json: jest.fn(),
    status: jest.fn(),
    render: jest.fn(),
    redirect: jest.fn(),
  } as unknown as Response;

  const req = {
    fc: {
      interactionId: interactionIdMock,
    },
    query: {
      firstQueryParam: 'first',
      secondQueryParam: 'second',
    },
    route: {
      path: '/some/path',
    },
  } as unknown as Request;

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

  const coreVerifyServiceMock = {
    verify: jest.fn(),
    handleUnavailableIdp: jest.fn(),
  };

  const coreFcaVerifyServiceMock = {
    handleVerifyIdentity: jest.fn(),
    handleSsoDisabled: jest.fn(),
  };

  const coreAcrServiceMock = {
    rejectInvalidAcr: jest.fn(),
  };

  const identityProviderServiceMock = {
    getFilteredList: jest.fn(),
    getList: jest.fn(),
    isActiveById: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
    shouldExcludeIdp: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

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

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_SHOWED_IDP_CHOICE: Symbol(
        'FC_SHOWED_IDP_CHOICE',
      ) as unknown as TrackedEventInterface,
    },
  } as unknown as TrackingService;

  const oidcAcrServiceMock = {
    isAcrValid: jest.fn(),
  };

  const csrfToken = randomStringMock;

  const oidcClientSessionDataMock: OidcClientSession = {
    spId: spIdMock,
    idpId: idpIdMock,
    idpNonce: idpNonceMock,
    idpState: idpStateMock,
    interactionId: interactionIdMock,
    spAcr: acrMock,
    spIdentity: {} as IOidcIdentity,
    spName: spNameMock,
    stepRoute: '/some/route',
  };

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

  const handleUnavailableIdpResult = 'urlPrefixValue/interaction/interactionId';
  const handleVerifyResult = 'urlPrefixValue/login';
  const handleSsoDisabledResult =
    'urlPrefixValue/interaction/interactionIdMockValue';

  const appSessionServiceMock = getSessionServiceMock();

  const oidcSessionServiceMock = getSessionServiceMock();

  const csrfMock = 'csrfMockValue';

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

  const notificationsServiceMock = {
    refreshCache: jest.fn(),
    getList: jest.fn(),
    getNotificationToDisplay: jest.fn(),
  };

  const notificationsMock = Symbol('notifications');

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreFcaController],
      providers: [
        OidcProviderService,
        IdentityProviderAdapterMongoService,
        ServiceProviderAdapterMongoService,
        ConfigService,
        CoreAcrService,
        CoreFcaVerifyService,
        CoreVerifyService,
        TrackingService,
        OidcAcrService,
        SessionService,
        NotificationsService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(CoreFcaVerifyService)
      .useValue(coreFcaVerifyServiceMock)
      .overrideProvider(CoreVerifyService)
      .useValue(coreVerifyServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrServiceMock)
      .overrideProvider(SessionService)
      .useValue(oidcSessionServiceMock)
      .overrideProvider(NotificationsService)
      .useValue(notificationsServiceMock)
      .compile();

    coreController = app.get<CoreFcaController>(CoreFcaController);

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
    coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(false);
    coreVerifyServiceMock.verify.mockResolvedValue(interactionDetailsResolved);

    serviceProviderServiceMock.getById.mockResolvedValue({
      name: spNameMock,
    });
    sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);

    sessionServiceMock.set.mockResolvedValueOnce(undefined);
    cryptographyServiceMock.genRandomString.mockReturnValue(randomStringMock);
    configServiceMock.get.mockReturnValue(appConfigMock);

    sessionCsrfServiceMock.get.mockReturnValueOnce(randomStringMock);
    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);

    serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(true);
    oidcSessionServiceMock.get.mockReturnValue(oidcSessionMock);
    sessionCsrfServiceMock.get.mockReturnValueOnce(csrfMock);

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
    beforeEach(() => {
      oidcProviderServiceMock.getInteraction.mockResolvedValue(
        interactionDetailsMock,
      );

      notificationsServiceMock.getNotificationToDisplay.mockResolvedValue(
        notificationsMock,
      );

      appSessionServiceMock.get.mockResolvedValue(false);
    });

    it('should return nothing, stop interaction, when acr value is not an allowedAcrValue', async () => {
      // Given
      coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(true);

      oidcProviderServiceMock.getInteraction.mockResolvedValue({
        params: 'params',
        prompt: 'prompt',
        uid: 'uid',
      });

      // When
      const result = await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );
      // Then
      expect(result).toBeUndefined();
      expect(res.render).not.toHaveBeenCalled();
    });

    it('should track route if not a refresh', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(
        trackingServiceMock.TrackedEventsMap.FC_SHOWED_IDP_CHOICE,
        { req },
      );
    });

    it('should not track route if is a refresh', async () => {
      // Given
      oidcSessionServiceMock.get.mockReturnValueOnce({
        stepRoute: CoreRoutes.INTERACTION,
      });
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );
      // Then
      expect(trackingServiceMock.track).not.toHaveBeenCalled();
    });

    it('should retrieve the spName and stepRoute from oidcSession', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );
      // Then
      expect(oidcSessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(oidcSessionServiceMock.get).toHaveBeenCalledWith();
    });

    it('should retrieve the OidcProvider config', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
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
        csrfToken,
        oidcSessionServiceMock,
      );
      // Then
      expect(coreAcrServiceMock.rejectInvalidAcr).toHaveBeenCalledTimes(1);
      expect(coreAcrServiceMock.rejectInvalidAcr).toHaveBeenCalledWith(
        interactionDetailsMock.params.acr_values,
        appConfigMock.configuration.acrValues,
        { req, res },
      );
    });

    it('should not render and return if acr value is not an allowedAcrValue', async () => {
      // Given
      coreAcrServiceMock.rejectInvalidAcr.mockResolvedValueOnce(true);

      // When
      const result = await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );
      // Then
      expect(result).toBeUndefined();
      expect(res.render).not.toHaveBeenCalled();
    });

    it('should call the notifications list without params', async () => {
      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );

      // Then
      expect(
        notificationsServiceMock.getNotificationToDisplay,
      ).toHaveBeenCalledTimes(1);
      expect(
        notificationsServiceMock.getNotificationToDisplay,
      ).toHaveBeenCalledWith();
    });

    it('should return a complete response when rendering', async () => {
      const expectedInteractionDetails = {
        csrfToken: randomStringMock,
        notification: notificationsMock,
        params: interactionDetailsMock.params,
        spName: oidcSessionMock.spName,
        spScope: interactionDetailsMock.params.scope,
      };

      // When
      await coreController.getInteraction(
        req,
        res,
        params,
        csrfToken,
        oidcSessionServiceMock,
      );

      // Then
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(
        'interaction',
        expectedInteractionDetails,
      );
    });
  });

  describe('getVerify()', () => {
    it('should not call handleSsoDisabled with ssoDisabled = false and isSso = false', async () => {
      // When
      const oidcClientSessionDataMock = {
        isSso: false,
      } as unknown as ISessionService<OidcClientSession>;
      sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);
      serviceProviderServiceMock.getById.mockResolvedValue({
        ssoDisabled: false,
      });
      await coreController.getVerify(
        req,
        res as unknown as Response,
        params,
        sessionServiceMock,
      );

      // Then
      expect(coreFcaVerifyServiceMock.handleSsoDisabled).not.toHaveBeenCalled();
    });

    it('should not call handleSsoDisabled with isSso = false', async () => {
      // When
      const ssoDisabledMock = Symbol('a-boolean') as unknown as boolean;
      const oidcClientSessionDataMock = {
        isSso: false,
      } as unknown as ISessionService<OidcClientSession>;
      sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);
      serviceProviderServiceMock.getById.mockResolvedValue({
        ssoDisabled: ssoDisabledMock,
      });
      await coreController.getVerify(
        req,
        res as unknown as Response,
        params,
        sessionServiceMock,
      );

      // Then
      expect(coreFcaVerifyServiceMock.handleSsoDisabled).not.toHaveBeenCalled();
    });

    it('should not call handleSsoDisabled with ssoDisabled = false', async () => {
      // Given
      const isSsoMock = Symbol('a-boolean') as unknown as boolean;
      const oidcClientSessionDataMock = {
        isSso: isSsoMock,
      } as unknown as ISessionService<OidcClientSession>;

      // When
      sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);
      serviceProviderServiceMock.getById.mockResolvedValue({
        ssoDisabled: false,
      });
      await coreController.getVerify(
        req,
        res as unknown as Response,
        params,
        sessionServiceMock,
      );

      // Then
      expect(coreFcaVerifyServiceMock.handleSsoDisabled).not.toHaveBeenCalled();
    });

    it('should call handleSsoDisabled with isSso = true and ssoDisabled = true', async () => {
      // Given
      const oidcClientSessionDataMock = {
        idpId: 'idpIdMockValue',
        interactionId: 'interactionIdMockValue',
        spId: 'spIdMockValue',
        isSso: true,
      } as unknown as ISessionService<OidcClientSession>;
      const urlPrefixMock = '/api/v2';

      // When
      sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);
      serviceProviderServiceMock.getById.mockResolvedValue({
        ssoDisabled: true,
      });
      await coreController.getVerify(
        req,
        res as unknown as Response,
        params,
        sessionServiceMock,
      );

      // Then
      expect(coreFcaVerifyServiceMock.handleSsoDisabled).toHaveBeenCalledTimes(
        1,
      );
      expect(coreFcaVerifyServiceMock.handleSsoDisabled).toHaveBeenCalledWith(
        req,
        {
          urlPrefix: urlPrefixMock,
          interactionId: interactionIdMock,
          sessionOidc: sessionServiceMock,
        },
      );
    });

    it('should return redirect when isSso = true and ssoDisabled = true', async () => {
      // Given
      const oidcClientSessionDataMock = {
        idpId: 'idpIdMockValue',
        interactionId: 'interactionIdMockValue',
        spId: 'spIdMockValue',
        isSso: true,
      } as unknown as ISessionService<OidcClientSession>;

      coreFcaVerifyServiceMock.handleSsoDisabled.mockResolvedValue(
        handleSsoDisabledResult,
      );
      sessionServiceMock.get.mockReturnValue(oidcClientSessionDataMock);
      serviceProviderServiceMock.getById.mockResolvedValue({
        ssoDisabled: true,
      });

      // When
      await coreController.getVerify(
        req,
        res as unknown as Response,
        params,
        sessionServiceMock,
      );

      // Then
      expect(res.redirect).toHaveBeenCalledTimes(1);
      expect(res.redirect).toHaveBeenCalledWith(handleSsoDisabledResult);
    });

    describe('when `identityProvider.isActiveById` returns false', () => {
      beforeEach(() => {
        serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(false);
        identityProviderServiceMock.isActiveById.mockResolvedValue(false);
        coreVerifyServiceMock.handleUnavailableIdp.mockResolvedValue(
          handleUnavailableIdpResult,
        );
        coreFcaVerifyServiceMock.handleVerifyIdentity.mockResolvedValue(
          handleVerifyResult,
        );
      });

      it('should call `handleUnavailableIdp()` and not `handleVerify()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          sessionServiceMock,
        );
        // Then
        expect(
          coreVerifyServiceMock.handleUnavailableIdp,
        ).toHaveBeenCalledTimes(1);
        expect(
          coreFcaVerifyServiceMock.handleVerifyIdentity,
        ).not.toHaveBeenCalled();
      });

      it('should return result from `handleUnavailableIdp()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          sessionServiceMock,
        );
        // Then
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith(handleUnavailableIdpResult);
      });
    });

    describe('when `serviceProvider.shouldExcludeIdp()` returns `true`', () => {
      beforeEach(() => {
        coreVerifyServiceMock.handleUnavailableIdp.mockResolvedValue(
          handleUnavailableIdpResult,
        );
        coreFcaVerifyServiceMock.handleVerifyIdentity.mockResolvedValue(
          handleVerifyResult,
        );
      });

      it('should call `handleUnavailableIdp()` and not `handleVerify()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          sessionServiceMock,
        );
        // Then
        expect(
          coreVerifyServiceMock.handleUnavailableIdp,
        ).toHaveBeenCalledTimes(1);
        expect(
          coreFcaVerifyServiceMock.handleVerifyIdentity,
        ).not.toHaveBeenCalled();
      });

      it('should return result from `handleUnavailableIdp()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          sessionServiceMock,
        );
        // Then
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith(handleUnavailableIdpResult);
      });
    });

    describe('when `serviceProvider.shouldExcludeIdp()` returns `false`', () => {
      beforeEach(() => {
        serviceProviderServiceMock.shouldExcludeIdp.mockResolvedValue(false);
        coreVerifyServiceMock.handleUnavailableIdp.mockResolvedValue(
          handleUnavailableIdpResult,
        );
        coreFcaVerifyServiceMock.handleVerifyIdentity.mockResolvedValue(
          handleVerifyResult,
        );
      });

      it('should call `handleVerify()` and not `handleUnavailableIdp()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          sessionServiceMock,
        );
        // Then
        expect(
          coreFcaVerifyServiceMock.handleVerifyIdentity,
        ).toHaveBeenCalledTimes(1);
        expect(
          coreVerifyServiceMock.handleUnavailableIdp,
        ).not.toHaveBeenCalled();
      });

      it('should call return result from `handleVerify()`', async () => {
        // When
        await coreController.getVerify(
          req,
          res as unknown as Response,
          params,
          sessionServiceMock,
        );
        // Then
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith(handleVerifyResult);
      });
    });
  });
});
