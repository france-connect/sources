import * as os from 'os';
import * as uuid from 'uuid';

import { ConfigService } from '@fc/config';

import { LoggerLevelNames } from './enum';
import { ILoggerColorParams } from './interfaces';
import { nestLevelsMap } from './log-maps.map';
import { LoggerService } from './logger.service';
import * as utils from './utils';

jest.mock('os');
jest.mock('uuid');
jest.mock('./utils');

const dateTimeMock = 'timeValue';
const containerNameMock = 'containerValue';
const libraryNameMock = 'libraryNameValue';
const classMethodNameMock = 'classMethodNameValue';
const metadataMock = `%c${dateTimeMock}%c${containerNameMock}%c${libraryNameMock}%c${classMethodNameMock}()`;

let getColorsFromTextSpy;

const contextObjectMock = { foo: 'bar' };

// color: time
const timeColorsMock: ILoggerColorParams = {
  BACKGROUND_COLOR: '#555',
  TEXT_COLOR: '#FFF',
};

// color: container
const containerColorsMock: ILoggerColorParams = {
  TEXT_COLOR: '#FFF',
  BACKGROUND_COLOR: '#000',
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
const loggerSpecificClassColorsMock = {
  Controller: '#88A9FC',
  Adapter: '#F4D746',
  Handler: '#8ddd8d',
  ExceptionFilter: '#E29191',
};

// array of all color's object.
const allColors: Array<ILoggerColorParams> = [
  timeColorsMock,
  containerColorsMock,
  libraryColorMock,
  classMethodColorsMock,
];

// convert color object into css string.
const getStyleMock: Function = (c: ILoggerColorParams): string => {
  return `font-size: 11px;
font-weight: 400;
margin: 1px;
padding: 2px;
border-radius: 3px;
color: ${c.TEXT_COLOR};
background-color: ${c.BACKGROUND_COLOR};`;
};

const colorsCssMock: string[] = allColors.map((c) => getStyleMock(c));

describe('LoggerService', () => {
  // Generate configs for all levels and dev mode
  const configs: any = { dev: {}, notDev: {} };
  Object.values(LoggerLevelNames).forEach((level) => {
    configs['dev'][level] = {
      path: '/dev/null',
      isDevelopment: true,
      level: level,
    };

    configs['notDev'][level] = {
      path: '/dev/null',
      isDevelopment: false,
      level: level,
    };
  });

  const internalLoggerMock: any = jest.fn();
  const externalLoggerMock: any = {
    info: jest.fn(),
  };

  const businessEventMock = {
    interactionId: 'foo',
    ip: '123.123.123.123',
    step: '1',
    category: 'some category',
    event: 'some event',
    spId: 'sp identifier',
    spName: 'sp Name',
    spAcr: 'eidas3',
    idpId: 'idp identifier',
    idpName: 'Idp Name',
    idpAcr: 'eidas2',
  };

  let configMock = { isDevelopment: true };
  const configServiceMock = {
    get: () => configMock,
  } as unknown as ConfigService;

  const getConfiguredMockedService = (config: any): LoggerService => {
    configMock = config;
    const service = new LoggerService(configServiceMock);

    externalLoggerMock.level = config.level;

    service['internalLogger'] = internalLoggerMock;
    service['externalLogger'] = externalLoggerMock;

    jest.resetAllMocks();
    return service;
  };
  const uuidMock = 'uuidMockValue';

  const consoleLogCommandMock = console.log;
  const consoleWarnCommandMock = console.warn;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    uuid.v4.mockReturnValue(uuidMock);
  });

  describe('isDev()', () => {
    const service = getConfiguredMockedService(configs.dev.log);
    it('should load the configuration file.', () => {
      // Given
      jest.spyOn(configServiceMock, 'get').mockReturnValue(configMock);
      // When
      const isDevMock = service['isDev']();
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Logger');
      expect(configServiceMock.get).toHaveReturnedWith(configMock);
      expect(isDevMock).toStrictEqual(true);
    });
  });

  describe('getIdentifiedLog()', () => {
    const service = getConfiguredMockedService(configs.dev.log);
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

  describe('log()', () => {
    it('Should call only internalLogger when level: log and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
      // When
      service.log('log');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should not call any logger when level: log and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.log);
      // When
      service.log('log');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(0);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('verbose()', () => {
    it('Should call only internalLogger when level: verbose and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.verbose);
      // When
      service.verbose('verbose');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should call only internalLogger when level: verbose and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.verbose);
      // When
      service.verbose('verbose');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('debug()', () => {
    it('Should call only internalLogger when level: debug and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.debug);
      // When
      service.debug('debug');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should call only internalLogger when level: debug and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.debug);
      // When
      service.debug('debug');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('info()', () => {
    it('Should call only internalLogger when level: info and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.info);
      // When
      service.info('info');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should call only internalLogger when level: info and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.info);
      // When
      service.info('info');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('warn()', () => {
    it('Should call only internalLogger when level: warn and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.warn);
      // When
      service.warn('warn');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should call only internalLogger when level: warn and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.warn);
      // When
      service.warn('warn');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('error()', () => {
    it('Should call only internalLogger when level: error and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.error);
      // When
      service.error('error');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should call only internalLogger when level: error and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.error);
      // When
      service.error('error');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('fatal()', () => {
    it('Should call only internalLogger when level: fatal and dev: true', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.fatal);
      // When
      service.fatal('fatal');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('Should call only internalLogger when level: fatal and dev: false', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.fatal);
      // When
      service.fatal('fatal');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });
  });

  describe('technicalLogger()', () => {
    it('should emit a warning if stringify fails and log oiginal input', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.error);
      const message = { a: 'b', selfRef: null };
      message.selfRef = message;
      const context = 'test2';
      const level = LoggerLevelNames.ERROR;
      // When
      service['technicalLogger'](level, message, context);
      // Then
      expect(internalLoggerMock).toHaveBeenCalledTimes(2);
      expect(internalLoggerMock).toHaveBeenCalledWith(
        nestLevelsMap.warn,
        'could not JSON stringify a log',
        context,
      ),
        expect(internalLoggerMock).toHaveBeenCalledWith(
          level,
          message,
          context,
        );
    });

    it('should stringify the output', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.error);
      const message = { foo: 'bar' };
      const context = 'test';
      const level = LoggerLevelNames.ERROR;
      const spy = jest.spyOn(JSON, 'stringify');
      // When
      service['technicalLogger'](level, message, context);
      // Then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(message);
      expect(internalLoggerMock).toHaveBeenCalledTimes(1);
      expect(internalLoggerMock).toHaveBeenCalledWith(
        level,
        '{"foo":"bar"}',
        context,
      );
    });
  });

  describe('businessEvent()', () => {
    let classColorMock;
    it('should call both loggers when in dev mode + trace level', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.trace);
      jest
        .spyOn<any, any>(service, 'getConsoleCommand')
        .mockReturnValue(console.log);
      classColorMock = jest.spyOn<any, any>(service, 'getClassMethodColor');
      classColorMock.mockReturnValue(loggerSpecificClassColorsMock);
      // When
      service.businessEvent(businessEventMock);
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(1);
    });

    it('should call only externalLogger when not in dev mode + trace level', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.trace);
      jest
        .spyOn<any, any>(service, 'getConsoleCommand')
        .mockReturnValue(console.log);
      classColorMock = jest.spyOn<any, any>(service, 'getClassMethodColor');
      classColorMock.mockReturnValue(loggerSpecificClassColorsMock);
      // When
      service.businessEvent(businessEventMock);
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(0);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(1);
    });

    it('should call only externalLogger when not in dev mode + info level', () => {
      // Given
      const service = getConfiguredMockedService(configs.notDev.info);
      jest
        .spyOn<any, any>(service, 'getConsoleCommand')
        .mockReturnValue(console.log);
      classColorMock = jest.spyOn<any, any>(service, 'getClassMethodColor');
      classColorMock.mockReturnValue(loggerSpecificClassColorsMock);
      // When
      service.businessEvent(businessEventMock);
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(0);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(1);
    });

    it('should call only external logger when in dev mode + info level', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.info);
      jest
        .spyOn<any, any>(service, 'getConsoleCommand')
        .mockReturnValue(console.log);
      classColorMock = jest.spyOn<any, any>(service, 'getClassMethodColor');
      classColorMock.mockReturnValue(loggerSpecificClassColorsMock);
      // When
      service.businessEvent(businessEventMock);
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(0);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(1);
    });

    it('should not call external logger when in dev mode + info level', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.debug);
      jest
        .spyOn<any, any>(service, 'getConsoleCommand')
        .mockReturnValue(console.log);
      classColorMock = jest.spyOn<any, any>(service, 'getClassMethodColor');
      classColorMock.mockReturnValue(loggerSpecificClassColorsMock);
      // When
      service['businessLogger'](LoggerLevelNames.TRACE, 'businessEvent');
      // Then
      expect(service['internalLogger']).toHaveBeenCalledTimes(0);
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(0);
    });

    it('should call external logger with result from getIdentifiedLog', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.info);
      const getIdentifiedLogResponseMock = 'getIdentifiedLogResponseMockValue';
      service['getIdentifiedLog'] = jest
        .fn()
        .mockReturnValue(getIdentifiedLogResponseMock);
      jest
        .spyOn<any, any>(service, 'getConsoleCommand')
        .mockReturnValue(console.log);
      classColorMock = jest.spyOn<any, any>(service, 'getClassMethodColor');
      classColorMock.mockReturnValue(loggerSpecificClassColorsMock);
      // When
      service.businessEvent(businessEventMock);
      // Then
      expect(service['externalLogger'].info).toHaveBeenCalledTimes(1);
      expect(service['externalLogger'].info).toHaveBeenCalledWith(
        getIdentifiedLogResponseMock,
      );
    });
  });

  describe('overrideNativeConsole()', () => {
    it('should override native `console.log` and call service.log instead', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
      service['overrideNativeConsole']();
      const messageMock = 'messageMock';
      service.log = jest.fn();
      // Hard coded value in function
      const context = 'Native Console';
      // When
      console.log(messageMock);
      // Then
      expect(service.log).toHaveBeenCalledTimes(1);
      expect(service.log).toHaveBeenCalledWith(messageMock, context);
    });
  });

  describe('setContainerColors()', () => {
    let service;
    let osHosnameSpy;

    beforeEach(() => {
      service = getConfiguredMockedService(configs.dev.log);

      osHosnameSpy = jest.spyOn<any, any>(os, 'hostname');
      osHosnameSpy.mockResolvedValueOnce(containerNameMock);
    });

    it('should call `os.hostname()` to get the container name', () => {
      // When
      service['setContainerColors']();
      // Then
      expect(osHosnameSpy).toHaveBeenCalledTimes(1);
      expect(osHosnameSpy).toHaveBeenCalledWith();
    });

    it('should call `getColorsFromTextMock()` with the container name', () => {
      // Given
      getColorsFromTextSpy = jest.spyOn<any, any>(utils, 'getColorsFromText');
      getColorsFromTextSpy.mockReturnValueOnce(containerColorsMock);
      service['containerColors'] = containerColorsMock;
      // When
      service['setContainerColors']();
      // Then
      expect(getColorsFromTextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getLibraryName()', () => {
    it('should return a string value for `libraryName` from a context class name', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
      const contextMock = 'contextValue';
      const libraryNameMock = 'libraryNameValue';
      const slugLibNameSpy = jest.spyOn<any, any>(utils, 'slugLibName');
      slugLibNameSpy.mockReturnValueOnce(libraryNameMock);
      // When
      const result = service['getLibraryName'](contextMock);
      // Then
      expect(slugLibNameSpy).toHaveBeenCalledTimes(1);
      expect(slugLibNameSpy).toHaveBeenCalledWith(contextMock);
      expect(result).toStrictEqual(libraryNameMock);
    });

    it('should use the cache value if it has already been resolved', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
      const contextMock = 'contextValue';
      const cacheHasMock = true;
      const cacheHasSpy = jest.spyOn<any, any>(service['cache'], 'has');
      cacheHasSpy.mockReturnValue(cacheHasMock);
      const cacheGetSpy = jest.spyOn<any, any>(service['cache'], 'get');
      const slugLibNameSpy = jest.spyOn<any, any>(utils, 'slugLibName');
      // When
      service['getLibraryName'](contextMock);
      // Then
      expect(slugLibNameSpy).toHaveBeenCalledTimes(0);
      expect(cacheHasSpy).toHaveBeenCalledTimes(1);
      expect(cacheGetSpy).toHaveBeenCalledTimes(1);
      expect(cacheGetSpy).toHaveBeenCalledWith(contextMock);
    });
  });

  describe('setLibraryColors()', () => {
    it('should store a loggerConstants in a local Array according to the current lib', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
      // When
      service['setLibraryColors'](libraryColorMock);
      // Then
      expect(service['libraryColors']).toBe(libraryColorMock);
    });
  });

  describe('getClassMethodColor()', () => {
    it('should return a specific color object if a `Controller` class type is detected', () => {
      // Given
      const currentClassNameMock = 'Controller';
      const classMethodNameMock = 'classNameValueController.mockMethod()';
      const service = getConfiguredMockedService(configs.dev.log);
      // When
      const result = service['getClassMethodColor'](classMethodNameMock);
      // Then
      expect(result).toStrictEqual({
        ...classMethodColorsMock,
        BACKGROUND_COLOR: loggerSpecificClassColorsMock[currentClassNameMock],
      });
    });

    it('should return a standard color for a specified class type', () => {
      // Given
      const classMethodNameMock = 'classNameValueService.mockMethod()';
      const service = getConfiguredMockedService(configs.dev.log);
      // When
      const result = service['getClassMethodColor'](classMethodNameMock);
      // Then
      expect(result).toStrictEqual(classMethodColorsMock);
    });
  });

  describe('setContext()', () => {
    let service;
    const contextClassNameMock = 'contextClassNameValue';

    beforeEach(() => {
      getColorsFromTextSpy = jest.spyOn<any, any>(utils, 'getColorsFromText');
      getColorsFromTextSpy.mockReturnValueOnce(libraryColorMock);

      service = getConfiguredMockedService(configs.dev.log);
    });

    it('should get the color object of type `ILoggerColorParams` accordingly to the library name.', () => {
      // when
      service.setContext(contextClassNameMock);
      // Then
      expect(getColorsFromTextSpy).toHaveBeenCalledTimes(1);
    });

    it('should call `this.getLibraryName()` to get libraryName', () => {
      // Given
      const getLibraryNameSpy = jest.spyOn<any, any>(service, 'getLibraryName');
      getLibraryNameSpy.mockReturnValueOnce(libraryNameMock);
      // When
      service.setContext(contextClassNameMock);
      // Then
      expect(getLibraryNameSpy).toHaveBeenCalledTimes(1);
      expect(getLibraryNameSpy).toHaveBeenCalledWith(contextClassNameMock);
    });

    it('should use the cache if the `libraryName` has already been resolved', () => {
      // Given
      const cacheHasMock = true;
      const cacheHasSpy = jest.spyOn<any, any>(service['cache'], 'has');
      cacheHasSpy.mockReturnValue(cacheHasMock);
      const cacheGetSpy = jest.spyOn<any, any>(service['cache'], 'get');
      // When
      service.setContext(contextClassNameMock);
      // Then
      expect(cacheHasSpy).toHaveBeenCalledTimes(2);
      expect(cacheGetSpy).toHaveBeenCalledTimes(2);
      expect(cacheGetSpy).toHaveBeenCalledWith(contextClassNameMock);
    });

    it('should call `setLibraryColors()` with the local color object.', () => {
      // Given
      service['setLibraryColors'] = jest.fn();
      // when
      service.setContext(contextClassNameMock);
      // Then
      expect(service['setLibraryColors']).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDebuggerCssColors()', () => {
    it('should return an array of css string coresponding to an array of color objects', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
      const colorsCss: string[] = allColors.map((c) => getStyleMock(c));
      const getStyleSpy = jest.spyOn<any, any>(utils, 'getStyle');
      getStyleSpy.mockImplementation((c) => getStyleMock(c));
      // When
      const result = service['getDebuggerCssColors'](allColors);
      // Then
      expect(result).toEqual(colorsCss);
    });

    it('should use the cache if the array of color object has already be resolved', () => {
      // Given
      const cacheHasMock = true;
      const service = getConfiguredMockedService(configs.dev.log);
      const cacheHasSpy = jest.spyOn<any, any>(service['cache'], 'has');
      cacheHasSpy.mockReturnValue(cacheHasMock);
      const cacheGetSpy = jest.spyOn<any, any>(service['cache'], 'get');
      // When
      service['getDebuggerCssColors'](allColors);
      // Then
      expect(cacheHasSpy).toHaveBeenCalledTimes(4);
      expect(cacheGetSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe('getDebuggerMetadata()', () => {
    it('should return a string metadata', () => {
      // Given
      const service = getConfiguredMockedService(configs.dev.log);
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
    let service;

    beforeEach(() => {
      service = getConfiguredMockedService(configs.dev.log);
    });

    it('should return a `console.log` Function', () => {
      // Given
      const logLevelMock = 'log';
      // When
      const result: Function = service['getConsoleCommand'](logLevelMock);
      // Then
      expect(result.name).toBeDefined();
    });

    it('should return a `console.warn` if `LoggerLevelNames.WARN` argument is provided', () => {
      // Given
      const logLevelMock = 'warn';
      // When
      const result: Function = service['getConsoleCommand'](logLevelMock);
      // Then
      expect(result.name).toBeDefined();
    });

    it('should output a `console.log()` if `LoggerLevelNames` value is unknown', () => {
      // Given
      const logLevelMock = 'logLevelNamesValue';
      // When
      const result: Function = service['getConsoleCommand'](logLevelMock);
      // Then
      expect(result.name).toBeDefined();
    });

    it('should output a `console.log()` if no attributes are provided', () => {
      // When
      const result: Function = service['getConsoleCommand']();
      // Then
      expect(result.name).toBeDefined();
    });
  });

  describe('trace()', () => {
    let getDateTimeSpy;
    let getLibraryNameSpy;
    let getClassMethodCallerSpy;
    let getConsoleCommandSpy;
    let getDebuggerCssColorsSpy;
    let getDebuggerMetadataSpy;

    let consoleLogSpy;
    let consoleWarnSpy;

    let service;

    beforeEach(() => {
      service = getConfiguredMockedService(configs.dev.log);

      // Date-Time
      getDateTimeSpy = jest.spyOn<any, any>(utils, 'getDateTime');
      getDateTimeSpy.mockReturnValueOnce(dateTimeMock);

      // Library
      getLibraryNameSpy = jest.spyOn<any, any>(service, 'getLibraryName');

      // Class-Method
      getClassMethodCallerSpy = jest.spyOn<any, any>(
        utils,
        'getClassMethodCaller',
      );
      getClassMethodCallerSpy.mockReturnValueOnce(classMethodNameMock);

      // CSS color
      getDebuggerCssColorsSpy = jest.spyOn<any, any>(
        service,
        'getDebuggerCssColors',
      );

      // Metadata
      getDebuggerMetadataSpy = jest.spyOn<any, any>(
        service,
        'getDebuggerMetadata',
      );

      // ConsoleCommand
      getConsoleCommandSpy = jest.spyOn<any, any>(service, 'getConsoleCommand');

      consoleLogSpy = jest.spyOn<any, any>(console, 'log');
      consoleWarnSpy = jest.spyOn<any, any>(console, 'warn');

      service['libraryColors'] = libraryColorMock;
    });

    it("should'nt output the logger message if NOT in dev mode.", () => {
      // Given
      service = getConfiguredMockedService(configs.notDev.info);
      // When
      service.trace(contextObjectMock);
      // Then
      expect(consoleLogSpy).toHaveBeenCalledTimes(0);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
    });

    it('should call `getDateTime()`', () => {
      // When
      service.trace(contextObjectMock);
      // Then
      expect(getDateTimeSpy).toHaveBeenCalledTimes(1);
      expect(getDateTimeSpy).toHaveBeenCalledWith();
    });

    it('should call `this.getLibraryName()` to get libraryName', () => {
      // Given
      const contextClassNameMock = 'contextClassNameValue';
      const libraryNameMock = 'libraryNameValue';
      getLibraryNameSpy.mockReturnValueOnce(libraryNameMock);
      service['context'] = contextClassNameMock;
      // When
      service.trace(contextObjectMock);
      // Then
      expect(getLibraryNameSpy).toHaveBeenCalledTimes(1);
      expect(getLibraryNameSpy).toHaveBeenCalledWith(contextClassNameMock);
    });

    it('should call `getClassMethodCaller()`', () => {
      // Given
      getConsoleCommandSpy.mockReturnValue(consoleLogCommandMock);
      // When
      service.trace(contextObjectMock);
      // Then
      expect(getClassMethodCallerSpy).toHaveBeenCalledTimes(1);
      expect(getClassMethodCallerSpy).toHaveBeenCalledWith();
    });

    it('should output a `console.log()` with the right colors', () => {
      // Given
      getDebuggerCssColorsSpy.mockReturnValueOnce(colorsCssMock);
      getDebuggerMetadataSpy.mockReturnValueOnce(metadataMock);
      getConsoleCommandSpy.mockReturnValue(consoleLogCommandMock);
      // When
      service.trace(contextObjectMock);
      // Then
      expect(getConsoleCommandSpy).toHaveBeenCalledTimes(1);
      expect(getConsoleCommandSpy).toHaveBeenCalledWith('log');
    });

    it('should output a `console.warn()` if `LoggerLevelNames.WARN` argument is provided', () => {
      // Given
      getDebuggerCssColorsSpy.mockReturnValueOnce(colorsCssMock);
      getDebuggerMetadataSpy.mockReturnValueOnce(metadataMock);
      getConsoleCommandSpy.mockReturnValueOnce(consoleWarnCommandMock);
      // When
      service.trace(contextObjectMock, LoggerLevelNames.WARN);
      // Then
      expect(getConsoleCommandSpy).toHaveBeenCalledTimes(1);
      expect(getConsoleCommandSpy).toHaveBeenCalledWith('warn');
    });

    it('should output a `console.log()` if `LoggerLevelNames` value is unknown', () => {
      // Gien
      const logLevelNamesMock = 'logLevelNamesValue';
      getDebuggerCssColorsSpy.mockReturnValueOnce(colorsCssMock);
      getDebuggerMetadataSpy.mockReturnValueOnce(metadataMock);
      getConsoleCommandSpy.mockReturnValueOnce(consoleLogCommandMock);
      // When
      service.trace(contextObjectMock, logLevelNamesMock);
      // Then
      expect(getConsoleCommandSpy).toHaveBeenCalledTimes(1);
      expect(getConsoleCommandSpy).toHaveBeenCalledWith(logLevelNamesMock);
    });
  });
});
