import { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreRoutes, CoreVerifyService } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface } from '@fc/tracking';

import { AppConfig } from '../dto';

@Injectable()
export class CoreFcpVerifyService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly coreVerify: CoreVerifyService,
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
}
