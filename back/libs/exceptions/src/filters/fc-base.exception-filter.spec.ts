import { Response } from 'express';

import { HttpStatus } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiErrorMessage } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { BaseException, HttpException, RpcException } from '../exceptions';
import { FcBaseExceptionFilter } from './fc-base.exception-filter';

describe('FcBaseExceptionFilter', () => {
  let filter: FcBaseExceptionFilter;

  class FcBaseExceptionFilterImplementation extends FcBaseExceptionFilter {}

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const eventBusMock = {
    publish: jest.fn(),
  };

  const resMock = {
    status: jest.fn(),
    render: jest.fn(),
  };

  const prefixMock = 'Z';
  const scopeMock = 42;
  const codeMock = 1337;

  class ExceptionMock extends BaseException {
    static SCOPE = scopeMock;
    static CODE = codeMock;
    static ERROR = 'ERROR';
    static ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
  }

  let originalErrorMock: Error;
  let exceptionMock: BaseException;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FcBaseExceptionFilterImplementation,
        ConfigService,
        LoggerService,
        EventBus,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .compile();

    filter = module.get<FcBaseExceptionFilterImplementation>(
      FcBaseExceptionFilterImplementation,
    );

    originalErrorMock = new Error('originalErrorMockValue');
    exceptionMock = new ExceptionMock(originalErrorMock);

    configMock.get.mockReturnValue({ prefix: prefixMock });
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('getParams', () => {
    const messageMock = {};
    it('should return the params', () => {
      // Given
      filter['getHttpStatus'] = jest.fn().mockReturnValue(500);
      // When
      const result = filter['getParams'](
        exceptionMock,
        messageMock as ApiErrorMessage,
        resMock as unknown as Response,
      );

      // Then
      expect(result).toEqual({
        exception: exceptionMock,
        res: resMock,
        error: messageMock,
        httpResponseCode: 500,
      });
    });
  });

  describe('getHttpStatus', () => {
    it('should return the status code from status property', () => {
      // Given
      const exceptionStatusMock = {
        status: Symbol('status') as unknown as number,
      } as BaseException;
      // When
      const result = filter['getHttpStatus'](exceptionStatusMock);

      // Then
      expect(result).toBe(exceptionStatusMock.status);
    });

    it('should return the status code from statusCode property', () => {
      // Given
      const exceptionStatusMock = {
        statusCode: Symbol('statusCode') as unknown as number,
      } as BaseException;

      // When
      const result = filter['getHttpStatus'](exceptionStatusMock);

      // Then
      expect(result).toBe(exceptionStatusMock.statusCode);
    });

    it('should return the status code from class HTTP_STATUS_CODE static property', () => {
      // When
      const result = filter['getHttpStatus'](exceptionMock);

      // Then
      expect(result).toBe(ExceptionMock.HTTP_STATUS_CODE);
    });

    it('should return the default status given as argument', () => {
      // Given
      const defaultValue = Symbol('defaultValue') as unknown as number;
      const exceptionStatusMock = {} as BaseException;
      // When
      const result = filter['getHttpStatus'](exceptionStatusMock, defaultValue);

      // Then
      expect(result).toBe(defaultValue);
    });

    it('should return HttpStatus.INTERNAL_SERVER_ERROR if nothing is found not passed as argument', () => {
      // Given
      const exceptionStatusMock = {} as BaseException;

      // When
      const result = filter['getHttpStatus'](exceptionStatusMock);

      // Then
      expect(result).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('logException', () => {
    it('should log the exception', () => {
      // When
      filter['logException']('codeMock', 'idMock', exceptionMock);

      // Then
      expect(loggerMock.err).toHaveBeenCalledTimes(1);
    });
  });

  describe('getExceptionCodeFor', () => {
    it('should return the exception code', () => {
      // When
      const result = filter['getExceptionCodeFor'](exceptionMock);

      // Then
      expect(result).toEqual(`${prefixMock}${scopeMock}${codeMock}`);
    });

    it('should use the HTTP status code if the exception is an HttpException', () => {
      // Given
      const httpExceptionMock = new HttpException(
        'message',
        HttpStatus.NOT_FOUND,
      );
      // When
      const result = filter['getExceptionCodeFor'](httpExceptionMock);

      // Then
      expect(result).toEqual(`${prefixMock}000${HttpStatus.NOT_FOUND}`);
    });

    it('should use the HTTP status code if the exception is an HttpException', () => {
      // Given
      const httpExceptionMock = new RpcException('message');
      // When
      const result = filter['getExceptionCodeFor'](httpExceptionMock);

      // Then
      expect(result).toEqual(`${prefixMock}000000`);
    });
  });
});
