import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  AccessControlGuard,
  EntityType,
  PermissionInterface,
  PermissionsType,
} from '@fc/access-control';
import {
  PartnersServiceProviderNotFoundException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';

import { PartnersServiceProviderPayloadInterface } from '../interfaces';
import { PartnersServiceProviderFormService } from '../services';
import { ServiceProviderController } from './service-provider.controller';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;

  const serviceProviderServiceMock = {
    getAllowedServiceProviders: jest.fn(),
    getById: jest.fn(),
  };

  const formServiceMock = {
    toDisplayValue: jest.fn(),
  };

  const permissionsMock: PermissionInterface[] = [
    {
      permissionType: PermissionsType.LIST,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: null,
    },
    {
      permissionType: PermissionsType.VIEW,
      entity: EntityType.SERVICE_PROVIDER,
      entityId: 'service-provider-id',
    },
  ];

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

  const serviceProviderResponseDtoMock: PartnersServiceProviderPayloadInterface =
    {
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
    };

  const accessControlGuardMock = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
      providers: [
        PartnersServiceProviderService,
        PartnersServiceProviderFormService,
      ],
    })
      .overrideProvider(PartnersServiceProviderService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(PartnersServiceProviderFormService)
      .useValue(formServiceMock)
      .overrideGuard(AccessControlGuard)
      .useValue(accessControlGuardMock)
      .compile();

    controller = module.get<ServiceProviderController>(
      ServiceProviderController,
    );

    serviceProviderServiceMock.getById.mockResolvedValue(serviceProviderMock);
    formServiceMock.toDisplayValue.mockReturnValue(
      serviceProviderResponseDtoMock,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getServiceProviders', () => {
    it('should call getAllowedServiceProviders with permissions', async () => {
      // Given
      serviceProviderServiceMock.getAllowedServiceProviders.mockResolvedValue([
        serviceProviderMock,
      ]);

      // When
      await controller.getServiceProviders(permissionsMock);

      // Then
      expect(
        serviceProviderServiceMock.getAllowedServiceProviders,
      ).toHaveBeenCalledExactlyOnceWith(permissionsMock);
    });

    it('should return FSA format with service providers', async () => {
      // Given
      serviceProviderServiceMock.getAllowedServiceProviders.mockResolvedValue([
        serviceProviderMock,
      ]);

      // When
      const result = await controller.getServiceProviders(permissionsMock);

      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER',
        payload: [serviceProviderMock],
      });
    });

    it('should return empty array when no service providers', async () => {
      // Given
      serviceProviderServiceMock.getAllowedServiceProviders.mockResolvedValue(
        [],
      );

      // When
      const result = await controller.getServiceProviders(permissionsMock);

      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER',
        payload: [],
      });
    });
  });

  describe('getServiceProvider', () => {
    const serviceProviderIdMock = 'service-provider-id';

    beforeEach(() => {
      formServiceMock.toDisplayValue.mockReturnValue(
        serviceProviderResponseDtoMock,
      );
    });

    it('should call serviceProviderService.getById with serviceProviderId from params', async () => {
      // When
      await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(
        serviceProviderServiceMock.getById,
      ).toHaveBeenCalledExactlyOnceWith(serviceProviderIdMock);
    });

    it('should transform service provider using form service', async () => {
      // When
      await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(formServiceMock.toDisplayValue).toHaveBeenCalledWith(
        serviceProviderMock,
      );
    });

    it('should return transformed service provider in FSA format', async () => {
      // When
      const result = await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER',
        payload: serviceProviderResponseDtoMock,
      });
    });

    it('should return payload with mapped scopes', async () => {
      // When
      const result = await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(result.payload.datapassScopes).toEqual([
        'Identifiant technique',
        'Prénoms',
        'Nom de naissance',
        'Adresse électronique',
      ]);
    });

    it('should not expose platform and organisation fields', async () => {
      // When
      const result = await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(result.payload).not.toHaveProperty('platform');
      expect(result.payload).not.toHaveProperty('organisation');
    });

    it('should throw PartnersServiceProviderNotFoundException when service provider not found', async () => {
      // Given
      serviceProviderServiceMock.getById.mockRejectedValue(
        new PartnersServiceProviderNotFoundException(),
      );

      // When / Then
      await expect(
        controller.getServiceProvider(serviceProviderIdMock),
      ).rejects.toThrow(PartnersServiceProviderNotFoundException);
    });
  });
});
