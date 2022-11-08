import { mocked } from 'jest-mock';

import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionsType } from '../enums';
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

    setMetadataMock = mocked(SetMetadata);
  });

  it('set the given permissions as metadata', () => {
    // Given
    const permissions = [
      PermissionsType.SERVICE_PROVIDER_LIST,
      PermissionsType.SERVICE_PROVIDER_VIEW,
    ];
    const dataMock = [
      PermissionsType.SERVICE_PROVIDER_LIST,
      PermissionsType.SERVICE_PROVIDER_VIEW,
    ];
    // When
    RequirePermission(permissions);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      dataMock,
    );
  });

  it('set the given permission as metadata', () => {
    // Given
    const permission = PermissionsType.SERVICE_PROVIDER_LIST;
    const dataMock = [PermissionsType.SERVICE_PROVIDER_LIST];
    // When
    RequirePermission(permission);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      dataMock,
    );
  });

  it('should defined empty permission if undefined is applied', () => {
    // Given
    const permission = undefined;
    const dataMock = [];
    // When
    RequirePermission(permission);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      dataMock,
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
  const handlerMock = Symbol('handler') as unknown as Function;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    mocked(reflector.get).mockReturnValueOnce(requiredPermissions);
    mocked(context.getHandler).mockReturnValueOnce(handlerMock);
  });

  it('should retrieve the required permissions from context', () => {
    // Given
    // When
    const permissions = RequirePermission.get(reflector, context);

    // Then
    expect(permissions).toBe(requiredPermissions);
  });

  it('should retrieve the handler from the context', () => {
    // Given
    // When
    RequirePermission.get(reflector, context);
    // Then
    expect(context.getHandler).toHaveBeenCalledTimes(1);
    expect(context.getHandler).toHaveBeenCalledWith();
  });

  it('should retrieve the metadata from the context', () => {
    // Given
    // When
    RequirePermission.get(reflector, context);

    // Then
    expect(reflector.get).toHaveBeenCalledTimes(1);
    expect(reflector.get).toHaveBeenCalledWith(
      PERMISSION_METADATA_TOKEN,
      handlerMock,
    );
  });

  it('should return an empty array if no metadata was found', () => {
    // Given
    mocked(reflector.get).mockReset().mockReturnValueOnce(undefined);

    // When
    const permissions = RequirePermission.get(reflector, context);

    // Then
    expect(permissions).toEqual([]);
  });
});
