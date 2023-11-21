import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientService, OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger-legacy';

import { CoreFcaService } from './core-fca.service';
import { CoreFcaAuthorizationUrlService } from './core-fca-authorization-url.service';

describe('CoreFcaService', () => {
  let service: CoreFcaService;

  const loggerServiceMock = getLoggerMock();
  const configServiceMock = getConfigMock();

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const oidcMock = {
    utils: {
      checkIdpBlacklisted: jest.fn(),
      checkIdpDisabled: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
    },
  };

  const idpIdMock = 'idpIdMockValue';
  const spIdMock = 'spIdMockValue';
  const resMock = {
    redirect: jest.fn(),
  } as unknown as Response;

  const identityProviderMock = {
    getById: jest.fn(),
  };

  const coreFcaAuthorizationUrlServiceMock = {
    getAuthorizeUrl: jest.fn(),
  };

  const acrMock = 'acrMockValue';
  const configMock = {
    scope: Symbol('scopeMockValue'),
  };

  const identityProviderMockResponse = {
    name: Symbol('nameMockValue'),
    title: Symbol('titleMockValue'),
    featureHandlers: Symbol('featureHandlersMockValue'),
  };

  const nonceMock = Symbol('nonceMockValue');
  const stateMock = Symbol('stateMockValue');

  const authorizeUrlMock = Symbol('authorizeUrlMockValue');

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaService,
        LoggerService,
        ConfigService,
        OidcClientService,
        IdentityProviderAdapterMongoService,
        CoreFcaAuthorizationUrlService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderMock)
      .overrideProvider(CoreFcaAuthorizationUrlService)
      .useValue(coreFcaAuthorizationUrlServiceMock)
      .compile();

    service = app.get<CoreFcaService>(CoreFcaService);

    configServiceMock.get.mockReturnValue(configMock);
    oidcMock.utils.buildAuthorizeParameters.mockResolvedValue({
      nonce: nonceMock,
      state: stateMock,
    });
    identityProviderMock.getById.mockResolvedValue(
      identityProviderMockResponse,
    );
    coreFcaAuthorizationUrlServiceMock.getAuthorizeUrl.mockResolvedValue(
      authorizeUrlMock,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('redirectToIdp()', () => {
    beforeEach(() => {
      sessionServiceMock.get.mockResolvedValue({
        spId: spIdMock,
      });
    });

    it('should call config.get to retrieve configured parameters', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should call oidcClient.utils.checkIdpBlacklisted()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(oidcMock.utils.checkIdpBlacklisted).toHaveBeenCalledTimes(1);
      expect(oidcMock.utils.checkIdpBlacklisted).toHaveBeenCalledWith(
        spIdMock,
        idpIdMock,
      );
    });

    it('should call oidcClient.utils.checkIdpDisabled()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(oidcMock.utils.checkIdpDisabled).toHaveBeenCalledTimes(1);
      expect(oidcMock.utils.checkIdpDisabled).toHaveBeenCalledWith(idpIdMock);
    });

    it('should call oidcClient.utils.buildAuthorizeParameters()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(oidcMock.utils.buildAuthorizeParameters).toHaveBeenCalledTimes(1);
    });

    it('should call identityProvider.getById()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(identityProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(identityProviderMock.getById).toHaveBeenCalledWith(idpIdMock);
    });

    it('should call coreFcaAuthorizationUrlService.getAuthorizeUrl()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(
        coreFcaAuthorizationUrlServiceMock.getAuthorizeUrl,
      ).toHaveBeenCalledTimes(1);
      expect(
        coreFcaAuthorizationUrlServiceMock.getAuthorizeUrl,
      ).toHaveBeenCalledWith({
        oidcClient: oidcMock,
        state: stateMock,
        scope: configMock.scope,
        idpId: idpIdMock,
        idpFeatureHandlers: identityProviderMockResponse.featureHandlers,
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: acrMock,
        nonce: nonceMock,
        spId: spIdMock,
      });
    });

    it('should call sessionService.set()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        idpId: idpIdMock,
        idpName: identityProviderMockResponse.name,
        idpLabel: identityProviderMockResponse.title,
        idpNonce: nonceMock,
        idpState: stateMock,
        idpIdentity: undefined,
        spIdentity: undefined,
        accountId: undefined,
      });
    });

    it('should call res.redirect()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        acrMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
      );
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });
  });
});
