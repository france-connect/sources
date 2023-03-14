import { Injectable } from '@nestjs/common';

import { OidcSession } from '@fc/oidc';
import { ISessionBoundContext, SessionService } from '@fc/session';
import {
  TrackedEventContextInterface,
  TrackedEventInterface,
} from '@fc/tracking';

import { CoreMissingContextException } from '../exceptions';
import {
  ICoreTrackingContext,
  ICoreTrackingLog,
  ICoreTrackingProviders,
  IUserNetworkInfo,
} from '../interfaces';

@Injectable()
export class CoreTrackingService {
  constructor(private readonly sessionService: SessionService) {}

  async buildLog(
    trackedEvent: TrackedEventInterface,
    context: TrackedEventContextInterface,
  ): Promise<ICoreTrackingLog> {
    const {
      ip,
      port,
      // logs filter and analyses need this format
      // eslint-disable-next-line @typescript-eslint/naming-convention
      originalAddresses,
      sessionId,
      interactionId,
      claims,
    }: ICoreTrackingContext = this.extractContext(context);

    const { step, category, event } = trackedEvent;

    // Authorization route
    const data = await this.getDataFromSession(sessionId);

    return {
      interactionId,
      sessionId,
      step,
      category,
      event,
      ip,
      claims: claims?.join(' '),
      source: {
        address: ip,
        port,
        // logs filter and analyses need this format
        // eslint-disable-next-line @typescript-eslint/naming-convention
        original_addresses: originalAddresses,
      },
      ...data,
    };
  }

  private extractNetworkInfoFromHeaders(
    context: TrackedEventContextInterface,
  ): IUserNetworkInfo {
    if (!context.req.headers) {
      throw new CoreMissingContextException('req.headers');
    }

    const ip = context.req.headers['x-forwarded-for'];
    const port = context.req.headers['x-forwarded-source-port'];
    const originalAddresses = context.req.headers['x-forwarded-for-original'];

    return { ip, port, originalAddresses };
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
    const { ip, port, originalAddresses } =
      this.extractNetworkInfoFromHeaders(ctx);

    return {
      ip,
      port,
      originalAddresses,
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
      accountId = null,
      interactionId = null,
      isSso = null,

      spId = null,
      spAcr = null,
      spName = null,
      spIdentity = null,

      idpId = null,
      idpAcr = null,
      idpName = null,
      idpLabel = null,
      idpIdentity = null,
    } = sessionData;

    return {
      accountId,
      interactionId,
      isSso,
      sessionId,

      spId,
      spAcr,
      spName,
      spSub: spIdentity?.sub || null,

      idpId,
      idpAcr,
      idpName,
      idpLabel,
      idpSub: idpIdentity?.sub || null,
    };
  }
}
