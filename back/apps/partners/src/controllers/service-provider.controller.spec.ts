import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  AccessControlGuard,
  EntityType,
  PermissionInterface,
  PermissionsType,
} from '@fc/access-control';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';

import { ServiceProviderController } from './service-provider.controller';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;

  const serviceProviderServiceMock = {
    getAllowedServiceProviders: jest.fn(),
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

  const accessControlGuardMock = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceProviderController],
      providers: [
        {
          provide: PartnersServiceProviderService,
          useValue: serviceProviderServiceMock,
        },
      ],
    })
      .overrideGuard(AccessControlGuard)
      .useValue(accessControlGuardMock)
      .compile();

    controller = module.get<ServiceProviderController>(
      ServiceProviderController,
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
});
