import { Test, TestingModule } from '@nestjs/testing';

import {
  DEFAULT_TIMEZONE,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ElasticTransformCommandOptionsInterface } from '../interfaces';
import { CommandElasticTransformService } from '../services';
import { getPreviousMonth } from '../utils';
import { ElasticTransformWatcherCommand } from './elastic-transform-watcher.command';

jest.mock('../utils');

describe('ElasticTransformWatcherCommand', () => {
  let command: ElasticTransformWatcherCommand;
  const loggerMock = getLoggerMock();
  const periodMock = '2025-08';

  const transformMock = { actualizeTransform: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticTransformWatcherCommand,
        CommandElasticTransformService,
        LoggerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandElasticTransformService)
      .useValue(transformMock)
      .compile();

    jest.mocked(getPreviousMonth).mockReturnValue(periodMock);

    command = module.get<ElasticTransformWatcherCommand>(
      ElasticTransformWatcherCommand,
    );
  });

  it('should be defined', () => {
    expect(command).toBeDefined();
  });

  describe('run', () => {
    const baseOptions: ElasticTransformCommandOptionsInterface = {
      product: ElasticControlProductEnum.HIGH,
      range: ElasticControlRangeEnum.MONTH,
      pivot: ElasticControlPivotEnum.SP,
    };

    it('should log start and end messages', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(2);
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        1,
        '--- Start ElasticTransformWatcherCommand ---',
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        2,
        '--- End ElasticTransformWatcherCommand ---',
      );
    });

    it('should call getPreviousMonth', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(getPreviousMonth).toHaveBeenCalledTimes(1);
    });

    it('should call actualizeTransform with default period and no flags', async () => {
      // Given
      const dryRunMock = false;

      // When
      await command.run([], baseOptions);

      // Then
      expect(transformMock.actualizeTransform).toHaveBeenCalledExactlyOnceWith(
        {
          period: periodMock,
          product: baseOptions.product,
          range: baseOptions.range,
          pivot: baseOptions.pivot,
          timezone: DEFAULT_TIMEZONE,
        },
        dryRunMock,
      );
    });

    it('should call actualizeTransform with all provided options', async () => {
      // Given
      const dryRunMock = true;
      const options: ElasticTransformCommandOptionsInterface = {
        product: ElasticControlProductEnum.HIGH,
        range: ElasticControlRangeEnum.MONTH,
        pivot: ElasticControlPivotEnum.SP,
        period: '2024-01',
        dryRun: dryRunMock,
      };

      // When
      await command.run([], options);

      // Then
      expect(transformMock.actualizeTransform).toHaveBeenCalledTimes(1);
      expect(transformMock.actualizeTransform).toHaveBeenCalledWith(
        {
          period: options.period,
          product: options.product,
          range: options.range,
          pivot: options.pivot,
          timezone: DEFAULT_TIMEZONE,
        },
        dryRunMock,
      );
    });
  });
});
