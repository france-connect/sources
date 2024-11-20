import { Response } from 'express';

import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiContentType } from '@fc/app';
import { BaseException } from '@fc/exceptions';
import {
  FcWebHtmlExceptionFilter,
  FcWebJsonExceptionFilter,
} from '@fc/exceptions/filters';

import { ExceptionOccurredHandler } from './exception-occurred-web.handler';

describe('ExceptionOccurredHandler', () => {
  let handler: ExceptionOccurredHandler;

  const webHtmlMock = {
    catch: jest.fn(),
  };
  const webJsonlMock = {
    catch: jest.fn(),
  };

  const hostMock = {
    switchToHttp: jest.fn(),
    getResponse: jest.fn(),
  };

  const resMock = {
    getHeaders: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExceptionOccurredHandler,
        FcWebHtmlExceptionFilter,
        FcWebJsonExceptionFilter,
      ],
    })
      .overrideProvider(FcWebJsonExceptionFilter)
      .useValue(webJsonlMock)
      .overrideProvider(FcWebHtmlExceptionFilter)
      .useValue(webHtmlMock)
      .compile();

    handler = module.get<ExceptionOccurredHandler>(ExceptionOccurredHandler);

    hostMock.switchToHttp.mockReturnThis();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    beforeEach(() => {
      handler['getContentType'] = jest
        .fn()
        .mockReturnValue(ApiContentType.HTML);
    });

    it('should call the rendered html filter when the exception is a rendered exception and the content type is html', () => {
      // Given
      const exceptionMock = new (class MockRendered extends BaseException {})();

      // When
      handler.execute({
        exception: exceptionMock,
        host: hostMock as unknown as ArgumentsHost,
      });

      // Then
      expect(webHtmlMock.catch).toHaveBeenCalledExactlyOnceWith(
        exceptionMock,
        hostMock,
      );
    });

    it('should call the rendered json filter when the exception is a rendered exception and the content type is json', () => {
      // Given
      const exceptionMock = new (class MockRendered extends BaseException {})();
      handler['getContentType'] = jest
        .fn()
        .mockReturnValue(ApiContentType.JSON);

      // When
      handler.execute({
        exception: exceptionMock,
        host: hostMock as unknown as ArgumentsHost,
      });

      // Then
      expect(webJsonlMock.catch).toHaveBeenCalledExactlyOnceWith(
        exceptionMock,
        hostMock,
      );
    });
  });

  describe('getContentType', () => {
    it('should return parsed content type from header if present', () => {
      // Given
      const headers = {
        'content-type': 'application/json',
      };

      resMock.getHeaders.mockReturnValue(headers);

      // When
      const result = handler['getContentType'](resMock as unknown as Response);

      // Then
      expect(result).toBe(ApiContentType.JSON);
    });

    it('should return parsed content type from header even if it contains charset', () => {
      // Given
      const headers = {
        'content-type': 'application/json; charset=utf8',
      };

      resMock.getHeaders.mockReturnValue(headers);

      // When
      const result = handler['getContentType'](resMock as unknown as Response);

      // Then
      expect(result).toBe(ApiContentType.JSON);
    });

    it('should return text/html if content type is not present', () => {
      // Given
      resMock.getHeaders.mockReturnValue({});

      // When
      const result = handler['getContentType'](resMock as unknown as Response);

      // Then
      expect(result).toBe(ApiContentType.HTML);
    });
  });
});
