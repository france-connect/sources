import { Injectable } from '@nestjs/common';

import { CoreTrackingService } from '@fc/core';
import { TrackedEventContextInterface } from '@fc/tracking';

import { ICoreTrackingContext } from '../interfaces';

@Injectable()
export class CoreFcpTrackingService extends CoreTrackingService {
  protected extractContext(
    ctx: TrackedEventContextInterface,
  ): ICoreTrackingContext {
    const baseContext = super.extractContext(ctx);
    const { rep_scope } = ctx;

    const context = {
      ...baseContext,
      rep_scope: rep_scope?.join(' '),
    };

    return context;
  }
}
