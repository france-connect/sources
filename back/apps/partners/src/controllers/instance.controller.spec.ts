import { Test, TestingModule } from '@nestjs/testing';

import { EnvironmentEnum, PublicationStatusEnum } from '@entities/typeorm';

import {
  AccessControlGuard,
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { CreatedVia } from '@fc/csmr-config-client';
import { CsrfTokenGuard } from '@fc/csrf';
import { FormValidationPipe } from '@fc/dto2form';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionDto,
} from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { TypeormService } from '@fc/typeorm';

import { getSessionServiceMock } from '@mocks/session';
import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import {
  PartnerPublicationService,
  PartnersInstanceVersionFormService,
} from '../services';
import { InstanceController } from './instance.controller';

describe('InstanceController', () => {
  let controller: InstanceController;

  const sessionPartnersAccountMock = getSessionServiceMock();
  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const instanceMock = {
    getAllowedInstances: jest.fn(),
    getById: jest.fn(),
    save: jest.fn(),
  };

  const versionMock = {
    create: jest.fn(),
  };

  const accountPermissionServiceMock = {
    addPermissionTransactional: jest.fn(),
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

  const sessionPartnersMock = {
    identity: { ...userInfoMock },
    accessControl: [],
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
        AccountPermissionService,
        PartnerPublicationService,
        PartnersInstanceVersionFormService,
        TypeormService,
      ],
    })
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionMock)
      .overrideProvider(AccountPermissionService)
      .useValue(accountPermissionServiceMock)
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
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .compile();

    controller = module.get<InstanceController>(InstanceController);

    instanceMock.save.mockResolvedValueOnce({ id: instanceIdMock });
    versionMock.create.mockResolvedValueOnce({ id: versionIdMock });
    sessionPartnersAccountMock.get.mockReturnValue(sessionPartnersMock);
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
    beforeEach(() => {
      controller['createInstanceInDatabase'] = jest.fn();
      typeormServiceMock.withTransaction.mockImplementationOnce((callback) => {
        callback(queryRunnerMock);
        return {
          instanceId: instanceIdMock,
          versionId: versionIdMock,
        };
      });
    });

    it('should call session partner account to retrieve accountId', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(sessionPartnersAccountMock.get).toHaveBeenCalledTimes(1);
    });

    it('should createInstanceInDatabase within a transaction', async () => {
      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(typeormServiceMock.withTransaction).toHaveBeenCalledTimes(1);
      expect(
        controller['createInstanceInDatabase'],
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        body,
        sessionPartnersAccountMock.get().identity.id,
      );
    });

    it('should call publish method with instanceId, VersionId, data and action type to create config', async () => {
      // Given
      const dataWithCreatedInfo = {
        ...body,
        createdBy: userInfoMock.email,
        createdVia: CreatedVia.PARTNERS_MANUAL,
      };

      // When
      await controller.createInstance(body, sessionPartnersAccountMock);

      // Then
      expect(publicationMock.publish).toHaveBeenCalledExactlyOnceWith(
        instanceIdMock,
        versionIdMock,
        dataWithCreatedInfo,
        'CONFIG_CREATE',
      );
    });
  });

  describe('createInstanceInDatabase', () => {
    // Given
    const data = {} as OidcClientInterface;
    const accountId = 'accountIdMock';

    it('should call service.save with instance value from body', async () => {
      // Given
      const expected = {
        environment: EnvironmentEnum.SANDBOX,
      };

      // When
      await controller['createInstanceInDatabase'](
        queryRunnerMock,
        data,
        accountId,
      );

      // Then
      expect(instanceMock.save).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        expected,
      );
    });

    it('should call version.create with body and instance id', async () => {
      // When
      await controller['createInstanceInDatabase'](
        queryRunnerMock,
        data,
        accountId,
      );

      // Then
      expect(versionMock.create).toHaveBeenCalledTimes(1);
      expect(versionMock.create).toHaveBeenCalledWith(
        queryRunnerMock,
        data,
        instanceIdMock,
        pendingPublicationStatus,
      );
    });

    it('should call addPermissionTransactional with instanceId, accountId and default params', async () => {
      // When
      await controller['createInstanceInDatabase'](
        queryRunnerMock,
        data,
        accountId,
      );

      // Then
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, {
        accountId: accountId,
        entityId: instanceIdMock,
        entity: EntityType.SP_INSTANCE,
        permissionType: PermissionsType.VIEW,
      });
    });
  });

  describe('updateInstance', () => {
    const versionId = 'versionIdMock';

    beforeEach(() => {
      typeormServiceMock.withQueryRunner.mockImplementationOnce((callback) => {
        callback(queryRunnerMock);
        return versionId;
      });
    });

    it('should call fromFormValues with body and instance id', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(
        partnersServiceMock.fromFormValues,
      ).toHaveBeenCalledExactlyOnceWith(body, instanceIdMock);
    });

    it('should call version.create with queryRunner', async () => {
      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(typeormServiceMock.withQueryRunner).toHaveBeenCalledTimes(1);
      expect(versionMock.create).toHaveBeenCalledWith(
        queryRunnerMock,
        body,
        instanceIdMock,
        pendingPublicationStatus,
      );
    });

    it('should call publish method with instanceId, VersionId, data and action type to update config', async () => {
      // Given
      const dataWithCreatedInfo = {
        ...body,
        updatedBy: userInfoMock.email,
      };

      // When
      await controller.updateInstance(
        body,
        instanceIdMock,
        sessionPartnersAccountMock,
      );

      // Then
      expect(publicationMock.publish).toHaveBeenCalledWith(
        instanceIdMock,
        versionId,
        dataWithCreatedInfo,
        'CONFIG_UPDATE',
      );
    });
  });
});
