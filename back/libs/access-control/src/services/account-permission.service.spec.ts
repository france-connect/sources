import { QueryRunner } from 'typeorm';

import { Test, TestingModule } from '@nestjs/testing';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { uuid } from '@fc/common';
import { LoggerService } from '@fc/logger';
import { PartnersAccountSession } from '@fc/partners-account';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { EntityType, PermissionsType } from '../enums';
import { ACCESS_CONTROL_TOKEN } from '../tokens';
import { AccountPermissionRepository } from './account-permission.repository';
import { AccountPermissionService } from './account-permission.service';

describe('AccountPermissionService', () => {
  let service: AccountPermissionService;

  const sessionServiceMock = getSessionServiceMock();
  const accountPermissionRepositoryMock = {
    insert: jest.fn(),
  };

  const loggerMock = getLoggerMock();
  const userPermissionsMock = Symbol('userPermissions');

  const sessionPartnersAccountDataMock = {
    [ACCESS_CONTROL_TOKEN]: {
      userPermissions: userPermissionsMock,
    },
  } as unknown as PartnersAccountSession;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountPermissionService,
        SessionService,
        AccountPermissionRepository,
        LoggerService,
      ],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(AccountPermissionRepository)
      .useValue(accountPermissionRepositoryMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<AccountPermissionService>(AccountPermissionService);

    sessionServiceMock.get.mockReturnValueOnce(sessionPartnersAccountDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPermissionsFromSession', () => {
    it('should call partner account sessionService.get method', () => {
      // When
      service.getPermissionsFromSession();

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should return user permission from partner account session', () => {
      // When
      const result = service.getPermissionsFromSession();

      // Then
      expect(result).toStrictEqual(userPermissionsMock);
    });
  });

  describe('addPermission', () => {
    const accountIdMock = Symbol('accountId') as unknown as uuid;
    const entityIdMock = Symbol('entityId') as unknown as uuid;
    const entityMock = Symbol('entity') as unknown as EntityType;
    const permissionTypeMock = Symbol(
      'permissionType',
    ) as unknown as PermissionsType;

    it('should call create permission for a given entity', async () => {
      // When
      await service.addPermission({
        accountId: accountIdMock,
        permissionType: permissionTypeMock,
        entity: entityMock,
        entityId: entityIdMock,
      });

      // Then
      expect(accountPermissionRepositoryMock.insert).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.insert).toHaveBeenCalledWith(
        accountIdMock,
        permissionTypeMock,
        entityMock,
        entityIdMock,
      );
    });

    it('should call accountPermission.insert with given parameters', async () => {
      // When
      await service.addPermission({
        accountId: accountIdMock,
        entity: entityMock,
        permissionType: permissionTypeMock,
      });

      // Then
      expect(accountPermissionRepositoryMock.insert).toHaveBeenCalledTimes(1);
      expect(accountPermissionRepositoryMock.insert).toHaveBeenCalledWith(
        accountIdMock,
        permissionTypeMock,
        entityMock,
        NO_ENTITY_ID,
      );
    });
  });

  describe('addPermissionTransactional', () => {
    // Given
    const queryRunnerMock = {
      manager: {
        createQueryBuilder: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      },
    };

    const permissionMock = {
      accountId: Symbol('accountId') as unknown as uuid,
      entityId: Symbol('entityId') as unknown as uuid,
      entity: Symbol('entity') as unknown as EntityType,
      permissionType: Symbol('permissionType') as unknown as PermissionsType,
    };

    beforeEach(() => {
      queryRunnerMock.manager.createQueryBuilder.mockReturnThis();
      queryRunnerMock.manager.insert.mockReturnThis();
      queryRunnerMock.manager.into.mockReturnThis();
      queryRunnerMock.manager.values.mockReturnThis();
      queryRunnerMock.manager.orIgnore.mockReturnThis();
    });

    it('should insert correct data with queryRunner manager', async () => {
      // When
      await service.addPermissionTransactional(
        queryRunnerMock as unknown as QueryRunner,
        permissionMock,
      );

      // Then
      expect(queryRunnerMock.manager.createQueryBuilder).toHaveBeenCalledTimes(
        1,
      );
      expect(queryRunnerMock.manager.insert).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.into).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.values).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.values).toHaveBeenCalledWith(
        permissionMock,
      );
      expect(queryRunnerMock.manager.orIgnore).toHaveBeenCalledTimes(1);
      expect(queryRunnerMock.manager.execute).toHaveBeenCalledTimes(1);
    });

    it('should default entityId to NO_ENTITY_ID', async () => {
      // Given
      const permissionMockWithoutEntityId = {
        ...permissionMock,
        entityId: undefined,
      };

      // When
      await service.addPermissionTransactional(
        queryRunnerMock as unknown as QueryRunner,
        permissionMockWithoutEntityId,
      );

      // Then
      expect(queryRunnerMock.manager.values).toHaveBeenCalledWith({
        ...permissionMockWithoutEntityId,
        entityId: NO_ENTITY_ID,
      });
    });
  });
});
