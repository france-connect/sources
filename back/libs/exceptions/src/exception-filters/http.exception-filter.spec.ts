import { ArgumentsHost, HttpStatus } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { LoggerService } from '@fc/logger-legacy';

import { HttpException } from '../exceptions';
import { HttpExceptionFilter } from './http.exception-filter';

describe('HttpExceptionFilter', () => {
  let exceptionFilter: HttpExceptionFilter;
  const loggerMock = {
    debug: jest.fn(),
    warn: jest.fn(),
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

  const codeValueMock = 'codeValueMock';
  const idValueMock = 'idValueMock';
  const messageValueMock = 'messageValueMock';
  const errorValueMock: ApiErrorMessage = {
    code: codeValueMock,
    id: idValueMock,
    message: messageValueMock,
  };

  let configServiceMock;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    configServiceMock = {
      get: jest.fn(),
    };

    configServiceMock.get.mockReturnValue({
      apiOutputContentType: 'html',
    });

    exceptionFilter = new HttpExceptionFilter(configServiceMock, loggerMock);
  });

  describe('catch()', () => {
    it('should log an error', () => {
      // Given
      const exception = new HttpException('message text', 400);
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(loggerMock.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'HttpException',
          code: 'Y000400',
          message: 'message text',
        }),
      );
    });

    it('should render error template', () => {
      // Given
      const exception = new HttpException('message text', 403);
      exception.getResponse = jest
        .fn()
        .mockReturnValue({ message: 'some other text' });
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          code: 'Y000403',
          message: 'some other text',
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
        res: resMock,
        error: errorValueMock,
        httpResponseCode: HttpStatus.BAD_REQUEST,
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

    it('should send an HTTP code corresponding to `httpResponseCode` given in `errorParam`', () => {
      // Given
      const exceptionParam: ApiErrorParams = {
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
