import { QueryRunner, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';
import { TypeormService } from '@fc/typeorm';

import { getQueryRunnerMock, getTypeormServiceMock } from '@mocks/typeorm';

import { PartnersAccountInitException } from '../exceptions';
import { AccountInitInputInterface } from '../interfaces';
import { PartnersAccountService } from './partners-account.service';

describe('PartnersAccountService', () => {
  let service: PartnersAccountService;

  const accountMock = {
    sub: 'sub',
    firstname: 'test',
    lastname: 'test',
    email: 'test@test.fr',
  };

  const insertResult = {
    raw: [
      {
        id: 'accountId Mock',
        createdAt: new Date('2024-02-17'),
        updatedAt: new Date('2024-02-17'),
      },
    ],
  };

  const queryRunnerMock = getQueryRunnerMock();
  const typeormServiceMock = getTypeormServiceMock();

  const repositoryMock = {
    manager: {
      connection: {
        createQueryRunner: jest.fn(),
      },
    },
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };

  const accountPermissionMock = { addPermissionTransactional: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([PartnersAccount])],

      providers: [
        PartnersAccountService,
        Repository<PartnersAccount>,
        AccountPermissionService,
        TypeormService,
      ],
    })
      .overrideProvider(getRepositoryToken(PartnersAccount))
      .useValue(repositoryMock)
      .overrideProvider(AccountPermissionService)
      .useValue(accountPermissionMock)
      .overrideProvider(TypeormService)
      .useValue(typeormServiceMock)
      .compile();

    service = module.get<PartnersAccountService>(PartnersAccountService);

    repositoryMock.manager.connection.createQueryRunner.mockReturnValue(
      queryRunnerMock,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init', () => {
    const initResultMock = Symbol('initResultMock');

    beforeEach(() => {
      service['create'] = jest.fn().mockResolvedValue(initResultMock);
      service['addPermissions'] = jest.fn();
      service['handleException'] = jest.fn();
      typeormServiceMock.withTransaction.mockImplementationOnce((callback) =>
        callback(queryRunnerMock),
      );
    });

    it('should call get or create account', async () => {
      // When
      await service.init(accountMock);

      // Then
      expect(service['create']).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        accountMock,
      );
    });

    it('should handle account Permission', async () => {
      // When
      await service.init(accountMock);

      // Then
      expect(service['addPermissions']).toHaveBeenCalledExactlyOnceWith(
        queryRunnerMock,
        initResultMock,
      );
    });

    it('should return result from create()', async () => {
      // When
      const result = await service.init(accountMock);

      // Then
      expect(result).toBe(initResultMock);
    });

    it('should throw PartnersAccountInitException on error', async () => {
      // Given
      const error = new Error('error');
      service['create'] = jest.fn().mockRejectedValue(error);

      // Then / When
      await expect(() => service.init(accountMock)).rejects.toThrow(
        PartnersAccountInitException,
      );
    });
  });

  describe('getOrCreateByEmail', () => {
    // Given
    const account = { email: 'name@provider.fr' } as AccountInitInputInterface;
    const existingAccount = {
      id: 'existingAccountId',
    };
    const createdAccountId = 'createdAccountId';

    beforeEach(() => {
      service['create'] = jest.fn().mockResolvedValue(createdAccountId);
    });

    it('should return an accountId if it exists', async () => {
      // Given
      repositoryMock.findOne = jest.fn().mockResolvedValue(existingAccount);

      // When
      const result = await service.getOrCreateByEmail(queryRunnerMock, account);

      // Then
      expect(result).toBe(existingAccount.id);
    });

    it('should create an account if it does not exist', async () => {
      // Given
      repositoryMock.findOne = jest.fn().mockResolvedValue(undefined);

      // When
      const result = await service.getOrCreateByEmail(queryRunnerMock, account);

      // Then
      expect(result).toBe(createdAccountId);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      service['executeInsertAccount'] = jest.fn();
      service['extractAccountIdAndStatus'] = jest.fn();
    });

    it('should execute query with queryBuilder', async () => {
      // Given
      const queryBuilderMock = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orUpdate: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(insertResult),
      };
      queryRunnerMock.manager.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilderMock);

      // When
      await service['create'](
        queryRunnerMock as unknown as QueryRunner,
        accountMock,
      );

      // Then
      expect(queryBuilderMock.insert).toHaveBeenCalledOnce();
      expect(queryBuilderMock.into).toHaveBeenCalledExactlyOnceWith(
        PartnersAccount,
      );
      expect(queryBuilderMock.values).toHaveBeenCalledExactlyOnceWith(
        accountMock,
      );
      expect(queryBuilderMock.returning).toHaveBeenCalledExactlyOnceWith([
        'id',
      ]);
      expect(queryBuilderMock.execute).toHaveBeenCalledOnce();
    });
  });

  describe('addPermissions', () => {
    // Given
    const accountId = 'accountId';

    it('should add permissions for accountId', async () => {
      // When
      await service['addPermissions'](
        queryRunnerMock as unknown as QueryRunner,
        accountId,
      );

      // Then
      expect(
        accountPermissionMock.addPermissionTransactional,
      ).toHaveBeenCalledTimes(2);
      expect(
        accountPermissionMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SP_INSTANCE,
      });
      expect(
        accountPermissionMock.addPermissionTransactional,
      ).toHaveBeenCalledWith(queryRunnerMock, {
        accountId,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SERVICE_PROVIDER,
      });
    });
  });

  describe('updateLastConnection', () => {
    // Given
    const queryBuilderMock = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(insertResult),
      release: jest.fn(),
    };

    const data = {
      email: 'emailMock',
    } as unknown as AccountInitInputInterface;

    beforeEach(() => {
      queryBuilderMock.update = jest.fn().mockReturnThis();
      queryBuilderMock.set = jest.fn().mockReturnThis();
      queryBuilderMock.where = jest.fn().mockReturnThis();
      queryBuilderMock.returning = jest.fn().mockReturnThis();
      queryBuilderMock.execute = jest.fn().mockResolvedValue(insertResult);
      queryBuilderMock.release = jest.fn();

      queryRunnerMock.manager.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryBuilderMock);

      typeormServiceMock.withQueryRunner.mockImplementationOnce((callback) =>
        callback(queryRunnerMock),
      );
      service['buildUpdateValues'] = jest.fn().mockReturnValue({
        lastConnection: expect.any(Function),
      });
    });

    it('should update last connection', async () => {
      // When
      await service.updateAccount(data);

      // Then
      expect(queryBuilderMock.update).toHaveBeenCalledExactlyOnceWith(
        PartnersAccount,
      );
      expect(queryBuilderMock.set).toHaveBeenCalledExactlyOnceWith({
        lastConnection: expect.any(Function),
      });
      expect(queryBuilderMock.where).toHaveBeenCalledExactlyOnceWith({
        email: data.email,
      });
      expect(queryBuilderMock.returning).toHaveBeenCalledExactlyOnceWith([
        'id',
      ]);
      expect(queryBuilderMock.execute).toHaveBeenCalledOnce();
    });
  });

  describe('buildUpdateValues', () => {
    const existingAccount = {
      sub: 'sub',
      firstname: 'firstname',
      lastname: 'lastname',
      email: 'email',
    } as PartnersAccount;

    it('should return lastConnection if no changes', () => {
      // Given
      const data = {
        sub: existingAccount.sub,
        firstname: existingAccount.firstname,
        lastname: existingAccount.lastname,
        email: existingAccount.email,
      } as AccountInitInputInterface;

      // When
      const result = service['buildUpdateValues'](data, existingAccount);

      // Then
      expect(result).toEqual({
        lastConnection: expect.any(Function),
      });
    });

    it('should return updated values if changes', () => {
      // Given
      const data = {
        sub: 'newSub',
        firstname: 'newFirstname',
        lastname: 'newLastname',
        email: 'newEmail',
      } as AccountInitInputInterface;

      // When
      const result = service['buildUpdateValues'](data, existingAccount);

      // Then
      expect(result).toEqual({
        lastConnection: expect.any(Function),
        updatedAt: expect.any(Function),
        sub: data.sub,
        firstname: data.firstname,
        lastname: data.lastname,
      });
    });
  });
});
