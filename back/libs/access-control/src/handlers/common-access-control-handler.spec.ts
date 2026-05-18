import { FindOperator, In } from 'typeorm';

import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { NO_ENTITY_ID } from '@entities/typeorm';

import {
  AccessControlPermissionDataInterface,
  ENTITIES_MAP_TOKEN,
  PermissionInterface,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';
import { TypeormService } from '@fc/typeorm';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CommonAccessControlHandlerEnum } from '../enums';
import { RelatedEntitiesHelper } from '../helpers';
import { CommonAccessControlHandler } from './common-access-control.handler';

jest.mock('../helpers/get-related-entities-id.helper');
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  In: jest.fn(),
}));

describe('CommonAccessControlHandler', () => {
  const RelatedEntitiesHelperGetMock = jest.mocked(RelatedEntitiesHelper.get);
  const InMock = jest.mocked(In);

  enum EntityType {
    ENTITY_VALUE = 'entityValue',
    ANOTHER_ENTITY_VALUE = 'anotherEntityValue',
  }

  enum PermissionType {
    PERMISSION_VALUE = 'permissionValue',
    ANOTHER_PERMISSION_VALUE = 'anotherPermissionValue',
  }

  let handler: CommonAccessControlHandler<
    EntityType,
    PermissionType,
    CommonAccessControlHandlerEnum
  >;

  class AppTest extends CommonAccessControlHandler<
    EntityType,
    PermissionType,
    CommonAccessControlHandlerEnum
  > {
    public handlerMethod(): boolean {
      return true;
    }
  }

  const entityClass = Symbol('entityClass');
  const anotherEntityClass = Symbol('anotherEntityClass');

  const entitiesMap = {
    [EntityType.ENTITY_VALUE]: entityClass,
    [EntityType.ANOTHER_ENTITY_VALUE]: anotherEntityClass,
  };

  const reflectorMock = {} as Reflector;
  const sessionServiceMock = getSessionServiceMock();
  const loggerMock = getLoggerMock();
  const typeormMock = { getRepository: jest.fn() };

  const findOneMock = jest.fn();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppTest,
        { provide: Reflector, useValue: reflectorMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: LoggerService, useValue: loggerMock },
        { provide: TypeormService, useValue: typeormMock },
        { provide: ENTITIES_MAP_TOKEN, useValue: entitiesMap },
      ],
    }).compile();

    handler = module.get<AppTest>(AppTest);

    typeormMock.getRepository.mockReturnValue({ findOne: findOneMock });
    findOneMock.mockResolvedValue(true);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('DIRECT_ENTITY', () => {
    const entityId = 'entity-123';

    const permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      CommonAccessControlHandlerEnum
    > = {
      permission: PermissionType.PERMISSION_VALUE,
      entity: EntityType.ENTITY_VALUE,
      handler: {
        method: CommonAccessControlHandlerEnum.DIRECT_ENTITY,
      },
    };

    it('should return true when user has matching permission with entity ID', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: entityId,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when user does not have matching permission', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.ANOTHER_PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: entityId,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user has permission but different entity', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ANOTHER_ENTITY_VALUE,
            entityId: entityId,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user has permission but different entity ID', () => {
      // Given
      const differentEntityId = 'entity-456';
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: differentEntityId,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user has no permissions', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [];

      // When
      const result = handler[CommonAccessControlHandlerEnum.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return true when at least one permission matches', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: entityId,
          },
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: entityId,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });
  });

  describe('RELATED_ENTITY', () => {
    // Given
    const entityId = 'entity-123';
    const relatedEntityId = 'related-entity-123';

    const userPermissions: PermissionInterface<EntityType, PermissionType>[] = [
      {
        permissionType: PermissionType.PERMISSION_VALUE,
        entity: EntityType.ENTITY_VALUE,
        entityId: relatedEntityId,
      },
    ];

    const relatedEntityColumn = 'relatedEntityColumn';

    const controllerPermission = {
      permission: PermissionType.PERMISSION_VALUE,
      entity: EntityType.ANOTHER_ENTITY_VALUE,
      handler: {
        method: CommonAccessControlHandlerEnum.RELATED_ENTITY,
        entity: EntityType.ENTITY_VALUE,
        column: relatedEntityColumn,
      },
    } as AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      CommonAccessControlHandlerEnum
    >;

    it('should fetch related entities ids from user permissions', async () => {
      // When
      await handler[CommonAccessControlHandlerEnum.RELATED_ENTITY](
        controllerPermission,
        entityId,
        userPermissions,
      );

      // Then
      expect(RelatedEntitiesHelperGetMock).toHaveBeenCalledExactlyOnceWith(
        userPermissions,
        {
          entityTypes: [EntityType.ENTITY_VALUE],
        },
      );
    });

    it('should retrieve repository from entities map', async () => {
      // When
      await handler[CommonAccessControlHandlerEnum.RELATED_ENTITY](
        controllerPermission,
        entityId,
        userPermissions,
      );

      // Then
      expect(typeormMock.getRepository).toHaveBeenCalledExactlyOnceWith(
        entitiesMap[EntityType.ANOTHER_ENTITY_VALUE],
      );
    });

    it('should try to find entity that matches by id and related ids', async () => {
      // Given
      const inClauseMock = Symbol('inClause');
      InMock.mockReturnValue(inClauseMock as unknown as FindOperator<any>);

      // When
      await handler[CommonAccessControlHandlerEnum.RELATED_ENTITY](
        controllerPermission,
        entityId,
        userPermissions,
      );

      // Then
      expect(findOneMock).toHaveBeenCalledExactlyOnceWith({
        where: { id: entityId, [relatedEntityColumn]: inClauseMock },
      });
    });

    it('should return true when entity is found', async () => {
      // When
      const result = await handler[
        CommonAccessControlHandlerEnum.RELATED_ENTITY
      ](controllerPermission, entityId, userPermissions);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when entity is not found', async () => {
      // Given
      findOneMock.mockResolvedValue(null);

      // When
      const result = await handler[
        CommonAccessControlHandlerEnum.RELATED_ENTITY
      ](controllerPermission, entityId, userPermissions);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('GLOBAL_PERMISSION', () => {
    const entityId = 'entity-123';

    const permission: AccessControlPermissionDataInterface<
      EntityType,
      PermissionType,
      CommonAccessControlHandlerEnum
    > = {
      permission: PermissionType.PERMISSION_VALUE,
      handler: {
        method: CommonAccessControlHandlerEnum.GLOBAL_PERMISSION,
      },
    };

    it('should return true when user has matching permission type with NO_ENTITY_ID and null entity', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: null,
            entityId: NO_ENTITY_ID,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when user has matching permission type but entity is not null', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: NO_ENTITY_ID,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user has matching permission type but entityId is not NO_ENTITY_ID', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: null,
            entityId: 'some-entity-id',
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user does not have matching permission type', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.ANOTHER_PERMISSION_VALUE,
            entity: null,
            entityId: NO_ENTITY_ID,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user has no permissions', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return true when at least one permission matches the global criteria', () => {
      // Given
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: EntityType.ENTITY_VALUE,
            entityId: 'another-entity-id',
          },
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: null,
            entityId: NO_ENTITY_ID,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should ignore entityId parameter when checking global permission', () => {
      // Given
      const differentEntityId = 'different-entity-id';
      const userPermissions: PermissionInterface<EntityType, PermissionType>[] =
        [
          {
            permissionType: PermissionType.PERMISSION_VALUE,
            entity: null,
            entityId: NO_ENTITY_ID,
          },
        ];

      // When
      const result = handler[CommonAccessControlHandlerEnum.GLOBAL_PERMISSION](
        permission,
        differentEntityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });
  });
});
