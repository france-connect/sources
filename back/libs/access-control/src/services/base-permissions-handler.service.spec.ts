import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';

import { RequirePermission } from '../decorators';
import { EntityType, PermissionsType } from '../enums';
import { ACCESS_CONTROL_TOKEN } from '../tokens';
import { BasePermissionsHandlerService } from './base-permissions-handler.service';

jest.mock('../decorators');

describe('BaseRoleHandlerService', () => {
  let service: BasePermissionsHandlerService;

  class AppTest extends BasePermissionsHandlerService {
    protected checkPermissions(
      _permissionType: PermissionsType,
      _context: ExecutionContext,
    ): boolean {
      return true;
    }
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AppTest],
    }).compile();

    service = module.get<AppTest>(AppTest);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAllPermissions', () => {
    let checkRolesMock: jest.Mock;

    const controllerPermissionsMock: PermissionsType[] = [
      PermissionsType.SERVICE_PROVIDER_LIST,
    ];

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
      jest.mocked(RequirePermission.get).mockReturnValueOnce([]);
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
        controllerPermissionsMock[0],
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
        controllerPermissionsMock[0],
        contextMock,
      );
    });
  });

  describe('standardMatchPermission', () => {
    const userPermissions = [
      {
        permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: 'entityIdValue1',
      },
      {
        permissionType: PermissionsType.SERVICE_PROVIDER_VIEW,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: 'entityIdValue2',
      },
    ];

    it('should match permission', () => {
      const controllerMock = {
        permissionType: PermissionsType.SERVICE_PROVIDER_LIST,
        entity: EntityType.SERVICE_PROVIDER,
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
        permissionType: PermissionsType.SERVICE_PROVIDER_EDIT,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: 'entityIdValue1',
      };
      const result = service['standardMatchPermission'](
        userPermissions,
        controllerMock,
      );
      expect(result).toBe(false);
    });
  });

  describe('extractContextInfos', () => {
    const httpArgMock = {
      getRequest: jest.fn(),
    } as unknown as HttpArgumentsHost;

    const ctxMock = {
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;

    const reqMock = {
      body: Symbol('body'),
      params: Symbol('params'),
      query: Symbol('query'),
      [ACCESS_CONTROL_TOKEN]: Symbol('userPermissions'),
    };

    beforeEach(() => {
      jest.mocked(httpArgMock).getRequest.mockReturnValueOnce(reqMock);
      jest.mocked(ctxMock).switchToHttp.mockReturnValueOnce(httpArgMock);
    });

    it('should retrieve request from context', () => {
      // Given

      // When
      service['extractContextInfos'](ctxMock);

      // Then
      expect(ctxMock.switchToHttp).toHaveBeenCalledTimes(1);
      expect(ctxMock.switchToHttp).toHaveBeenCalledWith();
      expect(httpArgMock.getRequest).toHaveBeenCalledTimes(1);
      expect(httpArgMock.getRequest).toHaveBeenCalledWith();
    });

    it('should get all infos from context', () => {
      // Given
      const resultMock = {
        body: reqMock.body,
        params: reqMock.params,
        query: reqMock.query,
        userPermissions: reqMock[ACCESS_CONTROL_TOKEN],
      };

      // When
      const result = service['extractContextInfos'](ctxMock);

      // Then
      expect(result).toStrictEqual(resultMock);
    });
  });
});
