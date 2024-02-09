import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcClientService, OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { CoreFcaService } from './core-fca.service';
import { CoreFcaAuthorizationUrlService } from './core-fca-authorization-url.service';

describe('CoreFcaService', () => {
  let service: CoreFcaService;

  const configServiceMock = getConfigMock();

  const loggerMock = getLoggerMock();

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

  const fqdnToIdpAdapterMongoServiceMock = {
    getIdpsByFqdn: jest.fn(),
    refreshCache: jest.fn(),
    getList: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaService,
        ConfigService,
        OidcClientService,
        IdentityProviderAdapterMongoService,
        CoreFcaAuthorizationUrlService,
        FqdnToIdpAdapterMongoService,
        LoggerService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderMock)
      .overrideProvider(CoreFcaAuthorizationUrlService)
      .useValue(coreFcaAuthorizationUrlServiceMock)
      .overrideProvider(FqdnToIdpAdapterMongoService)
      .useValue(fqdnToIdpAdapterMongoServiceMock)
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
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
      );

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcClient');
    });

    it('should call oidcClient.utils.checkIdpBlacklisted()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
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
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
      );
      // Then
      expect(oidcMock.utils.checkIdpDisabled).toHaveBeenCalledTimes(1);
      expect(oidcMock.utils.checkIdpDisabled).toHaveBeenCalledWith(idpIdMock);
    });

    it('should call oidcClient.utils.buildAuthorizeParameters()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
      );
      // Then
      expect(oidcMock.utils.buildAuthorizeParameters).toHaveBeenCalledTimes(1);
    });

    it('should call identityProvider.getById()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
      );
      // Then
      expect(identityProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(identityProviderMock.getById).toHaveBeenCalledWith(idpIdMock);
    });

    it('should call coreFcaAuthorizationUrlService.getAuthorizeUrl()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
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
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: 'example@email.com',
      });
    });

    it('should call sessionService.set()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
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
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: 'example@email.com',
      });
    });

    it('should call res.redirect()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        {
          acr: acrMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          login_hint: 'example@email.com',
        },
      );
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });
  });

  describe('getIdpIdForEmail', () => {
    it('should return the default uuid of idp when no idp is found', async () => {
      // When
      const result = await service.getIdpIdForEmail('dobby@unknown.person');

      // Then
      expect(result).toBe(process.env.DEFAULT_IDP_UID);
    });

    it('should call fqdnToIdpAdapterMongoService getIdpsByFqdn', async () => {
      // When
      await service.getIdpIdForEmail('voldemort@bad.person');

      // Then
      expect(
        fqdnToIdpAdapterMongoServiceMock.getIdpsByFqdn,
      ).toHaveBeenCalledTimes(1);
      expect(
        fqdnToIdpAdapterMongoServiceMock.getIdpsByFqdn,
      ).toHaveBeenCalledWith('bad.person');
    });

    it('should get return the first corresponding idp for fqdn', async () => {
      // Given
      fqdnToIdpAdapterMongoServiceMock.getIdpsByFqdn.mockResolvedValueOnce([
        { fqdn: 'bad.person', identityProvider: 'snapeIdp' },
        { fqdn: 'bad.person', identityProvider: 'luciusIdp' },
        { fqdn: 'bad.person', identityProvider: 'dobbyIdp' },
      ]);

      // When
      const result = await service.getIdpIdForEmail('voldemort@bad.person');

      // Then
      expect(result).toBe('snapeIdp');
    });

    it('should log a warning when there more than one idp for fqdn', async () => {
      // Given
      fqdnToIdpAdapterMongoServiceMock.getIdpsByFqdn.mockResolvedValueOnce([
        { fqdn: 'bad.person', identityProvider: 'snapeIdp' },
        { fqdn: 'bad.person', identityProvider: 'luciusIdp' },
        { fqdn: 'bad.person', identityProvider: 'dobbyIdp' },
      ]);

      // When
      await service.getIdpIdForEmail('voldemort@bad.person');

      // Then
      expect(loggerMock.warning).toHaveBeenCalledTimes(1);
      expect(loggerMock.warning).toHaveBeenCalledWith(
        'More than one IdP exists',
      );
    });
  });

  describe('getFqdnFromEmail', () => {
    it('should only return the full qualified domain name from an email address', () => {
      // When
      const fqdn = service['getFqdnFromEmail']('hermione.granger@hogwards.uk');

      // Then
      expect(fqdn).toBe('hogwards.uk');
    });

    it('should only return the full qualified domain name from an email address with numbers', () => {
      // When
      const fqdn = service['getFqdnFromEmail'](
        'hermione.grangerhogwards4321@hogwards1234.uk',
      );

      // Then
      expect(fqdn).toBe('hogwards1234.uk');
    });
  });
});
