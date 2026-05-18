import { Test, TestingModule } from '@nestjs/testing';

import {
  PartnersOrganization,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import { I18nService } from '@fc/i18n';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';

import { PartnersServiceProviderFormService } from './partners-service-provider-form.service';

describe('PartnersServiceProviderFormService', () => {
  let service: PartnersServiceProviderFormService;

  const i18nMock = {
    translate: jest.fn(),
  };

  const loggerMock = {
    warning: jest.fn(),
  };

  const scopesServiceMock = {
    getScopesFromClaims: jest.fn(),
    getRawClaimsFromScopes: jest.fn(),
  };

  const defaultScopesFromClaimsReturnValue = ['openid', 'profile', 'email'];
  const defaultRawClaimsFromScopesReturnValue = ['sub'];

  const organizationMock: PartnersOrganization = {
    id: '12345',
    name: 'Test Organization',
    siret: '12345678901234',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    serviceProviders: [],
  };

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    datapassRequestId: '12345',
    datapassAuthorizationId: '12345678901234',
    datapassEidasLevel: 'EIDAS_1',
    datapassScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organization: organizationMock,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    instances: [],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersServiceProviderFormService,
        I18nService,
        LoggerService,
        ScopesService,
      ],
    })
      .overrideProvider(I18nService)
      .useValue(i18nMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ScopesService)
      .useValue(scopesServiceMock)
      .compile();

    service = module.get<PartnersServiceProviderFormService>(
      PartnersServiceProviderFormService,
    );

    i18nMock.translate.mockReturnValue('Label');
    scopesServiceMock.getScopesFromClaims.mockReturnValue(
      defaultScopesFromClaimsReturnValue,
    );
    scopesServiceMock.getRawClaimsFromScopes.mockReturnValue(
      defaultRawClaimsFromScopesReturnValue,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toDisplayValue', () => {
    it('should transform service provider entity to display value with translated labels', () => {
      // Given
      i18nMock.translate
        .mockReturnValueOnce('Identifiant technique')
        .mockReturnValueOnce('Prénoms')
        .mockReturnValueOnce('Nom de naissance')
        .mockReturnValueOnce('Adresse électronique');

      // When
      const result = service.toDisplayValue(serviceProviderMock);

      // Then
      expect(result).toEqual({
        id: 'service-provider-id',
        name: 'Test Service Provider',
        organization: organizationMock,
        datapassRequestId: '12345',
        datapassScopes: [
          'Identifiant technique',
          'Prénoms',
          'Nom de naissance',
          'Adresse électronique',
        ],
        fcScopes: ['openid', 'profile', 'email'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
    });

    it('should call i18n.translate for each claim', () => {
      // When
      service.toDisplayValue(serviceProviderMock);

      // Then
      expect(i18nMock.translate).toHaveBeenCalledTimes(4);
      expect(i18nMock.translate).toHaveBeenCalledWith('datapassScope.openid');
      expect(i18nMock.translate).toHaveBeenCalledWith(
        'datapassScope.given_name',
      );
      expect(i18nMock.translate).toHaveBeenCalledWith(
        'datapassScope.family_name',
      );
      expect(i18nMock.translate).toHaveBeenCalledWith('datapassScope.email');
    });

    it('should fallback to claim identifier if translation fails', () => {
      // Given
      i18nMock.translate.mockImplementation((key: string) => {
        if (key === 'datapassScope.unknown_claim') {
          throw new Error('Translation not found');
        }
        return 'Label';
      });
      scopesServiceMock.getScopesFromClaims.mockReturnValue(['profile']);

      const serviceProviderWithUnknownClaim = {
        ...serviceProviderMock,
        datapassScopes: ['given_name', 'unknown_claim'],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithUnknownClaim);

      // Then
      expect(result).toEqual({
        id: 'service-provider-id',
        name: 'Test Service Provider',
        organization: organizationMock,
        datapassRequestId: '12345',
        datapassScopes: ['Label', 'unknown_claim'],
        fcScopes: ['profile'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith(
        'Missing translation for datapassScope.unknown_claim',
      );
    });

    it('should not include platform and organization fields in response', () => {
      // When
      const result = service.toDisplayValue(serviceProviderMock);

      // Then
      expect(result).toEqual({
        id: 'service-provider-id',
        name: 'Test Service Provider',
        organization: organizationMock,
        datapassRequestId: '12345',
        datapassScopes: ['Label', 'Label', 'Label', 'Label'],
        fcScopes: ['openid', 'profile', 'email'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
    });

    it('should handle empty datapassScopes array', () => {
      // Given
      scopesServiceMock.getScopesFromClaims.mockReturnValue([]);
      const serviceProviderWithoutScopes = {
        ...serviceProviderMock,
        datapassScopes: [],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithoutScopes);

      // Then
      expect(result).toEqual({
        id: 'service-provider-id',
        name: 'Test Service Provider',
        organization: organizationMock,
        datapassRequestId: '12345',
        datapassScopes: [],
        fcScopes: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
    });

    it('should handle null datapassScopes', () => {
      // Given
      scopesServiceMock.getScopesFromClaims.mockReturnValue([]);
      const serviceProviderWithNullScopes = {
        ...serviceProviderMock,
        datapassScopes: null,
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithNullScopes);

      // Then
      expect(result).toEqual({
        id: 'service-provider-id',
        name: 'Test Service Provider',
        organization: organizationMock,
        datapassRequestId: '12345',
        datapassScopes: [],
        fcScopes: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
    });

    it('should call scopesService.getRawClaimsFromScopes with datapass scopes', () => {
      // When
      service.toDisplayValue(serviceProviderMock);

      // Then
      expect(
        scopesServiceMock.getRawClaimsFromScopes,
      ).toHaveBeenCalledExactlyOnceWith([
        'openid',
        'given_name',
        'family_name',
        'email',
      ]);
    });

    it('should call scopesService.getScopesFromClaims with base claims', () => {
      // Given
      scopesServiceMock.getRawClaimsFromScopes.mockReturnValue(['sub']);

      // When
      service.toDisplayValue(serviceProviderMock);

      // Then
      expect(
        scopesServiceMock.getScopesFromClaims,
      ).toHaveBeenCalledExactlyOnceWith(['sub']);
    });

    it('should convert datapass claims to base claims then to FC scopes', () => {
      // Given
      scopesServiceMock.getRawClaimsFromScopes.mockReturnValue([
        'openid',
        'sub',
      ]);
      const serviceProviderWithOpenid = {
        ...serviceProviderMock,
        datapassScopes: ['openid', 'given_name'],
      };

      // When
      service.toDisplayValue(serviceProviderWithOpenid);

      // Then
      expect(scopesServiceMock.getRawClaimsFromScopes).toHaveBeenCalledWith([
        'openid',
        'given_name',
      ]);
      expect(scopesServiceMock.getScopesFromClaims).toHaveBeenCalledWith([
        'openid',
        'sub',
      ]);
    });

    it('should expose only firstname and lastname for instance creator', () => {
      // Given
      const instanceWithCreator = {
        id: 'instance-id',
        environment: 'SANDBOX',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        creator: {
          id: 'creator-id',
          email: 'creator@example.com',
          firstname: 'Jean',
          lastname: 'Dupont',
        },
        currentVersion: null,
      } as PartnersServiceProviderInstance;
      const serviceProviderWithInstances = {
        ...serviceProviderMock,
        instances: [instanceWithCreator],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithInstances);

      // Then
      expect(result.instances[0].creator).toEqual({
        firstname: 'Jean',
        lastname: 'Dupont',
      });
    });

    it('should handle partial creator with only firstname', () => {
      // Given
      const instanceWithPartialCreator = {
        id: 'instance-id',
        environment: 'SANDBOX',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        creator: {
          id: 'creator-id',
          email: 'creator@example.com',
          firstname: 'Jean',
          lastname: null,
        },
        currentVersion: null,
      } as PartnersServiceProviderInstance;
      const serviceProviderWithInstances = {
        ...serviceProviderMock,
        instances: [instanceWithPartialCreator],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithInstances);

      // Then
      expect(result.instances[0].creator).toEqual({
        firstname: 'Jean',
        lastname: null,
      });
    });

    it('should pass through creator with null firstname and lastname without filtering', () => {
      // Given
      const instanceWithNullNames = {
        id: 'instance-id',
        environment: 'SANDBOX',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        creator: {
          id: 'creator-id',
          email: 'creator@example.com',
          firstname: null,
          lastname: null,
        },
        currentVersion: null,
      } as PartnersServiceProviderInstance;
      const serviceProviderWithInstances = {
        ...serviceProviderMock,
        instances: [instanceWithNullNames],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithInstances);

      // Then
      expect(result.instances[0].creator).toEqual({
        firstname: null,
        lastname: null,
      });
    });
  });
});
