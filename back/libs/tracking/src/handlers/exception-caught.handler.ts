import { Injectable } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';

import { ExceptionCaughtEvent } from '@fc/exceptions/events';

import { TrackingService } from '../services';

@EventsHandler(ExceptionCaughtEvent)
@Injectable()
export class ExceptionCaughtHandler {
  constructor(private readonly tracking: TrackingService) {}

  async handle(event: ExceptionCaughtEvent) {
    const { exception, context } = event;
    await this.tracking.trackExceptionIfNeeded(exception, context);
  }
}
