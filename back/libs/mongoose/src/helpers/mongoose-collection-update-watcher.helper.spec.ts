import { ChangeStreamDocument } from 'mongodb';
import { Document, Model } from 'mongoose';

import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { MongooseCollectionOperationWatcherHelper } from './mongoose-collection-update-watcher.helper';

describe('MongooseCollectionOperationWatcherHelper', () => {
  let service: MongooseCollectionOperationWatcherHelper;
  const loggerServiceMock = getLoggerMock();

  const eventBusMock = {
    publish: jest.fn(),
  };

  const modelMock = {
    lean: jest.fn(),
    find: jest.fn(),
    watch: jest.fn(),
    modelName: 'mockedModelName',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [
        MongooseCollectionOperationWatcherHelper,
        LoggerService,
        EventBus,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .compile();

    service = module.get<MongooseCollectionOperationWatcherHelper>(
      MongooseCollectionOperationWatcherHelper,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('watchWith', () => {
    it('should call watch function when watchWith is called', () => {
      // Given
      const streamMock = { on: jest.fn() };
      service['watch'] = jest.fn().mockReturnValueOnce(streamMock);
      // When
      service.watchWith<Document>(
        modelMock as unknown as Model<Document>,
        jest.fn(),
      );
      // Then
      expect(service['watch']).toHaveBeenCalledTimes(1);
    });
  });
  describe('watch', () => {
    it('should call watch.on', () => {
      // Given
      const callbackMock = jest.fn();
      const bindReturnValue = Symbol();
      const streamMock = { on: jest.fn() };
      modelMock.watch.mockReturnValueOnce(streamMock);
      service['operationTypeWatcher'].bind = jest
        .fn()
        .mockReturnValue(bindReturnValue);
      // When
      service['watch'](modelMock as unknown as Model<Document>, callbackMock);
      // Then
      expect(streamMock.on).toHaveBeenCalledTimes(3);
      expect(streamMock.on).toHaveBeenNthCalledWith(
        1,
        'error',
        expect.any(Function),
      );
      expect(streamMock.on).toHaveBeenNthCalledWith(
        2,
        'close',
        expect.any(Function),
      );
      expect(streamMock.on).toHaveBeenNthCalledWith(
        3,
        'change',
        bindReturnValue,
      );
    });

    it('should call operationTypeWatcher.bind with good params', () => {
      // Given
      const callbackMock = jest.fn();
      const bindReturnValue = Symbol();
      const streamMock = { on: jest.fn() };
      modelMock.watch.mockReturnValueOnce(streamMock);
      service['operationTypeWatcher'].bind = jest
        .fn()
        .mockReturnValue(bindReturnValue);
      // When
      service['watch'](modelMock as unknown as Model<Document>, callbackMock);
      // Then
      expect(service['operationTypeWatcher'].bind).toHaveBeenCalledTimes(1);
      expect(service['operationTypeWatcher'].bind).toHaveBeenCalledWith(
        service,
        modelMock.modelName,
        callbackMock,
      );
    });

    it('should log a notice when watch is called', () => {
      // Given
      const callbackMock = jest.fn();
      const bindReturnValue = Symbol();
      const streamMock = { on: jest.fn() };
      modelMock.watch.mockReturnValueOnce(streamMock);
      service['operationTypeWatcher'].bind = jest
        .fn()
        .mockReturnValue(bindReturnValue);
      // When
      service['watch'](modelMock as unknown as Model<Document>, callbackMock);
      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        `Opened change stream for "${modelMock.modelName}".`,
      );
    });
  });

  describe('logError', () => {
    it('should log an error when logError is called', () => {
      // Given
      const errorMock = new Error('mocked error');
      const modelMocked = { modelName: 'mockedModelName' } as Model<Document>;

      // When
      service['logError'](modelMocked, errorMock);

      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.err).toHaveBeenCalledWith(
        `Error while watching "${modelMocked.modelName}" collection: ${errorMock.message}`,
      );
    });
  });

  describe('logClose', () => {
    it('should log a notice when logClose is called', () => {
      // Given
      const modelMocked = { modelName: 'mockedModelName' } as Model<Document>;

      // When
      service['logClose'](modelMocked);

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        `Watch on "${modelMocked.modelName}" collection closed, reconnecting...`,
      );
    });
  });

  describe('connectAllWatchers', () => {
    const listenersMock = [
      { model: Symbol(), callback: Symbol() },
      { model: Symbol(), callback: Symbol() },
    ];
    beforeEach(() => {
      const streamMock = { on: jest.fn() };

      service['listeners'] = listenersMock;
      service['watch'] = jest.fn();
      modelMock.watch.mockReturnValue(streamMock);

      service['closeAllWatchers'] = jest.fn();
    });

    it('should closes all watchers', async () => {
      // When
      await service.connectAllWatchers();

      // Then
      expect(service['closeAllWatchers']).toHaveBeenCalledOnce();
    });

    it('should call watch to reconnect all watchers', async () => {
      // When
      await service.connectAllWatchers();

      // Then
      expect(service['watch']).toHaveBeenNthCalledWith(
        1,
        listenersMock[0].model,
        listenersMock[0].callback,
      );
      expect(service['watch']).toHaveBeenNthCalledWith(
        2,
        listenersMock[1].model,
        listenersMock[1].callback,
      );
    });
  });
  describe('operationTypeWatcher', () => {
    it('should call eventBus.publish with a good operationType', () => {
      // Given
      const callbackMock = jest.fn();
      const modelNameMock = 'modelMockedName';
      const streamMock = { operationType: 'insert' } as ChangeStreamDocument;
      // When
      service['operationTypeWatcher'](modelNameMock, callbackMock, streamMock);
      // Then
      expect(callbackMock).toHaveBeenCalled();
    });

    it('should log a notice when operationTypeWatcher is called', () => {
      // Given
      const callbackMock = jest.fn();
      const modelNameMock = 'modelMockedName';
      const streamMock = {
        operationType: 'insert',
      } as unknown as ChangeStreamDocument;
      // When
      service['operationTypeWatcher'](modelNameMock, callbackMock, streamMock);
      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        `Detected "${streamMock.operationType}" on "${modelNameMock}", calling handler.`,
      );
    });

    it('should not call eventBus.publish with a bad operationType', () => {
      // Given
      const callbackMock = jest.fn();
      const modelNameMock = 'modelMockedName';
      const streamMock = {
        operationType: 'wrong',
      } as unknown as ChangeStreamDocument;
      // When
      service['operationTypeWatcher'](modelNameMock, callbackMock, streamMock);
      // Then
      expect(callbackMock).not.toHaveBeenCalled();
    });

    it('should not log a notice when operationTypeWatcher is called with a bad operationType', () => {
      // Given
      const callbackMock = jest.fn();
      const modelNameMock = 'modelMockedName';
      const streamMock = {
        operationType: 'wrong',
      } as unknown as ChangeStreamDocument;
      // When
      service['operationTypeWatcher'](modelNameMock, callbackMock, streamMock);
      // Then
      expect(loggerServiceMock.notice).not.toHaveBeenCalled();
    });
  });

  describe('closeAllWatchers', () => {
    // Given
    const closeMock1 = jest.fn();
    const closeMock2 = jest.fn();
    const model1 = { modelName: 'model1' };
    const model2 = { modelName: 'model2' };

    beforeEach(() => {
      service['listeners'] = [
        { stream: { close: closeMock1 }, model: model1 },
        { stream: { close: closeMock2 }, model: model2 },
      ];
    });

    it('should close all streams', async () => {
      // When
      await service['closeAllWatchers']();

      // Then
      expect(closeMock1).toHaveBeenCalledTimes(1);
      expect(closeMock2).toHaveBeenCalledTimes(1);
    });

    it('should create a log for each closed watcher', async () => {
      // When
      await service['closeAllWatchers']();

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        'Closed change stream for "model1".',
      );
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        'Closed change stream for "model2".',
      );
    });
  });
});
