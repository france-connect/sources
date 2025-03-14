import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccountPermission } from '@entities/typeorm';

import { LoggerModule, LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { EntityType, PermissionsType } from '../enums';
import { AccountPermissionRepository } from './account-permission.repository';

jest.mock('../decorators');

describe('AccountPermissionRepository', () => {
  let repository: AccountPermissionRepository;

  const accountPermissionRepositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    insert: jest.fn(),
    upsert: jest.fn(),
    catch: jest.fn(),
  };

  const loggerMock = getLoggerMock();

  const accountIdMock = Symbol('accountIdMock') as unknown as string;
  const idMock = Symbol('id') as unknown as string;
  const itemMock = {};
  const dataMock = [itemMock];
  const emailMock = 'test@email.fr';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([PartnersAccountPermission]),
        LoggerModule,
      ],
      providers: [AccountPermissionRepository, LoggerService],
    })
      .overrideProvider(getRepositoryToken(PartnersAccountPermission))
      .useValue(accountPermissionRepositoryMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    repository = module.get<AccountPermissionRepository>(
      AccountPermissionRepository,
    );

    accountPermissionRepositoryMock.find.mockResolvedValueOnce(dataMock);
    accountPermissionRepositoryMock.insert.mockReturnThis();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('insert', () => {
    const dataMock = {
      accountId: accountIdMock,
      entity: EntityType.SP_INSTANCE,
      entityId: idMock,
      permissionType: PermissionsType.CREATE,
    };

    it('should call accountPermission.insert() method with correct data', async () => {
      // When
      await repository.insert(
        accountIdMock,
        PermissionsType.CREATE,
        EntityType.SP_INSTANCE,
        idMock,
      );

      // Then
      expect(accountPermissionRepositoryMock.insert).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.insert).toHaveBeenCalledWith(
        dataMock,
      );
    });

    it('should warn if the permission already exists', async () => {
      // Given
      accountPermissionRepositoryMock.insert.mockRejectedValueOnce(
        new Error('Duplicate entry'),
      );

      // When
      await repository.insert(
        accountIdMock,
        PermissionsType.CREATE,
        EntityType.SP_INSTANCE,
        idMock,
      );

      // Then
      expect(loggerMock.warning).toHaveBeenCalledTimes(1);
      expect(loggerMock.warning).toHaveBeenCalledWith({
        msg: 'Tried to insert existing permission',
        accountId: accountIdMock,
        permissionType: PermissionsType.CREATE,
        entity: EntityType.SP_INSTANCE,
        entityId: idMock,
        error: expect.any(Error),
      });
    });

    it('should not warn if the permission does not already exist', async () => {
      // When
      await repository.insert(
        accountIdMock,
        PermissionsType.CREATE,
        EntityType.SP_INSTANCE,
        idMock,
      );

      // Then
      expect(loggerMock.warning).not.toHaveBeenCalled();
    });
  });

  describe('getByEmail', () => {
    it('should call accountPermission.find() method with selected column and correct where clause', async () => {
      // When
      await repository.getByEmail(emailMock);

      // Then
      expect(accountPermissionRepositoryMock.find).toHaveBeenCalledTimes(1);

      expect(accountPermissionRepositoryMock.find).toHaveBeenCalledWith({
        select: {
          entity: true,
          entityId: true,
          permissionType: true,
        },
        where: {
          account: {
            email: emailMock,
          },
        },
      });
    });

    it('should return the result from accountPermissionRepositoryMock.find', async () => {
      // Given
      const emailMock = 'foo';

      // When
      const result = await repository.getByEmail(emailMock);

      // Then
      expect(result).toBe(dataMock);
    });
  });
});
