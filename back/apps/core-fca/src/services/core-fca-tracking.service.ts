import { Injectable } from '@nestjs/common';

import { CoreTrackingService, ICoreTrackingLog } from '@fc/core';
import {
  AppTrackingServiceAbstract,
  TrackedEventContextInterface,
  TrackedEventInterface,
} from '@fc/tracking';

@Injectable()
export class CoreFcaTrackingService implements AppTrackingServiceAbstract {
  constructor(private readonly coreTrackingService: CoreTrackingService) {}

  async buildLog(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<ICoreTrackingLog> {
    return this.coreTrackingService.buildLog(trackedEvent, context);
  }
}
