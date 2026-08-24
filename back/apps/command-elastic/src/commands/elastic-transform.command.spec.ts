import { Test, TestingModule } from '@nestjs/testing';

import {
  derivePeriod,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ElasticTransformCommandOptionsInterface } from '../interfaces';
import { CommandElasticTransformService } from '../services';
import { ElasticTransformCommand } from './elastic-transform.command';

jest.mock('@fc/elasticsearch', () => ({
  ...jest.requireActual('@fc/elasticsearch'),
  derivePeriod: jest.fn(),
}));

describe('ElasticTransformCommand', () => {
  let command: ElasticTransformCommand;
  const loggerMock = getLoggerMock();
  const monthPeriodMock = '2025-08';
  const yearPeriodMock = '2024';
  const semesterPeriodMock = '2025-01';

  const transformMock = { safeInitializeTransform: jest.fn() };
  const derivePeriodMock = jest.mocked(derivePeriod);

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

    derivePeriodMock.mockImplementation((range) => {
      switch (range) {
        case ElasticControlRangeEnum.YEAR:
          return yearPeriodMock;
        case ElasticControlRangeEnum.SEMESTER:
          return semesterPeriodMock;
        default:
          return monthPeriodMock;
      }
    });

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

    it('should log start and end messages in order', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        1,
        '--- Start ElasticTransformCommand ---',
      );
      expect(loggerMock.debug).toHaveBeenLastCalledWith(
        '--- End ElasticTransformCommand ---',
      );
    });

    it('should call safeInitializeTransform with derived month period for MONTH range', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(
        transformMock.safeInitializeTransform,
      ).toHaveBeenCalledExactlyOnceWith(
        {
          product: baseOptions.product,
          range: baseOptions.range,
          pivot: baseOptions.pivot,
          period: monthPeriodMock,
        },
        false,
        false,
      );
    });

    it('should call derivePeriod with YEAR range and forward the derived period', async () => {
      // Given
      const options: ElasticTransformCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.YEAR,
      };

      // When
      await command.run([], options);

      // Then
      expect(derivePeriodMock).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.YEAR,
      );
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.objectContaining({ period: yearPeriodMock }),
        false,
        false,
      );
    });

    it('should call derivePeriod with SEMESTER range and forward the derived period', async () => {
      // Given
      const options: ElasticTransformCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.SEMESTER,
      };

      // When
      await command.run([], options);

      // Then
      expect(derivePeriodMock).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.SEMESTER,
      );
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.objectContaining({ period: semesterPeriodMock }),
        false,
        false,
      );
    });

    it('should not call derivePeriod when period is explicitly provided', async () => {
      // Given
      const options: ElasticTransformCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.SEMESTER,
        period: '2023-07',
      };

      // When
      await command.run([], options);

      // Then
      expect(derivePeriodMock).not.toHaveBeenCalled();
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.objectContaining({ period: '2023-07' }),
        false,
        false,
      );
    });

    it('should call safeInitializeTransform with dryRun=true when option is set', async () => {
      // Given
      const options: ElasticTransformCommandOptionsInterface = {
        ...baseOptions,
        dryRun: true,
      };

      // When
      await command.run([], options);

      // Then
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.any(Object),
        true,
        false,
      );
    });

    it('should call safeInitializeTransform with force=true when option is set', async () => {
      // Given
      const options: ElasticTransformCommandOptionsInterface = {
        ...baseOptions,
        force: true,
      };

      // When
      await command.run([], options);

      // Then
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.any(Object),
        false,
        true,
      );
    });

    it('should call safeInitializeTransform with dryRun=false when dryRun option is not set', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.any(Object),
        false,
        expect.any(Boolean),
      );
    });

    it('should call safeInitializeTransform with force=false when force option is not set', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(transformMock.safeInitializeTransform).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Boolean),
        false,
      );
    });
  });
});
