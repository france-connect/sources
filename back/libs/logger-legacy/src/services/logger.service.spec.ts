import * as uuid from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { NestLoggerService } from '@fc/logger';

import { LoggerLevelCodes, LoggerLevelNames } from '../enum';
import { ILoggerBusinessEvent, LoggerTransport } from '../interfaces';
import { LoggerService } from './logger.service';
import { PinoService } from './pino.service';

jest.mock('os');
jest.mock('uuid');
jest.mock('../utils');

describe('LoggerService', () => {
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

  const configServiceMock = {
    get: jest.fn(),
  };

  let service: LoggerService;
  const ipMock = '123.123.123.123';
  const sourcePortMock = '443';
  const xForwardedForOriginalMock = '123.123.123.123, 124.124.124.124';

  const nestLoggerMock = {
    fatal: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerService, ConfigService, PinoService, NestLoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(PinoService)
      .useValue(externalLoggerMock)
      .overrideProvider(NestLoggerService)
      .useValue(nestLoggerMock)
      .compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

  describe('businessLogger()', () => {
    let canLogMock: jest.SpyInstance;
    let identifiedLogMock: jest.SpyInstance;

    const levelMock = LoggerLevelNames.INFO;
    const message = { foo: 'bar' };
    const identifiedLog = { logId: 'bar' };

    beforeEach(() => {
      canLogMock = jest.spyOn<LoggerService, any>(service, 'canLog');

      identifiedLogMock = jest.spyOn<LoggerService, any>(
        service,
        'getIdentifiedLog',
      );
      identifiedLogMock.mockReturnValueOnce(identifiedLog);
    });

    it('should log info message with context', () => {
      // Given
      canLogMock.mockReturnValueOnce(false);
      // When
      service['businessLogger'](levelMock, message);
      // Then
      expect(canLogMock).toHaveBeenCalledTimes(1);

      expect(identifiedLogMock).toHaveBeenCalledTimes(0);
    });

    it('should add id to output log', () => {
      // Given
      canLogMock.mockReturnValueOnce(true);
      // When
      service['businessLogger'](levelMock, message);

      // Then
      expect(identifiedLogMock).toHaveBeenCalledTimes(1);
      expect(identifiedLogMock).toHaveBeenCalledWith(message);
    });

    it('should trace and output log ', () => {
      // Given
      canLogMock.mockReturnValueOnce(true);

      // When
      service['businessLogger'](levelMock, message);

      // Then
      expect(transportMock[levelMock]).toHaveBeenCalledTimes(1);
      expect(transportMock[levelMock]).toHaveBeenCalledWith(identifiedLog);
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
      service.businessEvent(message);

      // Then
      expect(businessLoggerMock).toHaveBeenCalledTimes(1);
      expect(businessLoggerMock).toHaveBeenCalledWith(
        LoggerLevelNames.INFO,
        message,
      );
    });
  });
});
