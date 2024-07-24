import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterEnvService } from '@fc/service-provider-adapter-env';
import { SessionService } from '@fc/session';
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
  ) {}

  onModuleInit() {
    this.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.beforeAuthorizeMiddleware,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.afterAuthorizeMiddleware,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.TOKEN,
      this.tokenMiddleware,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.USERINFO,
      this.userinfoMiddleware,
    );
  }

  protected registerMiddleware(
    step: OidcProviderMiddlewareStep,
    pattern: OidcProviderMiddlewarePattern | OidcProviderRoutes,
    middleware: Function,
  ) {
    this.oidcProvider.registerMiddleware(step, pattern, middleware.bind(this));
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

    return eventContext;
  }

  private bindSessionId(ctx) {
    const context = this.getEventContext(ctx);

    ctx.req.sessionId = context.sessionId;
  }

  protected beforeAuthorizeMiddleware({ req, res }: OidcCtx): void {
    /**
     * Force cookies to be reset to prevent panva from keeping
     * a session open if you use several service provider in a row
     * @param ctx
     */
    this.oidcProvider.clearCookies(res);
    req.headers.cookie = '';
  }

  private async afterAuthorizeMiddleware(ctx) {
    /**
     * Abort middleware if authorize is in error
     *
     * We do not want to start a session
     * nor trigger authorization event for invalid requests
     */
    if (ctx.oidc['isError'] === true) {
      return;
    }

    const interactionId = this.oidcProvider.getInteractionIdFromCtx(ctx);

    const { client_id: spId, acr_values: spAcr } = ctx.oidc.params;

    const { name: spName } = await this.serviceProvider.getById(spId);

    const sessionProperties: OidcSession = {
      interactionId,
      spId,
      spAcr,
      spName,
    };

    this.sessionService.set('OidcClient', sessionProperties);
    await this.sessionService.commit();
  }

  private async tokenMiddleware(ctx) {
    try {
      this.bindSessionId(ctx);
      const eventContext = this.getEventContext(ctx);
      const { RECEIVED_CALL_ON_TOKEN } = this.tracking.TrackedEventsMap;
      await this.tracking.track(RECEIVED_CALL_ON_TOKEN, eventContext);
    } catch (exception) {
      this.logger.err(exception);
      await this.oidcErrorService.throwError(ctx, exception);
    }
  }

  private async userinfoMiddleware(ctx) {
    try {
      this.bindSessionId(ctx);
      const eventContext = this.getEventContext(ctx);
      const { RECEIVED_CALL_ON_USERINFO } = this.tracking.TrackedEventsMap;
      await this.tracking.track(RECEIVED_CALL_ON_USERINFO, eventContext);
    } catch (exception) {
      this.logger.err(exception);
      await this.oidcErrorService.throwError(ctx, exception);
    }
  }
}
