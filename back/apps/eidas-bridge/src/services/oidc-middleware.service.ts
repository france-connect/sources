import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  OidcProviderErrorService,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { ISessionBoundContext, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

@Injectable()
export class OidcMiddlewareService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly serviceProvider: ServiceProviderAdapterEnvService,
    private readonly oidcErrorService: OidcProviderErrorService,
    private readonly sessionService: SessionService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.authorizationMiddleware.bind(this),
    );

    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.TOKEN,
      this.tokenMiddleware.bind(this),
    );

    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.USERINFO,
      this.userinfoMiddleware.bind(this),
    );
  }

  private getEventContext(ctx): TrackedEventContextInterface {
    const interactionId: string =
      this.oidcProvider.getInteractionIdFromCtx(ctx);

    // Retrieve the sessionId from the oidc context (stored in accountId) or from the request
    const sessionId =
      ctx.oidc?.entities?.Account?.accountId || ctx.req.sessionId;

    const eventContext: TrackedEventContextInterface = {
      fc: { interactionId },
      req: ctx.req,
      sessionId,
    };

    this.logger.trace(eventContext);

    return eventContext;
  }

  private bindSessionId(ctx) {
    const context = this.getEventContext(ctx);

    ctx.req.sessionId = context.sessionId;
  }

  private async authorizationMiddleware(ctx) {
    /**
     * Abort middleware if authorize is in error
     *
     * We do not want to start a session
     * nor trigger authorization event for invalid requests
     */
    if (ctx.oidc['isError'] === true) {
      return;
    }

    const { sessionId } = ctx.req;
    const interactionId = this.oidcProvider.getInteractionIdFromCtx(ctx);

    // oidc defined variable name
    const { client_id: spId, acr_values: spAcr } = ctx.oidc.params;

    const { name: spName } = await this.serviceProvider.getById(spId);

    const sessionProperties: OidcSession = {
      interactionId,
      spId,
      spAcr,
      spName,
    };

    const boundSessionContext: ISessionBoundContext = {
      sessionId,
      moduleName: 'OidcClient',
    };

    const saveWithContext = this.sessionService.set.bind(
      this.sessionService,
      boundSessionContext,
    );
    await saveWithContext(sessionProperties);
  }

  private tokenMiddleware(ctx) {
    try {
      this.bindSessionId(ctx);
      const eventContext = this.getEventContext(ctx);
      const { RECEIVED_CALL_ON_TOKEN } = this.tracking.TrackedEventsMap;
      this.tracking.track(RECEIVED_CALL_ON_TOKEN, eventContext);
    } catch (exception) {
      this.oidcErrorService.throwError(ctx, exception);
    }
  }

  private userinfoMiddleware(ctx) {
    try {
      this.bindSessionId(ctx);
      const eventContext = this.getEventContext(ctx);
      const { RECEIVED_CALL_ON_USERINFO } = this.tracking.TrackedEventsMap;
      this.tracking.track(RECEIVED_CALL_ON_USERINFO, eventContext);
    } catch (exception) {
      this.oidcErrorService.throwError(ctx, exception);
    }
  }
}
