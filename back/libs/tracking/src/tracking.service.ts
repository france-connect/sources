import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

import { LoggerService } from '@fc/logger';

import { APP_TRACKING_SERVICE } from './app-tracking-service.token';
import {
  IAppTrackingService,
  IEvent,
  IEventContext,
  IEventMap,
} from './interfaces';

@Injectable()
export class TrackingService {
  constructor(
    @Inject(APP_TRACKING_SERVICE)
    private readonly appTrackingService: IAppTrackingService,
    private readonly eventBus: EventBus,
    private readonly logger: LoggerService,
  ) {}

  get EventsMap(): IEventMap {
    return this.appTrackingService.EventsMap;
  }

  track(EventClass, context: IEventContext): void {
    const event = new EventClass(context);
    this.eventBus.publish(event);
  }

  async log(event: IEvent, context: IEventContext): Promise<void> {
    const message = await this.appTrackingService.buildLog(event, context);
    this.logger.businessEvent(message);
  }
}
