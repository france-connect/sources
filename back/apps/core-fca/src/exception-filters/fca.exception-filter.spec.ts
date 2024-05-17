import { ArgumentsHost, HttpStatus } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { FcException, Loggable, Trackable } from '@fc/exceptions';
import { LoggerService } from '@fc/logger';
import { TrackingService } from '@fc/tracking';
import { ViewTemplateService } from '@fc/view-templates';

import { getLoggerMock } from '@mocks/logger';

import { FcaExceptionFilter } from './fca.exception-filter';

jest.mock('@fc/exceptions/decorator/trackable.decorator');

describe('FcaExceptionFilter', () => {
  let exceptionFilter: FcaExceptionFilter;

  const loggerServiceMock = getLoggerMock();

  const trackingServiceMock = {
    trackExceptionIfNeeded: jest.fn(),
  };

  const resMock: any = {};
  resMock.render = jest.fn().mockReturnValue(resMock);
  resMock.json = jest.fn().mockReturnValue(resMock);
  resMock.status = jest.fn().mockReturnValue(resMock);

  const reqMock: any = {};

  const errorValueMock: ApiErrorMessage = {
    code: 'codeValueMock',
    id: 'idValueMock',
    message: 'messageValueMock',
  };

  const argumentHostMock = {
    switchToHttp: () => ({
      getResponse: () => resMock,
      getRequest: () => reqMock,
    }),
  } as ArgumentsHost;

  const configServiceMock = {
    get: jest.fn(),
  };

  const exception = new Error('mock exception');
  const ViewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    exceptionFilter = new FcaExceptionFilter(
      configServiceMock as unknown as ConfigService,
      loggerServiceMock as unknown as LoggerService,
      ViewTemplateServiceMock as unknown as ViewTemplateService,
      trackingServiceMock as unknown as TrackingService,
    );

    configServiceMock.get.mockReturnValue({
      apiOutputContentType: 'html',
    });
  });

  describe('getStackTraceArray()', () => {
    it('should return stack trace as an array', () => {
      // Given
      const stackMock = ['line1', 'line2', 'line3'];
      const errorMock = {
        stack: stackMock.join('\n'),
      };
      // When
      const result = exceptionFilter['getStackTraceArray'](errorMock);
      // Then
      expect(result).toEqual(stackMock);
    });

    it('should return empty array if not stack is present in error object', () => {
      // Given
      const errorMock = {};
      // When
      const result = exceptionFilter['getStackTraceArray'](errorMock);
      // Then
      expect(result).toEqual([]);
    });

    it('should concat with original error stack if provided', () => {
      // Given
      const stackMok = ['A1', 'A2'];
      const originalErrorStackMock = ['B1', 'B2'];
      const errorMock = {
        stack: stackMok.join('\n'),
        originalError: {
          stack: originalErrorStackMock.join('\n'),
        },
      };
      // When
      const result = exceptionFilter['getStackTraceArray'](errorMock);
      // Then
      expect(result).toEqual([...stackMok, ...originalErrorStackMock]);
    });

    it('should work seamlessly if original original error is provided but does not have a stack', () => {
      // Given
      const stackMok = ['A1', 'A2'];
      const errorMock = {
        stack: stackMok.join('\n'),
        originalError: {},
      };
      // When
      const result = exceptionFilter['getStackTraceArray'](errorMock);
      // Then
      expect(result).toEqual(stackMok);
    });
  });

  describe('catch()', () => {
    const STUB_ERROR_SCOPE = 2;
    const STUB_ERROR_CODE = 3;

    it('should render error template', async () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      // When
      await exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          exception,
          error: {
            code: 'Y020003',
            message: 'message text',
            id: expect.any(String),
          },
        }),
      );
    });

    it('should not log error', async () => {
      // Given
      @Loggable(false)
      class ClassMock extends FcException {}
      const exception = new ClassMock('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exceptionFilter['logException'] = jest.fn();
      // When
      await exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledTimes(0);
      expect(resMock.render).toHaveBeenCalled();
    });

    it('should log error', async () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exceptionFilter['logException'] = jest.fn();
      // When
      await exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledTimes(1);
      expect(resMock.render).toHaveBeenCalled();
    });

    it('should not render for redirections', async () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exception.redirect = true;
      // When
      await exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(resMock.render).not.toHaveBeenCalled();
    });

    it('should call `TrackingService.trackExceptionIfNeeded()`', async () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;

      const spy = jest.spyOn(Trackable, 'isTrackable');
      spy.mockImplementationOnce(() => true);
      // When
      await exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(trackingServiceMock.trackExceptionIfNeeded).toHaveBeenCalledTimes(
        1,
      );
      expect(trackingServiceMock.trackExceptionIfNeeded).toHaveBeenCalledWith(
        exception,
        {
          req: reqMock,
          exception,
        },
      );
      expect(resMock.render).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('ArgumentHostAdapter()', () => {
    it('should provide a fake argument adapter with switchToHttp method', () => {
      // Given
      const ctx = { res: {}, req: {} };
      // When
      const result = FcaExceptionFilter.ArgumentHostAdapter(ctx);
      // Then
      expect(result).toBeDefined();
      expect(typeof result.switchToHttp).toBe('function');
    });

    it('should provide a fake argument adapter with a getResponse method in response to switchToHttp', () => {
      // Given
      const ctx = { res: {} };
      const adapter = FcaExceptionFilter.ArgumentHostAdapter(ctx);
      const httpAdapter = adapter.switchToHttp();
      // When
      const result = httpAdapter.getResponse();
      // Then
      expect(result).toBeDefined();
      expect(result).toBe(ctx.res);
    });

    it('should provide a fake argument adapter with a getRequest method in response to switchToHttp', () => {
      // Given
      const ctx = { req: {} };
      const adapter = FcaExceptionFilter.ArgumentHostAdapter(ctx);
      const httpAdapter = adapter.switchToHttp();
      // When
      const result = httpAdapter.getRequest();
      // Then
      expect(result).toBeDefined();
      expect(result).toBe(ctx.req);
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

    it('should call `viewTemplate.bindMethodsToResponse()`', () => {
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
      expect(
        ViewTemplateServiceMock.bindMethodsToResponse,
      ).toHaveBeenCalledTimes(1);
      expect(
        ViewTemplateServiceMock.bindMethodsToResponse,
      ).toHaveBeenCalledWith(resMock);
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
