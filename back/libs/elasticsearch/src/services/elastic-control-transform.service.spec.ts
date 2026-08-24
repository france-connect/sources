import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { DEFAULT_TIMEZONE } from '../constants';
import { ElasticControlTransformOptionsDto } from '../dto';
import {
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
  PIVOT_FIELDS,
  TransformStatesEnum,
} from '../enums';
import { ElasticControlInvalidRequestException } from '../exceptions';
import {
  ElasticTransformStatsResponse,
  TransformStatusInterface,
} from '../interfaces';
import {
  derivePeriod,
  getPeriodWindow,
  getTransformDocIndexed,
  getTransformLastCheckpoint,
  isNotFound,
} from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';
import { ElasticControlDestIndexService } from './elastic-control-dest-index.service';
import { ElasticControlTransformService } from './elastic-control-transform.service';

jest.mock('../utils');

describe('ElasticControlTransformService', () => {
  let service: ElasticControlTransformService;
  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();

  const getTransformDocIndexedMock = jest.mocked(getTransformDocIndexed);
  const getTransformLastCheckpointMock = jest.mocked(
    getTransformLastCheckpoint,
  );
  const isNotFoundMock = jest.mocked(isNotFound);

  const destIndexServiceMock = {
    safeDeleteDestIndex: jest.fn(),
  };
  const elasticClientMock = {
    getTransformStats: jest.fn(),
    createTransform: jest.fn(),
    startTransform: jest.fn(),
    stopTransform: jest.fn(),
    deleteTransform: jest.fn(),
  };

  const optionsMock: ElasticControlTransformOptionsDto = {
    product: ElasticControlProductEnum.HIGH,
    range: ElasticControlRangeEnum.MONTH,
    pivot: ElasticControlPivotEnum.SP,
  };

  const transformIdMock = 'runner_stats_franceconnect_plus_sp_month';
  const dryRun = false;

  const elasticControlConfigMock = {
    highTracksIndex: 'highIndex',
    lowTracksIndex: 'lowIndex',
  };

  const elasticTransformStatsMock: ElasticTransformStatsResponse = {
    count: 1,
    transforms: [{ id: transformIdMock, state: TransformStatesEnum.STARTED }],
  };

  const transformStatusMock: TransformStatusInterface = {
    id: transformIdMock,
    state: TransformStatesEnum.STARTED,
    lastCheckpoint: 1,
    docsIndexed: 100,
    reason: undefined,
  };

  const bodyMock = { a: 1 };

  beforeEach(async () => {
    jest.resetAllMocks();

    configMock.get.mockReturnValue(elasticControlConfigMock);

    isNotFoundMock.mockReturnValue(false);
    getTransformLastCheckpointMock.mockReturnValue(1);
    getTransformDocIndexedMock.mockReturnValue(100);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticControlTransformService,
        LoggerService,
        ConfigService,
        ElasticControlDestIndexService,
        ElasticControlClientService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(ElasticControlDestIndexService)
      .useValue(destIndexServiceMock)
      .overrideProvider(ElasticControlClientService)
      .useValue(elasticClientMock)
      .compile();

    service = module.get<ElasticControlTransformService>(
      ElasticControlTransformService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTransform', () => {
    beforeEach(() => {
      service['buildTransformId'] = jest.fn().mockReturnValue(transformIdMock);
      elasticClientMock.getTransformStats.mockResolvedValue(
        elasticTransformStatsMock,
      );
    });

    it('should call buildTransformId with options', async () => {
      // When
      await service.findTransform(optionsMock);

      // Then
      expect(service['buildTransformId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call elastic.getTransformStats with the transform id', async () => {
      // When
      await service.findTransform(optionsMock);

      // Then
      expect(
        elasticClientMock.getTransformStats,
      ).toHaveBeenCalledExactlyOnceWith(transformIdMock);
    });

    it('should return null if no transforms found', async () => {
      // Given
      elasticClientMock.getTransformStats.mockResolvedValueOnce({
        transforms: [],
      });

      // When
      const result = await service.findTransform(optionsMock);

      // Then
      expect(result).toBeNull();
    });

    it('should return the transform status on success', async () => {
      // When
      const result = await service.findTransform(optionsMock);

      // Then
      expect(result).toEqual(transformStatusMock);
    });

    it('should call getTransformLastCheckpoint with the current transform', async () => {
      // When
      await service.findTransform(optionsMock);

      // Then
      expect(getTransformLastCheckpointMock).toHaveBeenCalledExactlyOnceWith(
        elasticTransformStatsMock.transforms[0],
      );
    });

    it('should call getTransformDocIndexed with the current transform', async () => {
      // When
      await service.findTransform(optionsMock);

      // Then
      expect(getTransformDocIndexedMock).toHaveBeenCalledExactlyOnceWith(
        elasticTransformStatsMock.transforms[0],
      );
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.getTransformStats.mockRejectedValueOnce(error);

      // When / Then
      await expect(service.findTransform(optionsMock)).rejects.toThrow(
        ElasticControlInvalidRequestException,
      );
    });
  });

  describe('initializeTransform', () => {
    beforeEach(() => {
      service['buildTransformId'] = jest.fn().mockReturnValue(transformIdMock);
      service['safeDeleteTransform'] = jest.fn().mockResolvedValue(undefined);
      service['buildTransformBody'] = jest.fn().mockReturnValue(bodyMock);
      service['createTransform'] = jest.fn().mockResolvedValue(undefined);
      service['startTransform'] = jest.fn().mockResolvedValue(undefined);
    });

    it('should call buildTransformId with options', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['buildTransformId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call safeDeleteTransform with the transform id and dryRun', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['safeDeleteTransform']).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        dryRun,
      );
    });

    it('should call destIndex.safeDeleteDestIndex with the transform id and dryRun', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(
        destIndexServiceMock.safeDeleteDestIndex,
      ).toHaveBeenCalledExactlyOnceWith(transformIdMock, dryRun);
    });

    it('should call buildTransformBody with options', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['buildTransformBody']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call createTransform with the transform id, body and dryRun', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['createTransform']).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        bodyMock,
        dryRun,
      );
    });

    it('should call startTransform with the transform id and dryRun', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['startTransform']).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        dryRun,
      );
    });

    it('should return a STARTED status object', async () => {
      // When
      const result = await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(result).toEqual({
        id: transformIdMock,
        state: TransformStatesEnum.STARTED,
        lastCheckpoint: 0,
        docsIndexed: 0,
      });
    });
  });

  describe('createTransform', () => {
    it('should call elastic.createTransform with the transform id and body', async () => {
      // When
      await service['createTransform'](transformIdMock, bodyMock, dryRun);

      // Then
      expect(elasticClientMock.createTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        bodyMock,
      );
    });

    it('should log creation message', async () => {
      // When
      await service['createTransform'](transformIdMock, bodyMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] Created transform "${transformIdMock}"`,
      );
    });

    it('should log dry-run message and not call elastic.createTransform when dryRun is true', async () => {
      // Given
      const dryRunTrue = true;

      // When
      await service['createTransform'](transformIdMock, bodyMock, dryRunTrue);

      // Then
      expect(elasticClientMock.createTransform).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] dry-run: would create transform "${transformIdMock}"`,
      );
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.createTransform.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service['createTransform'](transformIdMock, bodyMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('startTransform', () => {
    it('should call elastic.startTransform with the transform id', async () => {
      // When
      await service['startTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.startTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
      );
    });

    it('should log start message', async () => {
      // When
      await service['startTransform'](transformIdMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] Started transform "${transformIdMock}"`,
      );
    });

    it('should log dry-run message and not call elastic.startTransform when dryRun is true', async () => {
      // Given
      const dryRunTrue = true;

      // When
      await service['startTransform'](transformIdMock, dryRunTrue);

      // Then
      expect(elasticClientMock.startTransform).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] dry-run: would start transform "${transformIdMock}"`,
      );
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.startTransform.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service['startTransform'](transformIdMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('safeDeleteTransform', () => {
    it('should call elastic.stopTransform with the transform id', async () => {
      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.stopTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
      );
    });

    it('should call elastic.deleteTransform with the transform id', async () => {
      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.deleteTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
      );
    });

    it('should log stop and delete messages', async () => {
      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(2);
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        1,
        `[transform] Stopped transform "${transformIdMock}"`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        2,
        `[transform] Deleted transform "${transformIdMock}"`,
      );
    });

    it('should log dry-run message and not call elastic when dryRun is true', async () => {
      // Given
      const dryRunTrue = true;

      // When
      await service['safeDeleteTransform'](transformIdMock, dryRunTrue);

      // Then
      expect(elasticClientMock.stopTransform).not.toHaveBeenCalled();
      expect(elasticClientMock.deleteTransform).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] dry-run: would delete transform "${transformIdMock}"`,
      );
    });

    it('should log and ignore 404 errors', async () => {
      // Given
      const error = new Error('not found');
      elasticClientMock.stopTransform.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(true);

      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(isNotFoundMock).toHaveBeenCalledWith(error);
      expect(elasticClientMock.deleteTransform).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] Delete ignored: transform "${transformIdMock}" not found (404)`,
      );
    });

    it('should throw ElasticControlInvalidRequestException on non-404 errors', async () => {
      // Given
      const error = new Error('other error');
      elasticClientMock.stopTransform.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(false);

      // When / Then
      await expect(
        service['safeDeleteTransform'](transformIdMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('buildTransformBody', () => {
    const sourceIndexMock = 'sourceIndexMock';
    const filtersMock = [{ term: { foo: 'bar' } }];
    const groupByMock = { spId: { terms: { field: 'spId' } } };

    beforeEach(() => {
      service['buildTransformId'] = jest.fn().mockReturnValue(transformIdMock);
      service['buildSource'] = jest.fn().mockReturnValue({
        sourceIndex: sourceIndexMock,
        filters: filtersMock,
      });
      service['buildGroupBy'] = jest.fn().mockReturnValue(groupByMock);
    });

    it('should call buildTransformId with options', () => {
      // When
      service['buildTransformBody'](optionsMock);

      // Then
      expect(service['buildTransformId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call buildSource with options and pivotConfig', () => {
      // When
      service['buildTransformBody'](optionsMock);

      // Then
      expect(service['buildSource']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
        PIVOT_FIELDS[optionsMock.pivot],
      );
    });

    it('should call buildGroupBy with groupFields and options', () => {
      // When
      service['buildTransformBody'](optionsMock);

      // Then
      expect(service['buildGroupBy']).toHaveBeenCalledExactlyOnceWith(
        PIVOT_FIELDS[optionsMock.pivot].groupFields,
        optionsMock,
      );
    });

    it('should return a body assembled from source, filters and group_by', () => {
      // Given
      const { nameFields } = PIVOT_FIELDS[optionsMock.pivot];

      // When
      const result = service['buildTransformBody'](optionsMock);

      // Then
      expect(result).toEqual({
        source: {
          index: sourceIndexMock,
          query: {
            bool: {
              filter: filtersMock,
            },
          },
        },
        dest: { index: transformIdMock },
        pivot: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          group_by: groupByMock,
          aggregations: {
            nbOfIdentities: { cardinality: { field: 'accountId' } },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            nbOfConnections: { value_count: { field: 'accountId' } },
            info: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              top_metrics: {
                metrics: nameFields.map((field) => ({ field })),
                sort: { time: 'desc' },
              },
            },
          },
        },
      });
    });
  });

  describe('buildSource', () => {
    const periodFromInMs = 1_735_689_600_000;
    const periodToInMs = 1_738_368_000_000;

    beforeEach(() => {
      jest.mocked(getPeriodWindow).mockReturnValue({
        gte: new Date(periodFromInMs),
        lt: new Date(periodToInMs),
      });
    });

    it('should get ElasticControl config', () => {
      // Given
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      service['buildSource'](optionsMock, pivotConfig);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('ElasticControl');
    });

    it('should return highTracksIndex as sourceIndex for HIGH product', () => {
      // Given
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      const { sourceIndex } = service['buildSource'](optionsMock, pivotConfig);

      // Then
      expect(sourceIndex).toBe(elasticControlConfigMock.highTracksIndex);
    });

    it('should return lowTracksIndex as sourceIndex for LOW product', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        product: ElasticControlProductEnum.LOW,
      };
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      const { sourceIndex } = service['buildSource'](options, pivotConfig);

      // Then
      expect(sourceIndex).toBe(elasticControlConfigMock.lowTracksIndex);
    });

    it('should always include event and service filters for HIGH product', () => {
      // Given
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      const { filters } = service['buildSource'](optionsMock, pivotConfig);

      // Then
      expect(filters).toContainEqual({ term: { event: 'FC_VERIFIED' } });
      expect(filters).toContainEqual({ term: { service: 'fc_core_v2_app' } });
    });

    it('should use FCP_LOW service for LOW product', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        product: ElasticControlProductEnum.LOW,
      };
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      const { filters } = service['buildSource'](options, pivotConfig);

      // Then
      expect(filters).toContainEqual({ term: { service: 'fc_core_low_app' } });
    });

    it('should add filter term when pivotConfig has filterField and filterValue', () => {
      // Given
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.IDP_PUBLIC_SP];

      // When
      const { filters } = service['buildSource'](optionsMock, pivotConfig);

      // Then
      expect(filters).toContainEqual({ term: { spType: 'public' } });
    });

    it('should add only the period range filter when pivotConfig has no filterField', () => {
      // Given
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      const { filters } = service['buildSource'](optionsMock, pivotConfig);

      // Then
      expect(filters).toHaveLength(3);
    });

    it.each([
      ElasticControlRangeEnum.MONTH,
      ElasticControlRangeEnum.YEAR,
      ElasticControlRangeEnum.SEMESTER,
    ])('should call buildPeriodRangeFilter for %s range', (range) => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        range,
        period: '2025-01',
      };
      const periodFilterMock = { range: { time: { gte: 1, lt: 2 } } };
      service['buildPeriodRangeFilter'] = jest
        .fn()
        .mockReturnValue(periodFilterMock);
      const pivotConfig = PIVOT_FIELDS[ElasticControlPivotEnum.SP];

      // When
      const { filters } = service['buildSource'](options, pivotConfig);

      // Then
      expect(service['buildPeriodRangeFilter']).toHaveBeenCalledExactlyOnceWith(
        range,
        '2025-01',
      );
      expect(filters).toContainEqual(periodFilterMock);
    });
  });

  describe('buildPeriodRangeFilter', () => {
    const periodFromInMs = 1_735_689_600_000;
    const periodToInMs = 1_738_368_000_000;

    beforeEach(() => {
      jest.mocked(getPeriodWindow).mockReturnValue({
        gte: new Date(periodFromInMs),
        lt: new Date(periodToInMs),
      });
    });

    it('should call getPeriodWindow with the range and the provided period', () => {
      // When
      service['buildPeriodRangeFilter'](
        ElasticControlRangeEnum.MONTH,
        '2025-01',
      );

      // Then
      expect(getPeriodWindow).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.MONTH,
        '2025-01',
      );
    });

    it('should fall back to derivePeriod when period is undefined', () => {
      // Given
      jest.mocked(derivePeriod).mockReturnValue('2024-12');

      // When
      service['buildPeriodRangeFilter'](
        ElasticControlRangeEnum.MONTH,
        undefined,
      );

      // Then
      expect(derivePeriod).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.MONTH,
      );
      expect(getPeriodWindow).toHaveBeenCalledExactlyOnceWith(
        ElasticControlRangeEnum.MONTH,
        '2024-12',
      );
    });

    it('should return a range filter with epoch_millis from getPeriodWindow', () => {
      // When
      const result = service['buildPeriodRangeFilter'](
        ElasticControlRangeEnum.MONTH,
        '2025-01',
      );

      // Then
      expect(result).toEqual({
        range: {
          time: { gte: periodFromInMs, lt: periodToInMs },
        },
      });
    });
  });

  describe('buildGroupBy', () => {
    it('should create a terms entry for each groupField', () => {
      // Given
      const groupFields = ['spId', 'idpId'];

      // When
      const result = service['buildGroupBy'](groupFields, optionsMock);

      // Then
      expect(result['spId']).toEqual({ terms: { field: 'spId' } });
      expect(result['idpId']).toEqual({ terms: { field: 'idpId' } });
    });

    it('should call buildDateHistogram and add period for non-SEMESTER range', () => {
      // Given
      const dateHistogramMock = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        date_histogram: { field: 'time' },
      };
      service['buildDateHistogram'] = jest
        .fn()
        .mockReturnValue(dateHistogramMock);

      // When
      const result = service['buildGroupBy'](['spId'], optionsMock);

      // Then
      expect(service['buildDateHistogram']).toHaveBeenCalledExactlyOnceWith(
        optionsMock.range,
      );
      expect(result['period']).toEqual(dateHistogramMock);
    });

    it('should not add period for SEMESTER range', () => {
      // Given
      const semesterOptions: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        range: ElasticControlRangeEnum.SEMESTER,
      };
      service['buildDateHistogram'] = jest.fn();

      // When
      const result = service['buildGroupBy'](['spId'], semesterOptions);

      // Then
      expect(service['buildDateHistogram']).not.toHaveBeenCalled();
      expect(result).not.toHaveProperty('period');
    });
  });

  describe('buildDateHistogram', () => {
    it('should return a calendar_interval date_histogram for MONTH range', () => {
      // When
      const result = service['buildDateHistogram'](
        ElasticControlRangeEnum.MONTH,
      );

      // Then
      expect(result).toEqual({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        date_histogram: {
          field: 'time',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          calendar_interval: '1M',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_zone: DEFAULT_TIMEZONE,
        },
      });
    });

    it('should return a calendar_interval date_histogram for YEAR range', () => {
      // When
      const result = service['buildDateHistogram'](
        ElasticControlRangeEnum.YEAR,
      );

      // Then
      expect(result).toEqual({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        date_histogram: {
          field: 'time',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          calendar_interval: '1y',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          time_zone: DEFAULT_TIMEZONE,
        },
      });
    });

    it('should throw ElasticControlInvalidRequestException for unsupported range', () => {
      // When / Then
      expect(() =>
        service['buildDateHistogram']('UNSUPPORTED' as ElasticControlRangeEnum),
      ).toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('buildTransformId', () => {
    it('should return an id following the runner_stats_<product>_<pivot>_<range> convention', () => {
      // When
      const result = service.buildTransformId(optionsMock);

      // Then
      expect(result).toBe('runner_stats_franceconnect_plus_sp_month');
    });

    it('should build correct id for LOW product', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        product: ElasticControlProductEnum.LOW,
        range: ElasticControlRangeEnum.YEAR,
        pivot: ElasticControlPivotEnum.IDP,
      };

      // When
      const result = service.buildTransformId(options);

      // Then
      expect(result).toBe('runner_stats_franceconnect_idp_year');
    });
  });
});
