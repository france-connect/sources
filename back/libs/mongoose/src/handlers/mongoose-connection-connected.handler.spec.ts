import { Test, TestingModule } from '@nestjs/testing';

import { MongooseCollectionOperationWatcherHelper } from '../helpers';
import { MongooseConnectionConnectedHandler } from './mongoose-connection-connected.handler';

describe('MongooseConnectionConnectedHandler', () => {
  let service: MongooseConnectionConnectedHandler;

  const mongooseCollectionOperationWatcherHelperMock = {
    connectAllWatchers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseConnectionConnectedHandler,
        MongooseCollectionOperationWatcherHelper,
      ],
    })
      .overrideProvider(MongooseCollectionOperationWatcherHelper)
      .useValue(mongooseCollectionOperationWatcherHelperMock)
      .compile();

    service = module.get<MongooseConnectionConnectedHandler>(
      MongooseConnectionConnectedHandler,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('handle', () => {
    it('should call connectAllWatcher from mongooseHelper', () => {
      // When
      service.handle();
      // Then
      expect(
        mongooseCollectionOperationWatcherHelperMock.connectAllWatchers,
      ).toHaveBeenCalled();
    });
  });
});
