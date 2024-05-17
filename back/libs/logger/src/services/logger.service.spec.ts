import pino, { Logger } from 'pino';

import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';
import { ConfigService } from '@fc/config';
import { SESSION_STORE_KEY } from '@fc/session/tokens';

import { getAsyncLocalStorageMock } from '@mocks/async-local-storage';
import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { LogLevels } from '../enums';
import { LoggerService } from './logger.service';

jest.mock('pino');

describe('LoggerService', () => {
  let service: LoggerService;

  const configMock = {
    threshold: 'debug',
    stdoutLevels: ['notice', 'info', 'debug'],
    stderrLevels: ['emerg', 'alert', 'crit', 'err', 'warning'],
  };
  const configServiceMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const asyncLocalStorageMock = getAsyncLocalStorageMock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    configServiceMock.get.mockReturnValue(configMock);
    jest.mocked(pino).mockReturnValue(loggerMock as unknown as Logger<string>);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, ConfigService, AsyncLocalStorageService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageMock)
      .compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('configure', () => {
    /**
     * 🚨 Due to the use of a constructor, we need to clear counter to properly test the function.
     * Please exerts utmost caution while updating. 🚨
     */
    beforeEach(() => {
      jest.clearAllMocks();

      service['overloadConsole'] = jest.fn();
    });

    it('should retrieve the logger config', () => {
      // When
      service['configure']();

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Logger');
    });

    it('should instantiate pino with the configuration, custom levels', () => {
      // Given
      const expectedOptions = {
        level: configMock.threshold,
        customLevels: service['customLevels'],
        useOnlyCustomLevels: true,
      };

      // When
      service['configure']();

      // Then
      expect(jest.mocked(pino)).toHaveBeenCalledTimes(1);
      expect(jest.mocked(pino)).toHaveBeenCalledWith(expectedOptions);
    });

    it('should overload the console', () => {
      // When
      service['configure']();

      // Then
      expect(service['overloadConsole']).toHaveBeenCalledTimes(1);
      expect(service['overloadConsole']).toHaveBeenCalledWith();
    });

    it('should log a notice that the console logger is overloaded', () => {
      // When
      service['configure']();

      // Then
      expect(loggerMock.notice).toHaveBeenCalledTimes(1);
      expect(loggerMock.notice).toHaveBeenCalledWith(
        'Logger is ready and native console is now overloaded.',
      );
    });
  });

  describe('business', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.BUSINESS;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('emerg', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.EMERGENCY;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('alert', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.ALERT;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('crit', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.CRITICAL;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('err', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.ERROR;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('warning', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.WARNING;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('notice', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.NOTICE;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('info', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.INFO;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('debug', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service['logWithContext'] = jest.fn();
    });

    it('should call the pino logger with the correct level, object and message with arguments', () => {
      // Given
      const level = LogLevels.DEBUG;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];

      // When
      service[level](obj, message, ...args);

      // Then
      expect(service['logWithContext']).toHaveBeenCalledTimes(1);
      expect(service['logWithContext']).toHaveBeenCalledWith(
        level,
        obj,
        message,
        ...args,
      );
    });
  });

  describe('logWithContext', () => {
    const requestMock = {
      foo: 'bar',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      service['getRequestContext'] = jest.fn().mockReturnValue(requestMock);
    });

    it('should call the pino logger with the correct level and arguments when first argument is the message', () => {
      // Given
      const level = LogLevels.DEBUG;
      const message = 'test message';
      const args = ['arg1', 'arg2'];

      // When
      service['logWithContext'](level, message, args[0], args[1]);

      // Then
      expect(loggerMock[level]).toHaveBeenCalledTimes(1);
      expect(loggerMock[level]).toHaveBeenCalledWith(
        requestMock,
        message,
        ...args,
      );
    });

    it('should call the pino logger with the correct level and arguments when first argument is an object', () => {
      // Given
      const level = LogLevels.DEBUG;
      const message = 'test message';
      const obj = { test: 'test' };
      const args = ['arg1', 'arg2'];
      const expectedMessage = {
        ...obj,
        ...requestMock,
      };

      // When
      service['logWithContext'](level, obj, message, args[0], args[1]);

      // Then
      expect(loggerMock[level]).toHaveBeenCalledTimes(1);
      expect(loggerMock[level]).toHaveBeenCalledWith(
        expectedMessage,
        message,
        ...args,
      );
    });

    it('should call the pino logger with the correct level and arguments when first argument is anything other than a string', () => {
      // Given
      const level = LogLevels.DEBUG;
      const message = 'test message';
      const obj = 123;
      const args = ['arg1', 'arg2'];

      // When
      service['logWithContext'](level, obj, message, args[0], args[1]);

      // Then
      expect(loggerMock[level]).toHaveBeenCalledTimes(1);
      expect(loggerMock[level]).toHaveBeenCalledWith(
        requestMock,
        message,
        ...args,
      );
    });
  });

  describe('getRequestContext', () => {
    const requestMock = {
      method: 'GET',
      baseUrl: '/base-url',
      path: '/path',
      headers: {},
    };

    const sessionDataMock = {
      id: 'test-session-id',
    };

    const expectedRequestContext = {
      method: requestMock.method,
      sessionId: sessionDataMock.id,
      path: `${requestMock.baseUrl}${requestMock.path}`,
    };

    it('should retrieve the request context from the async local storage', () => {
      // When
      service['getRequestContext']();

      // Then
      expect(asyncLocalStorageMock.get).toHaveBeenCalledTimes(2);
      expect(asyncLocalStorageMock.get).toHaveBeenNthCalledWith(1, 'request');
      expect(asyncLocalStorageMock.get).toHaveBeenNthCalledWith(
        2,
        SESSION_STORE_KEY,
      );
    });

    it('should return the request context if found', () => {
      // Given
      asyncLocalStorageMock.get
        .mockReturnValueOnce(requestMock)
        .mockReturnValueOnce(sessionDataMock);

      // When
      const requestContext = service['getRequestContext']();

      // Then
      expect(requestContext).toStrictEqual(expectedRequestContext);
    });

    it('should return undefined if no request context is found', () => {
      // Given
      asyncLocalStorageMock.get.mockReturnValueOnce(undefined);

      // When
      const requestContext = service['getRequestContext']();

      // Then
      expect(requestContext).toBeUndefined();
    });

    it('should return the request context with the x-request-id if present', () => {
      // Given
      const headersMock = {
        'x-request-id': 'test-x-request-id',
      };
      const expectedRequestContextWithHeader = {
        ...expectedRequestContext,
        requestId: headersMock['x-request-id'],
      };
      asyncLocalStorageMock.get
        .mockReturnValueOnce({
          ...requestMock,
          headers: headersMock,
        })
        .mockReturnValueOnce(sessionDataMock);

      // When
      const requestContext = service['getRequestContext']();

      // Then
      expect(requestContext).toStrictEqual(expectedRequestContextWithHeader);
    });

    it('should return the request context with the isSuspicious if present', () => {
      // Given
      const headersMock = {
        'x-suspicious': '1',
      };
      const expectedRequestContextWithHeader = {
        ...expectedRequestContext,
        isSuspicious: true,
      };
      asyncLocalStorageMock.get
        .mockReturnValueOnce({
          ...requestMock,
          headers: headersMock,
        })
        .mockReturnValueOnce(sessionDataMock);

      // When
      const requestContext = service['getRequestContext']();

      // Then
      expect(requestContext).toStrictEqual(expectedRequestContextWithHeader);
    });
  });

  describe('overloadConsole', () => {
    it('should overload the console with the logger to the correct level', () => {
      // When
      service['overloadConsole']();

      // Then
      /**
       * We compare the serialized string of the functions because they are bound functions,
       * not the same instance, but are still named the same.
       */
      expect(console.log.toString()).toEqual(
        service[LogLevels.INFO].bind(service).toString(),
      );
      expect(console.info.toString()).toEqual(
        service[LogLevels.NOTICE].bind(service).toString(),
      );
      expect(console.warn.toString()).toEqual(
        service[LogLevels.WARNING].bind(service).toString(),
      );
      expect(console.error.toString()).toEqual(
        service[LogLevels.CRITICAL].bind(service).toString(),
      );
      expect(console.debug.toString()).toEqual(
        service[LogLevels.DEBUG].bind(service).toString(),
      );
      expect(console.trace.toString()).toEqual(
        service[LogLevels.DEBUG].bind(service).toString(),
      );
    });
  });
});
