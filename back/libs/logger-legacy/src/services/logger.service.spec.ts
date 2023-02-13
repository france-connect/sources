import * as os from 'os';
import * as QuickLRU from 'quick-lru';
import * as uuid from 'uuid';

import { ConsoleLogger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { LoggerConfig } from '../dto';
import { LoggerLevelCodes, LoggerLevelNames } from '../enum';
import {
  ILoggerBusinessEvent,
  ILoggerColorParams,
  LoggerTransport,
} from '../interfaces';
import { nestLevelsMap } from '../log-maps.map';
import * as utils from '../utils';
import { LOG_METHODS, LoggerService } from './logger.service';
import { PinoService } from './pino.service';

jest.mock('os');
jest.mock('uuid');
jest.mock('../utils');

describe('LoggerService', () => {
  const libraryNameMock = 'libraryValue';
  const contextMock = 'contextValue';
  const contextClassNameMock = 'contextClassNameValue';

  const transportMock: LoggerTransport = {
    log: jest.fn(),
    trace: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };

  const externalLoggerMock = {
    level: LoggerLevelCodes.INFO,
    transport: transportMock,
  };

  // color: library
  const libraryColorMock: ILoggerColorParams = {
    BACKGROUND_COLOR: '#ab3de9',
    TEXT_COLOR: '#FFFFFF',
  };

  // color: class-method
  const classMethodColorsMock: ILoggerColorParams = {
    BACKGROUND_COLOR: '#EAEAEA',
    TEXT_COLOR: '#222',
  };

  // color: container
  const containerColorsMock: ILoggerColorParams = {
    TEXT_COLOR: '#FFF',
    BACKGROUND_COLOR: '#000',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  let service: LoggerService;
  let setContainerColorsMock: jest.SpyInstance;
  const ipMock = '123.123.123.123';
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123, 124.124.124.124';

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    setContainerColorsMock = jest.spyOn<LoggerService, any>(
      LoggerService.prototype,
      'setContainerColors',
    );

    setContainerColorsMock.mockReturnValueOnce(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, ConfigService, PinoService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(PinoService)
      .useValue(externalLoggerMock)
      .compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have defined colors container', () => {
    expect(setContainerColorsMock).toHaveBeenCalledTimes(1);
    expect(setContainerColorsMock).toHaveBeenCalledWith();
  });

  describe('onModuleInit()', () => {
    let isDevMock: jest.SpyInstance;
    let overrideNativeMock: jest.SpyInstance;

    beforeEach(() => {
      isDevMock = jest.spyOn<LoggerService, any>(service, 'isDev');
      overrideNativeMock = jest.spyOn<LoggerService, any>(
        service,
        'overrideNativeConsole',
      );
      overrideNativeMock.mockReturnValueOnce(void 0);
    });

    it('should not override native console in development mode', () => {
      // Given
      isDevMock.mockReturnValueOnce(true);
      // When
      service.onModuleInit();
      // Then
      expect(isDevMock).toHaveBeenCalledTimes(1);
      expect(overrideNativeMock).toHaveBeenCalledTimes(0);
    });

    it('should override native console in production mode', () => {
      // Given
      isDevMock.mockReturnValueOnce(false);
      // When
      service.onModuleInit();
      // Then
      expect(isDevMock).toHaveBeenCalledTimes(1);
      expect(overrideNativeMock).toHaveBeenCalledTimes(1);
      expect(overrideNativeMock).toHaveBeenCalledWith();
    });
  });

  describe('getIdentifiedLog()', () => {
    const uuidMock = 'uuidMockValue';
    beforeEach(() => {
      uuid.v4.mockReturnValue(uuidMock);
    });

    it('should add a `logId` property', () => {
      // Given
      const logMock = { foo: 'fooValue' };
      // When
      const result = service['getIdentifiedLog'](logMock);
      // Then
      expect(result).toEqual({
        foo: 'fooValue',
        logId: uuidMock,
      });
    });

    it('should override an existing `logId` property', () => {
      // Given
      const logMock = { foo: 'fooValue', logId: 'existingValue' };
      // When
      const result = service['getIdentifiedLog'](logMock);
      // Then
      expect(result).toEqual({
        foo: 'fooValue',
        logId: uuidMock,
      });
    });
  });

  describe('internalLogger()', () => {
    let logSuperMock: jest.SpyInstance;

    const level = LoggerLevelNames.LOG;
    const message = 'messageValue';

    beforeEach(() => {
      logSuperMock = jest.spyOn<ConsoleLogger, any>(
        ConsoleLogger.prototype,
        LoggerLevelNames.LOG,
      );
      logSuperMock.mockReturnValueOnce(void 0);
    });

    it('should call log function with log message only because context is missing falsy', () => {
      // When
      service['internalLogger'](level, message);
      // Then
      expect(logSuperMock).toHaveBeenCalledTimes(1);
      expect(logSuperMock).toHaveBeenCalledWith(message);
    });

    it('should call Log function with log and context', () => {
      // When
      service['internalLogger'](level, message, contextMock);
      // Then
      expect(logSuperMock).toHaveBeenCalledTimes(1);
      expect(logSuperMock).toHaveBeenCalledWith(message, contextMock);
    });
  });

  describe('canLog()', () => {
    it('can log if required level is greater than the logger level', () => {
      // When
      const result = service['canLog'](LoggerLevelNames.WARN);

      // Then
      expect(result).toBe(true);
    });

    it('can log if required level is equal to the logger level', () => {
      // When
      const result = service['canLog'](LoggerLevelNames.INFO);

      // Then
      expect(result).toBe(true);
    });

    it("can't log if required level is less than the logger level", () => {
      // When
      const result = service['canLog'](LoggerLevelNames.TRACE);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('isDev()', () => {
    it('should load the configuration file.', () => {
      // Given
      const configMock: Partial<LoggerConfig> = { isDevelopment: true };
      configServiceMock.get.mockReturnValue(configMock);
      // When
      const isDevResult = service['isDev']();
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Logger');
      expect(configServiceMock.get).toHaveReturnedWith(configMock);
      expect(isDevResult).toEqual(true);
    });
  });

  describe('isOutputTrace()', () => {
    let isDevMock: jest.SpyInstance;

    beforeEach(() => {
      isDevMock = jest.spyOn<LoggerService, any>(service, 'isDev');
    });

    it('should return true if dev mode is activated', () => {
      // Given
      isDevMock.mockReturnValueOnce(true);
      // Then
      const result = service['isOutputTrace']();
      // When
      expect(result).toBe(true);
    });

    it('should return false if dev mode is not activated', () => {
      // Given
      isDevMock.mockReturnValueOnce(false);
      // When
      const result = service['isOutputTrace']();
      // Then
      expect(result).toBe(false);
    });
  });

  describe('technicalLogger()', () => {
    let canLogMock: jest.SpyInstance;
    let isDevMock: jest.SpyInstance;
    let stringifyMock: jest.SpyInstance;
    let internalLoggerMock: jest.SpyInstance;

    const stringifyResult = '{"tech":"nical"}';
    const message = { tech: 'nical' };
    const level = LoggerLevelNames.ERROR;

    beforeEach(() => {
      canLogMock = jest.spyOn<LoggerService, any>(service, 'canLog');
      canLogMock.mockReturnValueOnce(true);

      isDevMock = jest.spyOn<LoggerService, any>(service, 'isDev');
      isDevMock.mockReturnValue(false);

      stringifyMock = jest.spyOn<JSON, any>(JSON, 'stringify');
      stringifyMock.mockReturnValueOnce(stringifyResult);

      internalLoggerMock = jest.spyOn<LoggerService, any>(
        service,
        'internalLogger',
      );
      internalLoggerMock.mockReturnValue(void 0);
    });

    it("should do nothing if we can't log", () => {
      // Given
      canLogMock.mockReset().mockReturnValueOnce(false);
      // When
      service['technicalLogger'](level, message, contextMock);

      // Then
      expect(canLogMock).toHaveBeenCalledTimes(1);
      expect(internalLoggerMock).toHaveBeenCalledTimes(0);
    });

    it('should emit a warning if stringify fails and log original input', () => {
      // Given
      const errorMock = new Error('Unknown Error');
      stringifyMock.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      service['technicalLogger'](level, message, contextMock);

      // Then
      expect(stringifyMock).toHaveBeenCalledTimes(1);
      expect(stringifyMock).toHaveBeenCalledWith(message);

      expect(internalLoggerMock).toHaveBeenCalledTimes(2);
      expect(internalLoggerMock).toHaveBeenCalledWith(
        nestLevelsMap.warn,
        'could not JSON stringify a log',
        contextMock,
      );
      expect(internalLoggerMock).toHaveBeenCalledWith(
        level,
        message,
        contextMock,
      );
    });

    it('should stringify the output', () => {
      // Given

      // When
      service['technicalLogger'](level, message, contextMock);
      // Then
      expect(stringifyMock).toHaveBeenCalledTimes(1);
      expect(stringifyMock).toHaveBeenCalledWith(message);

      expect(internalLoggerMock).toHaveBeenCalledTimes(1);
      expect(internalLoggerMock).toHaveBeenCalledWith(
        level,
        stringifyResult,
        contextMock,
      );
    });

    it('should not emit a warning in dev mode if log failed to be stringified', () => {
      // Given
      isDevMock.mockReset().mockReturnValueOnce(true);

      const errorMock = new Error('Unknown Error');
      stringifyMock.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      service['technicalLogger'](level, message, contextMock);

      // Then
      expect(stringifyMock).toHaveBeenCalledTimes(0);

      expect(internalLoggerMock).toHaveBeenCalledTimes(1);
      expect(internalLoggerMock).toHaveBeenCalledWith(
        level,
        message,
        contextMock,
      );
    });
  });

  describe('businessLogger()', () => {
    let traceMock: jest.SpyInstance;
    let canLogMock: jest.SpyInstance;
    let identifiedLogMock: jest.SpyInstance;

    const levelMock = LoggerLevelNames.TRACE;
    const message = { foo: 'bar' };
    const identifiedLog = { logId: 'bar' };

    beforeEach(() => {
      canLogMock = jest.spyOn<LoggerService, any>(service, 'canLog');
      traceMock = jest.spyOn<LoggerService, any>(service, 'trace');
      traceMock.mockReturnValueOnce(void 0);

      identifiedLogMock = jest.spyOn<LoggerService, any>(
        service,
        'getIdentifiedLog',
      );
      identifiedLogMock.mockReturnValueOnce(identifiedLog);
    });

    it('should trace log message with context', () => {
      // Given
      canLogMock.mockReturnValueOnce(false);
      // When
      service['businessLogger'](levelMock, message, contextMock);
      // Then
      expect(traceMock).toHaveBeenCalledTimes(1);
      expect(traceMock).toHaveBeenCalledWith(
        { log: message, context: contextMock },
        levelMock,
      );
      expect(canLogMock).toHaveBeenCalledTimes(1);

      expect(identifiedLogMock).toHaveBeenCalledTimes(0);
      expect(transportMock[levelMock]).toHaveBeenCalledTimes(0);
    });

    it('should add id to output log', () => {
      // Given
      canLogMock.mockReturnValueOnce(true);
      // When
      service['businessLogger'](levelMock, message, contextMock);

      // Then
      expect(identifiedLogMock).toHaveBeenCalledTimes(1);
      expect(identifiedLogMock).toHaveBeenCalledWith(message);
    });

    it('should trace and output log ', () => {
      // Given
      canLogMock.mockReturnValueOnce(true);

      // Then
      service['businessLogger'](levelMock, message, contextMock);

      // When
      expect(traceMock).toHaveBeenCalledTimes(1);

      expect(transportMock[levelMock]).toHaveBeenCalledTimes(1);
      expect(transportMock[levelMock]).toHaveBeenCalledWith(identifiedLog);
    });
  });

  describe('overrideNativeConsole()', () => {
    type LogMock = Record<string, jest.SpyInstance>;

    const data = ['am', 'stram', 'gram'];
    const result = data.join('\n');
    const context = 'Native Console';
    const consoleMock: LogMock = {};
    const serviceMock: LogMock = {};
    const backup: LogMock = {};

    beforeEach(() => {
      /**
       * @Note we have to restore all method of native console after the tested code is runned.
       *
       * The tested code affects all listed methods every time it is called so we can not achieve
       * a clean reset within a simple `test.each()`.
       */
      LOG_METHODS.forEach((method) => {
        consoleMock[method] = jest.spyOn<Console, any>(console, method);
        serviceMock[method] = jest.spyOn<LoggerService, any>(service, method);
        serviceMock[method].mockReturnValue(void 0);

        backup[method] = console[method];
      });
    });

    afterEach(() => {
      LOG_METHODS.forEach((method) => {
        console[method] = backup[method];
      });
    });

    it('should override native `console.log` and call service.log instead', () => {
      // Given

      service['overrideNativeConsole']();

      // When
      console.log(...data);

      // Then
      expect(serviceMock.log).toHaveBeenCalledTimes(1);
      expect(serviceMock.log).toHaveBeenCalledWith(result, context);
      expect(consoleMock.log).toHaveBeenCalledTimes(0);
    });

    it('should override native `console.error` and call service.error instead', () => {
      // Given

      service['overrideNativeConsole']();

      // When
      console.error(...data);

      // Then
      expect(serviceMock.error).toHaveBeenCalledTimes(1);
      expect(serviceMock.error).toHaveBeenCalledWith(result, context);
      expect(consoleMock.error).toHaveBeenCalledTimes(0);
    });

    it('should override native `console.debug` and call service.debug instead', () => {
      // Given

      service['overrideNativeConsole']();

      // When
      console.debug(...data);

      // Then
      expect(serviceMock.debug).toHaveBeenCalledTimes(1);
      expect(serviceMock.debug).toHaveBeenCalledWith(result, context);
      expect(consoleMock.debug).toHaveBeenCalledTimes(0);
    });

    it('should override native `console.info` and call service.info instead', () => {
      // Given

      service['overrideNativeConsole']();

      // When
      console.info(...data);

      // Then
      expect(serviceMock.info).toHaveBeenCalledTimes(1);
      expect(serviceMock.info).toHaveBeenCalledWith(result, context);
      expect(consoleMock.info).toHaveBeenCalledTimes(0);
    });

    it('should override native `console.warn` and call service.warn instead', () => {
      // Given

      service['overrideNativeConsole']();

      // When
      console.warn(...data);

      // Then
      expect(serviceMock.warn).toHaveBeenCalledTimes(1);
      expect(serviceMock.warn).toHaveBeenCalledWith(result, context);
      expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    });
  });

  describe('log()', () => {
    let isDevMock: jest.SpyInstance;
    let technicalLoggerMock: jest.SpyInstance;
    const messageMock = 'logValue';

    beforeEach(() => {
      isDevMock = jest.spyOn<LoggerService, any>(service, 'isDev');
      technicalLoggerMock = jest.spyOn<LoggerService, any>(
        service,
        'technicalLogger',
      );
    });
    it('Should call only internalLogger when level: log and dev: true', () => {
      // Given
      isDevMock.mockReturnValueOnce(true);
      // When
      service.log(messageMock, contextMock);
      // Then
      expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
      expect(technicalLoggerMock).toHaveBeenCalledWith(
        LoggerLevelNames.LOG,
        messageMock,
        contextMock,
      );
    });

    it('Should not call any logger when level: log and dev: false', () => {
      // Given
      isDevMock.mockReturnValueOnce(false);
      // When
      service.log(messageMock);
      // Then
      expect(technicalLoggerMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('LoggerAdapter Level', () => {
    let technicalLoggerMock: jest.SpyInstance;
    const message = 'logValue';

    beforeEach(() => {
      technicalLoggerMock = jest.spyOn<LoggerService, any>(
        service,
        'technicalLogger',
      );
      technicalLoggerMock.mockReturnValueOnce(void 0);
    });

    describe('verbose()', () => {
      it('Should call technicalLogger with verbose level', () => {
        // When
        service.verbose(message, contextMock);
        // Then
        expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
        expect(technicalLoggerMock).toHaveBeenCalledWith(
          LoggerLevelNames.VERBOSE,
          message,
          contextMock,
        );
      });
    });

    describe('debug()', () => {
      it('Should call technicalLogger with  level', () => {
        // When
        service.debug(message, contextMock);
        // Then
        expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
        expect(technicalLoggerMock).toHaveBeenCalledWith(
          LoggerLevelNames.DEBUG,
          message,
          contextMock,
        );
      });
    });

    describe('info()', () => {
      it('Should call technicalLogger with info level', () => {
        // When
        service.info(message, contextMock);
        // Then
        expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
        expect(technicalLoggerMock).toHaveBeenCalledWith(
          LoggerLevelNames.INFO,
          message,
          contextMock,
        );
      });
    });

    describe('warn()', () => {
      it('Should call technicalLogger with warn level', () => {
        // When
        service.warn(message, contextMock);
        // Then
        expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
        expect(technicalLoggerMock).toHaveBeenCalledWith(
          LoggerLevelNames.WARN,
          message,
          contextMock,
        );
      });
    });

    describe('error()', () => {
      it('Should call technicalLogger with error level', () => {
        // When
        service.error(message, contextMock);
        // Then
        expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
        expect(technicalLoggerMock).toHaveBeenCalledWith(
          LoggerLevelNames.ERROR,
          message,
          contextMock,
        );
      });
    });

    describe('fatal()', () => {
      it('Should call technicalLogger with fatal level', () => {
        // When
        service.fatal(message, contextMock);
        // Then
        expect(technicalLoggerMock).toHaveBeenCalledTimes(1);
        expect(technicalLoggerMock).toHaveBeenCalledWith(
          LoggerLevelNames.FATAL,
          message,
          contextMock,
        );
      });
    });
  });

  describe('businessEvent()', () => {
    let businessLoggerMock: jest.SpyInstance;
    const message: ILoggerBusinessEvent = {
      category: 'categorValue',
      event: 'eventValue',
      ip: ipMock,
      source: {
        address: ipMock,
        port: sourcePortMock,
        // logs filter and analyses need this format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        original_addresses: xForwardedForOriginalMock,
      },
    };

    beforeEach(() => {
      businessLoggerMock = jest.spyOn<LoggerService, any>(
        service,
        'businessLogger',
      );
      businessLoggerMock.mockReturnValueOnce(void 0);
    });

    it('should call business logger with info level', () => {
      // When
      service.businessEvent(message, contextMock);

      // Then
      expect(businessLoggerMock).toHaveBeenCalledTimes(1);
      expect(businessLoggerMock).toHaveBeenCalledWith(
        LoggerLevelNames.INFO,
        message,
        contextMock,
      );
    });
  });

  describe('setContainerColors()', () => {
    let osHostnameMock: jest.SpyInstance;
    let getColorsFromTextMock: jest.SpyInstance;
    const containerNameMock = 'containerValue';
    const containerColorsMock = 'containerColorsValue';

    beforeEach(() => {
      osHostnameMock = jest.spyOn<any, any>(os, 'hostname');
      osHostnameMock.mockReturnValueOnce(containerNameMock);

      getColorsFromTextMock = jest.spyOn<typeof utils, any>(
        utils,
        'getColorsFromText',
      );
      getColorsFromTextMock.mockReturnValueOnce(containerColorsMock);
    });

    it('should call `os.hostname()` to get the container name', () => {
      // When
      service['setContainerColors']();
      // Then
      expect(osHostnameMock).toHaveBeenCalledTimes(1);
      expect(osHostnameMock).toHaveBeenCalledWith();

      expect(service['containerName']).toEqual(containerNameMock);
    });

    it('should call `getColorsFromTextMock()` with the container name', () => {
      // When
      service['setContainerColors']();
      // Then
      expect(getColorsFromTextMock).toHaveBeenCalledTimes(1);
      expect(getColorsFromTextMock).toHaveBeenCalledWith(containerNameMock);
      expect(service['containerColors']).toEqual(containerColorsMock);
    });

    it('should get n/a as name of container if os.hostname failed', () => {
      // Given
      osHostnameMock.mockReset().mockReturnValueOnce(undefined);
      // When
      service['setContainerColors']();
      // Then
      expect(osHostnameMock).toHaveBeenCalledTimes(1);
      expect(osHostnameMock).toHaveBeenCalledWith();

      expect(service['containerName']).toEqual('n/a');
    });
  });

  describe('setLibraryColors()', () => {
    it('should store a loggerConstants in a local Array according to the current lib', () => {
      // When
      service['setLibraryColors'](libraryColorMock);
      // Then
      expect(service['libraryColors']).toStrictEqual(libraryColorMock);
    });
  });

  describe('getColorsFromLibrary()', () => {
    let cacheGetMock: jest.SpyInstance;
    let cacheSetMock: jest.SpyInstance;
    let getColorsFromTextMock: jest.SpyInstance;

    describe('in cache', () => {
      beforeEach(() => {
        const cache = service['cache'];
        cacheGetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'get');
        cacheGetMock.mockReturnValueOnce(libraryColorMock);

        cacheSetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'set');
        cacheSetMock.mockReturnValueOnce(void 0);
      });
      it('should get colors from libraryName', () => {
        // When
        const result = service['getColorsFromLibrary'](libraryNameMock);
        // Then
        expect(result).toStrictEqual(libraryColorMock);
      });

      it('should extract colors from cache with the name', () => {
        // When
        service['getColorsFromLibrary'](libraryNameMock);

        // Then
        expect(cacheGetMock).toHaveBeenCalledTimes(1);
        expect(cacheGetMock).toHaveBeenCalledWith(libraryNameMock);

        expect(cacheSetMock).toHaveBeenCalledTimes(0);
      });
    });

    describe('not in cache', () => {
      beforeEach(() => {
        const cache = service['cache'];
        cacheGetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'get');
        cacheGetMock.mockReturnValue(undefined);

        cacheSetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'set');
        cacheSetMock.mockReturnValueOnce(void 0);
        getColorsFromTextMock = jest.spyOn<typeof utils, any>(
          utils,
          'getColorsFromText',
        );
        getColorsFromTextMock.mockReturnValueOnce(libraryColorMock);
      });

      it('should extract colors from text if not present in cache', () => {
        // When
        const result = service['getColorsFromLibrary'](libraryNameMock);
        // Then
        expect(cacheGetMock).toHaveBeenCalledTimes(1);
        expect(getColorsFromTextMock).toHaveBeenCalledTimes(1);
        expect(getColorsFromTextMock).toHaveBeenCalledWith(libraryNameMock);

        expect(result).toStrictEqual(libraryColorMock);
      });

      it('should save new extracted colors in cache', () => {
        // When
        service['getColorsFromLibrary'](libraryNameMock);
        // Then
        expect(cacheGetMock).toHaveBeenCalledTimes(1);
        expect(getColorsFromTextMock).toHaveBeenCalledTimes(1);
        expect(cacheSetMock).toHaveBeenCalledTimes(1);
        expect(cacheSetMock).toHaveBeenCalledWith(
          libraryNameMock,
          libraryColorMock,
        );
      });
    });
  });

  describe('setContext()', () => {
    let setContextMock: jest.SpyInstance;
    let getLibraryNameMock: jest.SpyInstance;
    let getColorFromLibraryMock: jest.SpyInstance;
    let setLibraryColorsMock: jest.SpyInstance;

    beforeEach(() => {
      setContextMock = jest.spyOn<ConsoleLogger, any>(
        ConsoleLogger.prototype,
        'setContext',
      );
      setContextMock.mockReturnValue(void 0);

      getLibraryNameMock = jest.spyOn<LoggerService, any>(
        service,
        'getLibraryName',
      );
      getLibraryNameMock.mockReturnValueOnce(libraryNameMock);

      getColorFromLibraryMock = jest.spyOn<LoggerService, any>(
        service,
        'getColorsFromLibrary',
      );
      getColorFromLibraryMock.mockReturnValueOnce(libraryColorMock);

      setLibraryColorsMock = jest.spyOn<LoggerService, any>(
        service,
        'setLibraryColors',
      );
      setLibraryColorsMock.mockResolvedValue(void 0);
    });

    it('should defined context', () => {
      // When
      service.setContext(contextClassNameMock);
      // Then
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith(contextClassNameMock);
    });

    it('should get library name based on context', () => {
      // When
      service.setContext(contextClassNameMock);

      // Then
      expect(getLibraryNameMock).toHaveBeenCalledTimes(1);
      expect(getLibraryNameMock).toHaveBeenCalledWith(contextClassNameMock);
    });

    it('should get Colors from libraryName', () => {
      // When
      service.setContext(contextClassNameMock);
      // Then
      expect(getColorFromLibraryMock).toHaveBeenCalledTimes(1);
      expect(getColorFromLibraryMock).toHaveBeenCalledWith(libraryNameMock);
    });

    it('should call `setLibraryColors()` with the local color object.', () => {
      // when
      service.setContext(contextClassNameMock);
      // Then
      expect(setLibraryColorsMock).toHaveBeenCalledTimes(1);
      expect(setLibraryColorsMock).toHaveBeenCalledWith(libraryColorMock);
    });
  });

  describe('getLibraryName()', () => {
    let cacheGetMock: jest.SpyInstance;
    let cacheSetMock: jest.SpyInstance;

    let slugLibNameMock: jest.SpyInstance;

    beforeEach(() => {
      const cache = service['cache'];
      cacheGetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'get');
    });

    it('should get "logger" as library name if no context is provider', () => {
      // When
      const result = service['getLibraryName']();

      // Then
      expect(result).toEqual('logger');
      expect(cacheGetMock).toHaveBeenCalledTimes(0);
    });

    describe('in cache', () => {
      beforeEach(() => {
        cacheGetMock.mockReturnValueOnce(libraryNameMock);
      });

      it('should get library name from cache', () => {
        // When
        const result = service['getLibraryName'](contextMock);

        // Then
        expect(cacheGetMock).toHaveBeenCalledTimes(1);
        expect(cacheGetMock).toHaveBeenCalledWith(contextMock);

        expect(result).toEqual(libraryNameMock);
      });
    });

    describe('not in cache', () => {
      beforeEach(() => {
        const cache = service['cache'];
        cacheGetMock.mockReturnValue(undefined);

        cacheSetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'set');
        cacheSetMock.mockReturnValue(void 0);

        slugLibNameMock = jest.spyOn<typeof utils, any>(utils, 'slugLibName');
        slugLibNameMock.mockReturnValueOnce(libraryNameMock);
      });

      it('should get library name from context by simplifing it', () => {
        // When
        const result = service['getLibraryName'](contextMock);

        // Then
        expect(cacheGetMock).toHaveBeenCalledTimes(1);

        expect(slugLibNameMock).toHaveBeenCalledTimes(1);
        expect(slugLibNameMock).toHaveBeenCalledWith(contextMock);

        expect(result).toEqual(libraryNameMock);
      });

      it('should save in cache the newly create library name', () => {
        // When
        const result = service['getLibraryName'](contextMock);

        // Then
        expect(cacheGetMock).toHaveBeenCalledTimes(1);

        expect(cacheSetMock).toHaveBeenCalledTimes(1);
        expect(cacheSetMock).toHaveBeenCalledWith(contextMock, libraryNameMock);

        expect(result).toEqual(libraryNameMock);
      });
    });
  });

  describe('getClassMethodColor()', () => {
    it('should return a specific color object if a `Controller` class type is detected', () => {
      // Given
      const classMethodNameMock = 'classNameValueController.mockMethod()';
      // When
      const result = service['getClassMethodColor'](classMethodNameMock);
      // Then
      expect(result).toStrictEqual({
        TEXT_COLOR: '#222',
        BACKGROUND_COLOR: '#88A9FC',
      });
    });

    it('should return a standard color for a specified class type', () => {
      // Given
      const classMethodNameMock = 'classNameValueService.mockMethod()';
      // When
      const result = service['getClassMethodColor'](classMethodNameMock);
      // Then
      expect(result).toStrictEqual(classMethodColorsMock);
    });
  });

  describe('getDebuggerCssColors()', () => {
    // color: time
    const timeColorsMock: ILoggerColorParams = {
      BACKGROUND_COLOR: '#555',
      TEXT_COLOR: '#FFF',
    };

    // array of all color's object.
    const allColors: Array<ILoggerColorParams> = [
      timeColorsMock,
      containerColorsMock,
      libraryColorMock,
      classMethodColorsMock,
    ];

    // convert color object into css string.
    const getStyleFormat: Function = (c: ILoggerColorParams): string => {
      return `font-size: 11px;
font-weight: 400;
margin: 1px;
padding: 2px;
border-radius: 3px;
color: ${c.TEXT_COLOR};
background-color: ${c.BACKGROUND_COLOR};`;
    };

    const colorsCss: string[] = allColors.map((c) => getStyleFormat(c));

    let getStyleMock: jest.SpyInstance;
    let cacheGetMock: jest.SpyInstance;

    beforeEach(() => {
      getStyleMock = jest.spyOn<typeof utils, any>(utils, 'getStyle');
      getStyleMock.mockImplementation((style) => getStyleFormat(style));

      const cache = service['cache'];
      cacheGetMock = jest.spyOn<QuickLRU<string, any>, any>(cache, 'get');
    });

    it('should return an array of css string coresponding to an array of color objects', () => {
      // Given
      cacheGetMock.mockReturnValue(undefined);
      // When
      const result = service['getDebuggerCssColors'](allColors);
      // Then
      expect(result).toEqual(colorsCss);
      expect(getStyleMock).toHaveBeenCalledTimes(4);
      expect(getStyleMock).toHaveBeenNthCalledWith(1, allColors[0]);
      expect(getStyleMock).toHaveBeenNthCalledWith(2, allColors[1]);
      expect(getStyleMock).toHaveBeenNthCalledWith(3, allColors[2]);
      expect(getStyleMock).toHaveBeenNthCalledWith(4, allColors[3]);
    });

    it('should use the cache if the array of color object has already be resolved', () => {
      // Given
      cacheGetMock
        .mockReturnValueOnce(colorsCss[0])
        .mockReturnValueOnce(colorsCss[1])
        .mockReturnValueOnce(colorsCss[2])
        .mockReturnValueOnce(colorsCss[3]);
      // When
      const result = service['getDebuggerCssColors'](allColors);
      // Then
      expect(result).toEqual(colorsCss);
      expect(getStyleMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('getDebuggerMetadata()', () => {
    const dateTimeMock = 'timeValue';
    const containerNameMock = 'containerValue';
    const classMethodNameMock = 'classNameValueController.mockMethod()';

    it('should return a string metadata', () => {
      // Given
      const metadataMock = `%c${dateTimeMock}%c${containerNameMock}%c${libraryNameMock}%c${classMethodNameMock}()`;
      // When
      const result = service['getDebuggerMetadata'](
        dateTimeMock,
        containerNameMock,
        libraryNameMock,
        classMethodNameMock,
      );
      // Then
      expect(result).toBe(metadataMock);
    });
  });

  describe('getConsoleCommand()', () => {
    it('should return a `console.log` function', () => {
      // Given
      const logLevelMock = 'log';
      // When
      const result: Function = service['getConsoleCommand'](logLevelMock);
      // Then
      expect(result.name).toEqual(LoggerLevelNames.LOG);
    });

    it('should return a `console.warn` if `LoggerLevelNames.WARN` argument is provided', () => {
      // Given
      const logLevelMock = LoggerLevelNames.WARN;
      // When
      const result: Function = service['getConsoleCommand'](logLevelMock);
      // Then
      expect(result.name).toEqual(LoggerLevelNames.WARN);
    });

    it('should output a `console.log()` if `LoggerLevelNames` value is unknown', () => {
      // Given
      const logLevelMock = 'logLevelNamesValue';
      // When
      const result: Function = service['getConsoleCommand'](logLevelMock);
      // Then
      expect(result.name).toEqual(LoggerLevelNames.LOG);
    });

    it('should output a `console.log()` if no attributes are provided', () => {
      // When
      const result: Function = service['getConsoleCommand']();
      // Then
      expect(result.name).toEqual(LoggerLevelNames.LOG);
    });
  });

  describe('trace()', () => {
    let outputTraceMock: jest.SpyInstance;
    let getDateTimeSpy: jest.SpyInstance;
    let getLibraryNameSpy: jest.SpyInstance;
    let getClassMethodCallerSpy: jest.SpyInstance;
    let getConsoleCommandSpy: jest.SpyInstance;
    let getDebuggerCssColorsSpy: jest.SpyInstance;
    let getDebuggerMetadataSpy: jest.SpyInstance;
    let getClassMethodColorSpy: jest.SpyInstance;

    let consoleLogSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;

    const message = { foo: 'bar' };
    const dateTimeMock = 'timeValue';
    const containerNameMock = 'containerValue';
    const classMethodNameMock = 'classNameValueController.mockMethod()';
    const metadataMock = `%c${dateTimeMock}%c${containerNameMock}%c${libraryNameMock}%c${classMethodNameMock}()`;
    const allColorsMock = [
      `font-size: 11px;
font-weight: 400;
margin: 1px;
padding: 2px;
border-radius: 3px;
color: #222;
background-color: #FCE444`,
      `font-size: 11px;
font-weight: 400;
margin: 1px;
padding: 2px;
border-radius: 3px;
color: #333;
background-color: #AAAAAA`,
    ];

    beforeEach(() => {
      outputTraceMock = jest.spyOn<LoggerService, any>(
        service,
        'isOutputTrace',
      );
      outputTraceMock.mockReturnValueOnce(true);

      // Date-Time
      getDateTimeSpy = jest.spyOn<typeof utils, any>(utils, 'getDateTime');
      getDateTimeSpy.mockReturnValueOnce(dateTimeMock);

      // Library
      getLibraryNameSpy = jest.spyOn<LoggerService, any>(
        service,
        'getLibraryName',
      );
      getLibraryNameSpy.mockReturnValueOnce(libraryNameMock);

      // Class-Method
      getClassMethodCallerSpy = jest.spyOn<typeof utils, any>(
        utils,
        'getClassMethodCaller',
      );
      getClassMethodCallerSpy.mockReturnValueOnce(classMethodNameMock);

      // Metadata
      getDebuggerMetadataSpy = jest.spyOn<LoggerService, any>(
        service,
        'getDebuggerMetadata',
      );
      getDebuggerMetadataSpy.mockReturnValueOnce(metadataMock);

      getClassMethodColorSpy = jest.spyOn<LoggerService, any>(
        service,
        'getClassMethodColor',
      );
      getClassMethodColorSpy.mockReturnValueOnce(classMethodColorsMock);

      // CSS color
      getDebuggerCssColorsSpy = jest.spyOn<LoggerService, any>(
        service,
        'getDebuggerCssColors',
      );
      getDebuggerCssColorsSpy.mockReturnValueOnce(allColorsMock);

      // ConsoleCommand
      getConsoleCommandSpy = jest.spyOn<LoggerService, any>(
        service,
        'getConsoleCommand',
      );

      consoleLogSpy = jest.spyOn<Console, any>(console, 'log');
      consoleLogSpy.mockReturnValue(void 0);
      consoleWarnSpy = jest.spyOn<Console, any>(console, 'warn');
      consoleWarnSpy.mockReturnValue(void 0);

      getConsoleCommandSpy.mockReturnValue(consoleLogSpy);

      // Force internal propertie's values.
      service['context'] = contextClassNameMock;
      service['containerName'] = containerNameMock;
      service['libraryColors'] = libraryColorMock;
      service['containerColors'] = containerColorsMock;
    });

    it("shouldn't output the logger message if NOT in dev mode.", () => {
      // Given
      outputTraceMock.mockReset().mockReturnValueOnce(false);
      // When
      service.trace(message);
      // Then
      expect(outputTraceMock).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
    });

    it('should call `getDateTime()`', () => {
      // When
      service.trace(message);
      // Then
      expect(getDateTimeSpy).toHaveBeenCalledTimes(1);
      expect(getDateTimeSpy).toHaveBeenCalledWith();
    });

    it('should call `this.getLibraryName()` to get libraryName', () => {
      // When
      service.trace(message);
      // Then
      expect(getLibraryNameSpy).toHaveBeenCalledTimes(1);
      expect(getLibraryNameSpy).toHaveBeenCalledWith(contextClassNameMock);
    });

    it('should call `getClassMethodCaller()`', () => {
      // When
      service.trace(message);
      // Then
      expect(getClassMethodCallerSpy).toHaveBeenCalledTimes(1);
      expect(getClassMethodCallerSpy).toHaveBeenCalledWith();
    });

    it('should call `getDebuggerMetadata()` with all logs metatada', () => {
      // When
      service.trace(message);
      // Then
      expect(getDebuggerMetadataSpy).toHaveBeenCalledTimes(1);
      expect(getDebuggerMetadataSpy).toHaveBeenCalledWith(
        dateTimeMock,
        containerNameMock,
        libraryNameMock,
        classMethodNameMock,
      );
    });

    it('should call `getClassMethodColor()` with class method name', () => {
      // When
      service.trace(message);
      // Then
      expect(getDebuggerMetadataSpy).toHaveBeenCalledTimes(1);
      expect(getDebuggerMetadataSpy).toHaveBeenCalledWith(
        dateTimeMock,
        containerNameMock,
        libraryNameMock,
        classMethodNameMock,
      );
    });

    it('should call `getDebuggerCssColors()` with all colors params', () => {
      // Given
      const allColorsResult = [
        { BACKGROUND_COLOR: '#555', TEXT_COLOR: '#FFF' },
        { TEXT_COLOR: '#FFF', BACKGROUND_COLOR: '#000' },
        { BACKGROUND_COLOR: '#ab3de9', TEXT_COLOR: '#FFFFFF' },
        { BACKGROUND_COLOR: '#EAEAEA', TEXT_COLOR: '#222' },
      ];

      // When
      service.trace(message);
      // Then
      expect(getDebuggerCssColorsSpy).toHaveBeenCalledTimes(1);
      expect(getDebuggerCssColorsSpy).toHaveBeenCalledWith(allColorsResult);
    });

    it('should output a `console.log()` with colors params', () => {
      // When
      service.trace(message);
      // Then
      expect(getConsoleCommandSpy).toHaveBeenCalledTimes(1);
      expect(getConsoleCommandSpy).toHaveBeenCalledWith('log');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        metadataMock,
        allColorsMock[0],
        allColorsMock[1],
        message,
      );
    });

    it('should output a `console.warn()` if `LoggerLevelNames.WARN` argument is provided', () => {
      // Given
      getConsoleCommandSpy.mockReset().mockReturnValueOnce(consoleWarnSpy);

      // When
      service.trace(message, LoggerLevelNames.WARN);
      // Then
      expect(getConsoleCommandSpy).toHaveBeenCalledTimes(1);
      expect(getConsoleCommandSpy).toHaveBeenCalledWith('warn');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        metadataMock,
        allColorsMock[0],
        allColorsMock[1],
        message,
      );
    });
  });
});
