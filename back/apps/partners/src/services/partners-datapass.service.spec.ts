import { Repository } from 'typeorm';

import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import {
  PartnersAccount,
  PartnersOrganization,
  PartnersPlatform,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
} from '@entities/typeorm';

import {
  AccountPermissionInterface,
  AccountPermissionService,
} from '@fc/access-control';
import { CryptographyService } from '@fc/cryptography';
import { DatapassEvents, SimplifiedDatapassPayload } from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { PartnersAccountService } from '@fc/partners-account';
import { PartnersOrganizationService } from '@fc/partners-organization';
import {
  PartnersServiceProviderCreationFailureException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceVersionService } from '@fc/partners-service-provider-instance-version';
import { TypeormService } from '@fc/typeorm';

import { getLoggerMock } from '@mocks/logger';
import {
  getQueryRunnerMock,
  getRepositoryMock,
  getTypeormServiceMock,
  resetRepositoryMock,
} from '@mocks/typeorm';

import { EidasPlatformMap } from '../const/eidas-platform.map';
import {
  AccessControlEntity,
  AccessControlPermission,
  CreatedBy,
} from '../enums';
import { ServiceProviderCreationResultInterface } from '../interfaces';
import { PartnersDatapassService } from './partners-datapass.service';
import { PartnersInstanceService } from './partners-instance.service';
import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';
import { PartnerPublicationService } from './partners-publication.service';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
}));

describe('PartnersDatapassService', () => {
  let service: PartnersDatapassService;

  const loggerServiceMock = getLoggerMock();
  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const accountServiceMock = {
    getOrCreateByEmail: jest.fn(),
    updateAccountTransactional: jest.fn(),
  };

  const serviceProviderServiceMock = {
    upsert: jest.fn(),
    getByIdTransactional: jest.fn(),
  };

  const accessControlServiceMock = {
    addPermissionTransactional: jest.fn(),
    removePermissionTransactional: jest.fn(),
    getAccountsByPermissions: jest.fn(),
  };

  const cryptoMock = {
    hash: jest.fn(),
  };

  const simplifiedDatapassPayloadMock: SimplifiedDatapassPayload = {
    event: DatapassEvents.APPROVE,
    datapassRequestId: '12345',
    state: 'approved',
    organization: {
      id: 12345,
      name: 'Test Organization',
      siret: '12345678901234',
    },
    datapassAuthorizationId: '12345678901234',
    datapassEidasLevel: 'eidas_1',
    applicant: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
      phone: '0102030405',
    },
    datapassName: 'Test Service Provider',
    scopes: ['openid', 'given_name', 'family_name', 'email'],
    technicalContact: {
      email: 'tech@example.com',
      firstname: 'Tech',
      lastname: 'Contact',
      phone: '0607080910',
    },
  };

  const instance1Mock = {
    id: 'instance-1-id',
    currentVersion: {
      data: {
        name: 'instance name 1',
      },
    },
  } as PartnersServiceProviderInstance;

  const instance2Mock = {
    id: 'instance-2-id',
    currentVersion: {
      data: {
        name: 'instance name 2',
      },
    },
  } as PartnersServiceProviderInstance;

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    datapassRequestId: '12345',
    datapassScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organization: {
      id: '12345',
      name: 'Test Organization',
      siret: '12345678901234',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      serviceProviders: [],
    },
    datapassAuthorizationId: '12345678901234',
    datapassEidasLevel: 'eidas_1',
    createdAt: new Date(),
    updatedAt: new Date(),
    instances: [instance1Mock, instance2Mock],
  };

  const creationResultMock: ServiceProviderCreationResultInterface = {
    serviceProviderId: serviceProviderMock.id,
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

  const organizationServiceMock = {
    upsert: jest.fn(),
  };

  const platformRepositoryMock = getRepositoryMock();

  const platformMock = {
    id: 'platform-id',
    name: 'platform name',
  } as PartnersPlatform;

  const instanceServiceMock = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersPlatform])],
      providers: [
        PartnersDatapassService,
        LoggerService,
        TypeormService,
        PartnersAccountService,
        PartnersServiceProviderService,
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
        CryptographyService,
        PartnersServiceProviderInstanceVersionService,
        PartnerPublicationService,
        PartnersInstanceVersionFormService,
        PartnersOrganizationService,
        Repository<PartnersPlatform>,
        PartnersInstanceService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .overrideProvider(PartnersAccountService)
      .useValue(accountServiceMock)
      .overrideProvider(PartnersServiceProviderService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(
        AccountPermissionService<AccessControlEntity, AccessControlPermission>,
      )
      .useValue(accessControlServiceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptoMock)
      .overrideProvider(PartnersServiceProviderInstanceVersionService)
      .useValue(versionServiceMock)
      .overrideProvider(PartnerPublicationService)
      .useValue(publicationServiceMock)
      .overrideProvider(PartnersInstanceVersionFormService)
      .useValue(formServiceMock)
      .overrideProvider(PartnersOrganizationService)
      .useValue(organizationServiceMock)
      .overrideProvider(getRepositoryToken(PartnersPlatform))
      .useValue(platformRepositoryMock)
      .overrideProvider(PartnersInstanceService)
      .useValue(instanceServiceMock)
      .compile();

    service = module.get<PartnersDatapassService>(PartnersDatapassService);

    accessControlServiceMock.getAccountsByPermissions.mockResolvedValue([]);

    resetRepositoryMock(platformRepositoryMock);
    platformRepositoryMock.findOne.mockResolvedValue(platformMock);
    serviceProviderServiceMock.getByIdTransactional = jest
      .fn()
      .mockResolvedValue(serviceProviderMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleWebhookEvent', () => {
    it('should call handleApproveEvent for APPROVE event', async () => {
      // Given
      service['handleApproveEvent'] = jest.fn();

      // When
      await service.handleWebhookEvent(simplifiedDatapassPayloadMock);

      // Then
      expect(service['handleApproveEvent']).toHaveBeenCalledExactlyOnceWith(
        simplifiedDatapassPayloadMock,
      );
    });

    it('should return status code returned by handle method', async () => {
      // Given
      service['handleApproveEvent'] = jest.fn().mockResolvedValue({
        statusCode: HttpStatus.CREATED,
      });

      // When
      const result = await service.handleWebhookEvent(
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(result).toEqual({ statusCode: HttpStatus.CREATED });
    });

    it('should call handleNotImplementedEvent for events different from APPROVE', async () => {
      // Given
      const unmappedPayload = {
        ...simplifiedDatapassPayloadMock,
        event: DatapassEvents.CREATE,
      };

      service['handleNotImplementedEvent'] = jest.fn();

      // When
      await service.handleWebhookEvent(unmappedPayload);

      // Then
      expect(
        service['handleNotImplementedEvent'],
      ).toHaveBeenCalledExactlyOnceWith(unmappedPayload);
    });

    it('should log info when handling an unknown event', async () => {
      // Given
      const unmappedPayload = {
        ...simplifiedDatapassPayloadMock,
        event: 'UNKNOWN_EVENT' as DatapassEvents,
      };

      // When
      await service.handleWebhookEvent(unmappedPayload);

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledWith({
        message: 'DataPass event not implemented',
        event: 'UNKNOWN_EVENT',
        datapassRequestId: simplifiedDatapassPayloadMock.datapassRequestId,
      });
    });

    it('should return NO_CONTENT for unmapped events', async () => {
      // Given
      const unmappedPayload = {
        ...simplifiedDatapassPayloadMock,
        event: 'UNKNOWN_EVENT' as DatapassEvents,
      };

      // When
      const result = await service.handleWebhookEvent(unmappedPayload);

      // Then
      expect(result).toEqual({ statusCode: HttpStatus.NO_CONTENT });
    });
  });

  describe('handleApproveEvent', () => {
    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );
      service['upsertServiceProviderTransactional'] = jest
        .fn()
        .mockResolvedValue(creationResultMock);

      service['updateInstances'] = jest.fn().mockResolvedValue(undefined);
    });

    it('should call upsertServiceProviderTransactional within a transaction', async () => {
      // When
      await service['handleApproveEvent'](simplifiedDatapassPayloadMock);

      // Then
      expect(
        service['upsertServiceProviderTransactional'],
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );
    });

    it('should create service provider successfully', async () => {
      // When
      const result = await service['handleApproveEvent'](
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(result.statusCode).toBe(HttpStatus.CREATED);
    });

    it('should update instances successfully', async () => {
      // When
      await service['handleApproveEvent'](simplifiedDatapassPayloadMock);

      // Then
      expect(service['updateInstances']).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        serviceProviderMock.id,
      );
    });

    it('should log success message', async () => {
      // When
      await service['handleApproveEvent'](simplifiedDatapassPayloadMock);

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledWith({
        message:
          'Service Provider created successfully from DataPass approve event',
        serviceProviderId: serviceProviderMock.id,
        datapassRequestId: simplifiedDatapassPayloadMock.datapassRequestId,
      });
    });

    it('should throw PartnersServiceProviderCreationFailureException on error', async () => {
      // Given
      const error = new Error('Database error');
      service['upsertServiceProviderTransactional'] = jest
        .fn()
        .mockRejectedValue(error);

      // When / Then
      await expect(
        service['handleApproveEvent'](simplifiedDatapassPayloadMock),
      ).rejects.toThrow(PartnersServiceProviderCreationFailureException);
    });

    it('should log warning message on failure', async () => {
      // Given
      const error = new Error('Database error');
      service['upsertServiceProviderTransactional'] = jest
        .fn()
        .mockRejectedValue(error);

      // When / Then
      await expect(
        service['handleApproveEvent'](simplifiedDatapassPayloadMock),
      ).rejects.toThrow(PartnersServiceProviderCreationFailureException);

      expect(loggerServiceMock.warning).toHaveBeenCalledWith({
        message:
          'Failed to create Service Provider from DataPass approve event',
        error: error.message,
        stack: error.stack,
        datapassRequestId: simplifiedDatapassPayloadMock.datapassRequestId,
      });
    });
  });

  describe('upsertServiceProviderTransactional', () => {
    beforeEach(() => {
      service['upsertServiceProvider'] = jest
        .fn()
        .mockResolvedValue(serviceProviderMock);
      service['manageUsersFromDatapass'] = jest
        .fn()
        .mockResolvedValue(undefined);
    });

    it('should call createUsersFromDatapass when validation passes', async () => {
      // When
      await service['upsertServiceProviderTransactional'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(service['manageUsersFromDatapass']).toHaveBeenCalledWith(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
        serviceProviderMock.id,
      );
    });

    it('should create service provider', async () => {
      // When
      await service['upsertServiceProviderTransactional'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(service['upsertServiceProvider']).toHaveBeenCalledWith(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );
    });

    it('should return service provider id', async () => {
      // When
      const result = await service['upsertServiceProviderTransactional'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(result).toEqual({
        serviceProviderId: serviceProviderMock.id,
      });
    });
  });

  describe('upsertServiceProvider', () => {
    beforeEach(() => {
      serviceProviderServiceMock.upsert.mockResolvedValue(serviceProviderMock);
    });

    it('should find platform entity', async () => {
      // When
      await service['upsertServiceProvider'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(platformRepositoryMock.findOne).toHaveBeenCalledWith({
        where: {
          name: EidasPlatformMap[
            simplifiedDatapassPayloadMock.datapassEidasLevel
          ],
        },
      });
    });

    it('should create service provider entity with correct data', async () => {
      // When
      await service['upsertServiceProvider'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(serviceProviderServiceMock.upsert).toHaveBeenCalledWith(
        queryRunnerMock,
        {
          name: simplifiedDatapassPayloadMock.datapassName,
          organization: expect.any(PartnersOrganization),
          platform: platformMock,
          datapassRequestId: simplifiedDatapassPayloadMock.datapassRequestId,
          datapassAuthorizationId:
            simplifiedDatapassPayloadMock.datapassAuthorizationId,
          datapassEidasLevel: simplifiedDatapassPayloadMock.datapassEidasLevel,
          datapassScopes: simplifiedDatapassPayloadMock.scopes,
        },
      );
    });

    it('should return the created service provider', async () => {
      // When
      const result = await service['upsertServiceProvider'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(result).toBe(serviceProviderMock);
    });
  });

  describe('handleNotImplementedEvent', () => {
    it('should log info about not implemented event', () => {
      // Given
      const unmappedPayload = {
        ...simplifiedDatapassPayloadMock,
        event: DatapassEvents.ARCHIVE,
      };

      // When
      service['handleNotImplementedEvent'](unmappedPayload);

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledExactlyOnceWith({
        message: `DataPass ${unmappedPayload.event} event not yet implemented`,
        datapassRequestId: unmappedPayload.datapassRequestId,
      });
    });

    it('should return NO_CONTENT status', () => {
      // Given
      const unmappedPayload = {
        ...simplifiedDatapassPayloadMock,
        event: DatapassEvents.ARCHIVE,
      };

      // When
      const result = service['handleNotImplementedEvent'](unmappedPayload);

      // Then
      expect(result).toEqual({ statusCode: HttpStatus.NO_CONTENT });
    });
  });

  describe('manageUsersFromDatapass', () => {
    const newContactsMock = [{ account: { email: 'new@example.com' } }] as any;
    const existingContactsMock = [
      { account: { email: 'old@example.com' } },
    ] as any;

    beforeEach(() => {
      service['getNewContacts'] = jest.fn().mockReturnValue(newContactsMock);
      service['getExistingContacts'] = jest
        .fn()
        .mockResolvedValue(existingContactsMock);
      service['manageContacts'] = jest.fn().mockResolvedValue(undefined);
    });

    it('should orchestrate get and manage contact methods', async () => {
      // When
      await service.manageUsersFromDatapass(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
        serviceProviderMock.id,
      );

      // Then
      expect(service['getNewContacts']).toHaveBeenCalledExactlyOnceWith(
        simplifiedDatapassPayloadMock,
      );
      expect(service['getExistingContacts']).toHaveBeenCalledExactlyOnceWith(
        serviceProviderMock.id,
      );
      expect(service['manageContacts']).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        newContactsMock,
        existingContactsMock,
        serviceProviderMock.id,
      );
    });
  });

  describe('getNewContacts', () => {
    beforeEach(() => {
      cryptoMock.hash.mockImplementation((email) => `hashed-${email}`);
    });

    it('should build applicant and technical contacts with hashed sub', () => {
      // When
      const result = service['getNewContacts'](simplifiedDatapassPayloadMock);

      // Then
      expect(cryptoMock.hash).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        {
          account: {
            email: simplifiedDatapassPayloadMock.applicant.email,
            firstname: simplifiedDatapassPayloadMock.applicant.firstname,
            lastname: simplifiedDatapassPayloadMock.applicant.lastname,
            phone: simplifiedDatapassPayloadMock.applicant.phone,
            sub: 'hashed-test@example.com',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
        {
          account: {
            email: simplifiedDatapassPayloadMock.technicalContact.email,
            firstname: simplifiedDatapassPayloadMock.technicalContact.firstname,
            lastname: simplifiedDatapassPayloadMock.technicalContact.lastname,
            phone: simplifiedDatapassPayloadMock.technicalContact.phone,
            sub: 'hashed-tech@example.com',
          },
          permissionType: AccessControlPermission.SP_TECH,
        },
      ]);
    });
  });

  describe('getDistinctContacts', () => {
    it('should return an empty array when no contacts are provided', () => {
      // When
      const result = service['getDistinctContacts']([]);

      // Then
      expect(result).toEqual([]);
    });

    it('should return the same array when all contacts have different emails', () => {
      // Given
      const contacts = [
        {
          account: { email: 'admin@example.com' },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
        {
          account: { email: 'tech@example.com' },
          permissionType: AccessControlPermission.SP_TECH,
        },
      ] as unknown as AccountPermissionInterface<
        PartnersAccount,
        AccessControlPermission
      >[];

      // When
      const result = service['getDistinctContacts'](contacts);

      // Then
      expect(result).toEqual(contacts);
    });

    it('should return distinct contacts keeping the last item with the same email', () => {
      // Given
      const newContacts = [
        {
          account: { email: 'new@example.com' },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
        {
          account: { email: 'new@example.com' },
          permissionType: AccessControlPermission.SP_TECH,
        },
      ] as unknown as AccountPermissionInterface<
        PartnersAccount,
        AccessControlPermission
      >[];

      // When
      const result = service['getDistinctContacts'](newContacts);

      // Then
      expect(result).toEqual([
        {
          account: { email: 'new@example.com' },
          permissionType: AccessControlPermission.SP_TECH,
        },
      ]);
    });
  });

  describe('getExistingContacts', () => {
    it('should retrieve existing contacts from access control service', async () => {
      // Given
      const existingContacts = [{ account: { id: 'account-id' } }] as any;
      accessControlServiceMock.getAccountsByPermissions.mockResolvedValue(
        existingContacts,
      );

      // When
      const result = await service['getExistingContacts'](
        serviceProviderMock.id,
      );

      // Then
      expect(
        accessControlServiceMock.getAccountsByPermissions,
      ).toHaveBeenCalledExactlyOnceWith(
        [AccessControlPermission.SP_ADMIN, AccessControlPermission.SP_TECH],
        AccessControlEntity.SERVICE_PROVIDER,
        serviceProviderMock.id,
      );
      expect(result).toBe(existingContacts);
    });
  });

  describe('manageContacts', () => {
    const currentContactsMock = [
      {
        account: { id: 'old-id', email: 'old@example.com' },
        permissionType: AccessControlPermission.SP_TECH,
      },
    ];
    const newContactsMock = [
      {
        account: { id: 'new-id', email: 'new@example.com' },
        permissionType: AccessControlPermission.SP_ADMIN,
      },
    ];

    beforeEach(() => {
      service['mapContacts'] = jest
        .fn()
        .mockReturnValueOnce({
          'old@example.com:SP_TECH': currentContactsMock[0],
        })
        .mockReturnValueOnce({
          'new@example.com:SP_ADMIN': newContactsMock[0],
        });
      service['addContact'] = jest.fn().mockResolvedValue(undefined);
      service['removeContact'] = jest.fn().mockResolvedValue(undefined);
      service['getDistinctContacts'] = jest
        .fn()
        .mockReturnValue(newContactsMock);
      service['updateContactsData'] = jest.fn().mockResolvedValue(undefined);
    });

    it('should add missing, remove obsolete and update contacts data', async () => {
      // When
      await service['manageContacts'](
        queryRunnerMock,
        newContactsMock as any,
        currentContactsMock as any,
        serviceProviderMock.id,
      );

      // Then
      expect(service['addContact']).toHaveBeenCalledWith(
        queryRunnerMock,
        newContactsMock[0],
        serviceProviderMock.id,
      );
      expect(service['removeContact']).toHaveBeenCalledWith(
        queryRunnerMock,
        currentContactsMock[0],
        serviceProviderMock.id,
      );
      expect(service['getDistinctContacts']).toHaveBeenCalledWith(
        newContactsMock,
      );
      expect(service['updateContactsData']).toHaveBeenCalledWith(
        queryRunnerMock,
        currentContactsMock,
        newContactsMock,
      );
    });
  });

  describe('removeContact', () => {
    it('should remove scoped permission for the contact', async () => {
      // Given
      const contact = {
        account: { id: 'obsolete-contact-id' },
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      } as any;

      // When
      await service['removeContact'](
        queryRunnerMock,
        contact,
        serviceProviderMock.id,
      );

      // Then
      expect(
        accessControlServiceMock.removePermissionTransactional,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, {
        accountId: 'obsolete-contact-id',
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        entityId: serviceProviderMock.id,
      });
    });
  });

  describe('updateContactsData', () => {
    it('should not update account when find does not return freshData', async () => {
      // Given
      const existingContacts = [
        {
          account: {
            email: 'same@example.com',
            phone: '0102030405',
            firstname: 'Same',
            lastname: 'User',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;
      const newContacts = [
        {
          account: {
            email: 'same@example.com',
            phone: '0102030405',
            firstname: 'Same',
            lastname: 'User',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;

      // When
      await service['updateContactsData'](
        queryRunnerMock,
        existingContacts,
        newContacts,
      );

      // Then
      expect(
        accountServiceMock.updateAccountTransactional,
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        {
          email: 'same@example.com',
          firstname: 'Same',
          lastname: 'User',
        },
        {
          email: 'same@example.com',
          lastConnection: expect.any(Object),
        },
      );
    });

    it('should not update the phone number when contact phone number is undefined', async () => {
      // Given
      const existingContacts = [
        {
          account: {
            email: 'same@example.com',
            phone: '0102030405',
            firstname: 'Same',
            lastname: 'User',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;
      const newContacts = [
        {
          account: {
            email: 'same@example.com',
            phone: undefined,
            firstname: 'Same',
            lastname: 'User',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;

      // When
      await service['updateContactsData'](
        queryRunnerMock,
        existingContacts,
        newContacts,
      );

      // Then
      expect(
        accountServiceMock.updateAccountTransactional,
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        {
          email: 'same@example.com',
          firstname: 'Same',
          lastname: 'User',
        },
        {
          email: 'same@example.com',
          lastConnection: expect.any(Object),
        },
      );
    });

    it('should update account when find returns freshData', async () => {
      // Given
      const existingContacts = [
        {
          account: {
            email: 'same@example.com',
            phone: '0102030405',
            firstname: 'Old',
            lastname: 'Name',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;
      const newContacts = [
        {
          account: {
            email: 'same@example.com',
            phone: '0607080910',
            firstname: 'New',
            lastname: 'Name',
          },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;

      // When
      await service['updateContactsData'](
        queryRunnerMock,
        existingContacts,
        newContacts,
      );

      // Then
      expect(
        accountServiceMock.updateAccountTransactional,
      ).toHaveBeenCalledTimes(2);
      expect(
        accountServiceMock.updateAccountTransactional,
      ).toHaveBeenNthCalledWith(1, queryRunnerMock, {
        email: 'same@example.com',
        phone: '0607080910',
      });
      expect(
        accountServiceMock.updateAccountTransactional,
      ).toHaveBeenNthCalledWith(
        2,
        queryRunnerMock,
        {
          email: 'same@example.com',
          firstname: 'New',
          lastname: 'Name',
        },
        {
          email: 'same@example.com',
          lastConnection: expect.any(Object),
        },
      );
    });
  });

  describe('addContact', () => {
    const accountId = 'account-id-123';
    const serviceProviderId = 'service-provider-id-456';
    const accountPermissionMock = {
      account: {
        email: 'contact@example.com',
        firstname: 'Contact',
        lastname: 'Name',
        phone: '0102030405',
        sub: 'hashed-contact@example.com',
      },
      permissionType: AccessControlPermission.SP_ADMIN,
    };

    it('should create account if account id is missing', async () => {
      // Given
      accountServiceMock.getOrCreateByEmail.mockResolvedValue(accountId);

      // When
      await service['addContact'](
        queryRunnerMock,
        {
          ...accountPermissionMock,
          account: { ...accountPermissionMock.account, id: undefined } as any,
        },
        serviceProviderId,
      );

      // Then
      expect(
        accountServiceMock.getOrCreateByEmail,
      ).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        {
          email: accountPermissionMock.account.email,
          firstname: accountPermissionMock.account.firstname,
          lastname: accountPermissionMock.account.lastname,
          phone: accountPermissionMock.account.phone,
          sub: accountPermissionMock.account.sub,
        },
        { upsertFields: ['phone'] },
      );
    });

    it('should add global and scoped permissions', async () => {
      // Given
      accountServiceMock.getOrCreateByEmail.mockResolvedValue(accountId);

      // When
      await service['addContact'](
        queryRunnerMock,
        accountPermissionMock as any,
        serviceProviderId,
      );

      // Then
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
      });
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: AccessControlPermission.SP_ADMIN,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        entityId: serviceProviderId,
      });
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: AccessControlPermission.INSTANCE_CONTRIBUTOR,
      });
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledTimes(3);
    });

    it('should remove contributor permission', async () => {
      // Given
      accountServiceMock.getOrCreateByEmail.mockResolvedValue(accountId);

      // When
      await service['addContact'](
        queryRunnerMock,
        accountPermissionMock as any,
        serviceProviderId,
      );

      // Then
      expect(
        accessControlServiceMock.removePermissionTransactional,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, {
        accountId,
        permissionType: AccessControlPermission.SP_CONTRIBUTOR,
        entity: AccessControlEntity.SERVICE_PROVIDER,
        entityId: serviceProviderId,
      });
    });
  });

  describe('mapContacts', () => {
    it('should map contacts to an object with email as key', () => {
      // Given
      const contactsMock = [
        {
          account: { email: 'contact1@example.com' },
          permissionType: AccessControlPermission.SP_ADMIN,
        },
      ] as any;
      const expectedResultMock = {
        'contact1@example.com:SP_ADMIN': contactsMock[0],
      };

      // When
      const result = service['mapContacts'](contactsMock);

      // Then
      expect(result).toEqual(expectedResultMock);
    });
  });

  describe('updateInstances', () => {
    it('should update instances successfully', async () => {
      // When
      await service['updateInstances'](queryRunnerMock, serviceProviderMock.id);

      // Then
      expect(instanceServiceMock.update).toHaveBeenNthCalledWith(
        1,
        queryRunnerMock,
        instance1Mock.currentVersion.data,
        instance1Mock,
        serviceProviderMock.id,
        CreatedBy.DATAPASS,
      );
      expect(instanceServiceMock.update).toHaveBeenNthCalledWith(
        2,
        queryRunnerMock,
        instance2Mock.currentVersion.data,
        instance2Mock,
        serviceProviderMock.id,
        CreatedBy.DATAPASS,
      );
    });

    it('should log warning message on failure', async () => {
      // Given
      const error = new Error('Database error');
      instanceServiceMock.update = jest.fn().mockRejectedValue(error);

      // When
      await service['updateInstances'](queryRunnerMock, serviceProviderMock.id);

      // Then
      expect(loggerServiceMock.warning).toHaveBeenCalledWith({
        message: 'Failed to update instances',
        error: error.message,
        stack: error.stack,
        instance: instance1Mock,
        serviceProviderId: serviceProviderMock.id,
      });
    });
  });
});
