import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import { getAsyncLocalStorageMock } from '@mocks/async-local-storage';

import { ResponseStatus } from '../enums';
import { MicroservicesRmqSubscriberService } from './microservices-rmq-subscriber.service';

describe('MicroservicesRmqSubscriberService', () => {
  let service: MicroservicesRmqSubscriberService;

  const asyncLocalStorageMock = getAsyncLocalStorageMock();
  const payloadMock = {
    foo: 'bar',
  };
  const storeMock = {
    message: 'message',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MicroservicesRmqSubscriberService, AsyncLocalStorageService],
    })
      .overrideProvider(AsyncLocalStorageService)
      .useValue(asyncLocalStorageMock)
      .compile();

    service = module.get<MicroservicesRmqSubscriberService>(
      MicroservicesRmqSubscriberService,
    );

    asyncLocalStorageMock.get.mockReturnValue(storeMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('response', () => {
    it('should return an FSA with payload and message from store', () => {
      // When
      const response = service.response(payloadMock);

      // Then
      expect(response).toEqual({
        type: ResponseStatus.SUCCESS,
        meta: {
          message: storeMock.message,
        },
        payload: payloadMock,
      });
    });
  });
});
