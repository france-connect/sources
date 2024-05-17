import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreAuthorizationService } from '@fc/core';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import {
  OidcClientIdpBlacklistedException,
  OidcClientIdpDisabledException,
  OidcClientService,
} from '@fc/oidc-client';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getCoreAuthorizationServiceMock } from '@mocks/core';
import { getSessionServiceMock } from '@mocks/session';

import {
  CoreFcaAgentIdpBlacklistedException,
  CoreFcaAgentIdpDisabledException,
  CoreFcaAgentNoIdpException,
} from '../exceptions';
import { CoreFcaService } from './core-fca.service';

describe('CoreFcaService', () => {
  let service: CoreFcaService;

  const configServiceMock = getConfigMock();

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
        CoreAuthorizationService,
        SessionService,
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
      .overrideProvider(CoreAuthorizationService)
      .useValue(coreAuthorizationServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('redirectToIdp', () => {
    const authorizationParametersMock = {
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: acrMock,
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint: 'example@email.com',
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue({
        spId: spIdMock,
      });

      const getIdpIdForEmailMock = jest.spyOn(service, 'getIdpIdForEmail');

      getIdpIdForEmailMock.mockResolvedValueOnce([idpIdMock]);
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
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          acr_values: acrMock,
          nonce: nonceMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
          sp_id: spIdMock,
          // oidc parameter
          // eslint-disable-next-line @typescript-eslint/naming-convention
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
        authorizationParametersMock,
      );
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });
  });

  describe('getIdpIdForEmail', () => {
    it('should return the default uuid of idp when the idp list is empty', async () => {
      // Given
      fqdnToIdpAdapterMongoMock.getIdpsByFqdn.mockResolvedValueOnce([]);

      // When
      const result = await service.getIdpIdForEmail('voldemort@bad.person');

      // Then
      expect(result).toEqual([process.env.DEFAULT_IDP_UID]);
    });

    it('should get return all the corresponding idp for fqdn', async () => {
      // Given
      fqdnToIdpAdapterMongoMock.getIdpsByFqdn.mockResolvedValueOnce([
        { fqdn: 'bad.person', identityProvider: 'snapeIdp' },
        { fqdn: 'bad.person', identityProvider: 'luciusIdp' },
        { fqdn: 'bad.person', identityProvider: 'dobbyIdp' },
      ]);

      // When
      const result = await service.getIdpIdForEmail('voldemort@bad.person');

      // Then
      expect(result).toEqual(['snapeIdp', 'luciusIdp', 'dobbyIdp']);
    });
  });

  describe('getFqdnFromEmail', () => {
    it('should only return the full qualified domain name from an email address', () => {
      // When
      const fqdn = service.getFqdnFromEmail('hermione.granger@hogwards.uk');

      // Then
      expect(fqdn).toBe('hogwards.uk');
    });

    it('should only return the full qualified domain name from an email address with numbers', () => {
      // When
      const fqdn = service.getFqdnFromEmail(
        'hermione.grangerhogwards4321@hogwards1234.uk',
      );

      // Then
      expect(fqdn).toBe('hogwards1234.uk');
    });

    const emailToTest = [
      {
        value: 'hermione.granger@hogwards1234.uK',
        expectedFqdn: 'hogwards1234.uk',
      },
      {
        value: 'hermione.granger@hogwardS1234.uk',
        expectedFqdn: 'hogwards1234.uk',
      },
      {
        value: 'hermione.granger@hogwardS1234.uK',
        expectedFqdn: 'hogwards1234.uk',
      },
      {
        value: 'hermione.granger@HOGWARDS1234.UK',
        expectedFqdn: 'hogwards1234.uk',
      },
    ];
    it.each(emailToTest)(
      'should always return qualified domain name in lower case from an email address with upper case',
      ({ value, expectedFqdn }) => {
        // When
        const fqdn = service.getFqdnFromEmail(value);

        // Then
        expect(fqdn).toBe(expectedFqdn);
      },
    );
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

  describe('getDefaultIdp', () => {
    it('should call the config when we call getDefaultIdp', () => {
      // When
      service['getDefaultIdp'](1);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should throw an CoreFcaAgentNoIdpException error when no idp is found', () => {
      // Then
      expect(() => service['getDefaultIdp'](0)).toThrow(
        CoreFcaAgentNoIdpException,
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
      const providers = await service.getIdentityProvidersByIds(...idpIds);

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
});
