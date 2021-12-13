import { Injectable } from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { OidcSession } from '@fc/oidc';
import {
  ISessionBoundContext,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';
import { IAppTrackingService, IEvent, IEventContext } from '@fc/tracking';

import { getEventsMap } from '../events.map';
import { CoreMissingContextException } from '../exceptions';
import {
  ICoreTrackingContext,
  ICoreTrackingLog,
  ICoreTrackingProviders,
} from '../interfaces';

@Injectable()
export class CoreTrackingService implements IAppTrackingService {
  readonly EventsMap;

  constructor(
    private readonly sessionService: SessionService,
    private readonly config: ConfigService,
  ) {
    this.EventsMap = getEventsMap(this.config.get<AppConfig>('App').urlPrefix);
  }

  async buildLog(
    event: IEvent,
    context: IEventContext,
  ): Promise<ICoreTrackingLog> {
    const { ip, sessionId, interactionId, claims }: ICoreTrackingContext =
      await this.extractContext(context);

    const { step, category, event: eventName } = event;
    let data: ICoreTrackingProviders;

    // Authorization route
    if (event === this.EventsMap.FC_AUTHORIZE_INITIATED) {
      data = this.getDataFromContext(context);
    } else {
      data = await this.getDataFromSession(sessionId);
    }

    return {
      interactionId,
      step,
      category,
      event: eventName,
      ip,
      claims: claims?.join(' '),
      ...data,
    };
  }

  private extractIpFromContext(context: IEventContext): string {
    if (!context.req.headers) {
      throw new CoreMissingContextException('req.headers');
    }

    const ip = context.req.headers['x-forwarded-for'];

    if (!ip) {
      throw new CoreMissingContextException("req.headers['x-forwarded-for']");
    }

    return ip;
  }

  private async extractContext(
    ctx: IEventContext,
  ): Promise<ICoreTrackingContext> {
    /**
     * Throw rather than allow a non-loggable interaction.
     *
     * This should never happen and is a *real* exception, not a business one.
     */
    const { req } = ctx;
    if (!req) {
      throw new CoreMissingContextException('req');
    }

    const { claims } = req;

    const ip: string = this.extractIpFromContext(ctx);
    const interactionId: string = this.getInteractionIdFromContext(ctx);

    const sessionId: string =
      req.sessionId || (await this.sessionService.getAlias(interactionId));

    return { ip, sessionId, interactionId, claims };
  }

  private extractInteractionId(req) {
    return (
      req.fc?.interactionId ||
      req.body?.uid ||
      req.params?.uid ||
      req.cookies?._interaction
    );
  }

  private getInteractionIdFromContext({ req }: IEventContext): string {
    const interactionId = this.extractInteractionId(req);

    if (!interactionId) {
      throw new CoreMissingContextException('interactionId missing in context');
    }
    return interactionId;
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

    const sessionData: OidcSession = await boundSessionServiceGet();

    if (!sessionData) {
      throw new SessionNotFoundException(boundSessionContext.moduleName);
    }

    const {
      accountId = null,

      spId = null,
      spAcr = null,
      spName = null,
      spIdentity = null,

      idpId = null,
      idpAcr = null,
      idpName = null,
      idpIdentity = null,
    } = sessionData;

    return {
      accountId,

      spId,
      spAcr,
      spName,
      /**
       * @TODO #146 ETQ dev, j'élucide le mystère sur le spIdentity qui est undefined pendant la cinématique
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/229
       */
      spSub: spIdentity?.sub || null,

      idpId,
      idpAcr,
      idpName,
      idpSub: idpIdentity?.sub || null,
    };
  }

  /**
   * Authorize logging can't rely on session since session is not created at this stage.
   * We have to do specific work to retrieve informations to log.
   */
  private getDataFromContext(context: IEventContext): ICoreTrackingProviders {
    if (!context.req) {
      throw new CoreMissingContextException('req');
    }
    const { spId, spAcr, spName, spSub } = context.req;

    return {
      accountId: null,

      spId,
      spAcr,
      spName,
      spSub,

      idpId: null,
      idpAcr: null,
      idpName: null,
      idpSub: null,
    };
  }
}
