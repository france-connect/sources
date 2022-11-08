import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { IAppTrackingService, IEvent, IEventContext } from '@fc/tracking';
import { getEventsMap } from '@fc/user-dashboard';

import { AppConfig } from '../dto';
import { UserDashboardMissingContextException } from '../exceptions';
import {
  UserDashboardTrackingContextInterface,
  UserDashboardTrackingLogInterface,
  UserNetworkInfoInterface,
} from '../interfaces';

@Injectable()
export class UserDashboardTrackingService implements IAppTrackingService {
  readonly EventsMap;

  constructor(private readonly config: ConfigService) {
    this.EventsMap = getEventsMap(this.config.get<AppConfig>('App').urlPrefix);
  }

  async buildLog(
    event: IEvent,
    context: IEventContext,
  ): Promise<UserDashboardTrackingLogInterface> {
    const { ip, port, originalAddresses } = await this.extractContext(
      context.ctx,
    );

    const { category, event: eventName } = event;
    const {
      idpChanges,
      hasAllowFutureIdpChanged,
      idpLength,
      changeSetId,
      futureAllowedNewValue,
    } = context.ctx;

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
      sub: context.ctx.identity.sub,
      sessionId: context.ctx.req.sessionId,
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
    context: IEventContext,
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

  private async extractContext(
    ctx: IEventContext,
  ): Promise<UserDashboardTrackingContextInterface> {
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
