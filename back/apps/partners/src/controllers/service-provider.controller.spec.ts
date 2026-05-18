import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionService,
  PermissionInterface,
} from '@fc/access-control';
import {
  PartnersServiceProviderNotFoundException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';

import { AccessControlEntity, AccessControlPermission } from '../enums';
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

  const accountPermissionServiceMock = {
    getAccountsByPermissions: jest.fn(),
  };

  const permissionsMock: PermissionInterface<
    AccessControlEntity,
    AccessControlPermission
  >[] = [
    {
      permissionType: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      entityId: null,
    },
    {
      permissionType: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.SERVICE_PROVIDER,
      entityId: 'service-provider-id',
    },
  ];

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    organization: {
      id: '12345',
      name: 'Test Organization',
      siret: '12345678901234',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      serviceProviders: [],
    },
    datapassRequestId: '12345',
    datapassAuthorizationId: '12345678901234',
    datapassEidasLevel: 'eidas_1',
    datapassScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    instances: [],
  };

  const serviceProviderResponseDtoMock: PartnersServiceProviderPayloadInterface =
    {
      id: 'service-provider-id',
      name: 'Test Service Provider',
      datapassRequestId: '12345',
      organization: {
        id: '12345',
        name: 'Test Organization',
        siret: '12345678901234',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        serviceProviders: [serviceProviderMock],
      },
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
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      ],
    })
      .overrideProvider(PartnersServiceProviderService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(PartnersServiceProviderFormService)
      .useValue(formServiceMock)
      .overrideProvider(
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      )
      .useValue(accountPermissionServiceMock)
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
    accountPermissionServiceMock.getAccountsByPermissions.mockResolvedValue([]);
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

    it('should transform each service provider using form service', async () => {
      // Given
      const secondServiceProviderMock = {
        ...serviceProviderMock,
        id: 'service-provider-id-2',
      };
      serviceProviderServiceMock.getAllowedServiceProviders.mockResolvedValue([
        serviceProviderMock,
        secondServiceProviderMock,
      ]);

      // When
      await controller.getServiceProviders(permissionsMock);

      // Then
      expect(formServiceMock.toDisplayValue).toHaveBeenCalledTimes(2);
      expect(formServiceMock.toDisplayValue).toHaveBeenNthCalledWith(
        1,
        serviceProviderMock,
      );
      expect(formServiceMock.toDisplayValue).toHaveBeenNthCalledWith(
        2,
        secondServiceProviderMock,
      );
    });

    it('should return FSA format with transformed service providers without fcScopes', async () => {
      // Given
      serviceProviderServiceMock.getAllowedServiceProviders.mockResolvedValue([
        serviceProviderMock,
      ]);

      // When
      const result = await controller.getServiceProviders(permissionsMock);

      // Then
      const { fcScopes: _fcScopes, ...expectedPayload } =
        serviceProviderResponseDtoMock;
      expect(result).toEqual({
        type: 'SERVICE_PROVIDER',
        payload: [expectedPayload],
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
        meta: {
          permissions: [],
        },
      });
    });

    it('should not expose platform fields', async () => {
      // When
      const result = await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(result.payload).not.toHaveProperty('platform');
    });

    it('should include filtered account fields in meta permissions', async () => {
      // Given
      accountPermissionServiceMock.getAccountsByPermissions.mockResolvedValue([
        {
          account: {
            id: 'account-id',
            email: 'contact@example.com',
            firstname: 'John',
            lastname: 'Doe',
            lastConnection: new Date('2024-01-01'),
            phone: '0102030405',
            sub: 'hidden',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ]);

      // When
      const result = await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(result.meta.permissions).toEqual([
        {
          account: {
            id: 'account-id',
            email: 'contact@example.com',
            firstname: 'John',
            lastname: 'Doe',
            lastConnection: new Date('2024-01-01'),
            phone: '0102030405',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ]);
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
