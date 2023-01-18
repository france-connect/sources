import { ChangeStreamDocument } from 'mongodb';
import { Model } from 'mongoose';

import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { MongooseCollectionOperationWatcherHelper } from './mongoose-collection-update-watcher.helper';

describe('MongooseCollectionOperationWatcherHelper', () => {
  let service: MongooseCollectionOperationWatcherHelper;
  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
  };

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
      service.watchWith(modelMock as unknown as Model<unknown>, jest.fn());
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
      service['watch'](modelMock as unknown as Model<unknown>, callbackMock);
      // Then
      expect(streamMock.on).toHaveBeenCalledTimes(1);
      expect(streamMock.on).toHaveBeenCalledWith('change', bindReturnValue);
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
      service['watch'](modelMock as unknown as Model<unknown>, callbackMock);
      // Then
      expect(service['operationTypeWatcher'].bind).toHaveBeenCalledTimes(1);
      expect(service['operationTypeWatcher'].bind).toHaveBeenCalledWith(
        service,
        modelMock.modelName,
        callbackMock,
      );
    });
  });
  describe('connectAllWatchers', () => {
    it('should call watch function', () => {
      // Given
      const listenersMock = [
        { model: Symbol(), callback: Symbol() },
        { model: Symbol(), callback: Symbol() },
      ];
      MongooseCollectionOperationWatcherHelper['listeners'] = listenersMock;
      const streamMock = { on: jest.fn() };
      modelMock.watch.mockReturnValueOnce(streamMock);
      service['watch'] = jest.fn();
      // When
      service.connectAllWatchers();
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
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalled();
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
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(callbackMock).not.toHaveBeenCalled();
    });
  });
});
