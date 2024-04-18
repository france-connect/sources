import { ArgumentsHost, HttpStatus } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getLoggerMock } from '@mocks/logger';

import { HttpException } from '../exceptions';
import { HttpExceptionFilter } from './http.exception-filter';

describe('HttpExceptionFilter', () => {
  let exceptionFilter: HttpExceptionFilter;
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

  const codeValueMock = 'codeValueMock';
  const idValueMock = 'idValueMock';
  const messageValueMock = 'messageValueMock';
  const errorValueMock: ApiErrorMessage = {
    code: codeValueMock,
    id: idValueMock,
    message: messageValueMock,
  };
  const exception = new Error('mock exception');

  let configServiceMock;

  const viewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    configServiceMock = {
      get: jest.fn(),
    };

    configServiceMock.get.mockReturnValue({
      apiOutputContentType: 'html',
    });

    exceptionFilter = new HttpExceptionFilter(
      configServiceMock,
      loggerMock as unknown as LoggerService,
      viewTemplateServiceMock as unknown as ViewTemplateService,
    );
  });

  describe('catch()', () => {
    it('should call logException with error code, error id and exception', () => {
      // Given
      const codeMock = 400;
      const exception = new HttpException(
        'Exception from HttpException',
        codeMock,
      );
      exceptionFilter['logException'] = jest.fn();

      // When
      exceptionFilter.catch(exception, argumentHostMock);

      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledWith(
        `Y000${codeMock}`,
        expect.any(String),
        exception,
      );
    });

    it('should render error template', () => {
      // Given
      const codeMock = 403;
      const exception = new HttpException('message text', codeMock);
      exception.getResponse = jest
        .fn()
        .mockReturnValue({ message: 'some other text' });

      // When
      exceptionFilter.catch(exception, argumentHostMock);

      // Then
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          exception,
          error: {
            code: `Y000${codeMock}`,
            message: 'some other text',
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
      const exceptionParam: ApiErrorParams = {
        exception,
        res: resMock,
        error: errorValueMock,
        httpResponseCode: HttpStatus.BAD_REQUEST,
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
      const exceptionParam: ApiErrorParams = {
        exception,
        res: resMock,
        error: errorValueMock,
        httpResponseCode: HttpStatus.BAD_REQUEST,
      };
      const errorValueReturnedMock = {
        exception,
        error: {
          code: 'codeValueMock',
          id: 'idValueMock',
          message: 'messageValueMock',
        },
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

    it('should send an HTTP code corresponding to `httpResponseCode` given in `errorParam`', () => {
      // Given
      const exceptionParam: ApiErrorParams = {
        exception,
        res: resMock,
        error: errorValueMock,
        httpResponseCode: HttpStatus.BAD_REQUEST,
      };
      // When
      exceptionFilter['errorOutput'](exceptionParam);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    });
  });
});
