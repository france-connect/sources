import { NestJsDependencyInjectionWrapper } from '@fc/common';

import { ExceptionOccurredCommand } from '../commands';
import { BaseException } from '../exceptions';
import { throwException } from './throw-exception.helper';

jest.mock('@fc/common', () => ({
  NestJsDependencyInjectionWrapper: {
    get: jest.fn(),
  },
  wait: jest.fn(),
}));

describe('throwException', () => {
  const nestDiMock = jest.mocked(NestJsDependencyInjectionWrapper.get);

  const asyncLocalStorageMock = {
    get: jest.fn(),
  };

  const request = {};
  const response = {};

  const commandBusMock = {
    execute: jest.fn(),
  };

  const exceptionMock = new BaseException();

  beforeEach(() => {
    jest.resetAllMocks();

    nestDiMock.mockReturnValueOnce(commandBusMock);
    nestDiMock.mockReturnValueOnce(asyncLocalStorageMock);
    asyncLocalStorageMock.get.mockReturnValueOnce(request);
    asyncLocalStorageMock.get.mockReturnValueOnce(response);
  });

  it('should execute command on commandBus', async () => {
    // When
    await throwException(exceptionMock);

    // Then
    expect(commandBusMock.execute).toHaveBeenCalledExactlyOnceWith(
      expect.any(ExceptionOccurredCommand),
    );
  });

  it('should build a command with hostArgument', async () => {
    // Given
    await throwException(exceptionMock);

    // When
    const commandMock = commandBusMock.execute.mock.calls[0][0];
    const hostReq = commandMock.host.switchToHttp().getRequest();
    const hostRes = commandMock.host.switchToHttp().getResponse();

    // Then
    expect(hostReq).toBe(request);
    expect(hostRes).toBe(response);
  });

  it('should build a command with exception', async () => {
    // Given
    await throwException(exceptionMock);

    // When
    const commandMock = commandBusMock.execute.mock.calls[0][0];

    // Then
    expect(commandMock.exception).toBe(exceptionMock);
  });
});
