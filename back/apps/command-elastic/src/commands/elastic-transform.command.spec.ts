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
import { ElasticTransformCommand } from './elastic-transform.command';

jest.mock('../utils');

describe('ElasticTransformCommand', () => {
  let command: ElasticTransformCommand;
  const loggerMock = getLoggerMock();
  const periodMock = '2025-08';

  const transformMock = { safeInitializeTransform: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticTransformCommand,
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

    command = module.get<ElasticTransformCommand>(ElasticTransformCommand);
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
        '--- Start ElasticTransformCommand ---',
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        2,
        '--- End ElasticTransformCommand ---',
      );
    });

    it('should call getPreviousMonth', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(getPreviousMonth).toHaveBeenCalledTimes(1);
    });

    it('should call safeInitializeTransform with default period and no flags', async () => {
      // Given
      const dryRunMock = false;
      const forceMock = false;

      // When
      await command.run([], baseOptions);

      // Then
      expect(
        transformMock.safeInitializeTransform,
      ).toHaveBeenCalledExactlyOnceWith(
        {
          period: periodMock,
          product: baseOptions.product,
          range: baseOptions.range,
          pivot: baseOptions.pivot,
          timezone: DEFAULT_TIMEZONE,
        },
        dryRunMock,
        forceMock,
      );
    });

    it('should call safeInitializeTransform with all provided options', async () => {
      // Given
      const dryRunMock = true;
      const forceMock = true;
      const options: ElasticTransformCommandOptionsInterface = {
        product: ElasticControlProductEnum.HIGH,
        range: ElasticControlRangeEnum.MONTH,
        pivot: ElasticControlPivotEnum.SP,
        period: '2024-01',
        dryRun: dryRunMock,
        force: forceMock,
      };

      // When
      await command.run([], options);

      // Then
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledTimes(1);
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        {
          period: options.period,
          product: options.product,
          range: options.range,
          pivot: options.pivot,
          timezone: DEFAULT_TIMEZONE,
        },
        dryRunMock,
        forceMock,
      );
    });
  });
});
