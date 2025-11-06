import { Document, Model } from 'mongoose';

import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { ChangeStreamCompatibleDocument } from '../types';
import { MongooseChangeStreamService } from './mongoose-change-stream.service';

describe('MongooseChangeStreamService', () => {
  let service: MongooseChangeStreamService;

  const loggerServiceMock = getLoggerMock();

  const mockOn = jest.fn();
  const mockClose = jest.fn();
  const mockConnection = {
    watch: jest.fn(),
  };

  const callbackMock = jest.fn();
  const errorMessageMock = 'Mock error message';
  const modelNameMock = 'mockModel';
  const collectionNameMock = 'mockCollectionName';
  const modelMock: Model<Document> = {
    collection: { collectionName: collectionNameMock },
    modelName: modelNameMock,
  } as unknown as Model<Document>;

  const mockError = new Error(errorMessageMock);

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseChangeStreamService,
        LoggerService,
        { provide: getConnectionToken(), useValue: mockConnection },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<MongooseChangeStreamService>(
      MongooseChangeStreamService,
    );

    mockConnection.watch.mockReturnValueOnce({
      on: mockOn,
      close: mockClose,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should call watchChangeStream', () => {
      // Given
      service['watchChangeStream'] = jest.fn();

      // When
      service.onApplicationBootstrap();

      // Then
      expect(service['watchChangeStream']).toHaveBeenCalledOnce();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call closeChangeStream', async () => {
      // Given
      service['closeChangeStream'] = jest.fn();

      // When
      await service.onModuleDestroy();

      // Then
      expect(service['closeChangeStream']).toHaveBeenCalledOnce();
    });
  });

  describe('registerWatcher', () => {
    it('should register a watcher', () => {
      // When
      service.registerWatcher(modelMock, callbackMock);

      // Then
      expect(service['collectionsToWatch'].get(collectionNameMock)).toEqual({
        callback: callbackMock,
        modelName: modelNameMock,
      });
    });

    it('should log the registration', () => {
      // When
      service.registerWatcher(modelMock, callbackMock);

      // Then
      expect(loggerServiceMock.info).toHaveBeenCalledExactlyOnceWith(
        `Watcher registered for "${modelNameMock}" ("${collectionNameMock}" collection).`,
      );
    });
  });

  describe('reopenChangeStream', () => {
    beforeEach(() => {
      // Given
      service['closeChangeStream'] = jest.fn();
      service['watchChangeStream'] = jest.fn();
    });

    it('should log warning', async () => {
      // When
      await service.reopenChangeStream();

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        'Reopening the Change Stream...',
      );
    });

    it('should close the change stream', async () => {
      // When
      await service.reopenChangeStream();

      // Then
      expect(service['closeChangeStream']).toHaveBeenCalledOnce();
    });

    it('should watch the change stream', async () => {
      // When
      await service.reopenChangeStream();

      // Then
      expect(service['watchChangeStream']).toHaveBeenCalledOnce();
    });
  });

  describe('watchChangeStream', () => {
    const pipelineMock = ['mockPipeline'];

    beforeEach(() => {
      service['buildChangeStreamPipeline'] = jest
        .fn()
        .mockReturnValue([pipelineMock]);

      service['onChange'] = jest.fn();
      service['onError'] = jest.fn();
      service['onClose'] = jest.fn();

      service['collectionsToWatch'].set('collection1', {
        callback: callbackMock,
        modelName: 'Model1',
      });
      service['collectionsToWatch'].set('collection2', {
        callback: callbackMock,
        modelName: 'Model2',
      });
    });

    it('should log a warning if no collections are registered', () => {
      // Given
      service['collectionsToWatch'].clear();

      // When
      service['watchChangeStream']();

      // Then
      expect(loggerServiceMock.warning).toHaveBeenCalledWith(
        'No collections to watch.',
      );
    });

    it('should not call buildChangeStreamPipeline if no collections are registered', () => {
      // Given
      service['collectionsToWatch'].clear();

      // When
      service['watchChangeStream']();

      // Then
      expect(service['buildChangeStreamPipeline']).not.toHaveBeenCalled();
    });

    it('should call buildChangeStreamPipeline', () => {
      // When
      service['watchChangeStream']();

      // Then
      expect(service['buildChangeStreamPipeline']).toHaveBeenCalledOnce();
    });

    it('should log pipeline built', () => {
      // When
      service['watchChangeStream']();

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledExactlyOnceWith(
        { pipeline: [pipelineMock] },
        'Pipeline built for change streams',
      );
    });

    it('should initialize changeStream', () => {
      // When
      service['watchChangeStream']();

      // Then
      expect(mockConnection.watch).toHaveBeenCalledExactlyOnceWith([
        pipelineMock,
      ]);
    });

    it('should set event listeners', () => {
      // When
      service['watchChangeStream']();

      // Then
      expect(mockOn).toHaveBeenCalledTimes(3);
      expect(mockOn).toHaveBeenNthCalledWith(1, 'change', expect.any(Function));
      expect(mockOn).toHaveBeenNthCalledWith(2, 'error', expect.any(Function));
      expect(mockOn).toHaveBeenNthCalledWith(3, 'close', expect.any(Function));
    });

    it('should log the initialized collections being watched', () => {
      // Given
      service['collectionsToWatch'].set('collection1', {
        callback: callbackMock,
        modelName: 'Model1',
      });
      service['collectionsToWatch'].set('collection2', {
        callback: callbackMock,
        modelName: 'Model2',
      });

      // When
      service['watchChangeStream']();

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        'Change streams initialized with collections: collection1, collection2',
      );
    });
  });

  describe('onChange', () => {
    // Given
    const operationTypeMock = 'insert';
    const collectionNameMock = 'mockCollection';

    const mockEvent = {
      operationType: operationTypeMock,
      ns: { coll: collectionNameMock },
    } as unknown as ChangeStreamCompatibleDocument;

    beforeEach(() => {
      service['collectionsToWatch'].set(collectionNameMock, {
        callback: callbackMock,
        modelName: modelNameMock,
      });
    });

    it('should log the change event', () => {
      // When
      service['onChange'](mockEvent);

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledExactlyOnceWith(
        `Detected "${operationTypeMock}" on "${modelNameMock}", calling handler.`,
      );
    });

    it('should call the registered callback with the change event', () => {
      // When
      service['onChange'](mockEvent);

      // Then
      expect(callbackMock).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('onError', () => {
    beforeEach(() => {
      service['reopenChangeStream'] = jest.fn();
    });

    it('should log the error ', async () => {
      // When
      await service['onError'](mockError);

      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledWith(
        `Error on changeStream: ${errorMessageMock}`,
      );
    });

    it('should reset the change stream', async () => {
      // When
      await service['onError'](mockError);

      // Then
      expect(service['reopenChangeStream']).toHaveBeenCalledOnce();
    });
  });

  describe('onClose', () => {
    beforeEach(() => {
      service['reopenChangeStream'] = jest.fn();
    });

    it('should log notice', async () => {
      // When
      await service['onClose']();

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        `ChangeStream closed`,
      );
    });

    it('should reset the change stream', async () => {
      // When
      await service['onClose']();

      // Then
      expect(service['reopenChangeStream']).toHaveBeenCalledOnce();
    });
  });

  describe('closeChangeStream', () => {
    beforeEach(() => {
      service['changeStream'] = {
        close: mockClose,
      };
    });

    it('should close the change stream if defined', async () => {
      // When
      await service['closeChangeStream']();

      // Then
      expect(mockClose).toHaveBeenCalledOnce();
    });

    it('should log the closing of changeStream', async () => {
      // When
      await service['closeChangeStream']();

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        'ChangeStream closed.',
      );
    });

    it('should do nothing if change stream is not defined', async () => {
      // Given
      service['changeStream'] = undefined;

      // When
      await service['closeChangeStream']();

      // Then
      expect(loggerServiceMock.notice).toHaveBeenCalledWith(
        'No ChangeStream to close.',
      );
    });

    it('should reinitialize changeStream to null if changeStream is defined', async () => {
      // When
      await service['closeChangeStream']();

      // Then
      expect(service['changeStream']).toBeNull();
    });

    it('should reinitialize changeStream to null if changeStream is not defined', async () => {
      // Given
      service['changeStream'] = undefined;

      // When
      await service['closeChangeStream']();

      // Then
      expect(service['changeStream']).toBeNull();
    });
  });

  describe('buildChangeStreamPipeline', () => {
    it('should build and return the correct pipeline', () => {
      // Given
      const collections = ['collection1', 'collection2'];
      const expectedPipeline = [
        {
          $match: {
            operationType: {
              $in: ['insert', 'update', 'delete', 'rename', 'replace'],
            },
            'ns.coll': { $in: ['collection1', 'collection2'] },
          },
        },
      ];

      // When
      const pipeline = service['buildChangeStreamPipeline'](collections);

      // Then
      expect(pipeline).toEqual(expectedPipeline);
    });
  });
});
