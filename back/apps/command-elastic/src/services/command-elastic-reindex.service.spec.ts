import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import {
  ControlDocumentInterface,
  ControlStatesEnum,
  ElasticControlDocumentService,
  ElasticControlKeyEnum,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
  ElasticControlReindexOptionsDto,
  ElasticControlReindexService,
  ElasticOperationsEnum,
  ReindexStatusInterface,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CommandElasticInvalidOptionsException } from '../exceptions';
import { CommandElasticReindexService } from './command-elastic-reindex.service';

jest.mock('@fc/common');

describe('CommandElasticReindexService', () => {
  let service: CommandElasticReindexService;
  const loggerMock = getLoggerMock();

  const validateDtoMock = jest.mocked(validateDto);

  const reindexServiceMock = {
    initializeTask: jest.fn(),
    findTask: jest.fn(),
  };

  const controlDocumentMock = {
    getOrCreateControlDoc: jest.fn(),
    updateControlDoc: jest.fn(),
    buildControlDocId: jest.fn(),
    getControlDocById: jest.fn(),
  };

  const optionsMock: ElasticControlReindexOptionsDto = {
    key: ElasticControlKeyEnum.CONNECTIONS,
    product: ElasticControlProductEnum.HIGH,
    range: ElasticControlRangeEnum.MONTH,
    pivot: ElasticControlPivotEnum.SP,
    period: '2025-08',
  };

  const transformDocMock: ControlDocumentInterface = {
    id: 'transformDocId',
    operation: ElasticOperationsEnum.TRANSFORM,
    state: ControlStatesEnum.COMPLETED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: optionsMock,
    status: {
      id: 'transformId',
      state: 'stopped',
      docsIndexed: 100,
    },
  };

  const reindexDocMock: ControlDocumentInterface = {
    id: 'reindexDocId',
    operation: ElasticOperationsEnum.REINDEX,
    state: ControlStatesEnum.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: optionsMock,
    status: {
      id: 'taskId',
      completed: false,
    },
  };

  const reindexStatusMock: ReindexStatusInterface = {
    id: 'taskId',
    completed: false,
    total: 0,
  };

  const dryRun = false;
  const force = false;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandElasticReindexService,
        LoggerService,
        ElasticControlReindexService,
        ElasticControlDocumentService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ElasticControlReindexService)
      .useValue(reindexServiceMock)
      .overrideProvider(ElasticControlDocumentService)
      .useValue(controlDocumentMock)
      .compile();

    validateDtoMock.mockResolvedValue([]);

    service = module.get<CommandElasticReindexService>(
      CommandElasticReindexService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('safeInitializeReindex', () => {
    beforeEach(() => {
      service['validateOptions'] = jest.fn().mockResolvedValue(undefined);
      service['fetchTransformDoc'] = jest
        .fn()
        .mockResolvedValue(transformDocMock);
      service['shouldAbortDueToTransformState'] = jest
        .fn()
        .mockReturnValue(false);
      service['shouldInitialize'] = jest.fn().mockReturnValue(true);

      controlDocumentMock.getOrCreateControlDoc.mockResolvedValue(
        reindexDocMock,
      );
      reindexServiceMock.initializeTask.mockResolvedValue(reindexStatusMock);
    });

    it('should call validateOptions', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(service['validateOptions']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call fetchTransformDoc', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(service['fetchTransformDoc']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call shouldAbortDueToTransformState', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(
        service['shouldAbortDueToTransformState'],
      ).toHaveBeenCalledExactlyOnceWith(transformDocMock);
    });

    it('should call controlDocument.getOrCreateControlDoc', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(
        controlDocumentMock.getOrCreateControlDoc,
      ).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
        ElasticOperationsEnum.REINDEX,
        dryRun,
      );
    });

    it('should call shouldInitialize', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(service['shouldInitialize']).toHaveBeenCalledExactlyOnceWith(
        reindexDocMock,
        force,
      );
    });

    it('should call reindex.initializeTask', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(reindexServiceMock.initializeTask).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
        dryRun,
      );
    });

    it('should call controlDocument.updateControlDoc', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(
        controlDocumentMock.updateControlDoc,
      ).toHaveBeenCalledExactlyOnceWith(
        reindexDocMock,
        ControlStatesEnum.RUNNING,
        reindexStatusMock,
        dryRun,
      );
    });

    it('should log messages', async () => {
      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(loggerMock.info).toHaveBeenCalledTimes(5);
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        1,
        `[Command] Reindex initialization requested with options: ${JSON.stringify(optionsMock)}`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        `[Command] Transform control document has state=${transformDocMock.state}`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        3,
        `[Command] Reindex control document has state=${reindexDocMock.state}`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        4,
        `[Command] Initializing reindex`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        5,
        `[Command] Updating control document`,
      );
    });

    it('should abort if shouldAbortDueToTransformState returns true', async () => {
      // Given
      service['shouldAbortDueToTransformState'] = jest
        .fn()
        .mockReturnValue(true);

      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(controlDocumentMock.getOrCreateControlDoc).not.toHaveBeenCalled();
      expect(reindexServiceMock.initializeTask).not.toHaveBeenCalled();
    });

    it('should log abort message if shouldInitialize returns false', async () => {
      // Given
      service['shouldInitialize'] = jest.fn().mockReturnValue(false);

      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(loggerMock.info).toHaveBeenCalledTimes(4);
      expect(loggerMock.info).toHaveBeenLastCalledWith(
        `[Command] Aborting: reindex is already initialized, re-run with --force to restart`,
      );
    });

    it('should not call reindex.initializeTask if shouldInitialize returns false', async () => {
      // Given
      service['shouldInitialize'] = jest.fn().mockReturnValue(false);

      // When
      await service.safeInitializeReindex(optionsMock, dryRun, force);

      // Then
      expect(reindexServiceMock.initializeTask).not.toHaveBeenCalled();
    });
  });

  describe('actualizeReindex', () => {
    const runningReindexDocMock: ControlDocumentInterface = {
      ...reindexDocMock,
      state: ControlStatesEnum.RUNNING,
      status: {
        id: 'taskId',
        completed: false,
      },
    };

    const completedReindexStatusMock: ReindexStatusInterface = {
      id: 'taskId',
      completed: true,
      total: 100,
    };

    beforeEach(() => {
      service['validateOptions'] = jest.fn().mockResolvedValue(undefined);
      service['fetchReindexDoc'] = jest
        .fn()
        .mockResolvedValue(runningReindexDocMock);
      service['getReindexTarget'] = jest.fn().mockResolvedValue(100);
      service['getNextState'] = jest
        .fn()
        .mockReturnValue(ControlStatesEnum.COMPLETED);

      reindexServiceMock.findTask.mockResolvedValue(completedReindexStatusMock);
    });

    it('should call validateOptions', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(service['validateOptions']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call fetchReindexDoc', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(service['fetchReindexDoc']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call getReindexTarget', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(service['getReindexTarget']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call reindex.findTask', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(reindexServiceMock.findTask).toHaveBeenCalledExactlyOnceWith(
        'taskId',
        optionsMock,
      );
    });

    it('should call getNextState', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(service['getNextState']).toHaveBeenCalledExactlyOnceWith(
        completedReindexStatusMock,
        100,
      );
    });

    it('should call controlDocument.updateControlDoc', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(
        controlDocumentMock.updateControlDoc,
      ).toHaveBeenCalledExactlyOnceWith(
        runningReindexDocMock,
        ControlStatesEnum.COMPLETED,
        completedReindexStatusMock,
        dryRun,
      );
    });

    it('should log messages', async () => {
      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(loggerMock.info).toHaveBeenCalledTimes(5);
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        1,
        `[Command] Reindex actualisation requested with options: ${JSON.stringify(optionsMock)}`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        2,
        `[Command] Control document has state=${runningReindexDocMock.state}`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        3,
        `[Command] Reindex target=100`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        4,
        `[Command] Reindex total=${completedReindexStatusMock.total}`,
      );
      expect(loggerMock.info).toHaveBeenNthCalledWith(
        5,
        `[Command] Updating control document`,
      );
    });

    it('should log abort message if reindex doc is not RUNNING', async () => {
      // Given
      const completedReindexDoc = {
        ...runningReindexDocMock,
        state: ControlStatesEnum.COMPLETED,
      };
      service['fetchReindexDoc'] = jest
        .fn()
        .mockResolvedValue(completedReindexDoc);

      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(loggerMock.info).toHaveBeenCalledTimes(3);
      expect(loggerMock.info).toHaveBeenLastCalledWith(
        `[Command] Aborting: Control document is already in final state`,
      );
    });

    it('should not call reindex.findTask if reindex doc is not RUNNING', async () => {
      // Given
      const completedReindexDoc = {
        ...runningReindexDocMock,
        state: ControlStatesEnum.COMPLETED,
      };
      service['fetchReindexDoc'] = jest
        .fn()
        .mockResolvedValue(completedReindexDoc);

      // When
      await service.actualizeReindex(optionsMock, dryRun);

      // Then
      expect(reindexServiceMock.findTask).not.toHaveBeenCalled();
    });
  });

  describe('shouldAbortDueToTransformState', () => {
    it('should return true and log if transform doc is null', () => {
      // When
      const result = service['shouldAbortDueToTransformState'](null);

      // Then
      expect(result).toBe(true);
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[Command] Aborting: transform has not completed`,
      );
    });

    it('should return true and log if transform state is not COMPLETED', () => {
      // Given
      const runningTransformDoc = {
        ...transformDocMock,
        state: ControlStatesEnum.RUNNING,
      };

      // When
      const result =
        service['shouldAbortDueToTransformState'](runningTransformDoc);

      // Then
      expect(result).toBe(true);
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[Command] Aborting: transform has not completed`,
      );
    });

    it('should return false if transform state is COMPLETED', () => {
      // When
      const result =
        service['shouldAbortDueToTransformState'](transformDocMock);

      // Then
      expect(result).toBe(false);
      expect(loggerMock.info).not.toHaveBeenCalled();
    });
  });

  describe('shouldInitialize', () => {
    it('should return true if force is true', () => {
      // When
      const result = service['shouldInitialize'](reindexDocMock, true);

      // Then
      expect(result).toBe(true);
    });

    it('should return true if doc state is PENDING', () => {
      // When
      const result = service['shouldInitialize'](reindexDocMock, false);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if doc state is not PENDING (and no force)', () => {
      // Given
      const runningDocMock = {
        ...reindexDocMock,
        state: ControlStatesEnum.RUNNING,
      };

      // When
      const result = service['shouldInitialize'](runningDocMock, false);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('getNextState', () => {
    it('should return COMPLETED if reindex.completed is true and total equals target', () => {
      // Given
      const reindex: ReindexStatusInterface = {
        id: 'taskId',
        completed: true,
        total: 100,
      };

      // When
      const result = service['getNextState'](reindex, 100);

      // Then
      expect(result).toBe(ControlStatesEnum.COMPLETED);
    });

    it('should return FAILED if reindex.completed is true but total does not equal target', () => {
      // Given
      const reindex: ReindexStatusInterface = {
        id: 'taskId',
        completed: true,
        total: 50,
      };

      // When
      const result = service['getNextState'](reindex, 100);

      // Then
      expect(result).toBe(ControlStatesEnum.FAILED);
    });

    it('should return RUNNING if reindex.completed is false', () => {
      // Given
      const reindex: ReindexStatusInterface = {
        id: 'taskId',
        completed: false,
        total: 50,
      };

      // When
      const result = service['getNextState'](reindex, 100);

      // Then
      expect(result).toBe(ControlStatesEnum.RUNNING);
    });
  });

  describe('getReindexTarget', () => {
    beforeEach(() => {
      service['fetchTransformDoc'] = jest
        .fn()
        .mockResolvedValue(transformDocMock);
    });

    it('should call fetchTransformDoc', async () => {
      // When
      await service['getReindexTarget'](optionsMock);

      // Then
      expect(service['fetchTransformDoc']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should return docsIndexed from transform doc', async () => {
      // When
      const result = await service['getReindexTarget'](optionsMock);

      // Then
      expect(result).toBe(100);
    });

    it('should return undefined if transform doc has no status', async () => {
      // Given
      const transformDocWithoutStatus = {
        ...transformDocMock,
        status: undefined,
      };
      service['fetchTransformDoc'] = jest
        .fn()
        .mockResolvedValue(transformDocWithoutStatus);

      // When
      const result = await service['getReindexTarget'](optionsMock);

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('fetchTransformDoc', () => {
    const transformDocId = 'transformControlDocId';

    beforeEach(() => {
      controlDocumentMock.buildControlDocId.mockReturnValue(transformDocId);
      controlDocumentMock.getControlDocById.mockResolvedValue(transformDocMock);
    });

    it('should call controlDocument.buildControlDocId with TRANSFORM operation', async () => {
      // When
      await service['fetchTransformDoc'](optionsMock);

      // Then
      expect(
        controlDocumentMock.buildControlDocId,
      ).toHaveBeenCalledExactlyOnceWith(
        ElasticOperationsEnum.TRANSFORM,
        expect.objectContaining({
          product: optionsMock.product,
          range: optionsMock.range,
          pivot: optionsMock.pivot,
          period: optionsMock.period,
        }),
      );
    });

    it('should call controlDocument.getControlDocById', async () => {
      // When
      await service['fetchTransformDoc'](optionsMock);

      // Then
      expect(
        controlDocumentMock.getControlDocById,
      ).toHaveBeenCalledExactlyOnceWith(transformDocId);
    });

    it('should return the transform document', async () => {
      // When
      const result = await service['fetchTransformDoc'](optionsMock);

      // Then
      expect(result).toBe(transformDocMock);
    });
  });

  describe('fetchReindexDoc', () => {
    const reindexDocId = 'reindexControlDocId';

    beforeEach(() => {
      controlDocumentMock.buildControlDocId.mockReturnValue(reindexDocId);
      controlDocumentMock.getControlDocById.mockResolvedValue(reindexDocMock);
    });

    it('should call controlDocument.buildControlDocId with REINDEX operation', async () => {
      // When
      await service['fetchReindexDoc'](optionsMock);

      // Then
      expect(
        controlDocumentMock.buildControlDocId,
      ).toHaveBeenCalledExactlyOnceWith(
        ElasticOperationsEnum.REINDEX,
        optionsMock,
      );
    });

    it('should call controlDocument.getControlDocById', async () => {
      // When
      await service['fetchReindexDoc'](optionsMock);

      // Then
      expect(
        controlDocumentMock.getControlDocById,
      ).toHaveBeenCalledExactlyOnceWith(reindexDocId);
    });

    it('should return the reindex document', async () => {
      // When
      const result = await service['fetchReindexDoc'](optionsMock);

      // Then
      expect(result).toBe(reindexDocMock);
    });
  });

  describe('validateOptions', () => {
    const errors = [{ property: 'key', constraints: { isEnum: '...' } }];

    it('should call validateDto', async () => {
      // When
      await service['validateOptions'](optionsMock);

      // Then
      expect(validateDtoMock).toHaveBeenCalledOnce();
    });

    it('should return undefined if validation passes', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      const result = await service['validateOptions'](optionsMock);

      // Then
      expect(result).toBeUndefined();
    });

    it('should throw CommandElasticInvalidOptionsException if validation fails', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce(errors);

      // When / Then
      await expect(service['validateOptions'](optionsMock)).rejects.toThrow(
        CommandElasticInvalidOptionsException,
      );
    });

    it('should log error if validation fails', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce(errors);

      // When
      try {
        await service['validateOptions'](optionsMock);
        // You can't remove the catch argument, it's mandatory
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}

      // Then
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith(
        `[Command] Aborting: invalid options: ${JSON.stringify(errors)}`,
      );
    });
  });
});
