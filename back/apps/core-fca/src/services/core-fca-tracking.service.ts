import { Injectable } from '@nestjs/common';

import { CoreTrackingService } from '@fc/core';
import {
  AppTrackingServiceAbstract,
  TrackedEventContextInterface,
  TrackedEventInterface,
} from '@fc/tracking';

import { CoreFcaTrackingLogInterface } from '../interfaces';

@Injectable()
export class CoreFcaTrackingService implements AppTrackingServiceAbstract {
  constructor(private readonly core: CoreTrackingService) {}
  async buildLog(
    trackedEvent: TrackedEventInterface,
    ctx: TrackedEventContextInterface,
  ): Promise<CoreFcaTrackingLogInterface> {
    const tracking = await this.core.buildLog(trackedEvent, ctx);
    const { fqdn } = ctx;
    return { ...tracking, fqdn };
  }
}
