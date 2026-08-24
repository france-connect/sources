import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { RedisService } from '@fc/redis';

import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock, getRedisSubscriberMock } from '@mocks/redis';

import { Openid4vpInteractionStatus, Openid4vpLogEvent } from '../enums';
import { StatusEventInterface } from '../interfaces';
import { Openid4vpInteractionStatusService } from './openid4vp-interaction-status.service';

describe('Openid4vpInteractionStatusService', () => {
  let service: Openid4vpInteractionStatusService;

  const redisMock = getRedisServiceMock();
  const loggerMock = getLoggerMock();

  const interactionIdMock = 'interactionIdMock';
  const statusChannel = 'oid4vp:status';

  function statusMessage(interactionId: string, status: number): string {
    return JSON.stringify({ interactionId, status });
  }

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Openid4vpInteractionStatusService,
        RedisService,
        LoggerService,
      ],
    })
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<Openid4vpInteractionStatusService>(
      Openid4vpInteractionStatusService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishStatus', () => {
    it('should publish the serialized status event on the status channel', async () => {
      // When
      await service.publishStatus(
        interactionIdMock,
        Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
      );

      // Then
      expect(redisMock.client.publish).toHaveBeenCalledExactlyOnceWith(
        statusChannel,
        JSON.stringify({
          interactionId: interactionIdMock,
          status: Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
        }),
      );
    });

    it('should log and not throw when the publish fails', async () => {
      // Given
      const error = new Error('publish failed');
      redisMock.client.publish.mockRejectedValueOnce(error);

      // When / Then
      await expect(
        service.publishStatus(
          interactionIdMock,
          Openid4vpInteractionStatus.RESPONSE_RECEIVED,
        ),
      ).resolves.toBeUndefined();
      expect(loggerMock.crit).toHaveBeenCalledExactlyOnceWith(
        { error, interactionId: interactionIdMock },
        Openid4vpLogEvent.STATUS_PUBLISH_FAILED,
      );
    });
  });

  describe('subscribeToStatusChanges', () => {
    beforeEach(() => {
      service['initStatusSubscriber'] = jest.fn();
    });

    it('should call initStatusSubscriber', () => {
      // When
      service.subscribeToStatusChanges(interactionIdMock);

      // Then
      expect(service['initStatusSubscriber']).toHaveBeenCalledExactlyOnceWith();
    });

    it('should emit status values published for the interaction', () => {
      // Given
      const status$ = service.subscribeToStatusChanges(interactionIdMock);
      const collected: number[] = [];
      status$.subscribe((s) => collected.push(s));

      // When
      service['status$'].next({
        interactionId: interactionIdMock,
        status: Openid4vpInteractionStatus.RESPONSE_RECEIVED,
      } as StatusEventInterface);

      // Then
      expect(collected).toEqual([Openid4vpInteractionStatus.RESPONSE_RECEIVED]);
    });

    it('should not emit status values published for another interaction', () => {
      // Given
      const status$ = service.subscribeToStatusChanges(interactionIdMock);
      const collected: number[] = [];
      status$.subscribe((s) => collected.push(s));

      // When
      service['status$'].next({
        interactionId: 'anotherInteractionIdMock',
        status: Openid4vpInteractionStatus.RESPONSE_RECEIVED,
      } as StatusEventInterface);

      // Then
      expect(collected).toEqual([]);
    });

    it('should dispatch each event to every subscription of the same interaction', () => {
      // Given
      const collectedA: number[] = [];
      const collectedB: number[] = [];
      service
        .subscribeToStatusChanges(interactionIdMock)
        .subscribe((s) => collectedA.push(s));
      service
        .subscribeToStatusChanges(interactionIdMock)
        .subscribe((s) => collectedB.push(s));

      // When
      service['status$'].next({
        interactionId: interactionIdMock,
        status: Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
      } as StatusEventInterface);

      // Then
      expect(collectedA).toEqual([
        Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
      ]);
      expect(collectedB).toEqual([
        Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
      ]);
    });
  });

  describe('initStatusSubscriber', () => {
    const subscriberMock = getRedisSubscriberMock();
    let messageHandler: (channel: string, message: string) => void;
    let errorHandler: (err: Error) => void;

    beforeEach(() => {
      redisMock.client.duplicate.mockReturnValue(subscriberMock);
      subscriberMock.subscribe.mockResolvedValue(1);
      subscriberMock.on.mockImplementation(
        (event: string, handler: unknown) => {
          if (event === 'message')
            messageHandler = handler as typeof messageHandler;
          if (event === 'error') errorHandler = handler as typeof errorHandler;
        },
      );
    });

    it('should create the shared subscriber connection on first call', () => {
      // When
      service['initStatusSubscriber']();

      // Then
      expect(redisMock.client.duplicate).toHaveBeenCalledExactlyOnceWith();
    });

    it('should reuse the shared subscriber connection for subsequent calls', () => {
      // When
      service['initStatusSubscriber']();
      service['initStatusSubscriber']();

      // Then
      expect(redisMock.client.duplicate).toHaveBeenCalledExactlyOnceWith();
      expect(subscriberMock.subscribe).toHaveBeenCalledExactlyOnceWith(
        statusChannel,
      );
    });

    it('should subscribe to the shared status channel', () => {
      // When
      service['initStatusSubscriber']();

      // Then
      expect(subscriberMock.subscribe).toHaveBeenCalledExactlyOnceWith(
        statusChannel,
      );
    });

    it('should dispatch incoming messages to the status subject', () => {
      // Given
      service.subscribeToStatusChanges(interactionIdMock);
      const collected: number[] = [];
      service['status$'].subscribe((e) => collected.push(e.status));

      // When
      messageHandler(
        statusChannel,
        statusMessage(
          interactionIdMock,
          Openid4vpInteractionStatus.RESPONSE_RECEIVED,
        ),
      );

      // Then
      expect(collected).toEqual([Openid4vpInteractionStatus.RESPONSE_RECEIVED]);
    });

    it('should log a malformed message without emitting nor throwing', () => {
      // Given
      service.subscribeToStatusChanges(interactionIdMock);
      const collected: number[] = [];
      service['status$'].subscribe((e) => collected.push(e.status));

      // When / Then
      expect(() => messageHandler(statusChannel, 'not-a-json')).not.toThrow();
      expect(collected).toEqual([]);
      expect(loggerMock.crit).toHaveBeenCalledExactlyOnceWith(
        { error: expect.any(Error), message: 'not-a-json' },
        Openid4vpLogEvent.STATUS_MESSAGE_MALFORMED,
      );
    });

    it('should log subscriber connection errors without failing the stream', () => {
      // Given
      service.subscribeToStatusChanges(interactionIdMock);
      const error = new Error('redis error');

      // When
      errorHandler(error);

      // Then
      expect(loggerMock.crit).toHaveBeenCalledExactlyOnceWith(
        { error },
        Openid4vpLogEvent.STATUS_SUBSCRIBER_ERROR,
      );
    });

    it('should log a failed channel subscription without throwing', async () => {
      // Given
      const error = new Error('subscribe failed');
      subscriberMock.subscribe.mockRejectedValueOnce(error);

      // When
      service['initStatusSubscriber']();
      await Promise.resolve();

      // Then
      expect(loggerMock.crit).toHaveBeenCalledExactlyOnceWith(
        { error },
        Openid4vpLogEvent.STATUS_SUBSCRIBE_FAILED,
      );
    });

    it('should keep the shared connection open when a consumer unsubscribes', () => {
      // Given
      const subscription = service
        .subscribeToStatusChanges(interactionIdMock)
        .subscribe();

      // When
      subscription.unsubscribe();

      // Then
      expect(subscriberMock.unsubscribe).not.toHaveBeenCalled();
      expect(subscriberMock.quit).not.toHaveBeenCalled();
      expect(subscriberMock.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    const subscriberMock = getRedisSubscriberMock();

    beforeEach(() => {
      redisMock.client.duplicate.mockReturnValue(subscriberMock);
      subscriberMock.subscribe.mockResolvedValue(1);
    });

    it('should complete the status subject to signal active streams', async () => {
      // Given
      const status$ = service.subscribeToStatusChanges(interactionIdMock);
      let completed = false;
      status$.subscribe({ complete: () => (completed = true) });

      // When
      await service.onModuleDestroy();

      // Then
      expect(completed).toBe(true);
    });

    it('should do nothing when the subscriber was never created', async () => {
      // When
      await service.onModuleDestroy();

      // Then
      expect(subscriberMock.quit).not.toHaveBeenCalled();
      expect(subscriberMock.disconnect).not.toHaveBeenCalled();
    });

    it('should quit the subscriber connection gracefully', async () => {
      // Given
      service.subscribeToStatusChanges(interactionIdMock);
      subscriberMock.quit.mockResolvedValueOnce('OK');

      // When
      await service.onModuleDestroy();

      // Then
      expect(subscriberMock.quit).toHaveBeenCalledExactlyOnceWith();
      expect(subscriberMock.disconnect).not.toHaveBeenCalled();
    });

    it('should fallback to disconnect when quit fails', async () => {
      // Given
      service.subscribeToStatusChanges(interactionIdMock);
      subscriberMock.quit.mockRejectedValueOnce(new Error('quit failed'));

      // When
      await service.onModuleDestroy();

      // Then
      expect(subscriberMock.disconnect).toHaveBeenCalledExactlyOnceWith();
    });
  });
});
