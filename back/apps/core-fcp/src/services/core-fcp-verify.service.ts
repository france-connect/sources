import { Request } from 'express';
import { InteractionResults } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreRoutes, CoreVerifyService } from '@fc/core';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { AppConfig } from '../dto';

@Injectable()
export class CoreFcpVerifyService {
  constructor(
    private readonly config: ConfigService,
    private readonly coreVerify: CoreVerifyService,
    private readonly oidcProvider: OidcProviderService,
    private readonly tracking: TrackingService,
  ) {}

  async handleVerifyIdentity(
    req: Request,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
  ): Promise<string> {
    const { interactionId, urlPrefix, sessionOidc } = params;
    const trackingContext: TrackedEventContextInterface = { req };

    await this.coreVerify.verify(sessionOidc, trackingContext);

    await this.coreVerify.trackVerified(req);

    const url = `${urlPrefix}${CoreRoutes.INTERACTION_CONSENT.replace(
      ':uid',
      interactionId,
    )}`;
    return url;
  }

  handleInsufficientAcrLevel(interactionId: string): string {
    const { urlPrefix } = this.config.get<AppConfig>('App');

    return `${urlPrefix}${CoreRoutes.INTERACTION.replace(
      ':uid',
      interactionId,
    )}`;
  }

  async handleIdpError(
    req: Request,
    res: Response,
    errorParams: InteractionResults,
  ): Promise<void> {
    const trackingContext = { req, ...errorParams };
    const { IDP_CALLEDBACK_WITH_ERROR } = this.tracking.TrackedEventsMap;
    await this.tracking.track(IDP_CALLEDBACK_WITH_ERROR, trackingContext);

    return await this.oidcProvider.abortInteraction(
      req,
      res,
      errorParams,
      true,
    );
  }
}
