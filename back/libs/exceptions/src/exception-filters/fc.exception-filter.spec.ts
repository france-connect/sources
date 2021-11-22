import { ArgumentsHost } from '@nestjs/common';

import { ApiErrorMessage, ApiErrorParams, ApiHttpResponseCode } from '@fc/app';
import { ConfigService } from '@fc/config';
import { Loggable, Trackable } from '@fc/exceptions';
import { LoggerService } from '@fc/logger';
import { TrackingService } from '@fc/tracking';

import { TrackableEvent } from '../events';
import { FcException } from '../exceptions';
import { FcExceptionFilter } from './fc.exception-filter';

jest.mock('@fc/exceptions/decorator/trackable.decorator');

describe('FcExceptionFilter', () => {
  let exceptionFilter: FcExceptionFilter;

  const loggerServiceMock = {
    trace: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    setContext: jest.fn(),
  } as unknown as LoggerService;

  const trackingServiceMock = {
    track: jest.fn(),
  } as unknown as TrackingService;

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

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    exceptionFilter = new FcExceptionFilter(
      configServiceMock as unknown as ConfigService,
      loggerServiceMock,
      trackingServiceMock,
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

    it('should log a warning by default', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(loggerServiceMock.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'FcException',
          code: 'Y020003',
          message: 'message text',
        }),
      );
    });

    it('should concat stack trace from original error', () => {
      // Given
      const exception = new FcException();
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exception.originalError = new Error('foo bar');
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(loggerServiceMock.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'FcException',
          code: 'Y020003',
          stackTrace: expect.any(Array),
        }),
      );
    });

    it('should render error template', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          code: 'Y020003',
          message: 'message text',
        }),
      );
    });

    it('should not log error', () => {
      // Given
      @Loggable(false)
      class ClassMock extends FcException {}
      const exception = new ClassMock('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exceptionFilter['logException'] = jest.fn();
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledTimes(0);
      expect(resMock.render).toHaveBeenCalled();
    });

    it('should log error', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exceptionFilter['logException'] = jest.fn();
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledTimes(1);
      expect(resMock.render).toHaveBeenCalled();
    });

    it('should not render for redirections', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      exception.redirect = true;
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(resMock.render).not.toHaveBeenCalled();
    });

    it('should not call tracking service if isTrackable is not defined', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(0);
      expect(resMock.render).toHaveBeenCalled();
    });

    it('should not call tracking service if isTrackable is defined to false', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;

      const spy = jest.spyOn(Trackable, 'isTrackable');
      spy.mockImplementationOnce(() => false);
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(0);
      expect(resMock.render).toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should call tracking service if isTrackable is defined to true', () => {
      // Given
      const exception = new FcException('message text');
      exception.scope = STUB_ERROR_SCOPE;
      exception.code = STUB_ERROR_CODE;

      const spy = jest.spyOn(Trackable, 'isTrackable');
      spy.mockImplementationOnce(() => true);
      // When
      exceptionFilter.catch(exception, argumentHostMock);
      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledTimes(1);
      expect(trackingServiceMock.track).toHaveBeenCalledWith(TrackableEvent, {
        req: expect.any(Object),
        exception: expect.any(FcException),
      });
      expect(resMock.render).toHaveBeenCalled();

      spy.mockRestore();
    });
  });

  describe('ArgumentHostAdapter()', () => {
    it('should provide a fake argument adapter with switchToHttp method', () => {
      // Given
      const ctx = { res: {}, req: {} };
      // When
      const result = FcExceptionFilter.ArgumentHostAdapter(ctx);
      // Then
      expect(result).toBeDefined();
      expect(typeof result.switchToHttp).toBe('function');
    });

    it('should provide a fake argument adapter with a getResponse method in response to switchToHttp', () => {
      // Given
      const ctx = { res: {} };
      const adapter = FcExceptionFilter.ArgumentHostAdapter(ctx);
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
      const adapter = FcExceptionFilter.ArgumentHostAdapter(ctx);
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
      const httpErrorCodeValueMock = ApiHttpResponseCode.ERROR_CODE_NONE;
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

    it('should return a 500 error code if the status is set to `true`', () => {
      // Given
      const httpErrorCodeValueMock = 500;
      const exceptionParam: ApiErrorParams = {
        res: resMock,
        error: errorValueMock,
        httpResponseCode: httpErrorCodeValueMock,
      };
      // When
      exceptionFilter['errorOutput'](exceptionParam);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(500);
    });
  });
});
