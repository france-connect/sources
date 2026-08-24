import {
  catchError,
  defer,
  distinctUntilChanged,
  finalize,
  map,
  merge,
  Observable,
  of,
  scan,
  takeUntil,
  takeWhile,
  timer,
} from 'rxjs';

import { Injectable, MessageEvent } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  CONFIG_NAMESPACE,
  Openid4vpConfig,
  Openid4vpInteractionStatus,
  Openid4vpService,
} from '@fc/openid4vp';

import { SseDisplayState, SseLogEvent } from '../enums';
import { SseDisplayEventInterface } from '../interfaces';

@Injectable()
export class SseService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly openid4vp: Openid4vpService,
  ) {}

  buildSseStream(interactionId: string): Observable<MessageEvent> {
    const {
      relayingParty: { interactionTtl },
    } = this.config.get<Openid4vpConfig>(CONFIG_NAMESPACE);

    this.logger.debug({ interactionId }, SseLogEvent.SSE_OPENED);

    return this.buildStatusStream(interactionId).pipe(
      distinctUntilChanged(),
      takeWhile((status) => !this.isTerminal(status), true),
      map((status): MessageEvent => ({ data: this.toDisplayEvent(status) })),
      takeUntil(timer(interactionTtl * 1000)),
      catchError((error) => {
        this.logger.err({ error, interactionId }, SseLogEvent.SSE_STREAM_ERROR);

        return of<MessageEvent>({
          data: this.toDisplayEvent(Openid4vpInteractionStatus.NOT_FOUND),
        });
      }),
      finalize(() =>
        this.logger.debug({ interactionId }, SseLogEvent.SSE_CLOSED),
      ),
    );
  }

  private toDisplayEvent(
    status: Openid4vpInteractionStatus,
  ): SseDisplayEventInterface {
    const displays = {
      [Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED]:
        SseDisplayState.PENDING,
      [Openid4vpInteractionStatus.RESPONSE_RECEIVED]: SseDisplayState.SUCCESS,
      [Openid4vpInteractionStatus.NOT_FOUND]: SseDisplayState.ERROR,
      [Openid4vpInteractionStatus.ERROR]: SseDisplayState.ERROR,
    };

    return {
      display: displays[status] ?? null,
      final: this.isTerminal(status),
    };
  }

  private isTerminal(status: Openid4vpInteractionStatus): boolean {
    return [
      Openid4vpInteractionStatus.RESPONSE_RECEIVED,
      Openid4vpInteractionStatus.NOT_FOUND,
      Openid4vpInteractionStatus.ERROR,
    ].includes(status);
  }

  private buildStatusStream(
    interactionId: string,
  ): Observable<Openid4vpInteractionStatus> {
    return merge(
      this.openid4vp.subscribeToStatusChanges(interactionId),
      defer(() => this.openid4vp.getUserInteractionById(interactionId)).pipe(
        map((interaction) => interaction.status),
      ),
    ).pipe(scan((latest, status) => Math.max(latest, status)));
  }
}
