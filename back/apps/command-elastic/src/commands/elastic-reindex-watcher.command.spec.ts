import { Test, TestingModule } from '@nestjs/testing';

import {
  DEFAULT_TIMEZONE,
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ElasticReindexCommandOptionsInterface } from '../interfaces';
import { CommandElasticReindexService } from '../services';
import { getPreviousMonth } from '../utils';
import { ElasticReindexWatcherCommand } from './elastic-reindex-watcher.command';

jest.mock('../utils');

describe('ElasticReindexWatcherCommand', () => {
  let command: ElasticReindexWatcherCommand;
  const loggerMock = getLoggerMock();
  const periodMock = '2025-08';

  const reindexMock = { actualizeReindex: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticReindexWatcherCommand,
        CommandElasticReindexService,
        LoggerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandElasticReindexService)
      .useValue(reindexMock)
      .compile();

    jest.mocked(getPreviousMonth).mockReturnValue(periodMock);

    command = module.get<ElasticReindexWatcherCommand>(
      ElasticReindexWatcherCommand,
    );
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    const baseOptions: ElasticReindexCommandOptionsInterface = {
      key: ElasticControlKeyEnum.CONNECTIONS,
      product: ElasticControlProductEnum.HIGH,
      range: ElasticControlRangeEnum.MONTH,
      pivot: ElasticControlPivotEnum.SP,
    };

    it('should log start and end messages', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(loggerMock.info).toHaveBeenCalledTimes(2);
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        1,
        '--- Start ElasticReindexWatcherCommand ---',
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        '--- End ElasticReindexWatcherCommand ---',
      );
    });

    it('should call getPreviousMonth', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(getPreviousMonth).toHaveBeenCalledTimes(1);
    });

    it('should call actualizeReindex with default period and no dry-run flag', async () => {
      // Given
      const dryRunMock = false;

      // When
      await command.run([], baseOptions);

      // Then
      expect(reindexMock.actualizeReindex).toHaveBeenCalledExactlyOnceWith(
        {
          key: baseOptions.key,
          period: periodMock,
          product: baseOptions.product,
          range: baseOptions.range,
          pivot: baseOptions.pivot,
          timezone: DEFAULT_TIMEZONE,
        },
        dryRunMock,
      );
    });

    it('should call actualizeReindex with all provided options', async () => {
      // Given
      const dryRunMock = true;
      const options: ElasticReindexCommandOptionsInterface = {
        key: ElasticControlKeyEnum.IDENTITIES,
        product: ElasticControlProductEnum.LOW,
        range: ElasticControlRangeEnum.YEAR,
        pivot: ElasticControlPivotEnum.IDP,
        period: '2024-01',
        dryRun: dryRunMock,
      };

      // When
      await command.run([], options);

      // Then
      expect(reindexMock.actualizeReindex).toHaveBeenCalledTimes(1);
      expect(reindexMock.actualizeReindex).toHaveBeenCalledWith(
        {
          key: options.key,
          period: options.period,
          product: options.product,
          range: options.range,
          pivot: options.pivot,
          timezone: DEFAULT_TIMEZONE,
        },
        dryRunMock,
      );
    });

    it('should convert dryRun to boolean', async () => {
      // Given
      const options: ElasticReindexCommandOptionsInterface = {
        ...baseOptions,
        dryRun: true,
      };

      // When
      await command.run([], options);

      // Then
      expect(reindexMock.actualizeReindex).toHaveBeenCalledWith(
        expect.anything(),
        true,
      );
    });
  });

  describe('parseKey', () => {
    it('should return the value as-is', () => {
      // When
      const result = command.parseKey('nbOfConnections');

      // Then
      expect(result).toBe('nbOfConnections');
    });
  });

  describe('parseProduct', () => {
    it('should return the value as-is', () => {
      // When
      const result = command.parseProduct('franceconnect_plus');

      // Then
      expect(result).toBe('franceconnect_plus');
    });
  });

  describe('parseRange', () => {
    it('should return the value as-is', () => {
      // When
      const result = command.parseRange('month');

      // Then
      expect(result).toBe('month');
    });
  });

  describe('parsePivot', () => {
    it('should return the value as-is', () => {
      // When
      const result = command.parsePivot('sp');

      // Then
      expect(result).toBe('sp');
    });
  });

  describe('parsePeriod', () => {
    it('should return the value as-is', () => {
      // When
      const result = command.parsePeriod('2025-08');

      // Then
      expect(result).toBe('2025-08');
    });
  });

  describe('parseDryRun', () => {
    it('should return true', () => {
      // When
      const result = command.parseDryRun();

      // Then
      expect(result).toBe(true);
    });
  });
});
