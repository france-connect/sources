import { Test, TestingModule } from '@nestjs/testing';

import { EnvironmentEnum, PublicationStatusEnum } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionRepository,
} from '@fc/access-control';
import { CsrfTokenGuard } from '@fc/csrf';
import { FormValidationPipe } from '@fc/dto2form';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';

import { getSessionServiceMock } from '@mocks/session';

import {
  PartnerPublicationService,
  PartnersInstanceVersionFormService,
} from '../services';
import { InstanceController } from './instance.controller';

describe('InstanceController', () => {
  let controller: InstanceController;

  const sessionPartnersAccountMock = getSessionServiceMock();

  const instanceMock = {
    getAllowedInstances: jest.fn(),
    getById: jest.fn(),
    upsert: jest.fn(),
  };

  const versionMock = {
    create: jest.fn(),
  };

  const accountPermissionRepositoryMock = {
    addInstancePermission: jest.fn(),
    addVersionPermission: jest.fn(),
  };

  const partnersServiceMock = {
    fromFormValues: jest.fn(),
    toFormValues: jest.fn(),
  };

  const instanceIdMock = 'instanceId';
  const versionIdMock = 'versionId';
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

  const body = {
    name: 'instance name',
  } as unknown as ServiceProviderInstanceVersionDto;

  const rolesGuardMock = {
    canActivate: () => true,
  };

  const csrfTokenGuardMock = {
    canActivate: () => true,
  };

  const formValidationPipeMock = {
    transform: () => true,
  };

  const publicationMock = {
    publish: jest.fn(),
  };

  const pendingPublicationStatus = PublicationStatusEnum.PENDING;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstanceController],
      providers: [
        PartnersServiceProviderInstanceService,
        PartnersServiceProviderInstanceVersionService,
        AccountPermissionRepository,
        PartnerPublicationService,
        PartnersInstanceVersionFormService,
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionMock)
      .overrideProvider(AccountPermissionRepository)
      .useValue(accountPermissionRepositoryMock)
      .overrideProvider(PartnersInstanceVersionFormService)
      .useValue(partnersServiceMock)
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfTokenGuardMock)
      .overridePipe(FormValidationPipe)
      .useValue(formValidationPipeMock)
      .overrideProvider(PartnerPublicationService)
      .useValue(publicationMock)
      .compile();

    controller = module.get<InstanceController>(InstanceController);

    instanceMock.upsert.mockResolvedValueOnce({ id: instanceIdMock });
    versionMock.create.mockResolvedValueOnce({ id: versionIdMock });
    sessionPartnersAccountMock.get.mockReturnValue({ identity: userInfoMock });
    partnersServiceMock.fromFormValues.mockResolvedValue(body);
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
    it('should call service.upsert with instance value from body', async () => {
      // Given
      const expected = {
        name: body.name,
        environment: EnvironmentEnum.SANDBOX,
      };

      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(instanceMock.upsert).toHaveBeenCalledExactlyOnceWith(expected);
    });

    it('should call version.create with body and instance id', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(versionMock.create).toHaveBeenCalledTimes(1);
      expect(versionMock.create).toHaveBeenCalledWith(
        body,
        instanceIdMock,
        pendingPublicationStatus,
      );
    });

    it('should call session partner account to retrieve accountId', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(sessionPartnersAccountMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call addInstancePermission with instanceId and accountId', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(
        accountPermissionRepositoryMock.addInstancePermission,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountPermissionRepositoryMock.addInstancePermission,
      ).toHaveBeenCalledWith(userInfoMock.id, instanceIdMock);
    });

    it('should call addVersionPermission with versionId and accountId', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(
        accountPermissionRepositoryMock.addVersionPermission,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountPermissionRepositoryMock.addVersionPermission,
      ).toHaveBeenCalledWith(userInfoMock.id, versionIdMock);
    });
  });

  describe('updateInstance', () => {
    it('should call service.upsert with body and instance id', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(instanceMock.upsert).toHaveBeenCalledTimes(1);
      expect(instanceMock.upsert).toHaveBeenCalledWith(
        {
          name: body.name,
        },
        instanceIdMock,
      );
    });

    it('should call version.create with body and instance id', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(versionMock.create).toHaveBeenCalledTimes(1);
      expect(versionMock.create).toHaveBeenCalledWith(
        body,
        instanceIdMock,
        pendingPublicationStatus,
      );
    });

    it('should call session partner account to retrieve accountId', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(sessionPartnersAccountMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call addVersionPermission with versionId and accountId', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(
        accountPermissionRepositoryMock.addVersionPermission,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountPermissionRepositoryMock.addVersionPermission,
      ).toHaveBeenCalledWith(userInfoMock.id, versionIdMock);
    });
  });
});
