import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import {
  EntityType,
  PermissionInterface,
  PermissionsRequestInformationsInterface,
  PermissionsType,
  RequirePermissionDecoratorInterface,
  UnknownPermissionException,
} from '@fc/access-control';
import { uuid } from '@fc/common';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { AppPermissionsHandler } from './app-permissions.handler';

describe('AppPermissionsHandler', () => {
  let service: AppPermissionsHandler;

  const reflectorMock = {};
  const sessionServiceMock = getSessionServiceMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppPermissionsHandler],
      providers: [Reflector, SessionService],
    })
      .overrideProvider(Reflector)
      .useValue(reflectorMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<AppPermissionsHandler>(AppPermissionsHandler);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkPermissions()', () => {
    const contextMock = {} as ExecutionContext;
    const entityIdMock = Symbol('entityId') as unknown as uuid;

    const permissionMock: RequirePermissionDecoratorInterface = {
      entity: EntityType.SERVICE_PROVIDER,
      permissionType: PermissionsType.VIEW,
      entityIdLocation: { src: 'params', key: 'instanceId' },
    };

    const userPermissionsMock: PermissionInterface[] = [
      {
        permissionType: PermissionsType.VIEW,
        entity: EntityType.SERVICE_PROVIDER,
        entityId: 'entityIdValue',
      },
    ];

    const infoMock: PermissionsRequestInformationsInterface = {
      entityId: entityIdMock,
      userPermissions: userPermissionsMock,
    };

    beforeEach(() => {
      service['extractContextInfo'] = jest.fn().mockReturnValueOnce(infoMock);

      service['retrieveEntityIdFromRequest'] = jest
        .fn()
        .mockReturnValueOnce(entityIdMock);

      service['standardMatchPermission'] = jest.fn().mockReturnValueOnce(true);
    });

    it('should throw UnknownPermissionException if permissionType is invalid', () => {
      // Given
      const invalidPermission = {
        ...permissionMock,
        permissionType: 'INVALID',
      } as unknown as RequirePermissionDecoratorInterface;

      // Then
      expect(() =>
        service['checkPermissions'](invalidPermission, contextMock),
      ).toThrow(UnknownPermissionException);
    });

    it('should call extractContextInfo method', () => {
      // When
      service['checkPermissions'](permissionMock, contextMock);

      // Then
      expect(service['extractContextInfo']).toHaveBeenCalledTimes(1);
      expect(service['extractContextInfo']).toHaveBeenCalledWith(
        contextMock,
        permissionMock.entityIdLocation,
      );
    });

    it('should call standardMatchPermission method', () => {
      // Given
      const permissionExpected = {
        permissionType: permissionMock.permissionType,
        entity: permissionMock.entity,
        entityId: entityIdMock,
      };
      // When
      const result = service['checkPermissions'](permissionMock, contextMock);

      // Then
      expect(service['standardMatchPermission']).toHaveBeenCalledTimes(1);
      expect(service['standardMatchPermission']).toHaveBeenCalledWith(
        infoMock.userPermissions,
        permissionExpected,
      );
      expect(result).toBe(true);
    });
  });
});
