import { ClientMetadata, KoaContextWithOIDC } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc';

import { OidcProviderRedisAdapter } from '../adapters';
import { OidcProviderService } from '../oidc-provider.service';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from '../tokens';
import { OidcProviderConfigService } from './oidc-provider-config.service';
import { OidcProviderErrorService } from './oidc-provider-error.service';

describe('OidcProviderConfigService', () => {
  let service: OidcProviderConfigService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const errorServiceMock = {
    renderError: jest.fn(),
    throwError: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const oidcProviderConfigAppMock = {
    logoutSource: jest.fn(),
    postLogoutSuccessSource: jest.fn(),
    findAccount: jest.fn(),
  };

  const oidcProviderRedisAdapterMock = class AdapterMock {};

  const oidcProviderServiceMock = {} as OidcProviderService;

  const configOidcProviderMock = {
    prefix: '/api',
    issuer: 'http://foo.bar',
    configuration: {
      adapter: oidcProviderRedisAdapterMock,
      jwks: { keys: [] },
      features: {
        devInteractions: { enabled: false },
      },
      cookies: {
        keys: ['foo'],
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderConfigService,
        ConfigService,
        OidcProviderErrorService,
        {
          provide: SERVICE_PROVIDER_SERVICE_TOKEN,
          useValue: serviceProviderServiceMock,
        },
        {
          provide: OIDC_PROVIDER_CONFIG_APP_TOKEN,
          useValue: oidcProviderConfigAppMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .compile();

    service = module.get<OidcProviderConfigService>(OidcProviderConfigService);
    jest.resetAllMocks();

    configServiceMock.get.mockImplementation((module) => {
      switch (module) {
        case 'OidcProvider':
          return configOidcProviderMock;
      }
    });
  });

  describe('getConfig()', () => {
    it('should call several services and concat their outputs', () => {
      // Given
      OidcProviderRedisAdapter.getConstructorWithDI = jest
        .fn()
        .mockReturnValue(oidcProviderRedisAdapterMock);

      // When
      const result = service.getConfig(oidcProviderServiceMock);

      // Then
      expect(
        OidcProviderRedisAdapter.getConstructorWithDI,
      ).toHaveBeenCalledTimes(1);
      expect(
        OidcProviderRedisAdapter.getConstructorWithDI,
      ).toHaveBeenCalledWith(
        oidcProviderServiceMock,
        serviceProviderServiceMock,
      );

      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcProvider');

      expect(result).toMatchObject(configOidcProviderMock);
    });

    it('should return false to pkce output if we pass two empty objects', () => {
      // Given
      OidcProviderRedisAdapter.getConstructorWithDI = jest
        .fn()
        .mockReturnValue(oidcProviderRedisAdapterMock);
      // When
      const result = service.getConfig(oidcProviderServiceMock);
      const pkceResult = result.configuration.pkce.required({}, {});
      expect(pkceResult).toEqual(false);
    });

    it('should bind methods to config', () => {
      // When
      const result = service.getConfig(oidcProviderServiceMock);

      // Then
      expect(result).toHaveProperty(
        'configuration.features.rpInitiatedLogout.logoutSource',
      );
      expect(result).toHaveProperty(
        'configuration.features.rpInitiatedLogout.postLogoutSuccessSource',
      );
      expect(result).toHaveProperty('configuration.findAccount');
      expect(result).toHaveProperty('configuration.pairwiseIdentifier');
      expect(result).toHaveProperty('configuration.renderError');
      expect(result).toHaveProperty('configuration.clientBasedCORS');
      expect(result).toHaveProperty('configuration.interactions.url');
    });
  });

  describe('url()', () => {
    it('Should return a relative interaction url with prefix', () => {
      // Given
      const prefix = '/prefix';
      const ctx = {
        oidc: {
          entities: {
            interaction: {
              uid: 123,
            },
          },
        },
      } as unknown as KoaContextWithOIDC;
      const { interaction } = ctx.oidc.entities;

      // When
      const result = service['url'](prefix, ctx, interaction);

      // Then
      expect(result).toEqual('/prefix/interaction/123');
    });
  });

  describe('pairwiseIdentifier()', () => {
    it('should return second argument as is', () => {
      // Given
      const ctx = {};
      const accountId = 'accountIdValue';
      // When
      const result = service['pairwiseIdentifier'](ctx, accountId);
      // Then
      expect(result).toBe(accountId);
    });
  });

  describe('clientBasedCORS', () => {
    it('Should return false', () => {
      // Given
      const ctx = {} as KoaContextWithOIDC;
      const origin = {};
      const client = {} as ClientMetadata;

      // When
      const result = service['clientBasedCORS'](ctx, origin, client);

      // Then
      expect(result).toBe(false);
    });
  });
});
