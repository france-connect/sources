import { createHash, Hash } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { ElasticControlTransformOptionsDto } from '../dto';
import {
  ControlStatesEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
  ElasticOperationsEnum,
  TransformStatesEnum,
} from '../enums';
import { ElasticControlInvalidRequestException } from '../exceptions';
import { ControlDocumentInterface } from '../interfaces';
import { isNotFound } from '../utils';
import { ElasticControlClientService } from './elastic-control-client.service';
import { ElasticControlDocumentService } from './elastic-control-document.service';

jest.mock('crypto');
jest.mock('../utils');
jest.mock('undici', () => ({
  fetch: jest.fn(),
  Agent: jest.fn(),
  setGlobalDispatcher: jest.fn(),
}));

describe('ElasticControlDocumentService', () => {
  let service: ElasticControlDocumentService;
  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();

  const createHashMock = jest.mocked(createHash);
  const isNotFoundMock = jest.mocked(isNotFound);

  const elasticClientMock = {
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    getDocument: jest.fn(),
    getIndex: jest.fn(),
    createIndex: jest.fn(),
  };

  const updateMock = jest.fn();
  const digestMock = jest.fn();

  const optionsMock: ElasticControlTransformOptionsDto = {
    product: ElasticControlProductEnum.HIGH,
    range: ElasticControlRangeEnum.MONTH,
    pivot: ElasticControlPivotEnum.SP,
    period: '2025-08',
  };

  const operationMock = ElasticOperationsEnum.TRANSFORM;
  const controlDocIdMock = 'controlDocIdMock';
  const controlIndexMock = 'controlIndexMock';
  const configDataMock = { controlIndex: controlIndexMock };

  const controlDocMock: ControlDocumentInterface = {
    id: controlDocIdMock,
    operation: operationMock,
    state: ControlStatesEnum.PENDING,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    options: optionsMock,
  };

  const dryRun = false;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2025-01-01T12:00:00Z'));

    updateMock.mockReturnThis();
    digestMock.mockReturnValue(controlDocIdMock);
    createHashMock.mockReturnValue({
      update: updateMock,
      digest: digestMock,
    } as unknown as Hash);

    configMock.get.mockReturnValue(configDataMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticControlDocumentService,
        LoggerService,
        ConfigService,
        ElasticControlClientService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(ElasticControlClientService)
      .useValue(elasticClientMock)
      .compile();

    isNotFoundMock.mockReturnValue(false);

    service = module.get<ElasticControlDocumentService>(
      ElasticControlDocumentService,
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call config.get', () => {
    // Then
    expect(configMock.get).toHaveBeenCalledExactlyOnceWith('ElasticControl');
  });

  it('should set controlIndex', () => {
    // Then
    expect(service['controlIndex']).toBe(controlIndexMock);
  });

  describe('getOrCreateControlDoc', () => {
    beforeEach(() => {
      service['buildControlDocId'] = jest
        .fn()
        .mockReturnValue(controlDocIdMock);
      service['ensureControlIndex'] = jest.fn().mockResolvedValue(undefined);
      service['getControlDocById'] = jest.fn().mockResolvedValue(null);
      service['createControlDoc'] = jest.fn().mockResolvedValue(controlDocMock);
    });

    it('should call buildControlDocId', async () => {
      // When
      await service.getOrCreateControlDoc(optionsMock, operationMock, dryRun);

      // Then
      expect(service['buildControlDocId']).toHaveBeenCalledExactlyOnceWith(
        operationMock,
        optionsMock,
      );
    });

    it('should call ensureControlIndex', async () => {
      // When
      await service.getOrCreateControlDoc(optionsMock, operationMock, dryRun);

      // Then
      expect(service['ensureControlIndex']).toHaveBeenCalledExactlyOnceWith(
        dryRun,
      );
    });

    it('should call getControlDocById', async () => {
      // When
      await service.getOrCreateControlDoc(optionsMock, operationMock, dryRun);

      // Then
      expect(service['getControlDocById']).toHaveBeenCalledExactlyOnceWith(
        controlDocIdMock,
      );
    });

    it('should call createControlDoc', async () => {
      // When
      await service.getOrCreateControlDoc(optionsMock, operationMock, dryRun);

      // Then
      expect(service['createControlDoc']).toHaveBeenCalledExactlyOnceWith(
        controlDocIdMock,
        operationMock,
        optionsMock,
        dryRun,
      );
    });

    it('should log creation', async () => {
      // When
      await service.getOrCreateControlDoc(optionsMock, operationMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] Creating control document "${controlDocIdMock}"`,
      );
    });

    it('should return the new doc', async () => {
      // When
      const result = await service.getOrCreateControlDoc(
        optionsMock,
        operationMock,
        dryRun,
      );

      // Then
      expect(result).toBe(controlDocMock);
    });

    it('should not call createControlDoc if existing', async () => {
      // Given
      service['getControlDocById'] = jest
        .fn()
        .mockResolvedValueOnce(controlDocMock);

      // When
      await service.getOrCreateControlDoc(optionsMock, operationMock, dryRun);

      // Then
      expect(service['createControlDoc']).not.toHaveBeenCalled();
    });

    it('should return existing doc', async () => {
      // Given
      service['getControlDocById'] = jest
        .fn()
        .mockResolvedValueOnce(controlDocMock);

      // When
      const result = await service.getOrCreateControlDoc(
        optionsMock,
        operationMock,
        dryRun,
      );

      // Then
      expect(result).toBe(controlDocMock);
    });
  });

  describe('updateControlDoc', () => {
    const nextState = ControlStatesEnum.RUNNING;
    const statusMock = {
      id: 'transformIdMock',
      state: TransformStatesEnum.STARTED,
    };
    const updatedDocMock = {
      ...controlDocMock,
      state: nextState,
      status: statusMock,
      updatedAt: '2025-01-01T12:00:00.000Z',
    };

    it('should call elastic.updateDocument with updated doc', async () => {
      // When
      await service.updateControlDoc(
        controlDocMock,
        nextState,
        statusMock,
        dryRun,
      );

      // Then
      expect(elasticClientMock.updateDocument).toHaveBeenCalledExactlyOnceWith(
        controlIndexMock,
        controlDocMock.id,
        updatedDocMock,
      );
    });

    it('should log update', async () => {
      // When
      await service.updateControlDoc(
        controlDocMock,
        nextState,
        statusMock,
        dryRun,
      );

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] Updated document "${controlDocMock.id}" state ${controlDocMock.state} -> ${nextState}`,
      );
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      await service.updateControlDoc(
        controlDocMock,
        nextState,
        statusMock,
        dryRun,
      );

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] dry-run: would update document "${controlDocMock.id}" state ${controlDocMock.state} -> ${nextState}`,
      );
      expect(elasticClientMock.updateDocument).not.toHaveBeenCalled();
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error();
      elasticClientMock.updateDocument.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service.updateControlDoc(controlDocMock, nextState, statusMock, dryRun),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('getControlDocById', () => {
    const elasticResponseMock = { _source: controlDocMock };

    beforeEach(() => {
      elasticClientMock.getDocument.mockResolvedValue(elasticResponseMock);
    });

    it('should call elastic.getDocument', async () => {
      // When
      await service.getControlDocById(controlDocIdMock);

      // Then
      expect(elasticClientMock.getDocument).toHaveBeenCalledExactlyOnceWith(
        controlIndexMock,
        controlDocIdMock,
      );
    });

    it('should return the document source on success', async () => {
      // When
      const result = await service.getControlDocById(controlDocIdMock);

      // Then
      expect(result).toBe(controlDocMock);
    });

    it('should return null if isNotFound is true', async () => {
      // Given
      const error = new Error('not found');
      elasticClientMock.getDocument.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(true);

      // When
      const result = await service.getControlDocById(controlDocIdMock);

      // Then
      expect(result).toBeNull();
      expect(isNotFoundMock).toHaveBeenCalledWith(error);
    });

    it('should throw ElasticControlInvalidRequestException on other errors', async () => {
      // Given
      const error = new Error('other error');
      elasticClientMock.getDocument.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(false);

      // When / Then
      await expect(service.getControlDocById(controlDocIdMock)).rejects.toThrow(
        ElasticControlInvalidRequestException,
      );
    });
  });

  describe('buildControlDocId', () => {
    it('should call createHash with sha256', () => {
      // When
      service.buildControlDocId(operationMock, optionsMock);

      // Then
      expect(createHashMock).toHaveBeenCalledWith('sha256');
    });

    it('should call update with sorted, joined payload', () => {
      // Given
      const expectedPayload = [
        operationMock,
        optionsMock.period,
        optionsMock.pivot,
        optionsMock.product,
        optionsMock.range,
      ].join('.');

      // When
      service.buildControlDocId(operationMock, optionsMock);

      // Then
      expect(updateMock).toHaveBeenCalledWith(expectedPayload, 'utf8');
    });

    it('should call digest with hex', () => {
      // When
      service.buildControlDocId(operationMock, optionsMock);

      // Then
      expect(digestMock).toHaveBeenCalledWith('hex');
    });

    it('should return the hashed id', () => {
      // When
      const result = service.buildControlDocId(operationMock, optionsMock);

      // Then
      expect(result).toBe(controlDocIdMock);
    });
  });

  describe('createControlDoc', () => {
    const expectedInitialDoc: ControlDocumentInterface = {
      id: controlDocIdMock,
      operation: operationMock,
      state: ControlStatesEnum.PENDING,
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
      options: optionsMock,
    };

    it('should call elastic.createDocument with the correct initial doc', async () => {
      // When
      await service['createControlDoc'](
        controlDocIdMock,
        operationMock,
        optionsMock,
        dryRun,
      );

      // Then
      expect(elasticClientMock.createDocument).toHaveBeenCalledExactlyOnceWith(
        controlIndexMock,
        controlDocIdMock,
        expectedInitialDoc,
      );
    });

    it('should return the initial doc', async () => {
      // When
      const result = await service['createControlDoc'](
        controlDocIdMock,
        operationMock,
        optionsMock,
        dryRun,
      );

      // Then
      expect(result).toEqual(expectedInitialDoc);
    });

    it('should log creation', async () => {
      // When
      await service['createControlDoc'](
        controlDocIdMock,
        operationMock,
        optionsMock,
        dryRun,
      );

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] Created control document "${controlDocIdMock}"`,
      );
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      const result = await service['createControlDoc'](
        controlDocIdMock,
        operationMock,
        optionsMock,
        dryRun,
      );

      // Then
      expect(elasticClientMock.createDocument).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] dry-run: would create document "${controlDocIdMock}" in index "${controlIndexMock}"`,
      );
      expect(result).toEqual(expectedInitialDoc);
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.createDocument.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service['createControlDoc'](
          controlDocIdMock,
          operationMock,
          optionsMock,
          dryRun,
        ),
      ).rejects.toThrow(ElasticControlInvalidRequestException);
    });
  });

  describe('ensureControlIndex', () => {
    beforeEach(() => {
      elasticClientMock.getIndex.mockResolvedValue({ status: 'ok' });
      service['createControlIndex'] = jest.fn().mockResolvedValue(undefined);
    });

    it('should call elastic.getIndex', async () => {
      // When
      await service['ensureControlIndex'](dryRun);

      // Then
      expect(elasticClientMock.getIndex).toHaveBeenCalledExactlyOnceWith(
        controlIndexMock,
      );
    });

    it('should return early if index exists', async () => {
      // When
      await service['ensureControlIndex'](dryRun);

      // Then
      expect(service['createControlIndex']).not.toHaveBeenCalled();
    });

    it('should call createControlIndex if index not found', async () => {
      // Given
      const error = new Error('not found');
      elasticClientMock.getIndex.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(true);

      // When
      await service['ensureControlIndex'](dryRun);

      // Then
      expect(service['createControlIndex']).toHaveBeenCalledExactlyOnceWith(
        dryRun,
      );
    });

    it('should log creation if index not found', async () => {
      // Given
      const error = new Error('not found');
      elasticClientMock.getIndex.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(true);

      // When
      await service['ensureControlIndex'](dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] Creating control index`,
      );
    });

    it('should throw ElasticControlInvalidRequestException', async () => {
      // Given
      const error = new Error('other error');
      elasticClientMock.getIndex.mockRejectedValueOnce(error);
      isNotFoundMock.mockReturnValueOnce(false);

      // When / Then
      await expect(service['ensureControlIndex'](dryRun)).rejects.toThrow(
        ElasticControlInvalidRequestException,
      );
    });
  });

  describe('createControlIndex', () => {
    const expectedBody = {
      settings: {
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        number_of_shards: 1,
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        number_of_replicas: 1,
      },
      mappings: {
        dynamic: 'strict',
        // elastic defined property
        // eslint-disable-next-line @typescript-eslint/naming-convention
        dynamic_templates: [
          {
            keywords: {
              // elastic defined property
              // eslint-disable-next-line @typescript-eslint/naming-convention
              path_match: '{status,options}.*',
              // elastic defined property
              // eslint-disable-next-line @typescript-eslint/naming-convention
              match_mapping_type: 'string',
              mapping: { type: 'keyword' },
            },
          },
        ],
        _source: { enabled: true },
        properties: {
          id: { type: 'keyword' },
          operation: { type: 'keyword' },
          state: { type: 'keyword' },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },
          options: { type: 'object', dynamic: true },
          status: { type: 'object', dynamic: true },
        },
      },
    };

    it('should call elastic.createIndex with correct body', async () => {
      // When
      await service['createControlIndex'](dryRun);

      // Then
      expect(elasticClientMock.createIndex).toHaveBeenCalledExactlyOnceWith(
        controlIndexMock,
        expectedBody,
      );
    });

    it('should log creation', async () => {
      // When
      await service['createControlIndex'](dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] Created index "${controlIndexMock}"`,
      );
    });

    it('should handle dryRun', async () => {
      // Given
      const dryRun = true;

      // When
      await service['createControlIndex'](dryRun);

      // Then
      expect(elasticClientMock.createIndex).not.toHaveBeenCalled();
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[control] dry-run: would create index "${controlIndexMock}"`,
      );
    });

    it('should throw ElasticControlInvalidRequestException on error', async () => {
      // Given
      const error = new Error('test error');
      elasticClientMock.createIndex.mockRejectedValueOnce(error);

      // When / Then
      await expect(service['createControlIndex'](dryRun)).rejects.toThrow(
        ElasticControlInvalidRequestException,
      );
    });
  });
});
