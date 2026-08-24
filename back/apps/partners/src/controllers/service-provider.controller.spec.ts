import { Test, TestingModule } from '@nestjs/testing';

import { EnvironmentEnum, PartnersServiceProvider } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionService,
  PermissionInterface,
} from '@fc/access-control';
import { CsrfTokenGuard } from '@fc/csrf';
import {
  Dto2FormI18nService,
  FormValidationPipe,
  MetadataFormService,
} from '@fc/dto2form';
import {
  PartnersServiceProviderNotFoundException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';
import { ServiceProviderInstanceVersionFromSpDto } from '@fc/partners-service-provider-instance-version';

import { getSessionServiceMock } from '@mocks/session';

import { AccessControlEntity, AccessControlPermission } from '../enums';
import { PartnersServiceProviderPayloadInterface } from '../interfaces';
import {
  PartnersInstanceService,
  PartnersServiceProviderFormService,
} from '../services';
import { ServiceProviderController } from './service-provider.controller';

describe('ServiceProviderController', () => {
  let controller: ServiceProviderController;

  const serviceProviderServiceMock = {
    getAllowedServiceProviders: jest.fn(),
    getById: jest.fn(),
  };

  const formServiceMock = {
    toDisplayValue: jest.fn(),
    sortPermissions: jest.fn(),
  };

  const accountPermissionServiceMock = {
    getAccountsByPermissions: jest.fn(),
  };

  const instanceServiceMock = {
    create: jest.fn(),
  };

  const metadataFormServiceMock = {
    getDtoMetadata: jest.fn(),
  };

  const partnersi18nMock = {
    translation: jest.fn(),
  };

  const sessionPartnersAccountMock = getSessionServiceMock();

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
        'Nom de famille',
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

  const csrfTokenGuardMock = {
    canActivate: () => true,
  };

  const formValidationPipeMock = {
    transform: () => true,
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
        PartnersInstanceService,
        MetadataFormService,
        Dto2FormI18nService,
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
      .overrideProvider(PartnersInstanceService)
      .useValue(instanceServiceMock)
      .overrideProvider(MetadataFormService)
      .useValue(metadataFormServiceMock)
      .overrideProvider(Dto2FormI18nService)
      .useValue(partnersi18nMock)
      .overrideGuard(AccessControlGuard)
      .useValue(accessControlGuardMock)
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfTokenGuardMock)
      .overridePipe(FormValidationPipe)
      .useValue(formValidationPipeMock)
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

    it('should sort permissions by lastConnection descending order', async () => {
      // Given
      const accounts = [{}, {}];

      accountPermissionServiceMock.getAccountsByPermissions.mockResolvedValue(
        accounts,
      );

      // When
      await controller.getServiceProvider(serviceProviderIdMock);

      // Then
      expect(formServiceMock.sortPermissions).toHaveBeenCalledOnce();
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

  describe('createInstance', () => {
    const serviceProviderIdMock = 'service-provider-id';
    const accountIdMock = 'account-id';
    const emailMock = 'creator@email.fr';
    const valuesMock = {
      name: 'instance name',
      redirect_uris: ['https://example.fr/callback'],
    } as unknown as ServiceProviderInstanceVersionFromSpDto;
    const sessionPartnersMock = {
      identity: { id: accountIdMock, email: emailMock },
      accessControl: [],
    };
    const instanceCreationResultMock = {
      instanceId: 'instance-id',
      versionId: 'version-id',
    };

    beforeEach(() => {
      sessionPartnersAccountMock.get.mockReturnValue(sessionPartnersMock);
      instanceServiceMock.create.mockResolvedValue(instanceCreationResultMock);
    });

    it('should call serviceProviderService.getById with the serviceProviderId from params', async () => {
      // When
      await controller.createInstance(
        serviceProviderIdMock,
        valuesMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(
        serviceProviderServiceMock.getById,
      ).toHaveBeenCalledExactlyOnceWith(serviceProviderIdMock);
    });

    it('should delegate to instanceService.create with the signupId enriched from the service provider and grantInstanceContributor false', async () => {
      // When
      await controller.createInstance(
        serviceProviderIdMock,
        valuesMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(instanceServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        {
          ...valuesMock,
          signupId: serviceProviderMock.datapassRequestId,
        },
        {
          accountId: accountIdMock,
          email: emailMock,
          serviceProviderId: serviceProviderIdMock,
        },
        {
          environment: EnvironmentEnum.SANDBOX,
          grantInstanceContributor: false,
        },
      );
    });

    it('should propagate PartnersServiceProviderNotFoundException and not call instanceService.create', async () => {
      // Given
      serviceProviderServiceMock.getById.mockRejectedValue(
        new PartnersServiceProviderNotFoundException(),
      );

      // When / Then
      await expect(
        controller.createInstance(
          serviceProviderIdMock,
          valuesMock,
          sessionPartnersAccountMock,
        ),
      ).rejects.toThrow(PartnersServiceProviderNotFoundException);
      expect(instanceServiceMock.create).not.toHaveBeenCalled();
    });

    it('should return an INSTANCE FSA with the created instanceId and versionId', async () => {
      // When
      const result = await controller.createInstance(
        serviceProviderIdMock,
        valuesMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(result).toEqual({
        type: 'INSTANCE',
        payload: instanceCreationResultMock,
      });
    });
  });

  describe('getInstanceFormMetadata', () => {
    const metadataMock = [{ name: 'field' }];
    const translatedMock = [{ name: 'field', label: 'libellé' }];

    beforeEach(() => {
      metadataFormServiceMock.getDtoMetadata.mockReturnValue(metadataMock);
      partnersi18nMock.translation.mockReturnValue(translatedMock);
    });

    it('should call metadataFormService.getDtoMetadata with the ServiceProviderInstanceVersionFromSpDto', () => {
      // When
      controller.getInstanceFormMetadata();

      // Then
      expect(
        metadataFormServiceMock.getDtoMetadata,
      ).toHaveBeenCalledExactlyOnceWith(
        ServiceProviderInstanceVersionFromSpDto,
      );
    });

    it('should pass the metadata to the i18n translation', () => {
      // When
      controller.getInstanceFormMetadata();

      // Then
      expect(partnersi18nMock.translation).toHaveBeenCalledExactlyOnceWith(
        metadataMock,
      );
    });

    it('should return the translated metadata', () => {
      // When
      const result = controller.getInstanceFormMetadata();

      // Then
      expect(result).toBe(translatedMock);
    });
  });
});
