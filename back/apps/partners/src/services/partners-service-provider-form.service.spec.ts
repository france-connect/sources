import { Test, TestingModule } from '@nestjs/testing';

import {
  PartnersAccount,
  PartnersOrganization,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import { AccountPermissionInterface } from '@fc/access-control';
import { I18nService } from '@fc/i18n';
import { LoggerService } from '@fc/logger';

import { AccessControlPermission } from '../enums';
import { PartnersServiceProviderFormService } from './partners-service-provider-form.service';

describe('PartnersServiceProviderFormService', () => {
  let service: PartnersServiceProviderFormService;

  const i18nMock = {
    translate: jest.fn(),
  };

  const loggerMock = {
    warning: jest.fn(),
  };

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
      ],
    })
      .overrideProvider(I18nService)
      .useValue(i18nMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<PartnersServiceProviderFormService>(
      PartnersServiceProviderFormService,
    );

    i18nMock.translate.mockReturnValue('Label');
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
        .mockReturnValueOnce('Nom de famille')
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
          'Nom de famille',
          'Adresse électronique',
        ],
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
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
    });

    it('should handle empty datapassScopes array', () => {
      // Given
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
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
    });

    it('should handle null datapassScopes', () => {
      // Given
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
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        instances: [],
      });
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

  describe('sortPermissions', () => {
    // Given

    const item1 = {
      permissionType: AccessControlPermission.SP_ADMIN,
      account: {
        lastConnection: new Date('2024-02-02'),
      },
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    const item2 = {
      permissionType: AccessControlPermission.SP_ADMIN,
      account: {
        lastConnection: new Date('2024-01-01'),
      },
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    const item3 = {
      permissionType: AccessControlPermission.SP_TECH,
      account: {
        lastConnection: new Date('2024-01-01'),
      },
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    const item4 = {
      permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      account: {
        lastConnection: new Date('2024-03-01'),
      },
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    const item5 = {
      permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      account: {},
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    const expected = [item1, item2, item3, item4, item5];

    it.each([
      [[item1, item2, item3, item4, item5]],
      [[item1, item2, item5, item4, item3]],
      [[item1, item5, item2, item4, item3]],
      [[item1, item5, item2, item3, item4]],
      [[item5, item4, item3, item2, item1]],
      [[item5, item4, item3, item1, item2]],
      [[item5, item4, item2, item1, item3]],
      [[item5, item4, item2, item3, item1]],
      [[item5, item4, item1, item2, item3]],
      [[item5, item4, item1, item3, item2]],
      [[item5, item3, item2, item1, item4]],
      [[item5, item3, item2, item4, item1]],
    ])(
      'should sort permissions by SP_ADMIN, SP_TECH, SP_CONTRIBUTOR, then by lastConnection descending order',
      (permissions) => {
        // When
        const result = permissions.sort(
          service['sortPermissions'].bind(service),
        );

        // Then
        expect(result).toEqual(expected);
      },
    );
  });

  describe('getLastConnectionTime', () => {
    // Given
    const LAST_CONNECTION_TIMESTAMP = 233366400000;

    const item1 = {
      account: {
        lastConnection: new Date(LAST_CONNECTION_TIMESTAMP),
      },
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    const item2 = {
      account: {},
    } as AccountPermissionInterface<PartnersAccount, AccessControlPermission>;

    it('should return the last connection time', () => {
      // When
      const result = service['getLastConnectionTime'](item1);

      // Then
      expect(result).toEqual(LAST_CONNECTION_TIMESTAMP);
    });

    it('should return zero when last connection time is not set', () => {
      // When
      const result = service['getLastConnectionTime'](item2);

      // Then
      expect(result).toEqual(0);
    });
  });
});
