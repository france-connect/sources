import { filter, map, Observable, Subject } from 'rxjs';

import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { RedisService } from '@fc/redis';

import { Openid4vpInteractionStatus, Openid4vpLogEvent } from '../enums';
import { StatusEventInterface } from '../interfaces';
import { STATUS_CHANNEL } from '../tokens';

@Injectable()
export class Openid4vpInteractionStatusService implements OnModuleDestroy {
  private statusSubscriber?: ReturnType<RedisService['client']['duplicate']>;
  private readonly status$ = new Subject<StatusEventInterface>();

  constructor(
    private readonly redis: RedisService,
    private readonly logger: LoggerService,
  ) {}

  async onModuleDestroy(): Promise<void> {
    this.status$.complete();

    if (!this.statusSubscriber) {
      return;
    }

    try {
      await this.statusSubscriber.quit();
    } catch {
      this.statusSubscriber.disconnect();
    }
  }

  subscribeToStatusChanges(
    interactionId: string,
  ): Observable<Openid4vpInteractionStatus> {
    this.initStatusSubscriber();

    return this.status$.pipe(
      filter((event) => event.interactionId === interactionId),
      map((event) => event.status),
    );
  }

  async publishStatus(
    interactionId: string,
    status: Openid4vpInteractionStatus,
  ): Promise<void> {
    const event: StatusEventInterface = { interactionId, status };

    try {
      await this.redis.client.publish(STATUS_CHANNEL, JSON.stringify(event));
    } catch (error) {
      this.logger.crit(
        { error, interactionId },
        Openid4vpLogEvent.STATUS_PUBLISH_FAILED,
      );
    }
  }

  private initStatusSubscriber(): void {
    if (this.statusSubscriber) {
      return;
    }

    this.statusSubscriber = this.redis.client.duplicate();

    this.statusSubscriber
      .subscribe(STATUS_CHANNEL)
      .catch((error: Error) =>
        this.logger.crit({ error }, Openid4vpLogEvent.STATUS_SUBSCRIBE_FAILED),
      );

    this.statusSubscriber.on('message', (_channel: string, message: string) =>
      this.dispatchStatusMessage(message),
    );

    this.statusSubscriber.on('error', (error: Error) =>
      this.logger.crit({ error }, Openid4vpLogEvent.STATUS_SUBSCRIBER_ERROR),
    );
  }

  private dispatchStatusMessage(message: string): void {
    try {
      this.status$.next(JSON.parse(message) as StatusEventInterface);
    } catch (error) {
      this.logger.crit(
        { error, message },
        Openid4vpLogEvent.STATUS_MESSAGE_MALFORMED,
      );
    }
  }
}
