import { Injectable } from '@nestjs/common';

import { IEvent, IEventContext, IEventMap } from '../interfaces';
import { TrackingService } from '../tracking.service';

@Injectable()
export abstract class TrackingHandler {
  constructor(private readonly tracking: TrackingService) {}

  protected get EventsMap(): IEventMap {
    return this.tracking.EventsMap;
  }

  protected async log(event: IEvent, context: IEventContext) {
    this.tracking.log(event, context);
  }
}
