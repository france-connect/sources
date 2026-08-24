import { Test, TestingModule } from '@nestjs/testing';

import {
  EnvironmentEnum,
  PartnersAccount,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PublicationStatusEnum,
} from '@entities/typeorm';

import { AccountPermissionService } from '@fc/access-control';
import { ActionTypes, CreatedVia } from '@fc/csmr-config-client';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import {
  PartnersServiceProviderInstanceVersionService,
  ServiceProviderInstanceVersionStandaloneDto,
} from '@fc/partners-service-provider-instance-version';
import { OidcClientInterface } from '@fc/service-provider';
import { TypeormService } from '@fc/typeorm';

import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { AccessControlEntity, AccessControlPermission } from '../enums';
import { PartnersInstanceNotFoundException } from '../exceptions';
import {
  InstanceCreationContextInterface,
  InstanceCreationOptionsInterface,
  InstanceCreationResultInterface,
} from '../interfaces';
import { PartnersInstanceService } from './partners-instance.service';
import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';
import { PartnerPublicationService } from './partners-publication.service';

describe('PartnersInstanceService', () => {
  let service: PartnersInstanceService;

  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const instance1Mock = {
    id: 'instance-1-id',
    currentVersion: {
      data: {
        name: 'instance name 1',
      },
    },
  } as PartnersServiceProviderInstance;

  const accountId = 'account-id-123';
  const email = 'creator@email.fr';
  const serviceProviderId = 'service-provider-id';
  const instanceId = 'instance-id-123';
  const versionId = 'version-id-123';

  const dataMock = {
    name: 'instance name',
  } as OidcClientInterface;

  const resultMock: InstanceCreationResultInterface = {
    instanceId,
    versionId,
  };

  const instanceServiceMock = {
    save: jest.fn(),
    getByIdWithQueryRunner: jest.fn(),
    markForDeletion: jest.fn(),
  };

  const versionServiceMock = {
    create: jest.fn(),
  };

  const publicationServiceMock = {
    publish: jest.fn(),
  };

  const formServiceMock = {
    fromFormValues: jest.fn(),
  };

  const accountPermissionServiceMock = {
    addPermissionTransactional: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersInstanceService,
        TypeormService,
        PartnersServiceProviderInstanceService,
        PartnersServiceProviderInstanceVersionService,
        PartnerPublicationService,
        PartnersInstanceVersionFormService,
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      ],
    })
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceServiceMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionServiceMock)
      .overrideProvider(PartnerPublicationService)
      .useValue(publicationServiceMock)
      .overrideProvider(PartnersInstanceVersionFormService)
      .useValue(formServiceMock)
      .overrideProvider(
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      )
      .useValue(accountPermissionServiceMock)
      .compile();

    service = module.get<PartnersInstanceService>(PartnersInstanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const valuesMock = {
      name: 'instance name',
    } as unknown as ServiceProviderInstanceVersionStandaloneDto;
    const contextMock: InstanceCreationContextInterface = {
      accountId,
      email,
      serviceProviderId,
    };
    const optionsMock: InstanceCreationOptionsInterface = {
      environment: EnvironmentEnum.SANDBOX,
      grantInstanceContributor: true,
    };

    beforeEach(() => {
      formServiceMock.fromFormValues.mockResolvedValue(dataMock);
      typeormServiceMock.withTransaction.mockResolvedValue(resultMock);
      service['createInstanceWithVersion'] = jest
        .fn()
        .mockResolvedValue(resultMock);
      service['grantContributorPermission'] = jest
        .fn()
        .mockResolvedValue(undefined);
      service['publishCreation'] = jest.fn().mockResolvedValue(undefined);
    });

    it('should prepare data from form values with the target service provider', async () => {
      // When
      await service.create(valuesMock, contextMock, optionsMock);

      // Then
      expect(formServiceMock.fromFormValues).toHaveBeenCalledExactlyOnceWith(
        valuesMock,
        serviceProviderId,
      );
    });

    it('should persist the instance and its version within a transaction', async () => {
      // Given
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );

      // When
      await service.create(valuesMock, contextMock, optionsMock);

      // Then
      expect(typeormServiceMock.withTransaction).toHaveBeenCalledTimes(1);
      expect(
        service['createInstanceWithVersion'],
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        dataMock,
        { accountId, serviceProviderId },
        optionsMock,
      );
    });

    it('should grant the contributor permission within the transaction when grantInstanceContributor is true', async () => {
      // Given
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );

      // When
      await service.create(valuesMock, contextMock, optionsMock);

      // Then
      expect(
        service['grantContributorPermission'],
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceId, accountId);
    });

    it('should not grant any contributor permission when grantInstanceContributor is false', async () => {
      // Given
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );

      // When
      await service.create(valuesMock, contextMock, {
        ...optionsMock,
        grantInstanceContributor: false,
      });

      // Then
      expect(service['grantContributorPermission']).not.toHaveBeenCalled();
    });

    it('should publish the creation with the transaction result and the creator email', async () => {
      // When
      await service.create(valuesMock, contextMock, optionsMock);

      // Then
      expect(service['publishCreation']).toHaveBeenCalledExactlyOnceWith(
        resultMock,
        dataMock,
        { email },
      );
    });

    it('should not publish the creation if the transaction fails', async () => {
      // Given
      typeormServiceMock.withTransaction.mockRejectedValue(
        new Error('transaction failed'),
      );

      // When / Then
      await expect(
        service.create(valuesMock, contextMock, optionsMock),
      ).rejects.toThrow('transaction failed');
      expect(service['publishCreation']).not.toHaveBeenCalled();
    });

    it('should return the persisted instanceId and versionId', async () => {
      // When
      const result = await service.create(valuesMock, contextMock, optionsMock);

      // Then
      expect(result).toEqual(resultMock);
    });
  });

  describe('update', () => {
    const updatedBy = 'updated-by-123';

    beforeEach(() => {
      formServiceMock.fromFormValues.mockResolvedValue(dataMock);
      service['createPendingVersion'] = jest
        .fn()
        .mockResolvedValue({ id: versionId });
    });

    it('should prepare the full data from the given form values, service provider and instance', async () => {
      // When
      await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderId,
        updatedBy,
      );

      // Then
      expect(formServiceMock.fromFormValues).toHaveBeenCalledExactlyOnceWith(
        dataMock,
        serviceProviderId,
        instance1Mock.id,
      );
    });

    it('should create a pending version for the instance with the given query runner', async () => {
      // When
      await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderId,
        updatedBy,
      );

      // Then
      expect(service['createPendingVersion']).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        dataMock,
        instance1Mock.id,
      );
    });

    it('should return a CONFIG_UPDATE publication descriptor holding the updater info', async () => {
      // When
      const result = await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderId,
        updatedBy,
      );

      // Then
      expect(result).toEqual({
        instanceId: instance1Mock.id,
        versionId,
        payload: {
          ...dataMock,
          updatedBy,
        },
        type: ActionTypes.CONFIG_UPDATE,
      });
    });

    it('should not publish the update, publication being the caller responsibility', async () => {
      // When
      await service['update'](
        queryRunnerMock,
        dataMock,
        instance1Mock,
        serviceProviderId,
        updatedBy,
      );

      // Then
      expect(publicationServiceMock.publish).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    const currentVersionMock = {
      id: 'current-version-id',
      data: {
        client_id: 'client-id-mock',
        client_secret: 'client-secret-mock',
        name: 'name-mock',
      },
    };
    const instanceToDeleteMock = {
      id: instanceId,
      currentVersion: currentVersionMock,
    } as unknown as PartnersServiceProviderInstance;

    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );
      instanceServiceMock.getByIdWithQueryRunner.mockResolvedValue(
        instanceToDeleteMock,
      );
    });

    it('should fetch the instance within the transaction', async () => {
      // When
      await service.delete(instanceId);

      // Then
      expect(
        instanceServiceMock.getByIdWithQueryRunner,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceId);
    });

    it('should throw PartnersInstanceNotFoundException if the instance does not exist', async () => {
      // Given
      instanceServiceMock.getByIdWithQueryRunner.mockResolvedValue(null);

      // When / Then
      await expect(service.delete(instanceId)).rejects.toThrow(
        PartnersInstanceNotFoundException,
      );
    });

    it('should not mark for deletion if the instance does not exist', async () => {
      // Given
      instanceServiceMock.getByIdWithQueryRunner.mockResolvedValue(null);

      // When
      await service.delete(instanceId).catch(() => undefined);

      // Then
      expect(instanceServiceMock.markForDeletion).not.toHaveBeenCalled();
    });

    it('should mark the instance for deletion within the transaction', async () => {
      // When
      await service.delete(instanceId);

      // Then
      expect(
        instanceServiceMock.markForDeletion,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, instanceId);
    });

    it('should publish a CONFIG_DELETE message with the client identifier only', async () => {
      // When
      await service.delete(instanceId);

      // Then
      expect(publicationServiceMock.publish).toHaveBeenCalledExactlyOnceWith(
        instanceToDeleteMock.id,
        currentVersionMock.id,
        { client_id: currentVersionMock.data.client_id },
        ActionTypes.CONFIG_DELETE,
      );
    });

    it('should publish the deletion within the transaction', async () => {
      // Given
      const callsMock: string[] = [];

      typeormServiceMock.withTransaction.mockImplementation(
        async (callback) => {
          callsMock.push('transaction:start');
          await callback(queryRunnerMock);
          callsMock.push('transaction:end');
        },
      );
      publicationServiceMock.publish.mockImplementation(() => {
        callsMock.push('publish');
      });

      // When
      await service.delete(instanceId);

      // Then
      expect(callsMock).toStrictEqual([
        'transaction:start',
        'publish',
        'transaction:end',
      ]);
    });

    it('should not publish the deletion if the transaction fails', async () => {
      // Given
      typeormServiceMock.withTransaction.mockRejectedValue(
        new Error('transaction failed'),
      );

      // When / Then
      await expect(service.delete(instanceId)).rejects.toThrow(
        'transaction failed',
      );
      expect(publicationServiceMock.publish).not.toHaveBeenCalled();
    });
  });

  describe('createInstanceWithVersion', () => {
    const attachmentMock = { accountId, serviceProviderId };
    const optionsMock = {
      environment: EnvironmentEnum.SANDBOX,
      grantInstanceContributor: true,
    };

    beforeEach(() => {
      instanceServiceMock.save.mockResolvedValue({ id: instanceId });
      service['createPendingVersion'] = jest
        .fn()
        .mockResolvedValue({ id: versionId });
    });

    it('should save the instance with the requested environment owned by the creator and linked to the service provider', async () => {
      // When
      await service['createInstanceWithVersion'](
        queryRunnerMock,
        dataMock,
        attachmentMock,
        optionsMock,
      );

      // Then
      expect(instanceServiceMock.save).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        {
          environment: EnvironmentEnum.SANDBOX,
          creator: { id: accountId } as PartnersAccount,
          serviceProvider: { id: serviceProviderId } as PartnersServiceProvider,
        },
      );
    });

    it('should create a pending version for the saved instance', async () => {
      // When
      await service['createInstanceWithVersion'](
        queryRunnerMock,
        dataMock,
        attachmentMock,
        optionsMock,
      );

      // Then
      expect(service['createPendingVersion']).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        dataMock,
        instanceId,
      );
    });

    it('should return the persisted instanceId and versionId', async () => {
      // When
      const result = await service['createInstanceWithVersion'](
        queryRunnerMock,
        dataMock,
        attachmentMock,
        optionsMock,
      );

      // Then
      expect(result).toEqual(resultMock);
    });
  });

  describe('grantContributorPermission', () => {
    it('should add a direct INSTANCE_CONTRIBUTOR permission on the instance for the given account within the transaction', async () => {
      // When
      await service['grantContributorPermission'](
        queryRunnerMock,
        instanceId,
        accountId,
      );

      // Then
      expect(
        accountPermissionServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, {
        accountId,
        permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
        entity: AccessControlEntity.SP_INSTANCE,
        entityId: instanceId,
      });
    });
  });

  describe('publishCreation', () => {
    it('should publish a CONFIG_CREATE message with the creator info', async () => {
      // Given
      const dataWithCreatedInfo = {
        ...dataMock,
        createdBy: email,
        createdVia: CreatedVia.PARTNERS_MANUAL,
      };

      // When
      await service['publishCreation'](resultMock, dataMock, { email });

      // Then
      expect(publicationServiceMock.publish).toHaveBeenCalledExactlyOnceWith(
        instanceId,
        versionId,
        dataWithCreatedInfo,
        ActionTypes.CONFIG_CREATE,
      );
    });
  });

  describe('createPendingVersion', () => {
    it('should create a version with a PENDING publication status', async () => {
      // When
      await service['createPendingVersion'](
        queryRunnerMock,
        dataMock,
        instanceId,
      );

      // Then
      expect(versionServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        dataMock,
        instanceId,
        PublicationStatusEnum.PENDING,
      );
    });
  });
});
