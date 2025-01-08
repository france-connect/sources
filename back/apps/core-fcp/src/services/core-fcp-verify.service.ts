import { Request } from 'express';
import { InteractionResults } from 'oidc-provider';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  CORE_VERIFY_SERVICE,
  CoreRoutes,
  CoreVerifyService,
  ProcessCore,
} from '@fc/core';
import { LoggerService } from '@fc/logger';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { AppConfig, OidcIdentityDto } from '../dto';
import { CoreFcpInvalidIdentityException } from '../exceptions';
import { IIdentityCheckFeatureHandler } from '../interfaces';

@Injectable()
export class CoreFcpVerifyService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    @Inject(CORE_VERIFY_SERVICE)
    private readonly coreVerify: CoreVerifyService,
    private readonly oidcProvider: OidcProviderService,
    private readonly tracking: TrackingService,
    private readonly logger: LoggerService,
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

  async validateIdentity(idpId: string, identity: OidcIdentityDto) {
    const identityCheckHandler =
      await this.coreVerify.getFeature<IIdentityCheckFeatureHandler>(
        idpId,
        ProcessCore.ID_CHECK,
      );

    const errors = await identityCheckHandler.handle(identity);
    if (errors.length) {
      this.logger.debug(errors, `Identity from "${idpId}" is invalid`);
      throw new CoreFcpInvalidIdentityException();
    }
  }
}
