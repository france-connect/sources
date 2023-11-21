import { Injectable } from '@nestjs/common';

import {
  AppTrackingServiceAbstract,
  TrackedEventContextInterface,
  TrackedEventInterface,
} from '@fc/tracking';

import { UserDashboardMissingContextException } from '../exceptions';
import {
  UserDashboardTrackingContextInterface,
  UserDashboardTrackingLogInterface,
  UserNetworkInfoInterface,
} from '../interfaces';

@Injectable()
export class UserDashboardTrackingService
  implements AppTrackingServiceAbstract
{
  // Needed to match the interface
  // eslint-disable-next-line require-await
  async buildLog(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<UserDashboardTrackingLogInterface> {
    const { ip, port, originalAddresses } = this.extractContext(context);

    const { category, event: eventName } = trackedEvent;
    const {
      idpChanges,
      hasAllowFutureIdpChanged,
      idpLength,
      changeSetId,
      futureAllowedNewValue,
    } = context;

    return {
      category,
      event: eventName,
      ip,
      source: {
        address: ip,
        port,
        // logs filter and analyses need this format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        original_addresses: originalAddresses,
      },
      sub: context.identity.sub,
      sessionId: context.req.sessionId,
      changeSetId,
      payload: {
        ...idpChanges,
        hasAllowFutureIdpChanged,
        idpLength,
        futureAllowedNewValue,
      },
    };
  }

  private extractNetworkInfoFromHeaders(
    context: TrackedEventContextInterface,
  ): UserNetworkInfoInterface {
    if (!context.req.headers) {
      throw new UserDashboardMissingContextException('req.headers');
    }

    const ip = context.req.headers['x-forwarded-for'];
    const port = context.req.headers['x-forwarded-source-port'];
    const originalAddresses = context.req.headers['x-forwarded-for-original'];

    this.checkForMissingHeaders(ip, port, originalAddresses);

    return { ip, port, originalAddresses };
  }

  private checkForMissingHeaders(ip, port, originalAddresses): void {
    if (!ip) {
      throw new UserDashboardMissingContextException(
        "req.headers['x-forwarded-for']",
      );
    }

    if (!port) {
      throw new UserDashboardMissingContextException(
        "req.headers['x-forwarded-source-port']",
      );
    }

    if (!originalAddresses) {
      throw new UserDashboardMissingContextException(
        "req.headers['x-forwarded-for-original']",
      );
    }
  }

  private extractContext(
    ctx: TrackedEventContextInterface,
  ): UserDashboardTrackingContextInterface {
    /**
     * Throw rather than allow a non-loggable interaction.
     *
     * This should never happen and is a *real* exception, not a business one.
     */
    const { req } = ctx;
    if (!req) {
      throw new UserDashboardMissingContextException('req');
    }

    const { ip, port, originalAddresses } =
      this.extractNetworkInfoFromHeaders(ctx);

    const sessionId: string = req.sessionId;

    return {
      ip,
      port,
      originalAddresses,
      sessionId,
    };
  }
}
