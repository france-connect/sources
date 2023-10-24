import { Injectable } from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { atHashFromAccessToken, IOidcClaims, OidcSession } from '@fc/oidc';
import { OidcAcrConfig, OidcAcrService } from '@fc/oidc-acr';
import { OidcClientSession } from '@fc/oidc-client';
import {
  OidcCtx,
  OidcProviderConfig,
  OidcProviderErrorService,
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreRoutes } from '../enums';
import { CoreClaimAmrException } from '../exceptions';
import { pickAcr } from '../transforms';

@Injectable()
export class CoreOidcProviderMiddlewareService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly logger: LoggerService,
    protected readonly config: ConfigService,
    protected readonly oidcProvider: OidcProviderService,
    protected readonly sessionService: SessionService,
    protected readonly serviceProvider: ServiceProviderAdapterMongoService,
    protected readonly tracking: TrackingService,
    protected readonly oidcErrorService: OidcProviderErrorService,
    protected readonly oidcAcr: OidcAcrService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  protected registerMiddleware(
    step: OidcProviderMiddlewareStep,
    pattern: OidcProviderMiddlewarePattern | OidcProviderRoutes,
    middleware: Function,
  ) {
    this.oidcProvider.registerMiddleware(step, pattern, middleware.bind(this));
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

  protected overrideAuthorizeAcrValues(ctx: OidcCtx): void {
    const { defaultAcrValue } = this.config.get<OidcAcrConfig>('OidcAcr');
    const knownAcrValues = this.oidcAcr.getKnownAcrValues();
    this.logger.trace({ ctx, knownAcrValues });

    if (['POST', 'GET'].includes(ctx.method)) {
      const isPostMethod = ctx.method === 'POST';
      const data = isPostMethod ? ctx.req.body : ctx.query;
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { acr_values: dataAcrValues } = data as { acr_values: string };
      const acrValues = dataAcrValues.split(/\s+/);
      data.acr_values = pickAcr(knownAcrValues, acrValues, defaultAcrValue);
    } else {
      this.logger.warn(
        `Unsupported method "${ctx.method} on /authorize endpoint". This should not happen`,
      );
    }
  }

  /**
   * Override authorize request `prompt` parameter.
   * We only support 'login' and 'consent' and enforce those.
   *
   * Overriding the parameters in the request allows us to influence
   * `oidc-provider` behavior and disable all 'SSO' or 'auto login' like features.
   *
   * We make sure that a new call to autorization endpoint will result
   * in a new interaction, wether or not user agent has a previous session.
   *
   * @param ctx
   * @param overrideValue
   */
  protected overrideAuthorizePrompt(ctx: OidcCtx): void {
    const { forcedPrompt } =
      this.config.get<OidcProviderConfig>('OidcProvider');
    const overrideValue = forcedPrompt.join(' ');
    this.logger.trace({ ctx, overrideValue });

    /**
     * Support both methods
     * @TODO #137 check what needs to be done if we implement pushedAuthorizationRequests
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/137
     */
    switch (ctx.method) {
      case 'GET':
        ctx.query.prompt = overrideValue;
        break;
      case 'POST':
        ctx.req.body.prompt = overrideValue;
        break;
      default:
        this.logger.warn(
          `Unsupported method "${ctx.method} on /authorize endpoint". This should not happen`,
        );
    }
  }

  protected getEventContext(ctx): TrackedEventContextInterface {
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

  protected async trackAuthorize(
    eventContext: TrackedEventContextInterface,
  ): Promise<void> {
    const { FC_AUTHORIZE_INITIATED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_AUTHORIZE_INITIATED, eventContext);
  }

  protected async buildSessionWithNewInteraction(
    ctx: OidcCtx,
    eventContext: TrackedEventContextInterface,
  ): Promise<{
    interactionId: string;
    spAcr: string;
    spId: string;
    spName: string;
    isSso: boolean;
    stepRoute: string;
  }> {
    const { interactionId } = eventContext.fc;
    const { isSso } = ctx;

    // oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { acr_values: spAcr, client_id: spId } = ctx.oidc.params;

    /**
     * We  have to cast properties of `ctx.oidc.params` to `string`
     * since `oidc-provider`defines them as `unknown`
     */
    const { name: spName } = await this.serviceProvider.getById(spId as string);

    const sessionProperties = {
      interactionId,
      spAcr: spAcr as string,
      spId: spId as string,
      spName,
      isSso,
      /**
       * Explicit stepRoute set
       *
       * we can not rely on @SetStep() decorator
       * since we reset the session.
       */
      stepRoute: OidcProviderRoutes.AUTHORIZATION,
    };

    return sessionProperties;
  }

  protected async overrideClaimAmrMiddleware(ctx) {
    const { claims }: { claims: IOidcClaims } = ctx.oidc;

    const amrIsRequested = Object.values(claims)
      .map((claimRequested) => Object.keys(claimRequested))
      .flat()
      .includes('amr');

    if (!amrIsRequested) {
      return;
    }

    const sp = await this.serviceProvider.getById(ctx.oidc.params.client_id);
    const spClaimsAuthorized = sp.claims as Array<string>;
    const spAmrIsAuthorized = spClaimsAuthorized.includes('amr');

    if (!spAmrIsAuthorized) {
      ctx.oidc['isError'] = true;
      const exception = new CoreClaimAmrException();
      this.oidcErrorService.throwError(ctx, exception);
    }
  }

  protected async tokenMiddleware(ctx: OidcCtx) {
    try {
      this.bindSessionId(ctx);

      const sessionOidc = SessionService.getBoundSession<OidcClientSession>(
        ctx.req,
        'OidcClient',
      );

      const { AccessToken } = ctx.oidc.entities;
      const atHash = atHashFromAccessToken(AccessToken);

      await sessionOidc.setAlias(atHash);

      const eventContext = this.getEventContext(ctx);
      const { SP_REQUESTED_FC_TOKEN } = this.tracking.TrackedEventsMap;
      await this.tracking.track(SP_REQUESTED_FC_TOKEN, eventContext);
    } catch (exception) {
      ctx.oidc['isError'] = true;
      this.oidcErrorService.throwError(ctx, exception);
    }
  }

  protected async userinfoMiddleware(ctx) {
    try {
      this.bindSessionId(ctx);
      const eventContext = this.getEventContext(ctx);
      const { SP_REQUESTED_FC_USERINFO } = this.tracking.TrackedEventsMap;
      await this.tracking.track(SP_REQUESTED_FC_USERINFO, eventContext);
    } catch (exception) {
      ctx.oidc['isError'] = true;
      this.oidcErrorService.throwError(ctx, exception);
    }
  }

  protected async isSsoAvailable(
    session: ISessionService<OidcSession>,
  ): Promise<boolean> {
    const spIdentity = await session.get('spIdentity');

    return Boolean(spIdentity);
  }

  protected async redirectToSso(ctx: OidcCtx): Promise<void> {
    const { res } = ctx;
    const interactionId = this.oidcProvider.getInteractionIdFromCtx(ctx);
    const { urlPrefix } = this.config.get<AppConfig>('App');

    const url = `${urlPrefix}${CoreRoutes.INTERACTION_VERIFY.replace(
      ':uid',
      interactionId,
    )}`;

    await this.trackSso(ctx);

    res.redirect(url);
  }

  protected async trackSso(ctx: OidcCtx): Promise<void> {
    const eventContext = this.getEventContext(ctx);

    const { FC_SSO_INITIATED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_SSO_INITIATED, eventContext);
  }

  protected async checkRedirectToSso(ctx: OidcCtx): Promise<void> {
    if (ctx.isSso) {
      this.logger.trace('ssoMiddleware');
      await this.redirectToSso(ctx);
    }
  }

  private bindSessionId(ctx: OidcCtx): void {
    const context = this.getEventContext(ctx);

    ctx.req.sessionId = context.sessionId;
  }
}
