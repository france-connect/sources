import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { RpcException } from '../exceptions';
import { RpcExceptionFilter } from './rpc.exception-filter';

describe('RpcExceptionFilter', () => {
  let exceptionFilter: RpcExceptionFilter;
  const loggerMock = {
    debug: jest.fn(),
    warn: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const apiOutputContentTypeValueMock = 'html';
  const configServiceMock = {} as unknown as ConfigService;
  configServiceMock.get = jest.fn().mockReturnValue({
    apiOutputContentType: apiOutputContentTypeValueMock,
  });

  const resMock: any = {};
  resMock.render = jest.fn().mockReturnValue(resMock);
  resMock.status = jest.fn().mockReturnValue(resMock);

  beforeEach(() => {
    exceptionFilter = new RpcExceptionFilter(configServiceMock, loggerMock);
    jest.resetAllMocks();
  });

  describe('catch', () => {
    it('should log an error', () => {
      // Given
      const exception = new RpcException('message text');
      // When
      exceptionFilter.catch(exception);
      // Then
      expect(loggerMock.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RpcException',
          code: 'Y000000',
          message: 'message text',
        }),
      );
    });
  });
});
