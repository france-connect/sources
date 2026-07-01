import { Test, TestingModule } from '@nestjs/testing';

import { EnvironmentEnum } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionService,
} from '@fc/access-control';
import { CsrfTokenGuard } from '@fc/csrf';
import { FormValidationPipe } from '@fc/dto2form';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { ServiceProviderInstanceVersionStandaloneDto } from '@fc/partners-service-provider-instance-version';
import { SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { getSessionServiceMock } from '@mocks/session';
import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import {
  AccessControlEntity,
  AccessControlPermission,
  DefaultServiceProviderEnum,
  PartnersPlatformEnum,
} from '../enums';
import { PartnersInstanceNotFoundException } from '../exceptions';
import {
  PartnersInstanceService,
  PartnersInstanceVersionFormService,
} from '../services';
import { InstanceController } from './instance.controller';

describe('InstanceController', () => {
  let controller: InstanceController;

  const sessionPartnersAccountMock = getSessionServiceMock();
  const sessionServiceMock = getSessionServiceMock();
  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const instanceMock = {
    getAllowedInstances: jest.fn(),
    getById: jest.fn(),
    getByIdWithQueryRunner: jest.fn(),
    getByIdsWithQueryRunner: jest.fn(),
    getLinkableInstances: jest.fn(),
    linkToServiceProvider: jest.fn(),
    save: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const accountPermissionServiceMock = {
    addPermissionTransactional: jest.fn(),
    removePermissionTransactional: jest.fn(),
  };

  const partnersServiceMock = {
    toFormValues: jest.fn(),
  };

  const instanceIdMock = 'instanceId';
  const permissionMock = [
    { entityId: null, entity: null, permissionType: null },
  ];

  const userInfoMock = {
    id: Symbol('accountId'),
    email: 'email@email.fr',
    given_name: 'givenName',
    usual_name: 'usualName',
    siret: 'siret',
    sub: 'identityMock.sub value',
  };

  const sessionPartnersMock = {
    identity: { ...userInfoMock },
    accessControl: [],
  };

  const body = {
    name: 'instance name',
  } as unknown as ServiceProviderInstanceVersionStandaloneDto;

  const rolesGuardMock = {
    canActivate: () => true,
  };

  const csrfTokenGuardMock = {
    canActivate: () => true,
  };

  const formValidationPipeMock = {
    transform: () => true,
  };

  const serviceProviderMock = {
    id: DefaultServiceProviderEnum.DEFAULT_LOW_SP,
  };

  const instanceServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstanceController],
      providers: [
        PartnersServiceProviderInstanceService,
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
        PartnersInstanceVersionFormService,
        TypeormService,
        SessionService,
        PartnersServiceProviderService,
        PartnersInstanceService,
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceMock)
      .overrideProvider(
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      )
      .useValue(accountPermissionServiceMock)
      .overrideProvider(PartnersInstanceVersionFormService)
      .useValue(partnersServiceMock)
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfTokenGuardMock)
      .overridePipe(FormValidationPipe)
      .useValue(formValidationPipeMock)
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(PartnersServiceProviderService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(PartnersInstanceService)
      .useValue(instanceServiceMock)
      .compile();

    controller = module.get<InstanceController>(InstanceController);

    sessionPartnersAccountMock.get.mockReturnValue(sessionPartnersMock);
    sessionServiceMock.get.mockReturnValue(sessionPartnersMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('retrieveVersions', () => {
    it('should call service.getAllowedInstances with permission from params', async () => {
      // When
      await controller.retrieveVersions(permissionMock);

      // Then
      expect(instanceMock.getAllowedInstances).toHaveBeenCalledExactlyOnceWith(
        permissionMock,
        sessionPartnersMock.identity.id,
      );
    });

    it('should return result of getAllowedInstances()', async () => {
      // Given
      const itemMock = Symbol('service provider');
      instanceMock.getAllowedInstances.mockResolvedValue(itemMock);

      // When
      const result = await controller.retrieveVersions(permissionMock);

      // Then
      expect(result).toEqual({
        type: 'INSTANCE',
        payload: itemMock,
      });
    });
  });

  describe('retrieveInstance', () => {
    it('should call service.getById with permission from params', async () => {
      // When
      await controller.retrieveInstance(instanceIdMock);

      // Then
      expect(instanceMock.getById).toHaveBeenCalledExactlyOnceWith(
        instanceIdMock,
      );
    });

    it('should return result of getById()', async () => {
      // Given
      const itemMock = Symbol('service provider');
      partnersServiceMock.toFormValues.mockReturnValueOnce(itemMock);

      // When
      const result = await controller.retrieveInstance(instanceIdMock);

      // Then
      expect(result).toEqual({
        type: 'INSTANCE',
        payload: itemMock,
      });
    });
  });

  describe('createInstance', () => {
    const instanceCreationResultMock = {
      instanceId: 'instance-id',
      versionId: 'version-id',
    };

    beforeEach(() => {
      instanceServiceMock.create.mockResolvedValue(instanceCreationResultMock);
    });

    it('should call session partner account to retrieve accountId', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(sessionPartnersAccountMock.get).toHaveBeenCalledTimes(1);
    });

    it('should delegate to instanceService.create with the default low SP, the sandbox environment and grantInstanceContributor true', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(instanceServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        body,
        {
          accountId: userInfoMock.id,
          email: userInfoMock.email,
          serviceProviderId: DefaultServiceProviderEnum.DEFAULT_LOW_SP,
        },
        {
          environment: EnvironmentEnum.SANDBOX,
          grantInstanceContributor: true,
        },
      );
    });

    it('should return an INSTANCE FSA with the created instanceId and versionId', async () => {
      // When
      const result = await controller.createInstance(
        body,
        sessionPartnersAccountMock,
      );

      // Then
      expect(result).toEqual({
        type: 'INSTANCE',
        payload: instanceCreationResultMock,
      });
    });
  });

  describe('retrieveLinkableInstances', () => {
    const serviceProviderIdMock = 'sp-id-mock';
    const detachedInstancesMock = [Symbol('instance1'), Symbol('instance2')];

    beforeEach(() => {
      instanceMock.getLinkableInstances.mockResolvedValue(
        detachedInstancesMock,
      );
    });

    it('should call serviceProvider.getById with the serviceProviderId', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        platform: { name: PartnersPlatformEnum.FRANCE_CONNECT_LOW },
      });

      // When
      await controller.retrieveLinkableInstances(serviceProviderIdMock);

      // Then
      expect(
        serviceProviderServiceMock.getById,
      ).toHaveBeenCalledExactlyOnceWith(serviceProviderIdMock);
    });

    it('should call getDetachedInstances with accountId and DEFAULT_LOW_SP for a LOW platform', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        platform: { name: PartnersPlatformEnum.FRANCE_CONNECT_LOW },
      });

      // When
      await controller.retrieveLinkableInstances(serviceProviderIdMock);

      // Then
      expect(instanceMock.getLinkableInstances).toHaveBeenCalledExactlyOnceWith(
        sessionPartnersMock.identity.id,
        DefaultServiceProviderEnum.DEFAULT_LOW_SP,
      );
    });

    it('should call getDetachedInstances with accountId and DEFAULT_HIGH_SP for a HIGH platform', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        platform: { name: PartnersPlatformEnum.FRANCE_CONNECT_HIGH },
      });

      // When
      await controller.retrieveLinkableInstances(serviceProviderIdMock);

      // Then
      expect(instanceMock.getLinkableInstances).toHaveBeenCalledExactlyOnceWith(
        sessionPartnersMock.identity.id,
        DefaultServiceProviderEnum.DEFAULT_HIGH_SP,
      );
    });

    it('should call serviceProvider.getById with the serviceProviderId', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        platform: { name: PartnersPlatformEnum.FRANCE_CONNECT_HIGH },
      });

      // When
      await controller.retrieveLinkableInstances(serviceProviderIdMock);
    });

    it('should return instances and serviceProvider as FSA payload', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValueOnce({
        platform: { name: PartnersPlatformEnum.FRANCE_CONNECT_LOW },
      });

      // When
      const result = await controller.retrieveLinkableInstances(
        serviceProviderIdMock,
      );

      // Then
      expect(result).toEqual({
        type: 'INSTANCE',
        payload: {
          instances: detachedInstancesMock,
          serviceProvider: {
            platform: { name: PartnersPlatformEnum.FRANCE_CONNECT_LOW },
          },
        },
      });
    });
  });

  describe('linkInstancesToServiceProvider', () => {
    const serviceProviderIdMock = 'sp-id-mock';
    const instanceIdsMock = ['instance-id-1', 'instance-id-2'];
    const instancesMock = [
      {
        id: instanceIdsMock[0],
        currentVersion: { data: { name: 'instance name 1' } },
      },
      {
        id: instanceIdsMock[1],
        currentVersion: { data: { name: 'instance name 2' } },
      },
    ];

    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementationOnce(
        async (callback) => {
          await callback(queryRunnerMock);
        },
      );
      instanceMock.getByIdsWithQueryRunner.mockResolvedValue(instancesMock);
    });

    it('should call linkToServiceProvider in a transaction', async () => {
      // When
      await controller.linkInstancesToServiceProvider(
        {
          serviceProviderId: serviceProviderIdMock,
          instanceIds: instanceIdsMock,
        },
        sessionPartnersAccountMock,
      );

      // Then
      expect(typeormServiceMock.withTransaction).toHaveBeenCalledTimes(1);
      expect(
        instanceMock.linkToServiceProvider,
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        instanceIdsMock,
        serviceProviderIdMock,
      );
    });

    it('should call getByIds with instanceIds after the transaction', async () => {
      // When
      await controller.linkInstancesToServiceProvider(
        {
          serviceProviderId: serviceProviderIdMock,
          instanceIds: instanceIdsMock,
        },
        sessionPartnersAccountMock,
      );

      // Then
      expect(
        instanceMock.getByIdsWithQueryRunner,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceIdsMock);
    });

    it('should update each instance', async () => {
      // When
      await controller.linkInstancesToServiceProvider(
        {
          serviceProviderId: serviceProviderIdMock,
          instanceIds: instanceIdsMock,
        },
        sessionPartnersAccountMock,
      );

      // Then
      expect(instanceServiceMock.update).toHaveBeenCalledTimes(
        instancesMock.length,
      );
      instancesMock.forEach((instance) => {
        expect(instanceServiceMock.update).toHaveBeenCalledWith(
          queryRunnerMock,
          instance.currentVersion.data,
          instance,
          serviceProviderIdMock,
          userInfoMock.email,
        );
      });
    });

    it('should remove the INSTANCE_CONTRIBUTOR permission for each instance', async () => {
      // When
      await controller.linkInstancesToServiceProvider(
        {
          serviceProviderId: serviceProviderIdMock,
          instanceIds: instanceIdsMock,
        },
        sessionPartnersAccountMock,
      );

      // Then
      expect(
        accountPermissionServiceMock.removePermissionTransactional,
      ).toHaveBeenCalledTimes(instancesMock.length);
      instancesMock.forEach((instance) => {
        expect(
          accountPermissionServiceMock.removePermissionTransactional,
        ).toHaveBeenCalledWith(queryRunnerMock, {
          accountId: userInfoMock.id,
          permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
          entity: AccessControlEntity.SP_INSTANCE,
          entityId: instance.id,
        });
      });
    });

    it('should return the linked instances as FSA payload', async () => {
      // When
      const result = await controller.linkInstancesToServiceProvider(
        {
          serviceProviderId: serviceProviderIdMock,
          instanceIds: instanceIdsMock,
        },
        sessionPartnersAccountMock,
      );

      // Then
      expect(result).toEqual({
        type: 'INSTANCE',
        payload: instancesMock,
      });
    });
  });

  describe('updateInstance', () => {
    const versionId = 'versionIdMock';
    const instanceEntityMock = {
      serviceProvider: serviceProviderMock,
    };

    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementationOnce(
        async (callback) => {
          await callback(queryRunnerMock);
          return versionId;
        },
      );

      instanceMock.getByIdWithQueryRunner.mockResolvedValueOnce(
        instanceEntityMock,
      );
    });

    it('should update instance with session partners account email', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(instanceServiceMock.update).toHaveBeenCalledWith(
        queryRunnerMock,
        body,
        instanceEntityMock,
        serviceProviderMock.id,
        userInfoMock.email,
      );
    });

    it('should throw PartnersInstanceNotFoundException if instance is not found', async () => {
      // Given
      instanceMock.getByIdWithQueryRunner.mockReset();
      instanceMock.getByIdWithQueryRunner.mockResolvedValueOnce(null);

      // When / Then
      await expect(
        controller.updateInstance(
          body,
          instanceIdMock,
          sessionPartnersAccountMock,
        ),
      ).rejects.toThrow(PartnersInstanceNotFoundException);
    });
  });
});
