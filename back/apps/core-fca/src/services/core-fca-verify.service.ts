import { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { CoreRoutes, CoreVerifyService } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

@Injectable()
export class CoreFcaVerifyService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly coreVerify: CoreVerifyService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async handleVerifyIdentity(
    req: Request,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
  ): Promise<string> {
    const { sessionOidc, urlPrefix } = params;
    const trackingContext: TrackedEventContextInterface = { req };

    await this.coreVerify.verify(sessionOidc, trackingContext);

    await this.coreVerify.trackVerified(req);

    const url = `${urlPrefix}${CoreRoutes.INTERACTION_LOGIN}`;
    return url;
  }

  private async trackSsoDisabled(eventContext: TrackedEventContextInterface) {
    const { SP_DISABLED_SSO } = this.tracking.TrackedEventsMap;
    await this.tracking.track(SP_DISABLED_SSO, eventContext);
  }

  async handleSsoDisabled(
    req: Request,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
  ): Promise<string> {
    const eventContext = { req };
    const { interactionId, sessionOidc, urlPrefix } = params;

    await sessionOidc.set('isSso', false);

    const url = `${urlPrefix}${CoreRoutes.INTERACTION.replace(
      ':uid',
      interactionId,
    )}`;

    await this.trackSsoDisabled(eventContext);

    return url;
  }
}
