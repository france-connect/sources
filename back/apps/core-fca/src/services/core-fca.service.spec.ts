import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CORE_AUTH_SERVICE, CoreAuthorizationService } from '@fc/core';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import {
  OidcClientIdpBlacklistedException,
  OidcClientIdpDisabledException,
  OidcClientService,
} from '@fc/oidc-client';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getCoreAuthorizationServiceMock } from '@mocks/core';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  CoreFcaAgentIdpBlacklistedException,
  CoreFcaAgentIdpDisabledException,
} from '../exceptions';
import { CoreFcaService } from './core-fca.service';
import { CoreFcaFqdnService } from './core-fca-fqdn.service';

describe('CoreFcaService', () => {
  let service: CoreFcaService;

  const configServiceMock = getConfigMock();
  const loggerServiceMock = getLoggerMock();

  const sessionServiceMock = getSessionServiceMock();

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
    render: jest.fn(),
  } as unknown as Response;

  const identityProviderMock = {
    getById: jest.fn(),
    getList: jest.fn(),
  };

  const acrMock = 'acrMockValue';
  const configMock = {
    scope: Symbol('scopeMockValue'),
    spAuthorizedFqdnsConfigs: [],
  };

  const identityProviderMockResponse = {
    name: Symbol('nameMockValue'),
    title: Symbol('titleMockValue'),
    featureHandlers: Symbol('featureHandlersMockValue'),
  };

  const nonceMock = Symbol('nonceMockValue');
  const stateMock = Symbol('stateMockValue');

  const authorizeUrlMock = Symbol('authorizeUrlMockValue');

  const fqdnToIdpAdapterMongoMock = {
    getIdpsByFqdn: jest.fn(),
    refreshCache: jest.fn(),
    getList: jest.fn(),
  };

  const coreAuthorizationServiceMock = getCoreAuthorizationServiceMock();

  const coreFcaFqdnServiceMock = {
    getFqdnConfigFromEmail: jest.fn(),
    getSpAuthorizedFqdnsConfig: jest.fn(),
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
        FqdnToIdpAdapterMongoService,
        {
          provide: CORE_AUTH_SERVICE,
          useClass: CoreAuthorizationService,
        },
        SessionService,
        CoreFcaFqdnService,
        LoggerService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderMock)
      .overrideProvider(FqdnToIdpAdapterMongoService)
      .useValue(fqdnToIdpAdapterMongoMock)
      .overrideProvider(CORE_AUTH_SERVICE)
      .useValue(coreAuthorizationServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(CoreFcaFqdnService)
      .useValue(coreFcaFqdnServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
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
    coreAuthorizationServiceMock.getAuthorizeUrl.mockResolvedValue(
      authorizeUrlMock,
    );

    coreFcaFqdnServiceMock.getFqdnConfigFromEmail.mockResolvedValue({
      fqdn: '',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('redirectToIdp', () => {
    const authorizationParametersMock = {
      acr_values: acrMock,
      login_hint: 'example@email.com',
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue({
        spId: spIdMock,
      });
    });

    it('should call config.get to retrieve configured parameters', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
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
        authorizationParametersMock,
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
        authorizationParametersMock,
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
        authorizationParametersMock,
      );
      // Then
      expect(oidcMock.utils.buildAuthorizeParameters).toHaveBeenCalledTimes(1);
    });

    it('should call identityProvider.getById()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(identityProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(identityProviderMock.getById).toHaveBeenCalledWith(idpIdMock);
    });

    it('should call coreAuthorization.getAuthorizeUrl()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(
        coreAuthorizationServiceMock.getAuthorizeUrl,
      ).toHaveBeenCalledTimes(1);
      expect(coreAuthorizationServiceMock.getAuthorizeUrl).toHaveBeenCalledWith(
        idpIdMock,
        {
          state: stateMock,
          scope: configMock.scope,
          acr_values: acrMock,
          nonce: nonceMock,
          sp_id: spIdMock,
          login_hint: 'example@email.com',
        },
      );
    });

    it('should call sessionService.set()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith('OidcClient', {
        idpId: idpIdMock,
        idpName: identityProviderMockResponse.name,
        idpLabel: identityProviderMockResponse.title,
        idpNonce: nonceMock,
        idpState: stateMock,
        idpIdentity: undefined,
        spIdentity: undefined,
        accountId: undefined,
        login_hint: 'example@email.com',
      });
    });

    it('should call res.redirect()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });
  });

  describe('checkIdpBlacklisted', () => {
    it('should call oidcClient.utils.checkIdpBlacklisted', async () => {
      // When
      await service['checkIdpBlacklisted'](spIdMock, idpIdMock);

      // Then
      expect(oidcMock.utils.checkIdpBlacklisted).toHaveBeenCalledTimes(1);
      expect(oidcMock.utils.checkIdpBlacklisted).toHaveBeenCalledWith(
        spIdMock,
        idpIdMock,
      );
    });

    it('should throw a CoreFcaAgentIdpBlacklistedException', async () => {
      // Given
      oidcMock.utils.checkIdpBlacklisted.mockRejectedValue(
        new OidcClientIdpBlacklistedException(),
      );
      // When
      await expect(
        service['checkIdpBlacklisted'](spIdMock, idpIdMock),
      ).rejects.toThrow(CoreFcaAgentIdpBlacklistedException);
    });

    it('should throw an error if utils return an error', async () => {
      // Given
      oidcMock.utils.checkIdpBlacklisted.mockRejectedValue(new Error('wrong'));
      // When
      await expect(
        service['checkIdpBlacklisted'](spIdMock, idpIdMock),
      ).rejects.toThrow(Error);
    });
  });

  describe('checkIdpDisabled', () => {
    it('should call oidcClient.utils.checkIdpDisabled', async () => {
      // When
      await service['checkIdpDisabled'](idpIdMock);

      // Then
      expect(oidcMock.utils.checkIdpDisabled).toHaveBeenCalledTimes(1);
      expect(oidcMock.utils.checkIdpDisabled).toHaveBeenCalledWith(idpIdMock);
    });

    it('should throw a CoreFcaAgentIdpDisabledException if utils returns a OidcClientIdpDisabledException', async () => {
      // Given
      oidcMock.utils.checkIdpDisabled.mockRejectedValue(
        new OidcClientIdpDisabledException(),
      );
      // When
      await expect(service['checkIdpDisabled'](idpIdMock)).rejects.toThrow(
        CoreFcaAgentIdpDisabledException,
      );
    });

    it('should throw an error if utils return an error', async () => {
      // Given
      oidcMock.utils.checkIdpDisabled.mockRejectedValue(new Error('wrong'));
      // When
      await expect(service['checkIdpDisabled'](idpIdMock)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getIdentityProvidersByIds', () => {
    it('should return the identity providers for the given ids', async () => {
      // Given
      identityProviderMock.getList.mockResolvedValue([
        { ...identityProviderMockResponse, uid: 'dobbyIdp' },
        { ...identityProviderMockResponse, uid: 'horcruxIdp' },
        { ...identityProviderMockResponse, uid: 'luciusIdp' },
        { ...identityProviderMockResponse, uid: 'snapeIdp' },
      ]);

      const { name, title } = identityProviderMockResponse;
      const identityProviderNameTitle = { name, title };
      const idpIds = ['snapeIdp', 'luciusIdp', 'dobbyIdp'];

      // When
      const providers = await service.getIdentityProvidersByIds(idpIds);

      // Then
      expect(providers).toEqual([
        {
          ...identityProviderNameTitle,
          uid: 'dobbyIdp',
        },
        {
          ...identityProviderNameTitle,
          uid: 'luciusIdp',
        },
        {
          ...identityProviderNameTitle,
          uid: 'snapeIdp',
        },
      ]);
    });
  });

  describe('validateEmailForSp', () => {
    it('should return nothing if authorized email configuration is empty', async () => {
      await expect(
        service['validateEmailForSp'](spIdMock, 'anyEmail@mail.fr'),
      ).resolves.not.toThrow();
    });

    it('should throw an error if the email is not authorized', async () => {
      coreFcaFqdnServiceMock.getSpAuthorizedFqdnsConfig.mockReturnValueOnce({
        spName: 'Barad-Dur',
        spContact: 'sauron@palantir.morgoth',
        authorizedFqdns: ['mordor.orc'],
      });
      await expect(
        service['validateEmailForSp'](spIdMock, 'galadriel@lorien.elve'),
      ).rejects.toThrow();
    });

    it('should return nothing if the email is authorized', async () => {
      coreFcaFqdnServiceMock.getSpAuthorizedFqdnsConfig.mockReturnValueOnce({
        spName: 'Barad-Dur',
        spContact: 'sauron@palantir.morgoth',
        authorizedFqdns: ['mordor.orc'],
      });

      coreFcaFqdnServiceMock.getFqdnConfigFromEmail.mockResolvedValueOnce({
        fqdn: 'mordor.orc',
      });

      await expect(
        service['validateEmailForSp'](spIdMock, 'gollum@mordor.orc'),
      ).resolves.not.toThrow();
    });

    it('should return nothing if the config has no authorized fqdns', async () => {
      coreFcaFqdnServiceMock.getSpAuthorizedFqdnsConfig.mockReturnValueOnce({
        spName: 'Barad-Dur',
        spContact: 'sauron@palantir.morgoth',
        authorizedFqdns: [],
      });

      coreFcaFqdnServiceMock.getFqdnConfigFromEmail.mockResolvedValueOnce({
        fqdn: 'mordor.orc',
      });

      await expect(
        service['validateEmailForSp'](spIdMock, 'gollum@mordor.orc'),
      ).resolves.not.toThrow();
    });
  });
});
