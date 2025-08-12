import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FunctionSafe } from '@fc/common';

import { WEBHOOKS_METADATA_TOKEN } from '../tokens';
import { Webhooks } from './webhooks.decorator';

jest.mock('@nestjs/common', () => {
  return {
    ...jest.requireActual('@nestjs/common'),
    SetMetadata: jest.fn(),
  };
});

describe('Webhooks', () => {
  let setMetadataMock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    setMetadataMock = jest.mocked(SetMetadata);
  });

  it('set the hook name as metadata', () => {
    // Given
    const hookNameMock = 'hookNameMock';

    // When
    Webhooks(hookNameMock);

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      WEBHOOKS_METADATA_TOKEN,
      hookNameMock,
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

  const hookNameMock = 'hookNameMock';
  const handlerMock = Symbol('handler') as unknown as FunctionSafe;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.mocked(reflector.get).mockReturnValueOnce(hookNameMock);
    jest.mocked(context.getHandler).mockReturnValueOnce(handlerMock);
  });

  it('should retrieve the hookName from context', () => {
    // When
    const hookName = Webhooks.get(reflector, context);

    // Then
    expect(hookName).toBe(hookNameMock);
  });

  it('should retrieve the handler from the context', () => {
    // When
    Webhooks.get(reflector, context);

    // Then
    expect(context.getHandler).toHaveBeenCalledTimes(1);
    expect(context.getHandler).toHaveBeenCalledWith();
  });

  it('should retrieve the metadata from the context', () => {
    // When
    Webhooks.get(reflector, context);

    // Then
    expect(reflector.get).toHaveBeenCalledTimes(1);
    expect(reflector.get).toHaveBeenCalledWith(
      WEBHOOKS_METADATA_TOKEN,
      handlerMock,
    );
  });

  it('should return null if no metadata was found', () => {
    // Given
    jest.mocked(reflector.get).mockReset().mockReturnValueOnce(undefined);

    // When
    const permissions = Webhooks.get(reflector, context);

    // Then
    expect(permissions).toEqual(null);
  });
});
