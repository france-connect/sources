import { QueryRunner, Repository } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import {
  AccountPermissionService,
  EntityType,
  PermissionsType,
} from '@fc/access-control';

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

  const queryRunnerMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      createQueryBuilder: jest.fn(),
    },
  };

  const repositoryMock = {
    manager: {
      connection: {
        createQueryRunner: jest.fn(),
      },
    },
    findOneBy: jest.fn(),
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
      ],
    })
      .overrideProvider(getRepositoryToken(PartnersAccount))
      .useValue(repositoryMock)
      .overrideProvider(AccountPermissionService)
      .useValue(accountPermissionMock)
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
      service['getQueryRunner'] = jest.fn().mockReturnValue(queryRunnerMock);
      service['create'] = jest.fn().mockResolvedValue(initResultMock);
      service['addPermissions'] = jest.fn();
      service['handleException'] = jest.fn();
    });
    it('should get a queryRunner', async () => {
      // When
      await service.init(accountMock);

      // Then
      expect(service['getQueryRunner']).toHaveBeenCalledOnce();
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

    it('should begin transaction', async () => {
      // When
      await service.init(accountMock);

      // Then
      expect(queryRunnerMock.startTransaction).toHaveBeenCalledOnce();
    });

    it('should commit transaction', async () => {
      // When
      await service.init(accountMock);

      // Then
      expect(queryRunnerMock.commitTransaction).toHaveBeenCalledOnce();
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

  describe('getQueryRunner', () => {
    it('should create a queryRunner', async () => {
      // When
      await service['getQueryRunner']();

      // Then
      expect(
        repositoryMock.manager.connection.createQueryRunner,
      ).toHaveBeenCalledOnce();
    });

    it('should connect', async () => {
      // When
      await service['getQueryRunner']();

      // Then
      expect(queryRunnerMock.connect).toHaveBeenCalledOnce();
    });

    it('should return queryRunner', async () => {
      // When
      const result = await service['getQueryRunner']();

      // Then
      expect(result).toBe(queryRunnerMock);
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
      ).toHaveBeenCalledExactlyOnceWith(queryRunnerMock, {
        accountId,
        permissionType: PermissionsType.LIST,
        entity: EntityType.SP_INSTANCE,
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
    });

    it('should update last connection', async () => {
      // When
      await service.updateLastConnection(data);

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

    it('should releaser queryRunner', async () => {
      // When
      await service.updateLastConnection(
        {} as unknown as AccountInitInputInterface,
      );

      // Then
      expect(queryRunnerMock.release).toHaveBeenCalledOnce();
    });
  });
});
