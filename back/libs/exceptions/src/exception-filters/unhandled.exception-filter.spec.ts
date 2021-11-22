import { ArgumentsHost } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { UnhandledExceptionFilter } from './unhandled.exception-filter';

describe(' UnhandledExceptionFilter', () => {
  let exceptionFilter: UnhandledExceptionFilter;
  const loggerMock = {
    debug: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const resMock: any = {};
  resMock.render = jest.fn().mockReturnValue(resMock);
  resMock.json = jest.fn().mockReturnValue(resMock);
  resMock.status = jest.fn().mockReturnValue(resMock);

  const argumentHostMock = {
    switchToHttp: () => ({
      getResponse: () => resMock,
    }),
  } as ArgumentsHost;

  const configServiceMock = {
    get: jest.fn(),
  };

  const errorValueMock: ApiErrorMessage = {
    code: 'codeValueMock',
    id: 'idValueMock',
    message: 'messageValueMock',
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    exceptionFilter = new UnhandledExceptionFilter(
      configServiceMock as unknown as ConfigService,
      loggerMock,
    );

    configServiceMock.get.mockReturnValue({
      apiOutputContentType: 'html',
    });
  });

  describe('catch()', () => {
    it('should log an error', () => {
      // Given
      const exception = new Error('message text');
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'Error',
          code: 'Y000000',
          message: 'message text',
        }),
      );
    });

    it('should render error template', () => {
      // Given
      const exception = new Error('message text');
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          code: 'Y000000',
          message: 'message text',
        }),
      );
    });
  });

  describe('errorOutput()', () => {
    it('should return an error in JSON if the `apiOutputContentType` value is set to `json`', () => {
      // Given
      configServiceMock.get.mockReturnValue({
        apiOutputContentType: 'json',
      });
      const httpErrorCodeValueMock = 500;
      const exceptionParam: ApiErrorParams = {
        res: resMock,
        error: errorValueMock,
        httpResponseCode: httpErrorCodeValueMock,
      };
      // When
      exceptionFilter['errorOutput'](exceptionParam);
      // Then
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({
        code: 'codeValueMock',
        id: 'idValueMock',
        message: 'messageValueMock',
      });
    });

    it('should return an error through `res.render` if the `apiOutputContentType` value is set to `html`', () => {
      // Given
      const httpErrorCodeValueMock = 500;
      const exceptionParam: ApiErrorParams = {
        res: resMock,
        error: errorValueMock,
        httpResponseCode: httpErrorCodeValueMock,
      };
      const errorValueReturnedMock: ApiErrorMessage = {
        code: 'codeValueMock',
        id: 'idValueMock',
        message: 'messageValueMock',
      };
      // When
      exceptionFilter['errorOutput'](exceptionParam);
      // Then
      expect(resMock.render).toHaveBeenCalledTimes(1);
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining(errorValueReturnedMock),
      );
    });
  });
});
