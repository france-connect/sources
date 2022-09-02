import { mocked } from 'jest-mock';
import pino, { Logger } from 'pino';

import { ShutdownSignal } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { LoggerConfig } from '../dto';
import { LoggerLevelCodes, LoggerLevelNames } from '../enum';
import { formatLevel, PinoService } from './pino.service';

jest.mock('pino');

describe('formatLevel()', () => {
  it('should format level of log', () => {
    const label = 'labelValue';
    const level = 42;

    const resultMock = { level: 'labelValue' };
    const result = formatLevel(label, level);

    expect(result).toStrictEqual(resultMock);
  });
});

describe('PinoAdapterService', () => {
  let service: PinoService;
  let getDestinationMock: jest.SpyInstance;

  const configDataMock: Partial<LoggerConfig> = {
    level: LoggerLevelNames.ERROR,
    path: '/dev/null',
    isDevelopment: true,
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const streamMock = {
    reopen: jest.fn(),
  };
  const pinoMock = {
    log: jest.fn(),
  };

  async function compileService(): Promise<PinoService> {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PinoService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<PinoService>(PinoService);
    return service;
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    configServiceMock.get.mockReturnValueOnce(configDataMock);

    getDestinationMock = jest.spyOn<any, any>(
      PinoService.prototype,
      'getDestinationForLog',
    );
    getDestinationMock.mockReturnValueOnce(streamMock);

    mocked(pino).mockReturnValueOnce(pinoMock as unknown as Logger);
  });

  it('should be defined', async () => {
    // Given
    service = await compileService();

    // Then
    expect(service).toBeDefined();
  });

  it('should defined the level of adapter', async () => {
    // Given
    service = await compileService();
    // Then
    expect(service.level).toEqual(LoggerLevelCodes.ERROR);
  });

  it('should defined stream pipe', async () => {
    // Given
    service = await compileService();

    expect(getDestinationMock).toHaveBeenCalledTimes(1);
    expect(getDestinationMock).toHaveBeenCalledWith(configDataMock.path);
  });

  it('should defined transport with stream pipe', async () => {
    // Given
    service = await compileService();

    expect(getDestinationMock).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledTimes(1);
    expect(pino).toHaveBeenCalledWith(
      {
        formatters: {
          level: formatLevel,
        },
        level: LoggerLevelNames.ERROR,
      },
      streamMock,
    );
  });

  describe('getDestinationForLog()', () => {
    let destinationMock: jest.SpyInstance;
    let processMock: jest.SpyInstance;
    let consoleWarnMock: jest.SpyInstance;

    const pathMock = 'pathValue';
    beforeEach(async () => {
      service = await compileService();

      destinationMock = jest.spyOn<typeof pino, any>(pino, 'destination');
      destinationMock.mockReturnValueOnce(streamMock);

      processMock = jest.spyOn<NodeJS.Process, any>(process, 'on');
      processMock.mockReturnValue(void 0);

      consoleWarnMock = jest.spyOn<Console, any>(console, 'warn');
      consoleWarnMock.mockReturnValue(void 0);
    });

    it('should get stream pipe from file path', () => {
      // When
      service['getDestinationForLog'](pathMock);

      // Then
      expect(destinationMock).toHaveBeenCalledTimes(1);
      expect(destinationMock).toHaveBeenCalledWith(pathMock);
    });

    it('should register event on SIGUSR2 signal', () => {
      // When
      service['getDestinationForLog'](pathMock);

      // Then
      expect(processMock).toHaveBeenCalledTimes(1);
      expect(processMock).toHaveBeenCalledWith(
        ShutdownSignal.SIGUSR2,
        expect.any(Function),
      );
    });

    it('should get the stream pipe manager', () => {
      // When
      const result = service['getDestinationForLog'](pathMock);

      // Then
      expect(destinationMock).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(streamMock);
    });

    it('should reopen stream pipe if process callback is called', () => {
      // When
      const result = service['getDestinationForLog'](pathMock);

      const [firstCall] = processMock.mock.calls;
      const [, callback] = firstCall;

      callback();

      // Then
      expect(result).toStrictEqual(streamMock);
      expect(streamMock.reopen).toHaveBeenCalledTimes(1);
      expect(streamMock.reopen).toHaveBeenCalledWith();
      expect(consoleWarnMock).toHaveBeenCalledTimes(2);
    });
  });
});
