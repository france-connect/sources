import { ArgumentsHost } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getLoggerMock } from '@mocks/logger';

import { UnhandledExceptionFilter } from './unhandled.exception-filter';

describe(' UnhandledExceptionFilter', () => {
  let exceptionFilter: UnhandledExceptionFilter;
  const loggerMock = getLoggerMock();

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

  const viewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  const exception = new Error('mock exception');

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    exceptionFilter = new UnhandledExceptionFilter(
      configServiceMock as unknown as ConfigService,
      loggerMock as unknown as LoggerService,
      viewTemplateServiceMock as unknown as ViewTemplateService,
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
      expect(loggerMock.err).toHaveBeenCalledWith(
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
          exception,
          error: {
            code: 'Y000000',
            message: 'message text',
            id: expect.any(String),
          },
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
        exception,
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
        exception,
        res: resMock,
        error: errorValueMock,
        httpResponseCode: httpErrorCodeValueMock,
      };
      const errorValueReturnedMock = {
        exception,
        error: errorValueMock,
        httpResponseCode: httpErrorCodeValueMock,
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
