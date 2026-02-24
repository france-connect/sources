import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
  AccessControlPermissionDataInterface,
  PermissionInterface,
} from '@fc/access-control';
import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  AccessControlEntity,
  AccessControlHandler,
  AccessControlPermission,
} from '../enums';
import { AppPermissionsHandler } from './app-permissions.handler';

describe('AppPermissionsHandler', () => {
  let handler: AppPermissionsHandler;

  const reflectorMock = {} as Reflector;
  const sessionServiceMock = getSessionServiceMock();
  const loggerMock = getLoggerMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppPermissionsHandler,
        { provide: Reflector, useValue: reflectorMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: LoggerService, useValue: loggerMock },
      ],
    }).compile();

    handler = module.get<AppPermissionsHandler>(AppPermissionsHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('DIRECT_ENTITY', () => {
    const entityId = 'entity-123';

    const permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    > = {
      permission: AccessControlPermission.SP_ADMIN,
      entity: AccessControlEntity.ORGANISATION,
      handler: {
        method: AccessControlHandler.DIRECT_ENTITY,
      },
    };

    it('should return true when user has matching permission with entity ID', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entity: AccessControlEntity.ORGANISATION,
          entityId: entityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when user does not have matching permission', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_TECH,
          entity: AccessControlEntity.ORGANISATION,
          entityId: entityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user has permission but different entity', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entity: AccessControlEntity.SERVICE_PROVIDER,
          entityId: entityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.DIRECT_ENTITY](
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
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entity: AccessControlEntity.ORGANISATION,
          entityId: differentEntityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user permissions array is empty', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [];

      // When
      const result = handler[AccessControlHandler.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return true when at least one permission matches', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_TECH,
          entity: AccessControlEntity.ORGANISATION,
          entityId: entityId,
        },
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entity: AccessControlEntity.ORGANISATION,
          entityId: entityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.DIRECT_ENTITY](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });
  });

  describe('GLOBAL_PERMISSION', () => {
    const entityId = 'entity-123';

    const permission: AccessControlPermissionDataInterface<
      AccessControlEntity,
      AccessControlPermission,
      AccessControlHandler
    > = {
      permission: AccessControlPermission.SP_ADMIN,
      handler: {
        method: AccessControlHandler.GLOBAL_PERMISSION,
      },
    };

    it('should return true when user has matching permission type', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entityId: entityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return true when user has matching permission type regardless of entity', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entityId: 'different-entity-id',
        },
      ];

      // When
      const result = handler[AccessControlHandler.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false when user does not have matching permission type', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_TECH,
          entityId: entityId,
        },
      ];

      // When
      const result = handler[AccessControlHandler.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false when user permissions array is empty', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [];

      // When
      const result = handler[AccessControlHandler.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return true when at least one permission matches the type', () => {
      // Given
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_TECH,
          entityId: entityId,
        },
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entity: AccessControlEntity.SERVICE_PROVIDER,
          entityId: 'another-entity-id',
        },
      ];

      // When
      const result = handler[AccessControlHandler.GLOBAL_PERMISSION](
        permission,
        entityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should ignore entityId parameter', () => {
      // Given
      const differentEntityId = 'different-entity-id';
      const userPermissions: PermissionInterface<
        AccessControlEntity,
        AccessControlPermission
      >[] = [
        {
          permissionType: AccessControlPermission.SP_ADMIN,
          entity: AccessControlEntity.ORGANISATION,
          entityId: 'some-other-id',
        },
      ];

      // When
      const result = handler[AccessControlHandler.GLOBAL_PERMISSION](
        permission,
        differentEntityId,
        userPermissions,
      );

      // Then
      expect(result).toBe(true);
    });
  });
});
