import { Test, TestingModule } from '@nestjs/testing';

import {
  derivePeriod,
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ElasticReindexCommandOptionsInterface } from '../interfaces';
import { CommandElasticReindexService } from '../services';
import { ElasticReindexCommand } from './elastic-reindex.command';

jest.mock('@fc/elasticsearch', () => ({
  ...jest.requireActual('@fc/elasticsearch'),
  derivePeriod: jest.fn(),
}));

describe('ElasticReindexCommand', () => {
  let command: ElasticReindexCommand;
  const loggerMock = getLoggerMock();
  const periodMock = '2025-08';

  const yearPeriodMock = '2024';
  const semesterPeriodMock = '2025-01';
  const reindexMock = { safeInitializeReindex: jest.fn() };
  const derivePeriodMock = jest.mocked(derivePeriod);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticReindexCommand,
        CommandElasticReindexService,
        LoggerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CommandElasticReindexService)
      .useValue(reindexMock)
      .compile();

    derivePeriodMock.mockImplementation((range) => {
      switch (range) {
        case ElasticControlRangeEnum.YEAR:
          return yearPeriodMock;
        case ElasticControlRangeEnum.SEMESTER:
          return semesterPeriodMock;
        default:
          return periodMock;
      }
    });

    command = module.get<ElasticReindexCommand>(ElasticReindexCommand);
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
        '--- Start ElasticReindexCommand ---',
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        '--- End ElasticReindexCommand ---',
      );
    });

    it('should call derivePeriod with MONTH range when no period is provided', async () => {
      // When
      await command.run([], baseOptions);

      // Then
      expect(derivePeriodMock).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.MONTH,
      );
    });

    it('should call derivePeriod with YEAR range when no period is provided', async () => {
      // Given
      const options: ElasticReindexCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.YEAR,
      };

      // When
      await command.run([], options);

      // Then
      expect(derivePeriodMock).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.YEAR,
      );
    });

    it('should call derivePeriod with SEMESTER range and forward the derived period', async () => {
      // Given
      const options: ElasticReindexCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.SEMESTER,
      };

      // When
      await command.run([], options);

      // Then
      expect(derivePeriodMock).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.SEMESTER,
      );
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledExactlyOnceWith(
        {
          key: options.key,
          period: semesterPeriodMock,
          product: options.product,
          range: options.range,
          pivot: options.pivot,
        },
        false,
        false,
      );
    });

    it('should call safeInitializeReindex with derived year period when range is YEAR', async () => {
      // Given
      const options: ElasticReindexCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.YEAR,
      };

      // When
      await command.run([], options);

      // Then
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledExactlyOnceWith(
        {
          key: options.key,
          period: yearPeriodMock,
          product: options.product,
          range: options.range,
          pivot: options.pivot,
        },
        false,
        false,
      );
    });

    it('should not call derivePeriod when period is explicitly provided', async () => {
      // Given
      const options: ElasticReindexCommandOptionsInterface = {
        ...baseOptions,
        range: ElasticControlRangeEnum.YEAR,
        period: '2023',
      };

      // When
      await command.run([], options);

      // Then
      expect(derivePeriodMock).not.toHaveBeenCalled();
    });

    it('should call safeInitializeReindex with default period and no flags', async () => {
      // Given
      const dryRunMock = false;
      const forceMock = false;

      // When
      await command.run([], baseOptions);

      // Then
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledExactlyOnceWith(
        {
          key: baseOptions.key,
          period: periodMock,
          product: baseOptions.product,
          range: baseOptions.range,
          pivot: baseOptions.pivot,
        },
        dryRunMock,
        forceMock,
      );
    });

    it('should call safeInitializeReindex with all provided options', async () => {
      // Given
      const dryRunMock = true;
      const forceMock = true;
      const options: ElasticReindexCommandOptionsInterface = {
        key: ElasticControlKeyEnum.IDENTITIES,
        product: ElasticControlProductEnum.LOW,
        range: ElasticControlRangeEnum.YEAR,
        pivot: ElasticControlPivotEnum.IDP,
        period: '2024-01',
        dryRun: dryRunMock,
        force: forceMock,
      };

      // When
      await command.run([], options);

      // Then
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledTimes(1);
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledWith(
        {
          key: options.key,
          period: options.period,
          product: options.product,
          range: options.range,
          pivot: options.pivot,
        },
        dryRunMock,
        forceMock,
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
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledWith(
        expect.anything(),
        true,
        false,
      );
    });

    it('should convert force to boolean', async () => {
      // Given
      const options: ElasticReindexCommandOptionsInterface = {
        ...baseOptions,
        force: true,
      };

      // When
      await command.run([], options);

      // Then
      expect(reindexMock.safeInitializeReindex).toHaveBeenCalledWith(
        expect.anything(),
        false,
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

  describe('parseForce', () => {
    it('should return true', () => {
      // When
      const result = command.parseForce();

      // Then
      expect(result).toBe(true);
    });
  });
});
