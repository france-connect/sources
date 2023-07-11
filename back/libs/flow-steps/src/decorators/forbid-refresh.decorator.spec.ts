import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FLOW_STEP_FORBID_REFRESH_METADATA } from '../tokens';
import { ForbidRefresh } from './forbid-refresh.decorator';

jest.mock('@nestjs/common', () => {
  return {
    ...jest.requireActual('@nestjs/common'),
    SetMetadata: jest.fn(),
  };
});

describe('ForbidRefresh', () => {
  let setMetadataMock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    setMetadataMock = jest.mocked(SetMetadata);
  });

  it('set the FLOW_STEP_FORBID_REFRESH_METADATA flag as true', () => {
    // When
    ForbidRefresh();

    // Then
    expect(setMetadataMock).toHaveBeenCalledTimes(1);
    expect(setMetadataMock).toHaveBeenCalledWith(
      FLOW_STEP_FORBID_REFRESH_METADATA,
      true,
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

  const ForbidRefreshFlag = [Symbol('ForbidRefreshFlag')];
  const handlerMock = Symbol('handler') as unknown as Function;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    jest.mocked(reflector.get).mockReturnValueOnce(ForbidRefreshFlag);
    jest.mocked(context.getHandler).mockReturnValueOnce(handlerMock);
  });

  it('should retrieve the flag from context', () => {
    // When
    const permissions = ForbidRefresh.get(reflector, context);

    // Then
    expect(permissions).toBe(ForbidRefreshFlag);
  });

  it('should retrieve the handler from the context', () => {
    // When
    ForbidRefresh.get(reflector, context);

    // Then
    expect(context.getHandler).toHaveBeenCalledTimes(1);
    expect(context.getHandler).toHaveBeenCalledWith();
  });

  it('should retrieve the metadata from the context', () => {
    // When
    ForbidRefresh.get(reflector, context);

    // Then
    expect(reflector.get).toHaveBeenCalledTimes(1);
    expect(reflector.get).toHaveBeenCalledWith(
      FLOW_STEP_FORBID_REFRESH_METADATA,
      handlerMock,
    );
  });

  it('should return undefined if flag was not found', () => {
    // Given
    jest.mocked(reflector.get).mockReset().mockReturnValueOnce(undefined);

    // When
    const permissions = ForbidRefresh.get(reflector, context);

    // Then
    expect(permissions).toBe(undefined);
  });
});
