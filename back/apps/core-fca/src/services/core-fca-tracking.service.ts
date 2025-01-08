import { Injectable } from '@nestjs/common';

import { CoreTrackingService } from '@fc/core';
import { TrackedEventContextInterface } from '@fc/tracking';

import { CoreFcaTrackingContextInterface } from '../interfaces';

@Injectable()
export class CoreFcaTrackingService extends CoreTrackingService {
  protected extractContext(
    ctx: TrackedEventContextInterface,
  ): CoreFcaTrackingContextInterface {
    const baseContext = super.extractContext(ctx);
    const { fqdn } = ctx;

    const context = {
      ...baseContext,
      fqdn,
    };

    return context;
  }
}
