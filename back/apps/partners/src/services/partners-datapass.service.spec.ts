import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProvider } from '@entities/typeorm';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { validateDto } from '@fc/common';
import { CryptographyService } from '@fc/cryptography';
import { DatapassEvents, SimplifiedDatapassPayload } from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { PartnersAccountService } from '@fc/partners-account';
import {
  PartnersServiceProviderCreationFailureException,
  PartnersServiceProviderService,
} from '@fc/partners-service-provider';
import { TypeormService } from '@fc/typeorm';

import { getLoggerMock } from '@mocks/logger';
import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { ServiceProviderCreationResultInterface } from '../interfaces';
import { PartnersDatapassService } from './partners-datapass.service';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
}));

describe('PartnersDatapassService', () => {
  let service: PartnersDatapassService;

  const loggerServiceMock = getLoggerMock();
  const typeormServiceMock = getTypeormServiceMock();
  const queryRunnerMock = getQueryRunnerMock();

  const accountServiceMock = {
    getOrCreateByEmail: jest.fn(),
  };

  const serviceProviderServiceMock = {
    upsert: jest.fn(),
  };

  const accessControlServiceMock = {
    addPermissionTransactional: jest.fn(),
  };

  const cryptoMock = {
    hash: jest.fn(),
  };

  const simplifiedDatapassPayloadMock: SimplifiedDatapassPayload = {
    event: DatapassEvents.APPROVE,
    datapassRequestId: '12345',
    state: 'approved',
    organizationName: 'Test Organization',
    applicant: {
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    },
    datapassName: 'Test Service Provider',
    scopes: ['openid', 'given_name', 'family_name', 'email'],
    technicalContact: {
      email: 'tech@example.com',
      firstname: 'Tech',
      lastname: 'Contact',
    },
  };

  const serviceProviderMock: PartnersServiceProvider = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    organizationName: 'Test Organization',
    datapassRequestId: '12345',
    authorizedScopes: ['openid', 'given_name', 'family_name', 'email'],
    platform: null,
    organisation: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const creationResultMock: ServiceProviderCreationResultInterface = {
    serviceProviderId: serviceProviderMock.id,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersDatapassService,
        {
          provide: LoggerService,
          useValue: loggerServiceMock,
        },
        {
          provide: TypeormService,
          useValue: typeormServiceMock,
        },
        {
          provide: PartnersAccountService,
          useValue: accountServiceMock,
        },
        {
          provide: PartnersServiceProviderService,
          useValue: serviceProviderServiceMock,
        },
        {
          provide: AccountPermissionService,
          useValue: accessControlServiceMock,
        },
        {
          provide: CryptographyService,
          useValue: cryptoMock,
        },
      ],
    }).compile();

    service = module.get<PartnersDatapassService>(PartnersDatapassService);
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
      service['createServiceProviderTransactional'] = jest
        .fn()
        .mockResolvedValue(creationResultMock);
    });

    it('should call createServiceProviderTransactional within a transaction', async () => {
      // When
      await service['handleApproveEvent'](simplifiedDatapassPayloadMock);

      // Then
      expect(
        service['createServiceProviderTransactional'],
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
      service['createServiceProviderTransactional'] = jest
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
      service['createServiceProviderTransactional'] = jest
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

  describe('createServiceProviderTransactional', () => {
    const accountIdMock = 'account-id';
    const validateDtoMock = jest.mocked(validateDto);

    beforeEach(() => {
      validateDtoMock.mockResolvedValue([]);
      accountServiceMock.getOrCreateByEmail.mockResolvedValue(accountIdMock);
      service['createServiceProvider'] = jest
        .fn()
        .mockResolvedValue(serviceProviderMock);
      cryptoMock.hash.mockReturnValue('hashed-email');
    });

    it('should call createUsersFromDatapass when validation passes', async () => {
      // Given
      service['createUsersFromDatapass'] = jest
        .fn()
        .mockResolvedValue(undefined);

      // When
      await service['createServiceProviderTransactional'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(service['createUsersFromDatapass']).toHaveBeenCalledWith(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
        serviceProviderMock.id,
      );
    });

    it('should create service provider', async () => {
      // When
      await service['createServiceProviderTransactional'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(service['createServiceProvider']).toHaveBeenCalledWith(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );
    });

    it('should return service provider id', async () => {
      // Given
      service['createUsersFromDatapass'] = jest
        .fn()
        .mockResolvedValue(undefined);

      // When
      const result = await service['createServiceProviderTransactional'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(result).toEqual({
        serviceProviderId: serviceProviderMock.id,
      });
    });
  });

  describe('createServiceProvider', () => {
    beforeEach(() => {
      serviceProviderServiceMock.upsert.mockResolvedValue(serviceProviderMock);
    });

    it('should create service provider entity with correct data', async () => {
      // When
      await service['createServiceProvider'](
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
      );

      // Then
      expect(serviceProviderServiceMock.upsert).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        {
          name: simplifiedDatapassPayloadMock.datapassName,
          organizationName: simplifiedDatapassPayloadMock.organizationName,
          datapassRequestId: simplifiedDatapassPayloadMock.datapassRequestId,
          authorizedScopes: simplifiedDatapassPayloadMock.scopes,
        },
      );
    });

    it('should return the created service provider', async () => {
      // When
      const result = await service['createServiceProvider'](
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

  describe('createUsersFromDatapass', () => {
    const accountIdMock = 'account-id-123';

    beforeEach(() => {
      typeormServiceMock.withTransaction.mockImplementation((callback) =>
        callback(queryRunnerMock),
      );
      accountServiceMock.getOrCreateByEmail.mockResolvedValue(accountIdMock);
      cryptoMock.hash.mockImplementation((email) => `hashed-${email}`);
      service['addServiceProviderPermissions'] = jest
        .fn()
        .mockResolvedValue(undefined);
    });

    it('should create users for both applicant and technical contact', async () => {
      // When
      await service.createUsersFromDatapass(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
        serviceProviderMock.id,
      );

      // Then
      expect(accountServiceMock.getOrCreateByEmail).toHaveBeenCalledTimes(2);
      expect(accountServiceMock.getOrCreateByEmail).toHaveBeenNthCalledWith(
        1,
        queryRunnerMock,
        {
          email: simplifiedDatapassPayloadMock.applicant.email,
          firstname: simplifiedDatapassPayloadMock.applicant.firstname,
          lastname: simplifiedDatapassPayloadMock.applicant.lastname,
          sub: 'hashed-test@example.com',
        },
      );
      expect(accountServiceMock.getOrCreateByEmail).toHaveBeenNthCalledWith(
        2,
        queryRunnerMock,
        {
          email: simplifiedDatapassPayloadMock.technicalContact.email,
          firstname: simplifiedDatapassPayloadMock.technicalContact.firstname,
          lastname: simplifiedDatapassPayloadMock.technicalContact.lastname,
          sub: 'hashed-tech@example.com',
        },
      );
    });

    it('should remove duplicate emails', async () => {
      // Given
      const duplicateEmailPayload = {
        ...simplifiedDatapassPayloadMock,
        technicalContact: {
          ...simplifiedDatapassPayloadMock.technicalContact,
          email: simplifiedDatapassPayloadMock.applicant.email, // Same email as applicant
        },
      };

      // When
      await service.createUsersFromDatapass(
        queryRunnerMock,
        duplicateEmailPayload,
        serviceProviderMock.id,
      );

      // Then
      expect(
        accountServiceMock.getOrCreateByEmail,
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, {
        email: simplifiedDatapassPayloadMock.applicant.email,
        firstname: simplifiedDatapassPayloadMock.applicant.firstname,
        lastname: simplifiedDatapassPayloadMock.applicant.lastname,
        sub: 'hashed-test@example.com',
      });
    });

    it('should add permissions for each created user', async () => {
      // When
      await service.createUsersFromDatapass(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
        serviceProviderMock.id,
      );

      // Then
      expect(service['addServiceProviderPermissions']).toHaveBeenCalledTimes(2);
      expect(service['addServiceProviderPermissions']).toHaveBeenCalledWith(
        queryRunnerMock,
        accountIdMock,
        serviceProviderMock.id,
      );
    });

    it('should hash emails for sub field', async () => {
      // When
      await service.createUsersFromDatapass(
        queryRunnerMock,
        simplifiedDatapassPayloadMock,
        serviceProviderMock.id,
      );

      // Then
      expect(cryptoMock.hash).toHaveBeenCalledTimes(2);
      expect(cryptoMock.hash).toHaveBeenNthCalledWith(
        1,
        simplifiedDatapassPayloadMock.applicant.email,
      );
      expect(cryptoMock.hash).toHaveBeenNthCalledWith(
        2,
        simplifiedDatapassPayloadMock.technicalContact.email,
      );
    });
  });

  describe('addServiceProviderPermissions', () => {
    const accountId = 'account-id-123';
    const serviceProviderId = 'service-provider-id-456';

    it('should add LIST permission for SERVICE_PROVIDER entity', async () => {
      // When
      await service['addServiceProviderPermissions'](
        queryRunnerMock,
        accountId,
        serviceProviderId,
      );

      // Then
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SERVICE_PROVIDER,
      });
    });

    it('should add VIEW permission for specific SERVICE_PROVIDER entity', async () => {
      // When
      await service['addServiceProviderPermissions'](
        queryRunnerMock,
        accountId,
        serviceProviderId,
      );

      // Then
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: PermissionsType.VIEW,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: serviceProviderId,
      });
    });

    it('should add LIST permission for SP_INSTANCE entity', async () => {
      // When
      await service['addServiceProviderPermissions'](
        queryRunnerMock,
        accountId,
        serviceProviderId,
      );

      // Then
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SP_INSTANCE,
      });
    });

    it('should call addPermissionTransactional exactly 3 times', async () => {
      // When
      await service['addServiceProviderPermissions'](
        queryRunnerMock,
        accountId,
        serviceProviderId,
      );

      // Then
      expect(
        accessControlServiceMock.addPermissionTransactional,
      ).toHaveBeenCalledTimes(3);
    });
  });
});
