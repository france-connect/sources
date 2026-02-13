import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { NO_ENTITY_ID } from '@entities/typeorm';

import { PartnersAccountSession } from '@fc/partners-account';
import { SessionNotFoundException, SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { RequirePermission } from '../decorators';
import { RequirePermissionDecoratorInterface } from '../interfaces';
import { BasePermissionsHandlerService } from './base-permissions-handler.service';

jest.mock('../decorators');

describe('BasePermissionsHandlerService', () => {
  enum EntityType {
    ENTITY_VALUE = 'entityValue',
  }

  enum PermissionsType {
    PERMISSION_VALUE = 'permissionValue',
    PERMISSION_VALUE_2 = 'permissionValue2',
  }

  let service: BasePermissionsHandlerService<EntityType, PermissionsType>;

  class AppTest extends BasePermissionsHandlerService<
    EntityType,
    PermissionsType
  > {
    protected checkPermissions(
      _permissionType: RequirePermissionDecoratorInterface<
        EntityType,
        PermissionsType
      >,
      _context: ExecutionContext,
    ): boolean {
      return true;
    }
  }

  const reflectorMock = {};
  const sessionServiceMock = getSessionServiceMock();

  const controllerPermissionsMock: RequirePermissionDecoratorInterface<
    EntityType,
    PermissionsType
  > = {
    permissionType: PermissionsType.PERMISSION_VALUE,
    entity: EntityType.ENTITY_VALUE,
    entityIdLocation: { src: 'params', key: 'instanceId' },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppTest, SessionService, Reflector],
    })
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<AppTest>(AppTest);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAllPermissions', () => {
    let checkRolesMock: jest.Mock;

    beforeEach(() => {
      checkRolesMock = service['checkPermissions'] = jest.fn();
    });

    const contextMock = {} as ExecutionContext;

    it('should extract permissions from metadata', () => {
      // Given
      jest
        .mocked(RequirePermission.get)
        .mockReturnValueOnce(controllerPermissionsMock);
      // When
      service.checkAllPermissions(contextMock);

      // Then
      expect(RequirePermission.get).toHaveBeenCalledTimes(1);
      expect(RequirePermission.get).toHaveBeenCalledWith(
        service['reflector'],
        contextMock,
      );
    });

    it('should return true if no role was required.', () => {
      // Given
      jest.mocked(RequirePermission.get).mockReturnValueOnce(null);
      checkRolesMock.mockReturnValueOnce(false);

      // When
      const result = service.checkAllPermissions(contextMock);

      // Then
      expect(result).toBe(true);
      expect(checkRolesMock).toHaveBeenCalledTimes(0);
    });

    it('should match role based controller role and context', () => {
      // Given
      jest
        .mocked(RequirePermission.get)
        .mockReturnValueOnce(controllerPermissionsMock);

      checkRolesMock.mockReturnValueOnce(true);

      // When
      const result = service.checkAllPermissions(contextMock);

      // Then
      expect(result).toBe(true);
      expect(checkRolesMock).toHaveBeenCalledTimes(1);
      expect(checkRolesMock).toHaveBeenCalledWith(
        controllerPermissionsMock,
        contextMock,
      );
    });

    it('should not match role if matching function failed', () => {
      // Given
      jest
        .mocked(RequirePermission.get)
        .mockReturnValueOnce(controllerPermissionsMock);
      checkRolesMock.mockReturnValueOnce(false);

      // When
      const result = service.checkAllPermissions(contextMock);

      // Then
      expect(result).toBe(false);
      expect(checkRolesMock).toHaveBeenCalledTimes(1);
      expect(checkRolesMock).toHaveBeenCalledWith(
        controllerPermissionsMock,
        contextMock,
      );
    });
  });

  describe('standardMatchPermission', () => {
    const userPermissions = [
      {
        permissionType: PermissionsType.PERMISSION_VALUE,
        entity: EntityType.ENTITY_VALUE,
        entityId: 'entityIdValue1',
      },
      {
        permissionType: PermissionsType.PERMISSION_VALUE_2,
        entity: EntityType.ENTITY_VALUE,
        entityId: 'entityIdValue2',
      },
    ];

    it('should match permission', () => {
      const controllerMock = {
        permissionType: PermissionsType.PERMISSION_VALUE,
        entity: EntityType.ENTITY_VALUE,
        entityId: 'entityIdValue1',
      };
      const result = service['standardMatchPermission'](
        userPermissions,
        controllerMock,
      );
      expect(result).toBe(true);
    });

    it('should not match permission', () => {
      const controllerMock = {
        permissionType: PermissionsType.PERMISSION_VALUE_2,
        entity: EntityType.ENTITY_VALUE,
        entityId: 'entityIdValue1',
      };
      const result = service['standardMatchPermission'](
        userPermissions,
        controllerMock,
      );
      expect(result).toBe(false);
    });
  });

  describe('extractContextInfo', () => {
    const httpArgMock = {
      getRequest: jest.fn(),
    } as unknown as HttpArgumentsHost;

    const ctxMock = {
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const reqMock = {
      params: { instanceId: 'entityId' },
    };

    const userPermissionsMock = Symbol('userPermissions');

    const sessionPartnersAccountDataMock = {
      permissions: userPermissionsMock,
      identity: Symbol('identity'),
    } as unknown as PartnersAccountSession<EntityType, PermissionsType>;

    beforeEach(() => {
      jest.mocked(httpArgMock).getRequest.mockReturnValueOnce(reqMock);
      jest.mocked(ctxMock).switchToHttp.mockReturnValueOnce(httpArgMock);
    });

    it('should retrieve request from context', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      service['extractContextInfo'](
        ctxMock,
        controllerPermissionsMock.entityIdLocation,
      );

      // Then
      expect(ctxMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(ctxMock.switchToHttp).toHaveBeenCalledWith();
      expect(httpArgMock.getRequest).toHaveBeenCalledTimes(1);
      expect(httpArgMock.getRequest).toHaveBeenCalledWith();
    });

    it('should return entityId not null and user permissions', () => {
      // Given
      const resultMock = {
        entityId: 'entityId',
        userPermissions: userPermissionsMock,
      };

      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      const result = service['extractContextInfo'](
        ctxMock,
        controllerPermissionsMock.entityIdLocation,
      );

      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it('should return entityId with NO_ENTITY_ID value if no entityIdLocation was provide and user permissions', () => {
      // Given
      const resultMock = {
        entityId: NO_ENTITY_ID,
        userPermissions: userPermissionsMock,
      };

      sessionServiceMock.get.mockReturnValueOnce(
        sessionPartnersAccountDataMock,
      );

      // When
      const result = service['extractContextInfo'](ctxMock, null);

      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it('should return SessionNotFoundException if no identity was found in partner session', () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce(null);

      // When
      expect(() =>
        service['extractContextInfo'](
          ctxMock,
          controllerPermissionsMock.entityIdLocation,
        ),
      ).toThrow(SessionNotFoundException);
    });
  });
});
