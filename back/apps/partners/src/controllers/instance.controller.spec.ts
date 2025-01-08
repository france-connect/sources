import { Test, TestingModule } from '@nestjs/testing';

import { EnvironmentEnum } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionRepository,
} from '@fc/access-control';
import { CsrfTokenGuard } from '@fc/csrf';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';

import { getSessionServiceMock } from '@mocks/session';

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

  const instanceIdMock = 'instanceId';
  const versionIdMock = 'versionId';
  const permissionMock = [
    { entityId: null, entity: null, permissionType: null },
  ];

  const userInfoMock = {
    accountId: Symbol('accountId'),
    email: 'email@email.fr',
    given_name: 'givenName',
    usual_name: 'usualName',
    siret: 'siret',
    sub: 'identityMock.sub value',
  };

  const body = {
    // oidc fashion naming
    // eslint-disable-next-line @typescript-eslint/naming-convention
    instance_name: 'instance name',
  } as unknown as ServiceProviderInstanceVersionDto;

  const rolesGuardMock = {
    canActivate: () => true,
  };

  const csrfTokenGuardMock = {
    canActivate: () => true,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstanceController],
      providers: [
        PartnersServiceProviderInstanceService,
        PartnersServiceProviderInstanceVersionService,
        AccountPermissionRepository,
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionMock)
      .overrideProvider(AccountPermissionRepository)
      .useValue(accountPermissionRepositoryMock)
      .overrideGuard(AccessControlGuard)
      .useValue(rolesGuardMock)
      .overrideGuard(CsrfTokenGuard)
      .useValue(csrfTokenGuardMock)
      .compile();

    controller = module.get<InstanceController>(InstanceController);

    instanceMock.upsert.mockResolvedValueOnce({ id: instanceIdMock });
    versionMock.create.mockResolvedValueOnce({ id: versionIdMock });

    sessionPartnersAccountMock.get.mockReturnValue(userInfoMock);
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
      instanceMock.getById.mockResolvedValue(itemMock);

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
        name: body.instance_name,
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
      expect(versionMock.create).toHaveBeenCalledWith(body, instanceIdMock);
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
      ).toHaveBeenCalledWith(userInfoMock.accountId, instanceIdMock);
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
      ).toHaveBeenCalledWith(userInfoMock.accountId, versionIdMock);
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
          name: body.instance_name,
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
      expect(versionMock.create).toHaveBeenCalledWith(body, instanceIdMock);
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
      ).toHaveBeenCalledWith(userInfoMock.accountId, versionIdMock);
    });
  });
});
