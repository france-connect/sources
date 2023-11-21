import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreAcrService, CoreRoutes, CoreVerifyService } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { MinistriesService } from '@fc/ministries';
import { IOidcIdentity } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import {
  ISessionService,
  SessionBadFormatException,
  SessionCsrfService,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

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

  const res = {
    json: jest.fn(),
    status: jest.fn(),
    render: jest.fn(),
    redirect: jest.fn(),
  };

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

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

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

  const ministriesServiceMock = {
    getList: jest.fn(),
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

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      IDP_CALLEDBACK: {},
    },
  } as unknown as TrackingService;

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
    stepRoute: '/some/route',
  };

  const handleUnavailableIdpResult = 'urlPrefixValue/interaction/interactionId';
  const handleVerifyResult = 'urlPrefixValue/login';
  const handleSsoDisabledResult =
    'urlPrefixValue/interaction/interactionIdMockValue';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoreFcaController],
      providers: [
        LoggerService,
        OidcProviderService,
        MinistriesService,
        IdentityProviderAdapterMongoService,
        ServiceProviderAdapterMongoService,
        ConfigService,
        SessionCsrfService,
        CoreAcrService,
        CoreFcaVerifyService,
        CoreVerifyService,
        TrackingService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(MinistriesService)
      .useValue(ministriesServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
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
      .overrideProvider(SessionCsrfService)
      .useValue(sessionCsrfServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
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
    coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(false);
    coreVerifyServiceMock.verify.mockResolvedValue(interactionDetailsResolved);

    serviceProviderServiceMock.getById.mockResolvedValue({
      name: spNameMock,
    });
    sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);

    sessionServiceMock.set.mockResolvedValueOnce(undefined);
    cryptographyServiceMock.genRandomString.mockReturnValue(randomStringMock);
    configServiceMock.get.mockReturnValue(appConfigMock);

    sessionCsrfServiceMock.get.mockReturnValueOnce(randomStringMock);
    sessionCsrfServiceMock.save.mockResolvedValueOnce(true);

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

  describe('getFrontHistoryBackURL()', () => {
    // Given
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
      await expect(
        coreController.getFrontHistoryBackURL(req, res, sessionServiceMock),
      ).rejects.toThrow(SessionBadFormatException);
    });

    it('should return a SessionBadFormatException session do not contains spName', async () => {
      // given
      sessionServiceMock.get.mockResolvedValueOnce({});
      // then
      await expect(
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

      oidcProviderServiceMock.getInteraction.mockResolvedValue({
        params: 'params',
        prompt: 'prompt',
        uid: 'uid',
      });
      coreAcrServiceMock.rejectInvalidAcr.mockResolvedValue(true);
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

    it('should track route if not a refresh', async () => {
      // When
      await coreController.getInteraction(req, res, sessionServiceMock);

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
    });

    it('should not track route if is a refresh', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(CoreRoutes.INTERACTION);
      // When
      await coreController.getInteraction(req, res, sessionServiceMock);

      // Then
      expect(trackingServiceMock.track).not.toHaveBeenCalled();
    });
  });

  describe('getVerify()', () => {
    it('should not call handleSsoDisabled with ssoDisabled = false and isSso = false', async () => {
      // When
      const oidcClientSessionDataMock = {
        isSso: false,
      } as unknown as ISessionService<OidcClientSession>;
      sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);
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
      sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);
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
      sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);
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
      sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);
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

      // When
      coreFcaVerifyServiceMock.handleSsoDisabled.mockResolvedValue(
        handleSsoDisabledResult,
      );
      sessionServiceMock.get.mockResolvedValue(oidcClientSessionDataMock);
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
      expect(res.redirect).toBeCalledTimes(1);
      expect(res.redirect).toBeCalledWith(handleSsoDisabledResult);
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
