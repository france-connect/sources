import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { ElasticControlReindexOptionsDto } from '../dto';
import {
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
  OTHER_BY_KEY,
  PIVOT_FIELDS,
} from '../enums';
import { ElasticControlInvalidRequestException } from '../exceptions';
import { isNotFound, mapReindexFailures } from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';
import { ElasticControlReindexService } from './elastic-control-reindex.service';
import { ElasticControlTransformService } from './elastic-control-transform.service';

jest.mock('../utils');

describe('ElasticControlReindexService', () => {
  let service: ElasticControlReindexService;
  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();

  const isNotFoundMock = jest.mocked(isNotFound);
  const mapReindexFailuresMock = jest.mocked(mapReindexFailures);

  const transformServiceMock = {
    buildTransformId: jest.fn(),
  };

  const elasticClientMock = {
    getTask: jest.fn(),
    putIngestPipeline: jest.fn(),
    reindex: jest.fn(),
    countDocuments: jest.fn(),
  };

  const optionsMock: ElasticControlReindexOptionsDto = {
    key: ElasticControlKeyEnum.CONNECTIONS,
    product: ElasticControlProductEnum.HIGH,
    range: ElasticControlRangeEnum.MONTH,
    pivot: ElasticControlPivotEnum.SP,
    period: '2025-08',
  };

  const taskIdMock = 'ABC123:12345';
  const sourceIndexMock = '2025-08_sp_franceconnect_plus_month';
  const pipelineIdMock = 'nbOfConnections_sp_franceconnect_plus_month_2025-08';
  const dryRun = false;

  const elasticControlConfigMock = {
    metricsIndex: 'metrics',
    controlIndex: 'control',
  };

  const totalReindexMock = 42;
  const failuresMock = [];

  beforeEach(async () => {
    jest.resetAllMocks();

    configMock.get.mockReturnValue(elasticControlConfigMock);
    isNotFoundMock.mockReturnValue(false);
    mapReindexFailuresMock.mockReturnValue(failuresMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticControlReindexService,
        LoggerService,
        ConfigService,
        ElasticControlTransformService,
        ElasticControlClientService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(ElasticControlTransformService)
      .useValue(transformServiceMock)
      .overrideProvider(ElasticControlClientService)
      .useValue(elasticClientMock)
      .compile();

    service = module.get<ElasticControlReindexService>(
      ElasticControlReindexService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findTask', () => {
    beforeEach(() => {
      service['getReindexedMetrics'] = jest
        .fn()
        .mockResolvedValue(totalReindexMock);
    });

    it('should call getReindexedMetrics', async () => {
      // Given
      elasticClientMock.getTask.mockResolvedValue({
        completed: false,
        response: {},
      });

      // When
      await service.findTask(taskIdMock, optionsMock);

      // Then
      expect(service['getReindexedMetrics']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call elastic.getTask', async () => {
      // Given
      elasticClientMock.getTask.mockResolvedValue({
        completed: false,
        response: {},
      });

      // When
      await service.findTask(taskIdMock, optionsMock);

      // Then
      expect(elasticClientMock.getTask).toHaveBeenCalledExactlyOnceWith(
        taskIdMock,
      );
    });

    it('should return ReindexStatusInterface on success', async () => {
      // Given
      const taskResponseMock = {
        completed: false,
        response: { failures: [] },
      };
      elasticClientMock.getTask.mockResolvedValue(taskResponseMock);

      // When
      const result = await service.findTask(taskIdMock, optionsMock);

      // Then
      expect(result).toEqual({
        id: taskIdMock,
        completed: false,
        total: totalReindexMock,
        failures: failuresMock,
      });
    });

    it('should call mapReindexFailures', async () => {
      // Given
      const responseMock = { failures: [] };
      elasticClientMock.getTask.mockResolvedValue({
        completed: true,
        response: responseMock,
      });

      // When
      await service.findTask(taskIdMock, optionsMock);

      // Then
      expect(mapReindexFailuresMock).toHaveBeenCalledExactlyOnceWith(
        responseMock,
      );
    });

    it('should return completed=true if task not found (404)', async () => {
      // Given
      const error = new Error('not found');
      elasticClientMock.getTask.mockRejectedValue(error);
      isNotFoundMock.mockReturnValue(true);

      // When
      const result = await service.findTask(taskIdMock, optionsMock);

      // Then
      expect(isNotFoundMock).toHaveBeenCalledWith(error);
      expect(result).toEqual({
        id: taskIdMock,
        completed: true,
        total: totalReindexMock,
        failures: [],
      });
    });

    it('should throw ElasticControlInvalidRequestException on other errors', async () => {
      // Given
      const error = new Error('other error');
      elasticClientMock.getTask.mockRejectedValue(error);
      isNotFoundMock.mockReturnValue(false);

      // When / Then
      await expect(service.findTask(taskIdMock, optionsMock)).rejects.toThrow(
        ElasticControlInvalidRequestException,
      );
      expect(isNotFoundMock).toHaveBeenCalledWith(error);
    });
  });

  describe('initializeTask', () => {
    beforeEach(() => {
      transformServiceMock.buildTransformId.mockReturnValue(sourceIndexMock);
      service['createPipeline'] = jest.fn().mockResolvedValue(pipelineIdMock);
      service['startReindex'] = jest.fn().mockResolvedValue(taskIdMock);
    });

    it('should call transform.buildTransformId with omitted key', async () => {
      // When
      await service.initializeTask(optionsMock, dryRun);

      // Then
      expect(
        transformServiceMock.buildTransformId,
      ).toHaveBeenCalledExactlyOnceWith({
        product: optionsMock.product,
        range: optionsMock.range,
        pivot: optionsMock.pivot,
        period: optionsMock.period,
      });
    });

    it('should call createPipeline', async () => {
      // When
      await service.initializeTask(optionsMock, dryRun);

      // Then
      expect(service['createPipeline']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
        dryRun,
      );
    });

    it('should call startReindex', async () => {
      // When
      await service.initializeTask(optionsMock, dryRun);

      // Then
      expect(service['startReindex']).toHaveBeenCalledExactlyOnceWith(
        sourceIndexMock,
        pipelineIdMock,
        dryRun,
      );
    });

    it('should return ReindexStatusInterface with completed=false', async () => {
      // When
      const result = await service.initializeTask(optionsMock, dryRun);

      // Then
      expect(result).toEqual({
        id: taskIdMock,
        completed: false,
        failures: [],
        total: 0,
      });
    });
  });

  describe('createPipeline', () => {
    beforeEach(() => {
      service['buildPipelineId'] = jest.fn().mockReturnValue(pipelineIdMock);
      service['buildPipelineBody'] = jest.fn().mockReturnValue({ foo: 'bar' });
    });

    it('should call buildPipelineId', async () => {
      // When
      await service['createPipeline'](optionsMock, dryRun);

      // Then
      expect(service['buildPipelineId']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call buildPipelineBody', async () => {
      // When
      await service['createPipeline'](optionsMock, dryRun);

      // Then
      expect(service['buildPipelineBody']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call elastic.putIngestPipeline', async () => {
      // When
      await service['createPipeline'](optionsMock, dryRun);

      // Then
      expect(
        elasticClientMock.putIngestPipeline,
      ).toHaveBeenCalledExactlyOnceWith(pipelineIdMock, { foo: 'bar' });
    });

    it('should log creation', async () => {
      // When
      await service['createPipeline'](optionsMock, dryRun);

      // Then
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[reindex] Created ingest pipeline "${pipelineIdMock}"`,
      );
    });

    it('should return pipelineId', async () => {
      // When
      const result = await service['createPipeline'](optionsMock, dryRun);

      // Then
      expect(result).toBe(pipelineIdMock);
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      const result = await service['createPipeline'](optionsMock, dryRun);

      // Then
      expect(elasticClientMock.putIngestPipeline).not.toHaveBeenCalled();
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[reindex] dry-run: would create ingest pipeline "${pipelineIdMock}"`,
      );
      expect(result).toBe(pipelineIdMock);
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.putIngestPipeline.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service['createPipeline'](optionsMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('startReindex', () => {
    it('should get config', async () => {
      // Given
      elasticClientMock.reindex.mockResolvedValue({ task: taskIdMock });

      // When
      await service['startReindex'](sourceIndexMock, pipelineIdMock, dryRun);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('ElasticControl');
    });

    it('should call elastic.reindex with correct body', async () => {
      // Given
      elasticClientMock.reindex.mockResolvedValue({ task: taskIdMock });

      // When
      await service['startReindex'](sourceIndexMock, pipelineIdMock, dryRun);

      // Then
      expect(elasticClientMock.reindex).toHaveBeenCalledExactlyOnceWith({
        source: { index: [sourceIndexMock] },
        dest: {
          index: elasticControlConfigMock.metricsIndex,
          pipeline: pipelineIdMock,
        },
      });
    });

    it('should log reindex start', async () => {
      // Given
      elasticClientMock.reindex.mockResolvedValue({ task: taskIdMock });

      // When
      await service['startReindex'](sourceIndexMock, pipelineIdMock, dryRun);

      // Then
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[reindex] Started reindex task "${taskIdMock}" `,
      );
    });

    it('should return taskId', async () => {
      // Given
      elasticClientMock.reindex.mockResolvedValue({ task: taskIdMock });

      // When
      const result = await service['startReindex'](
        sourceIndexMock,
        pipelineIdMock,
        dryRun,
      );

      // Then
      expect(result).toBe(taskIdMock);
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      const result = await service['startReindex'](
        sourceIndexMock,
        pipelineIdMock,
        dryRun,
      );

      // Then
      expect(elasticClientMock.reindex).not.toHaveBeenCalled();
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[reindex] dry-run: would start reindex task from "${sourceIndexMock}" -> "${elasticControlConfigMock.metricsIndex}" using pipeline "${pipelineIdMock}"`,
      );
      expect(result).toBeUndefined();
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.reindex.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service['startReindex'](sourceIndexMock, pipelineIdMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('buildPipelineId', () => {
    it('should return a sorted, underscore-joined string', () => {
      // When
      const result = service['buildPipelineId'](optionsMock);

      // Then
      // Sorted keys: key, period, pivot, product, range
      expect(result).toBe(
        'nbOfConnections_2025-08_sp_franceconnect_plus_month',
      );
    });
  });

  describe('buildPipelineBody', () => {
    it('should return a correctly structured pipeline body', () => {
      // Given
      const keyToOmmit = OTHER_BY_KEY[optionsMock.key];
      const { groupFields, nameFields } = PIVOT_FIELDS[optionsMock.pivot];

      // When
      const result = service['buildPipelineBody'](optionsMock);

      // Then
      expect(result).toEqual({
        description: `create and format metrics for ${optionsMock.key}`,
        processors: [
          { set: { field: 'date', value: '2025-08-01' } },
          { set: { field: 'key', value: optionsMock.key } },
          { set: { field: 'range', value: optionsMock.range } },
          { set: { field: 'product', value: optionsMock.product } },
          { set: { field: 'pivot', value: optionsMock.pivot } },
          {
            fingerprint: {
              fields: [
                'key',
                'date',
                'range',
                'product',
                'pivot',
                ...groupFields,
              ],
              // eslint-disable-next-line @typescript-eslint/naming-convention
              target_field: '_id',
              method: 'SHA-256',
            },
          },
          {
            rename: {
              field: optionsMock.key,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              target_field: 'value',
            },
          },
          {
            rename: {
              field: `info.${nameFields[0]}`,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              target_field: nameFields[0],
            },
          },
          {
            rename: {
              field: `info.${nameFields[1]}`,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              target_field: nameFields[1],
            },
          },
          { remove: { field: [keyToOmmit] } },
          { remove: { field: ['info'] } },
        ],
      });
    });

    describe('with SP pivot', () => {
      it('should include rename processors for spName and spType', () => {
        // Given
        const options: ElasticControlReindexOptionsDto = {
          ...optionsMock,
          pivot: ElasticControlPivotEnum.SP,
        };

        // When
        const result = service['buildPipelineBody'](options);

        // Then
        const renameProcessors = result.processors.filter((p) => p.rename);
        const renameFields = renameProcessors.map((p) => p.rename.field);
        expect(renameFields).toContain('info.spName');
        expect(renameFields).toContain('info.spType');
      });
    });

    describe('with SP_IDP_PAIR pivot', () => {
      it('should include both spId and idpId in fingerprint fields', () => {
        // Given
        const options: ElasticControlReindexOptionsDto = {
          ...optionsMock,
          pivot: ElasticControlPivotEnum.SP_IDP_PAIR,
        };

        // When
        const result = service['buildPipelineBody'](options);

        // Then
        const fingerprintProcessor = result.processors.find(
          (p) => p.fingerprint !== undefined,
        );
        expect(fingerprintProcessor.fingerprint.fields).toEqual([
          'key',
          'date',
          'range',
          'product',
          'pivot',
          'spId',
          'idpId',
        ]);
      });

      it('should create rename processors for both spName and idpName', () => {
        // Given
        const options: ElasticControlReindexOptionsDto = {
          ...optionsMock,
          pivot: ElasticControlPivotEnum.SP_IDP_PAIR,
        };

        // When
        const result = service['buildPipelineBody'](options);

        // Then
        const renameProcessors = result.processors.filter(
          (p) => p.rename !== undefined && p.rename.field?.startsWith('info.'),
        );

        expect(renameProcessors).toHaveLength(2);
        expect(renameProcessors[0].rename).toEqual({
          field: 'info.spName',
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_field: 'spName',
        });
        expect(renameProcessors[1].rename).toEqual({
          field: 'info.idpName',
          // elastic defined property
          // eslint-disable-next-line @typescript-eslint/naming-convention
          target_field: 'idpName',
        });
      });
    });
  });

  describe('getReindexedMetrics', () => {
    beforeEach(() => {
      elasticClientMock.countDocuments.mockResolvedValue({
        count: totalReindexMock,
      });
    });

    it('should get config', async () => {
      // When
      await service['getReindexedMetrics'](optionsMock);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('ElasticControl');
    });

    it('should call elastic.countDocuments with correct body', async () => {
      // Given
      const { groupFields } = PIVOT_FIELDS[optionsMock.pivot];

      // When
      await service['getReindexedMetrics'](optionsMock);

      // Then
      expect(elasticClientMock.countDocuments).toHaveBeenCalledExactlyOnceWith(
        elasticControlConfigMock.metricsIndex,
        {
          query: {
            bool: {
              filter: [
                { term: { key: optionsMock.key } },
                { term: { product: optionsMock.product } },
                { term: { range: optionsMock.range } },
                { term: { date: '2025-08-01' } },
                { term: { pivot: optionsMock.pivot } },
                ...groupFields.map((field) => ({ exists: { field } })),
              ],
            },
          },
        },
      );
    });

    it('should return count', async () => {
      // When
      const result = await service['getReindexedMetrics'](optionsMock);

      // Then
      expect(result).toBe(totalReindexMock);
    });

    it('should return 0 if count is undefined', async () => {
      // Given
      elasticClientMock.countDocuments.mockResolvedValueOnce({
        count: undefined,
      });

      // When
      const result = await service['getReindexedMetrics'](optionsMock);

      // Then
      expect(result).toBe(0);
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.countDocuments.mockRejectedValueOnce(error);

      // When / Then
      await expect(service['getReindexedMetrics'](optionsMock)).rejects.toThrow(
        ElasticControlInvalidRequestException,
      );
    });

    describe('with SP_IDP_PAIR pivot', () => {
      it('should add exists filters for both spId and idpId', async () => {
        // Given
        const options: ElasticControlReindexOptionsDto = {
          ...optionsMock,
          pivot: ElasticControlPivotEnum.SP_IDP_PAIR,
        };

        // When
        await service['getReindexedMetrics'](options);

        // Then
        expect(
          elasticClientMock.countDocuments,
        ).toHaveBeenCalledExactlyOnceWith(
          elasticControlConfigMock.metricsIndex,
          {
            query: {
              bool: {
                filter: [
                  { term: { key: options.key } },
                  { term: { product: options.product } },
                  { term: { range: options.range } },
                  { term: { date: '2025-08-01' } },
                  { term: { pivot: options.pivot } },
                  { exists: { field: 'spId' } },
                  { exists: { field: 'idpId' } },
                ],
              },
            },
          },
        );
      });
    });
  });
});
