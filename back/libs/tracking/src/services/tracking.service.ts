import { Global, Inject, Injectable, Scope, Type } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { FcException } from '@fc/exceptions-deprecated';
import { LoggerService } from '@fc/logger';
import { LoggerService as LoggerLegacyService } from '@fc/logger-legacy';

import { TrackingConfig } from '../dto';
import {
  AppTrackingServiceAbstract,
  TrackedEventContextInterface,
  TrackedEventInterface,
  TrackedEventMapType,
} from '../interfaces';
import { APP_TRACKING_SERVICE } from '../tokens';

@Global()
@Injectable({ scope: Scope.DEFAULT })
export class TrackingService {
  public TrackedEventsMap: TrackedEventMapType = {};
  constructor(
    @Inject(APP_TRACKING_SERVICE)
    private readonly appTrackingService: AppTrackingServiceAbstract,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly loggerLegacy: LoggerLegacyService,
  ) {}

  onModuleInit() {
    const { eventsMap } = this.config.get<TrackingConfig>('Tracking');
    this.TrackedEventsMap = eventsMap;
  }

  async track(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<void> {
    const message = await this.appTrackingService.buildLog(
      trackedEvent,
      context,
    );

    this.loggerLegacy.businessEvent(message);
  }

  private findEventForException(
    exception: FcException,
  ): TrackedEventInterface[] {
    const events = Object.values(this.TrackedEventsMap).filter(
      (eventDefinition) => {
        const exceptionsNames = this.toClassNames(eventDefinition.exceptions);

        if (exceptionsNames.includes(exception.constructor.name)) {
          return eventDefinition;
        }

        return false;
      },
    );

    return events;
  }

  private toClassNames(classes: Type<FcException>[] = []): string[] {
    return classes.map(({ name }) => name);
  }

  async trackExceptionIfNeeded(
    exception: FcException,
    context: TrackedEventContextInterface,
  ): Promise<void> {
    const events = this.findEventForException(exception);

    const promises = events.map((event) => this.track(event, context));

    await Promise.all(promises);
  }
}
