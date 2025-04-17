import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FunctionSafe } from '@fc/common';

import { EntityType, PermissionsType } from '../enums';
import { RequirePermissionDecoratorInterface } from '../interfaces';
import { PERMISSION_METADATA_TOKEN } from '../tokens';
import { RequirePermission } from './require-permissions.decorator';

jest.mock('@nestjs/common', () => {
  return {
    ...jest.requireActual('@nestjs/common'),
    SetMetadata: jest.fn(),
  };
});

describe('RequirePermission', () => {
  let setMetadataMock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    setMetadataMock = jest.mocked(SetMetadata);
  });

  it('set the given permissions as metadata', () => {
    // Given
    const permissionsMock: RequirePermissionDecoratorInterface = {
      permissionType: PermissionsType.EDIT,
      entity: EntityType.SERVICE_PROVIDER,
      entityIdLocation: {
        src: 'body',
        key: 'ServiceProviderId',
      },
    };

    // When
    RequirePermission(permissionsMock);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      permissionsMock,
    );
  });

  it('should defined empty permission if undefined is applied', () => {
    // Given
    const permission = undefined;

    // When
    RequirePermission(permission);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      permission,
    );
  });
});

describe('get', () => {
  const reflector = {
    get: jest.fn(),
  } as unknown as Reflector;
  const context = {
    getHandler: jest.fn(),
  } as unknown as ExecutionContext;

  const requiredPermissions = [Symbol('permission')];
  const handlerMock = Symbol('handler') as unknown as FunctionSafe;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.mocked(reflector.get).mockReturnValueOnce(requiredPermissions);
    jest.mocked(context.getHandler).mockReturnValueOnce(handlerMock);
  });

  it('should retrieve the required permissions from context', () => {
    // When
    const permissions = RequirePermission.get(reflector, context);

    // Then
    expect(permissions).toBe(requiredPermissions);
  });

  it('should retrieve the handler from the context', () => {
    // When
    RequirePermission.get(reflector, context);
    // Then
    expect(context.getHandler).toHaveBeenCalledTimes(1);
    expect(context.getHandler).toHaveBeenCalledWith();
  });

  it('should retrieve the metadata from the context', () => {
    // When
    RequirePermission.get(reflector, context);

    // Then
    expect(reflector.get).toHaveBeenCalledTimes(1);
    expect(reflector.get).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      handlerMock,
    );
  });

  it('should return null if no metadata was found', () => {
    // Given
    jest.mocked(reflector.get).mockReset().mockReturnValueOnce(undefined);

    // When
    const permissions = RequirePermission.get(reflector, context);

    // Then
    expect(permissions).toEqual(null);
  });
});
