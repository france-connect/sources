import {
  firstValueFrom,
  lastValueFrom,
  Observable,
  of,
  Subject,
  throwError,
  toArray,
} from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { Openid4vpInteractionStatus, Openid4vpService } from '@fc/openid4vp';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { SseDisplayState, SseLogEvent } from '../enums';
import { SseDisplayEventInterface } from '../interfaces';
import { SseService } from './sse.service';

describe('SseService', () => {
  let service: SseService;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const openid4vpServiceMock = {
    getUserInteractionById: jest.fn(),
    subscribeToStatusChanges: jest.fn(),
  };

  const interactionIdMock = '11111111-1111-1111-1111-111111111111';
  const interactionTtlMock = 600;
  const openid4vpConfigMock = {
    relayingParty: { interactionTtl: interactionTtlMock },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SseService, ConfigService, LoggerService, Openid4vpService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(Openid4vpService)
      .useValue(openid4vpServiceMock)
      .compile();

    configMock.get.mockReturnValue(openid4vpConfigMock);

    service = module.get<SseService>(SseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildSseStream', () => {
    const displayEventMock: SseDisplayEventInterface = {
      display: SseDisplayState.PENDING,
      final: false,
    };

    beforeEach(() => {
      service['buildStatusStream'] = jest
        .fn()
        .mockReturnValue(of(Openid4vpInteractionStatus.RESPONSE_RECEIVED));
      service['toDisplayEvent'] = jest.fn().mockReturnValue(displayEventMock);
      service['isTerminal'] = jest.fn().mockReturnValue(true);
    });

    it('should return an Observable', () => {
      // When
      const result = service.buildSseStream(interactionIdMock);

      // Then
      expect(result).toBeInstanceOf(Observable);
    });

    it('should log SSE_OPENED with the interactionId', () => {
      // When
      service.buildSseStream(interactionIdMock);

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        { interactionId: interactionIdMock },
        SseLogEvent.SSE_OPENED,
      );
    });

    it('should build the status stream for the interaction', async () => {
      // When
      await lastValueFrom(service.buildSseStream(interactionIdMock));

      // Then
      expect(service['buildStatusStream']).toHaveBeenCalledExactlyOnceWith(
        interactionIdMock,
      );
    });

    it('should emit the display event built by toDisplayEvent', async () => {
      // When
      const firstEvent = await firstValueFrom(
        service.buildSseStream(interactionIdMock),
      );

      // Then
      expect(service['toDisplayEvent']).toHaveBeenCalledExactlyOnceWith(
        Openid4vpInteractionStatus.RESPONSE_RECEIVED,
      );
      expect(firstEvent).toEqual({ data: displayEventMock });
    });

    it('should close the stream after the first terminal status', async () => {
      // Given
      service['buildStatusStream'] = jest
        .fn()
        .mockReturnValue(
          of(
            Openid4vpInteractionStatus.ERROR,
            Openid4vpInteractionStatus.RESPONSE_RECEIVED,
          ),
        );

      // When
      const events = await lastValueFrom(
        service.buildSseStream(interactionIdMock).pipe(toArray()),
      );

      // Then
      expect(events).toEqual([{ data: displayEventMock }]);
    });

    it('should emit every non-terminal status', async () => {
      // Given
      (service['isTerminal'] as jest.Mock).mockReturnValue(false);
      service['buildStatusStream'] = jest
        .fn()
        .mockReturnValue(
          of(
            Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
            Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
          ),
        );

      // When
      const events = await lastValueFrom(
        service.buildSseStream(interactionIdMock).pipe(toArray()),
      );

      // Then
      expect(events).toHaveLength(2);
    });

    it('should not emit duplicated statuses', async () => {
      // Given
      (service['isTerminal'] as jest.Mock).mockReturnValue(false);
      service['buildStatusStream'] = jest
        .fn()
        .mockReturnValue(
          of(
            Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
            Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
            Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
            Openid4vpInteractionStatus.RESPONSE_RECEIVED,
          ),
        );

      // When
      const events = await lastValueFrom(
        service.buildSseStream(interactionIdMock).pipe(toArray()),
      );

      // Then
      expect(events).toHaveLength(3);
    });

    it('should emit the error display event when the status stream fails', async () => {
      // Given
      const error = new Error('redis unreachable');
      service['buildStatusStream'] = jest
        .fn()
        .mockReturnValue(throwError(() => error));

      // When
      const events = await lastValueFrom(
        service.buildSseStream(interactionIdMock).pipe(toArray()),
      );

      // Then
      expect(service['toDisplayEvent']).toHaveBeenCalledExactlyOnceWith(
        Openid4vpInteractionStatus.NOT_FOUND,
      );
      expect(events).toEqual([{ data: displayEventMock }]);
    });

    it('should log the stream error before converting it to an error display event', async () => {
      // Given
      const error = new Error('redis unreachable');
      service['buildStatusStream'] = jest
        .fn()
        .mockReturnValue(throwError(() => error));

      // When
      await lastValueFrom(service.buildSseStream(interactionIdMock));

      // Then
      expect(loggerMock.err).toHaveBeenCalledExactlyOnceWith(
        { error, interactionId: interactionIdMock },
        SseLogEvent.SSE_STREAM_ERROR,
      );
    });

    it('should close the stream when the interaction TTL expires without a final status', async () => {
      // Given
      jest.useFakeTimers();
      (service['isTerminal'] as jest.Mock).mockReturnValue(false);
      service['buildStatusStream'] = jest.fn().mockReturnValue(new Subject());

      let completed = false;

      service.buildSseStream(interactionIdMock).subscribe({
        complete: () => {
          completed = true;
        },
      });

      await jest.advanceTimersByTimeAsync(0);
      expect(completed).toBe(false);

      // When
      await jest.advanceTimersByTimeAsync(interactionTtlMock * 1000);

      // Then
      expect(completed).toBe(true);

      jest.useRealTimers();
    });

    it('should log SSE_CLOSED when the stream completes', async () => {
      // When
      await lastValueFrom(service.buildSseStream(interactionIdMock));

      // Then
      expect(loggerMock.debug).toHaveBeenCalledWith(
        { interactionId: interactionIdMock },
        SseLogEvent.SSE_CLOSED,
      );
    });
  });

  describe('buildStatusStream', () => {
    const interactionPendingMock = {
      id: interactionIdMock,
      status: Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
    };
    const interactionResponseReceivedMock = {
      id: interactionIdMock,
      status: Openid4vpInteractionStatus.RESPONSE_RECEIVED,
    };

    beforeEach(() => {
      openid4vpServiceMock.subscribeToStatusChanges.mockReturnValue(
        new Subject(),
      );
    });

    it('should verify the interaction belongs to the user session', async () => {
      // Given
      openid4vpServiceMock.getUserInteractionById.mockResolvedValue(
        interactionResponseReceivedMock,
      );

      // When
      await firstValueFrom(service['buildStatusStream'](interactionIdMock));

      // Then
      expect(
        openid4vpServiceMock.getUserInteractionById,
      ).toHaveBeenCalledExactlyOnceWith(interactionIdMock);
    });

    it('should subscribe to status changes for the correct interaction', async () => {
      // Given
      openid4vpServiceMock.getUserInteractionById.mockResolvedValue(
        interactionResponseReceivedMock,
      );

      // When
      await firstValueFrom(service['buildStatusStream'](interactionIdMock));

      // Then
      expect(
        openid4vpServiceMock.subscribeToStatusChanges,
      ).toHaveBeenCalledExactlyOnceWith(interactionIdMock);
    });

    it('should emit the stored interaction status', async () => {
      // Given
      openid4vpServiceMock.getUserInteractionById.mockResolvedValue(
        interactionResponseReceivedMock,
      );

      // When
      const firstStatus = await firstValueFrom(
        service['buildStatusStream'](interactionIdMock),
      );

      // Then
      expect(firstStatus).toBe(Openid4vpInteractionStatus.RESPONSE_RECEIVED);
    });

    it('should emit statuses pushed from pub/sub', async () => {
      // Given
      openid4vpServiceMock.getUserInteractionById.mockResolvedValue(
        interactionPendingMock,
      );
      openid4vpServiceMock.subscribeToStatusChanges.mockReturnValue(
        of(Openid4vpInteractionStatus.RESPONSE_RECEIVED),
      );

      // When
      const firstStatus = await firstValueFrom(
        service['buildStatusStream'](interactionIdMock),
      );

      // Then
      expect(firstStatus).toBe(Openid4vpInteractionStatus.RESPONSE_RECEIVED);
    });

    it('should ignore a stale stored status arriving after a fresher pub/sub event', async () => {
      // Given
      jest.useFakeTimers();
      openid4vpServiceMock.getUserInteractionById.mockResolvedValue(
        interactionPendingMock,
      );
      openid4vpServiceMock.subscribeToStatusChanges.mockReturnValue(
        of(Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED),
      );

      const statuses: unknown[] = [];

      // When
      const subscription = service['buildStatusStream'](
        interactionIdMock,
      ).subscribe({ next: (status) => statuses.push(status) });

      await jest.advanceTimersByTimeAsync(0);

      // Then
      expect(statuses).not.toContain(
        Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
      );

      subscription.unsubscribe();
      jest.useRealTimers();
    });
  });

  describe('toDisplayEvent', () => {
    it.each([
      [Openid4vpInteractionStatus.REQUEST_URI_PROVIDED, null, false],
      [
        Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
        SseDisplayState.PENDING,
        false,
      ],
      [
        Openid4vpInteractionStatus.RESPONSE_RECEIVED,
        SseDisplayState.SUCCESS,
        true,
      ],
      [Openid4vpInteractionStatus.NOT_FOUND, SseDisplayState.ERROR, true],
      [Openid4vpInteractionStatus.ERROR, SseDisplayState.ERROR, true],
    ])(
      'should map status %s to display "%s" and final %s',
      (status, display, final) => {
        // When
        const result = service['toDisplayEvent'](status);

        // Then
        expect(result).toStrictEqual({ display, final });
      },
    );
  });

  describe('isTerminal', () => {
    it.each([
      [Openid4vpInteractionStatus.REQUEST_URI_PROVIDED, false],
      [Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED, false],
      [Openid4vpInteractionStatus.RESPONSE_RECEIVED, true],
      [Openid4vpInteractionStatus.NOT_FOUND, true],
      [Openid4vpInteractionStatus.ERROR, true],
    ])('should return %s → %s', (status, expected) => {
      // When
      const result = service['isTerminal'](status);

      // Then
      expect(result).toBe(expected);
    });
  });
});
