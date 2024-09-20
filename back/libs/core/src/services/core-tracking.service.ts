import { Injectable } from '@nestjs/common';

import { overrideWithSourceIfNotNull } from '@fc/common';
import { DeviceSession } from '@fc/device';
import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';
import {
  TrackedEventContextInterface,
  TrackedEventInterface,
} from '@fc/tracking';
import { extractNetworkInfoFromHeaders } from '@fc/tracking-context';

import {
  ICoreTrackingContext,
  ICoreTrackingLog,
  ICoreTrackingProviders,
} from '../interfaces';

@Injectable()
export class CoreTrackingService {
  constructor(private readonly sessionService: SessionService) {}

  // BuildLog can be async as per @fc/tracking library
  // eslint-disable-next-line require-await
  async buildLog(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<ICoreTrackingLog> {
    const extractedFromContext = this.extractContext(context);
    const {
      claims,
      source: { address: ip },
    } = extractedFromContext;

    const { step, category, event } = trackedEvent;

    const sessionId = context.sessionId || this.sessionService.getId();

    // Authorization route
    const extractedFromSession = this.getDataFromSession(sessionId);

    const ctxMergedWithSession = overrideWithSourceIfNotNull(
      extractedFromContext,
      extractedFromSession,
    );

    return {
      ...ctxMergedWithSession,
      sessionId,
      step,
      category,
      event,
      ip,
      claims: claims?.join(' '),
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

    const {
      sessionId,
      claims,
      interactionId,
      scope,
      dpId,
      dpClientId,
      dpTitle,
      accountId,
      browsingSessionId,
      isSso,
      spId,
      spAcr,
      spName,
      idpId,
      idpAcr,
      idpName,
      idpLabel,
      idpIdentity,

      isTrusted,
      isSuspicious,

      accountCount,
      knownDevice,
      newIdentity,
      becameTrusted,
      becameShared,

      rep_scope,
    } = ctx;
    const source = extractNetworkInfoFromHeaders(ctx);

    return {
      source,
      sessionId,
      interactionId,
      claims,
      scope,
      dpId,
      dpClientId,
      dpTitle,
      accountId,
      browsingSessionId,
      isSso,
      spId,
      spAcr,
      spName,
      idpId,
      idpAcr,
      idpName,
      idpLabel,
      idpIdentity,
      rep_scope: rep_scope?.join(' '),

      deviceTrusted: isTrusted,
      deviceIsSuspicious: isSuspicious,
      deviceAccountCount: accountCount,
      deviceKnown: knownDevice,
      deviceNewIdentity: newIdentity,
      deviceBecameTrusted: becameTrusted,
      deviceBecameShared: becameShared,
    };
  }

  // eslint-disable-next-line complexity
  private getDataFromSession(sessionId: string): ICoreTrackingProviders {
    const oidcSession =
      this.sessionService.get<OidcSession>('OidcClient') || {};

    // Defaults to undefined rather than null to not pollute AC logs
    const deviceSession = this.sessionService.get<DeviceSession>('Device') || {
      isTrusted: undefined,
      isSuspicious: undefined,
    };

    const {
      browsingSessionId = null,
      accountId = null,
      interactionId = null,
      interactionAcr = null,
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
    } = oidcSession;

    const { isTrusted, isSuspicious } = deviceSession;

    return {
      browsingSessionId,
      accountId,
      interactionId,
      interactionAcr,
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

      deviceTrusted: isTrusted,
      deviceIsSuspicious: isSuspicious,
    };
  }
}
