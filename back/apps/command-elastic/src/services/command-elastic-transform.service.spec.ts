import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import {
  ControlDocumentInterface,
  ControlStatesEnum,
  ElasticControlDocumentService,
  ElasticControlPivotEnum,
  ElasticControlProductEnum,
  ElasticControlRangeEnum,
  ElasticControlTransformOptionsDto,
  ElasticControlTransformService,
  ElasticOperationsEnum,
  TransformStatesEnum,
  TransformStatusInterface,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CommandElasticInvalidOptionsException } from '../exceptions';
import { isTransformCompleted, isTransformRunning } from '../utils';
import { CommandElasticTransformService } from './command-elastic-transform.service';

jest.mock('@fc/common');
jest.mock('../utils');

describe('CommandElasticTransformService', () => {
  let service: CommandElasticTransformService;
  const loggerMock = getLoggerMock();

  const validateDtoMock = jest.mocked(validateDto);
  const isTransformCompletedMock = jest.mocked(isTransformCompleted);
  const isTransformRunningMock = jest.mocked(isTransformRunning);

  const transformServiceMock = {
    findTransform: jest.fn(),
    initializeTransform: jest.fn(),
  };
  const controlDocumentMock = {
    getOrCreateControlDoc: jest.fn(),
    updateControlDoc: jest.fn(),
    buildControlDocId: jest.fn(),
    getControlDocById: jest.fn(),
  };

  const optionsMock: ElasticControlTransformOptionsDto = {
    product: ElasticControlProductEnum.HIGH,
    range: ElasticControlRangeEnum.MONTH,
    pivot: ElasticControlPivotEnum.SP,
    period: '2025-08',
  };

  const controlDocMock: ControlDocumentInterface = {
    id: 'controlDocId',
    operation: ElasticOperationsEnum.TRANSFORM,
    state: ControlStatesEnum.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    options: optionsMock,
  };

  const transformMock: TransformStatusInterface = {
    id: 'transformId',
    state: TransformStatesEnum.STARTED,
  };

  const dryRun = false;
  const force = false;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandElasticTransformService,
        LoggerService,
        ElasticControlTransformService,
        ElasticControlDocumentService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ElasticControlTransformService)
      .useValue(transformServiceMock)
      .overrideProvider(ElasticControlDocumentService)
      .useValue(controlDocumentMock)
      .compile();

    validateDtoMock.mockResolvedValue([]);

    service = module.get<CommandElasticTransformService>(
      CommandElasticTransformService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('safeInitializeTransform', () => {
    beforeEach(() => {
      service['validateOptions'] = jest.fn().mockResolvedValue(undefined);
      service['shouldInitialize'] = jest.fn().mockReturnValueOnce(true);

      controlDocumentMock.getOrCreateControlDoc.mockResolvedValue(
        controlDocMock,
      );
      transformServiceMock.findTransform.mockResolvedValue(null);
      transformServiceMock.initializeTransform.mockResolvedValue(transformMock);
    });

    it('should call validateOptions', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(service['validateOptions']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call controlDocument.getOrCreateControlDoc', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(
        controlDocumentMock.getOrCreateControlDoc,
      ).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
        ElasticOperationsEnum.TRANSFORM,
        dryRun,
      );
    });

    it('should call transform.findTransform', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(
        transformServiceMock.findTransform,
      ).toHaveBeenCalledExactlyOnceWith(optionsMock);
    });

    it('should call shouldInitialize', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(service['shouldInitialize']).toHaveBeenCalledExactlyOnceWith(
        controlDocMock,
        null,
        force,
      );
    });

    it('should call transform.initializeTransform', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(transformServiceMock.initializeTransform).toHaveBeenCalledWith(
        optionsMock,
        dryRun,
      );
    });

    it('should call controlDocument.updateControlDoc', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(controlDocumentMock.updateControlDoc).toHaveBeenCalledWith(
        controlDocMock,
        ControlStatesEnum.RUNNING,
        transformMock,
        dryRun,
      );
    });

    it('should log messages', async () => {
      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(5);
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        1,
        `[Command] Transform initialization requested with options: ${JSON.stringify(optionsMock)}`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        2,
        `[Command] Control document has state=${controlDocMock.state}`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        3,
        `[Command] Transform has state=undefined`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        4,
        `[Command] Initializing transform`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        5,
        `[Command] Updating control document`,
      );
    });

    it('should log abort message if shouldInitialize returns false', async () => {
      // Given
      service['shouldInitialize'] = jest.fn().mockReturnValueOnce(false);

      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(4);
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        4,
        `[Command] Aborting: transform is already initialized, re-run with --force to restart`,
      );
    });

    it('should not call transform.initializeTransform if shouldInitialize returns false', async () => {
      // Given
      service['shouldInitialize'] = jest.fn().mockReturnValueOnce(false);

      // When
      await service.safeInitializeTransform(optionsMock, dryRun, force);

      // Then
      expect(transformServiceMock.initializeTransform).not.toHaveBeenCalled();
    });
  });

  describe('actualizeTransform', () => {
    const runningDocMock = {
      ...controlDocMock,
      state: ControlStatesEnum.RUNNING,
    };
    const completedTransformMock = {
      ...transformMock,
      state: TransformStatesEnum.STOPPED,
      lastCheckpoint: 1,
    };

    beforeEach(() => {
      service['validateOptions'] = jest.fn().mockResolvedValue(undefined);
      service['fetchTransformDoc'] = jest
        .fn()
        .mockResolvedValue(runningDocMock);
      service['shouldActualize'] = jest.fn().mockReturnValue(true);
      service['getNextState'] = jest
        .fn()
        .mockReturnValue(ControlStatesEnum.COMPLETED);

      transformServiceMock.findTransform.mockResolvedValue(
        completedTransformMock,
      );
    });

    it('should call validateOptions', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(service['validateOptions']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call fetchTransformDoc', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(service['fetchTransformDoc']).toHaveBeenCalledExactlyOnceWith(
        optionsMock,
      );
    });

    it('should call transform.findTransform', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(
        transformServiceMock.findTransform,
      ).toHaveBeenCalledExactlyOnceWith(optionsMock);
    });

    it('should call shouldActualize', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(service['shouldActualize']).toHaveBeenCalledExactlyOnceWith(
        runningDocMock,
      );
    });

    it('should call getNextState', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(service['getNextState']).toHaveBeenCalledExactlyOnceWith(
        completedTransformMock,
      );
    });

    it('should call controlDocument.updateControlDoc', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(
        controlDocumentMock.updateControlDoc,
      ).toHaveBeenCalledExactlyOnceWith(
        runningDocMock,
        ControlStatesEnum.COMPLETED,
        completedTransformMock,
        dryRun,
      );
    });

    it('should log messages', async () => {
      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(4);
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        1,
        `[Command] Transform actualisation requested with options: ${JSON.stringify(optionsMock)}`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        2,
        `[Command] Control document has state=${runningDocMock.state}`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        3,
        `[Command] Transform has state=${completedTransformMock.state}`,
      );
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        4,
        `[Command] Updating control document`,
      );
    });

    it('should log abort message if shouldActualize returns false', async () => {
      // Given
      service['shouldActualize'] = jest.fn().mockReturnValueOnce(false);

      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledTimes(4);
      expect(loggerMock.debug).toHaveBeenNthCalledWith(
        4,
        `[Command] Aborting: Control document is already in final state, or transform is not found`,
      );
    });

    it('should not call controlDocument.updateControlDoc if shouldActualize returns false', async () => {
      // Given
      service['shouldActualize'] = jest.fn().mockReturnValueOnce(false);

      // When
      await service.actualizeTransform(optionsMock, dryRun);

      // Then
      expect(controlDocumentMock.updateControlDoc).not.toHaveBeenCalled();
    });
  });

  describe('shouldInitialize', () => {
    it('should return true if force is true', () => {
      // When
      const result = service['shouldInitialize'](undefined, undefined, true);

      // Then
      expect(result).toBe(true);
    });

    it('should return true if no transform and doc is PENDING', () => {
      // When
      const result = service['shouldInitialize'](controlDocMock, null, false);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if transform exists (and no force)', () => {
      // When
      const result = service['shouldInitialize'](
        controlDocMock,
        transformMock,
        false,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false if doc state is not PENDING (and no transform/force)', () => {
      // Given
      const runningDocMock = {
        ...controlDocMock,
        state: ControlStatesEnum.RUNNING,
      };

      // When
      const result = service['shouldInitialize'](runningDocMock, null, false);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('shouldActualize', () => {
    it('should return true if doc state is RUNNING', () => {
      // Given
      const runningDocMock = {
        ...controlDocMock,
        state: ControlStatesEnum.RUNNING,
      };

      // When
      const result = service['shouldActualize'](runningDocMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if doc state is not RUNNING', () => {
      // When
      const result = service['shouldActualize'](controlDocMock);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('getNextState', () => {
    it('should return FAILED if transform is undefined', () => {
      // When
      const state = service['getNextState'](undefined);

      // Then
      expect(state).toBe(ControlStatesEnum.FAILED);
    });

    it('should call isTransformCompleted', () => {
      // When
      service['getNextState'](transformMock);

      // Then
      expect(isTransformCompletedMock).toHaveBeenCalledExactlyOnceWith(
        transformMock,
      );
    });

    it('should call isTransformRunningMock', () => {
      // When
      service['getNextState'](transformMock);

      // Then
      expect(isTransformRunningMock).toHaveBeenCalledExactlyOnceWith(
        transformMock,
      );
    });

    it('should return COMPLETED if isTransformCompleted is true', () => {
      // Given
      isTransformCompletedMock.mockReturnValueOnce(true);

      // When
      const state = service['getNextState'](transformMock);

      // Then
      expect(state).toBe(ControlStatesEnum.COMPLETED);
    });

    it('should return RUNNING if not completed and isTransformRunning is true', () => {
      // Given
      isTransformCompletedMock.mockReturnValueOnce(false);
      isTransformRunningMock.mockReturnValueOnce(true);

      // When
      const state = service['getNextState'](transformMock);

      // Then
      expect(state).toBe(ControlStatesEnum.RUNNING);
    });

    it('should return FAILED if not completed and not running', () => {
      // Given
      isTransformCompletedMock.mockReturnValue(false);
      isTransformRunningMock.mockReturnValue(false);

      // When
      const state = service['getNextState'](transformMock);

      // Then
      expect(state).toBe(ControlStatesEnum.FAILED);
    });
  });

  describe('fetchTransformDoc', () => {
    const docId = 'controlDocId';

    beforeEach(() => {
      controlDocumentMock.buildControlDocId.mockReturnValue(docId);
      controlDocumentMock.getControlDocById.mockResolvedValue(controlDocMock);
    });

    it('should call controlDocument.buildControlDocId', async () => {
      // When
      await service['fetchTransformDoc'](optionsMock);

      // Then
      expect(
        controlDocumentMock.buildControlDocId,
      ).toHaveBeenCalledExactlyOnceWith(
        ElasticOperationsEnum.TRANSFORM,
        optionsMock,
      );
    });

    it('should call controlDocument.getControlDocById', async () => {
      // When
      await service['fetchTransformDoc'](optionsMock);

      // Then
      expect(
        controlDocumentMock.getControlDocById,
      ).toHaveBeenCalledExactlyOnceWith(docId);
    });

    it('should return the document', async () => {
      // When
      const result = await service['fetchTransformDoc'](optionsMock);

      // Then
      expect(result).toBe(controlDocMock);
    });
  });

  describe('validateOptions', () => {
    const errors = [{ property: 'period', constraints: { isString: '...' } }];

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
      expect(loggerMock.debug).toHaveBeenCalledExactlyOnceWith(
        `[Command] Aborting: invalid options: ${JSON.stringify(errors)}`,
      );
    });
  });
});
