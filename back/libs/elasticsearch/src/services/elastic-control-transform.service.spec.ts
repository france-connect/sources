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
  computeWindowFromPeriod,
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

  const computeWindowFromPeriodMock = jest.mocked(computeWindowFromPeriod);
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
    period: '2025-08',
    timezone: DEFAULT_TIMEZONE,
  };

  const transformIdMock = '2025-08_sp_franceconnect_plus_month';
  const dryRun = false;

  const elasticControlConfigMock = {
    highTracksIndex: 'highIndex',
    lowTracksIndex: 'lowIndex',
  };

  const windowMock = { gte: '2025-08-01', lt: '2025-09-01' };

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
    computeWindowFromPeriodMock.mockReturnValue(windowMock);
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

    it('should call buildTransformId', async () => {
      // When
      await service.findTransform(optionsMock);

      // Then
      expect(service['buildTransformId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call elastic.getTransformStats', async () => {
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

    it('should return TransformStatusInterface on success', async () => {
      // When
      const result = await service.findTransform(optionsMock);

      // Then
      expect(result).toEqual(transformStatusMock);
    });

    it('should call getTransformLastCheckpoint', async () => {
      // When
      await service.findTransform(optionsMock);

      // Then
      expect(getTransformLastCheckpointMock).toHaveBeenCalledExactlyOnceWith(
        elasticTransformStatsMock.transforms[0],
      );
    });

    it('should call getTransformDocIndexed', async () => {
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

    it('should call buildTransformId', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['buildTransformId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call safeDeleteTransform', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['safeDeleteTransform']).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        dryRun,
      );
    });

    it('should call destIndex.safeDeleteDestIndex', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(
        destIndexServiceMock.safeDeleteDestIndex,
      ).toHaveBeenCalledExactlyOnceWith(transformIdMock, dryRun);
    });

    it('should call buildTransformBody', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['buildTransformBody']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call createTransform', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['createTransform']).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        bodyMock,
        dryRun,
      );
    });

    it('should call startTransform', async () => {
      // When
      await service.initializeTransform(optionsMock, dryRun);

      // Then
      expect(service['startTransform']).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        dryRun,
      );
    });

    it('should return a "STARTED" status object', async () => {
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
    it('should call elastic.createTransform', async () => {
      // When
      await service['createTransform'](transformIdMock, bodyMock, dryRun);

      // Then
      expect(elasticClientMock.createTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
        bodyMock,
      );
    });

    it('should log creation', async () => {
      // When
      await service['createTransform'](transformIdMock, bodyMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] Created transform "${transformIdMock}"`,
      );
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      await service['createTransform'](transformIdMock, bodyMock, dryRun);

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
    it('should call elastic.startTransform', async () => {
      // When
      await service['startTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.startTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
      );
    });

    it('should log start', async () => {
      // When
      await service['startTransform'](transformIdMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] Started transform "${transformIdMock}"`,
      );
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      await service['startTransform'](transformIdMock, dryRun);

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
    it('should call elastic.stopTransform', async () => {
      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.stopTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
      );
    });

    it('should call elastic.deleteTransform', async () => {
      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.deleteTransform).toHaveBeenCalledExactlyOnceWith(
        transformIdMock,
      );
    });

    it('should log stop and delete', async () => {
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

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      await service['safeDeleteTransform'](transformIdMock, dryRun);

      // Then
      expect(elasticClientMock.stopTransform).not.toHaveBeenCalled();
      expect(elasticClientMock.deleteTransform).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[transform] dry-run: would delete transform "${transformIdMock}"`,
      );
    });

    it('should ignore 404 errors', async () => {
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

    it('should throw ElasticControlInvalidRequestException on other errors', async () => {
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
    beforeEach(() => {
      service['buildTransformId'] = jest.fn().mockReturnValue(transformIdMock);
    });

    it('should get config', () => {
      // When
      service['buildTransformBody'](optionsMock);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('ElasticControl');
    });

    it('should call buildTransformId', () => {
      // When
      service['buildTransformBody'](optionsMock);

      // Then
      expect(service['buildTransformId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call computeWindowFromPeriod', () => {
      // When
      service['buildTransformBody'](optionsMock);

      // Then
      expect(computeWindowFromPeriodMock).toHaveBeenCalledExactlyOnceWith(
        optionsMock.period,
        optionsMock.range,
        optionsMock.timezone,
      );
    });

    it('should return a correctly structured body', () => {
      // Given
      const { groupFields, nameFields } = PIVOT_FIELDS[optionsMock.pivot];
      const groupFieldStr = groupFields[0];

      // When
      const result = service['buildTransformBody'](optionsMock);

      // Then
      expect(result).toEqual({
        source: {
          index: elasticControlConfigMock.highTracksIndex, // From HIGH product
          query: {
            bool: {
              filter: [
                { term: { event: 'FC_VERIFIED' } },
                { term: { service: 'fc_core_v2_app' } },
                {
                  range: {
                    time: {
                      format: 'strict_date_optional_time',
                      gte: windowMock.gte,
                      lt: windowMock.lt,
                      // elastic defined property
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      time_zone: optionsMock.timezone,
                    },
                  },
                },
              ],
            },
          },
        },
        dest: { index: transformIdMock },
        pivot: {
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          group_by: {
            [groupFieldStr]: { terms: { field: groupFieldStr } },
          },
          aggregations: {
            nbOfIdentities: { cardinality: { field: 'accountId' } },
            // elastic defined property
            // eslint-disable-next-line @typescript-eslint/naming-convention
            nbOfConnections: { value_count: { field: 'accountId' } },
            info: {
              // elastic defined property
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

    it('should add spType filter with value "public" for IDP_PUBLIC_SP pivot', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.IDP_PUBLIC_SP,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const filters = (result.source as any).query.bool.filter;
      expect(filters).toContainEqual({
        term: { spType: 'public' },
      });
      expect(filters).toHaveLength(4);
    });

    it('should add spType filter with value "private" for IDP_PRIVATE_SP pivot', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.IDP_PRIVATE_SP,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const filters = (result.source as any).query.bool.filter;
      expect(filters).toContainEqual({
        term: { spType: 'private' },
      });
      expect(filters).toHaveLength(4);
    });

    it('should not add spType filter for SP pivot', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.SP,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const filters = (result.source as any).query.bool.filter;
      expect(filters).toHaveLength(3);
      expect(filters).not.toContainEqual(
        expect.objectContaining({
          term: expect.objectContaining({ spType: expect.anything() }),
        }),
      );
    });

    it('should not add spType filter for IDP pivot', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.IDP,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const filters = (result.source as any).query.bool.filter;
      expect(filters).toHaveLength(3);
      expect(filters).not.toContainEqual(
        expect.objectContaining({
          term: expect.objectContaining({ spType: expect.anything() }),
        }),
      );
    });
  });

  describe('buildTransformBody with SP_IDP_PAIR pivot', () => {
    it('should create group_by with both spId and idpId fields', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.SP_IDP_PAIR,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const pivot = result.pivot as any;
      expect(pivot.group_by).toHaveProperty('spId');
      expect(pivot.group_by).toHaveProperty('idpId');
      expect(pivot.group_by.spId).toEqual({ terms: { field: 'spId' } });
      expect(pivot.group_by.idpId).toEqual({ terms: { field: 'idpId' } });
    });

    it('should include both spName and idpName in top_metrics', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.SP_IDP_PAIR,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const info = (result.pivot as any).aggregations.info;
      expect(info.top_metrics.metrics).toEqual([
        { field: 'spName' },
        { field: 'idpName' },
      ]);
    });

    it('should not add any filter for SP_IDP_PAIR pivot', () => {
      // Given
      const options: ElasticControlTransformOptionsDto = {
        ...optionsMock,
        pivot: ElasticControlPivotEnum.SP_IDP_PAIR,
      };

      // When
      const result = service['buildTransformBody'](options);

      // Then
      const filters = (result.source as any).query.bool.filter;
      expect(filters).toHaveLength(3);
    });
  });

  describe('buildTransformId', () => {
    it('should return a sorted, underscore-joined string', () => {
      // When
      const result = service['buildTransformId'](optionsMock);

      // Then
      expect(result).toBe('2025-08_sp_franceconnect_plus_month');
    });
  });
});
