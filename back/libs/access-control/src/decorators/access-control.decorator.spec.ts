import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FunctionSafe } from '@fc/common';

import { MatchType } from '../enums';
import { AccessControlPermissionDataInterface } from '../interfaces';
import { ACCESS_CONTROL_METADATA_TOKEN } from '../tokens';
import { AccessControl } from './access-control.decorator';

jest.mock('@nestjs/common', () => {
  return {
    ...jest.requireActual('@nestjs/common'),
    SetMetadata: jest.fn(),
  };
});

describe('AccessControl', () => {
  let setMetadataMock;

  enum PermissionsType {
    FOO = 'foo',
    BAR = 'bar',
  }

  enum EntityType {
    ENTITY_VALUE = 'entityValue',
  }

  enum HandlerType {
    HANDLER_VALUE = 'handlerValue',
  }

  const FOO_PERMISSION: AccessControlPermissionDataInterface<
    EntityType,
    PermissionsType,
    HandlerType
  > = {
    permission: PermissionsType.FOO,
    entity: EntityType.ENTITY_VALUE,
    entityIdLocation: {
      src: 'body',
      key: 'ServiceProviderId',
    },
    handler: {
      method: HandlerType.HANDLER_VALUE,
    },
  };

  const BAR_PERMISSION: AccessControlPermissionDataInterface<
    EntityType,
    PermissionsType,
    HandlerType
  > = {
    permission: PermissionsType.BAR,
    entity: EntityType.ENTITY_VALUE,
    entityIdLocation: {
      src: 'params',
      key: 'id',
    },
    handler: {
      method: HandlerType.HANDLER_VALUE,
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    setMetadataMock = jest.mocked(SetMetadata);
  });

  it('should set the given permission data as metadata with default options', () => {
    // Given
    const permissionDataMock = [FOO_PERMISSION];

    // When
    AccessControl(permissionDataMock);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      ACCESS_CONTROL_METADATA_TOKEN,
      {
        permissionData: permissionDataMock,
        options: { matchType: MatchType.ANY },
      },
    );
  });

  it('should set the given permission data as metadata with custom options', () => {
    // Given
    const permissionDataMock = [FOO_PERMISSION];
    const optionsMock = { matchType: MatchType.ALL };

    // When
    AccessControl(permissionDataMock, optionsMock);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      ACCESS_CONTROL_METADATA_TOKEN,
      {
        permissionData: permissionDataMock,
        options: optionsMock,
      },
    );
  });

  it('should set the given permission data with multiple permissions', () => {
    // Given
    const permissionDataMock = [FOO_PERMISSION, BAR_PERMISSION];

    // When
    AccessControl(permissionDataMock);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      ACCESS_CONTROL_METADATA_TOKEN,
      {
        permissionData: permissionDataMock,
        options: { matchType: MatchType.ANY },
      },
    );
  });

  it('should set empty permission data if empty array is applied', () => {
    // Given
    const permissionData = [];

    // When
    AccessControl(permissionData);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      ACCESS_CONTROL_METADATA_TOKEN,
      {
        permissionData,
        options: { matchType: MatchType.ANY },
      },
    );
  });

  it('should merge custom options with default options', () => {
    // Given
    const permissionDataMock = [FOO_PERMISSION];
    const partialOptionsMock = {};

    // When
    AccessControl(permissionDataMock, partialOptionsMock);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      ACCESS_CONTROL_METADATA_TOKEN,
      {
        permissionData: permissionDataMock,
        options: { matchType: MatchType.ANY },
      },
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

  const accessControlData = Symbol('accessControlData');
  const handlerMock = Symbol('handler') as unknown as FunctionSafe;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.mocked(reflector.get).mockReturnValueOnce(accessControlData);
    jest.mocked(context.getHandler).mockReturnValueOnce(handlerMock);
  });

  it('should retrieve the access control data from context', () => {
    // When
    const result = AccessControl.get(reflector, context);

    // Then
    expect(result).toBe(accessControlData);
  });

  it('should retrieve the handler from the context', () => {
    // When
    AccessControl.get(reflector, context);

    // Then
    expect(context.getHandler).toHaveBeenCalledTimes(1);
    expect(context.getHandler).toHaveBeenCalledWith();
  });

  it('should retrieve the metadata from the context', () => {
    // When
    AccessControl.get(reflector, context);

    // Then
    expect(reflector.get).toHaveBeenCalledTimes(1);
    expect(reflector.get).toHaveBeenCalledWith(
      ACCESS_CONTROL_METADATA_TOKEN,
      handlerMock,
    );
  });

  it('should return undefined if no metadata was found', () => {
    // Given
    jest.mocked(reflector.get).mockReset().mockReturnValueOnce(undefined);

    // When
    const result = AccessControl.get(reflector, context);

    // Then
    expect(result).toEqual(undefined);
  });
});
