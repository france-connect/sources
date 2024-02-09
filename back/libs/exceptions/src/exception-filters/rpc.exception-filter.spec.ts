import { throwError } from 'rxjs';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getLoggerMock } from '@mocks/logger';

import { RpcException } from '../exceptions';
import { RpcExceptionFilter } from './rpc.exception-filter';

jest.mock('rxjs');

describe('RpcExceptionFilter', () => {
  let exceptionFilter: RpcExceptionFilter;
  const loggerMock = getLoggerMock();

  const apiOutputContentTypeValueMock = 'html';
  const configServiceMock = {} as unknown as ConfigService;
  configServiceMock.get = jest.fn().mockReturnValue({
    apiOutputContentType: apiOutputContentTypeValueMock,
  });

  const resMock: any = {};
  resMock.render = jest.fn().mockReturnValue(resMock);
  resMock.status = jest.fn().mockReturnValue(resMock);

  const viewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  beforeEach(() => {
    exceptionFilter = new RpcExceptionFilter(
      configServiceMock,
      loggerMock as unknown as LoggerService,
      viewTemplateServiceMock as unknown as ViewTemplateService,
    );
    jest.resetAllMocks();
  });

  describe('catch', () => {
    it('should call logException with error code, error id and exception', () => {
      // Given
      const exception = new RpcException('Exception from RpcException');
      exceptionFilter['logException'] = jest.fn();

      // When
      exceptionFilter.catch(exception);

      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledWith(
        'Y000000',
        expect.any(String),
        exception,
      );
    });

    it('should call throwError from rxjs', () => {
      // Given
      const exception = new RpcException('Exception from RpcException');
      exceptionFilter['logException'] = jest.fn();
      const throwErrorMock = jest.mocked(throwError);

      // When
      exceptionFilter.catch(exception);

      // Then
      expect(throwErrorMock).toHaveBeenCalledWith(exception.getError());
    });
  });
});
