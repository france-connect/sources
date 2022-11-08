import { ExecutionContext } from '@nestjs/common';

import { ACCESS_CONTROL_TOKEN } from '../tokens';
import { AccountPermissionsDecorator } from './account-permissions.decorator';

describe('AccountPermissionsDecorator', () => {
  const targetMock = null;
  const contextMock = {
    switchToHttp: jest.fn(),
  };

  const argumentHostMock = {
    getRequest: jest.fn(),
  };

  const accessControlMockValue = Symbol('accessControlMockValue');

  const requestMock = {
    [ACCESS_CONTROL_TOKEN]: accessControlMockValue,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    contextMock.switchToHttp.mockReturnValueOnce(argumentHostMock);
    argumentHostMock.getRequest.mockReturnValueOnce(requestMock);
  });

  it('should call  ctx.switchToHttp()', () => {
    // When
    AccountPermissionsDecorator(
      targetMock,
      contextMock as unknown as ExecutionContext,
    );
    // Then
    expect(contextMock.switchToHttp).toHaveBeenCalledTimes(1);
  });

  it('should call httpArgumentHost.getRequest()', () => {
    // When
    AccountPermissionsDecorator(
      targetMock,
      contextMock as unknown as ExecutionContext,
    );
    // Then
    expect(argumentHostMock.getRequest).toHaveBeenCalledTimes(1);
  });

  it('should return request property named with `ACCESS_CONTROL_TOKEN` symbol', () => {
    // When
    const result = AccountPermissionsDecorator(
      targetMock,
      contextMock as unknown as ExecutionContext,
    );
    // Then
    expect(result).toBe(accessControlMockValue);
  });
});
