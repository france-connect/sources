import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProvider } from '@entities/typeorm';

import { I18nService } from '@fc/i18n';
import { LoggerService } from '@fc/logger';

import { PartnersServiceProviderFormService } from './partners-service-provider-form.service';

describe('PartnersServiceProviderFormService', () => {
  let service: PartnersServiceProviderFormService;

  const i18nMock = {
    translate: jest.fn(),
  };

  const loggerMock = {
    warning: jest.fn(),
  };

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    organizationName: 'Test Organization',
    datapassRequestId: '12345',
    authorizedScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organisation: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersServiceProviderFormService,
        {
          provide: I18nService,
          useValue: i18nMock,
        },
        {
          provide: LoggerService,
          useValue: loggerMock,
        },
      ],
    }).compile();

    service = module.get<PartnersServiceProviderFormService>(
      PartnersServiceProviderFormService,
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
        organizationName: 'Test Organization',
        datapassRequestId: '12345',
        datapassScopes: [
          'Identifiant technique',
          'Prénoms',
          'Nom de naissance',
          'Adresse électronique',
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });
    });

    it('should call i18n.translate for each claim', () => {
      // Given
      i18nMock.translate.mockReturnValue('Label');

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

      const serviceProviderWithUnknownClaim = {
        ...serviceProviderMock,
        authorizedScopes: ['given_name', 'unknown_claim'],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithUnknownClaim);

      // Then
      expect(result.datapassScopes).toEqual(['Label', 'unknown_claim']);
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith(
        'Missing translation for datapassScope.unknown_claim',
      );
    });

    it('should not include platform and organisation fields in response', () => {
      // Given
      i18nMock.translate.mockReturnValue('Label');

      // When
      const result = service.toDisplayValue(serviceProviderMock);

      // Then
      expect(result).not.toHaveProperty('platform');
      expect(result).not.toHaveProperty('organisation');
    });

    it('should handle empty authorizedScopes array', () => {
      // Given
      const serviceProviderWithoutScopes = {
        ...serviceProviderMock,
        authorizedScopes: [],
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithoutScopes);

      // Then
      expect(result.datapassScopes).toEqual([]);
    });

    it('should handle null authorizedScopes', () => {
      // Given
      const serviceProviderWithNullScopes = {
        ...serviceProviderMock,
        authorizedScopes: null,
      };

      // When
      const result = service.toDisplayValue(serviceProviderWithNullScopes);

      // Then
      expect(result.datapassScopes).toEqual([]);
    });
  });
});
