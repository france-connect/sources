import { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { CoreRoutes, CoreVerifyService } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

@Injectable()
export class CoreFcaVerifyService {
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

    await this.trackVerified(req);

    const url = `${urlPrefix}${CoreRoutes.INTERACTION_LOGIN}`;
    return url;
  }

  async handleBlacklisted(
    req: Request,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
  ): Promise<string> {
    const { interactionId, urlPrefix, sessionOidc } = params;

    const url = `${urlPrefix}${CoreRoutes.INTERACTION.replace(
      ':uid',
      interactionId,
    )}`;

    /**
     * Black listing redirects to idp choice,
     * thus we are no longer in an "sso" interaction,
     * so we update isSso flag in session.
     */
    sessionOidc.set('isSso', false);

    await this.trackBlackListed(req);

    return url;
  }

  private async trackBlackListed(req: Request) {
    const eventContext = { req };
    const { FC_BLACKLISTED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_BLACKLISTED, eventContext);
  }

  private async trackVerified(req: Request) {
    const eventContext = { req };
    const { FC_VERIFIED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_VERIFIED, eventContext);
  }
}
