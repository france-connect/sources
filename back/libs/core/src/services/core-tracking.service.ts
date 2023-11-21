import { Injectable } from '@nestjs/common';

import { OidcSession } from '@fc/oidc';
import { ISessionBoundContext, SessionService } from '@fc/session';
import {
  TrackedEventContextInterface,
  TrackedEventInterface,
} from '@fc/tracking';
import { extractNetworkInfoFromHeaders } from '@fc/tracking-context';

import { CoreMissingContextException } from '../exceptions';
import {
  ICoreTrackingContext,
  ICoreTrackingLog,
  ICoreTrackingProviders,
} from '../interfaces';

@Injectable()
export class CoreTrackingService {
  constructor(private readonly sessionService: SessionService) {}

  async buildLog(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<ICoreTrackingLog> {
    const { source, sessionId, interactionId, claims }: ICoreTrackingContext =
      this.extractContext(context);

    const { step, category, event } = trackedEvent;

    // Authorization route
    const data = await this.getDataFromSession(sessionId);

    return {
      interactionId,
      sessionId,
      step,
      category,
      event,
      ip: source.address,
      claims: claims?.join(' '),
      source,
      ...data,
    };
  }

  private extractContext(
    ctx: TrackedEventContextInterface,
  ): ICoreTrackingContext {
    /**
     * Throw rather than allow a non-loggable interaction.
     *
     * This should never happen and is a *real* exception, not a business one.
     */
    const { req } = ctx;
    if (!req) {
      throw new CoreMissingContextException('req');
    }

    const { sessionId } = req;
    const { claims, interactionId } = ctx;
    const source = extractNetworkInfoFromHeaders(ctx);

    return {
      source,
      sessionId,
      interactionId,
      claims,
    };
  }

  private async getDataFromSession(
    sessionId: string,
  ): Promise<ICoreTrackingProviders> {
    const boundSessionContext: ISessionBoundContext = {
      sessionId,
      moduleName: 'OidcClient',
    };

    const boundSessionServiceGet = this.sessionService.get.bind(
      this.sessionService,
      boundSessionContext,
    );

    const sessionData: OidcSession = (await boundSessionServiceGet()) || {};

    const {
      browsingSessionId = null,
      accountId = null,
      interactionId = null,
      isSso = null,

      spId = null,
      spAcr = null,
      spName = null,
      subs = {},

      idpId = null,
      idpAcr = null,
      idpName = null,
      idpLabel = null,
      idpIdentity = null,
    } = sessionData;

    return {
      browsingSessionId,
      accountId,
      interactionId,
      isSso,
      sessionId,

      spId,
      spAcr,
      spName,
      spSub: subs[spId] || null,

      idpId,
      idpAcr,
      idpName,
      idpLabel,
      idpSub: idpIdentity?.sub || null,
    };
  }
}
