import { Inject, Injectable } from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { FlowStepsService } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger';
import { atHashFromAccessToken, IOidcClaims, OidcSession } from '@fc/oidc';
import { OidcAcrConfig, OidcAcrService } from '@fc/oidc-acr';
import { OidcClientRoutes } from '@fc/oidc-client';
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
import { SessionNoSessionIdException, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreConfig } from '../dto';
import { CoreRoutes } from '../enums';
import { CoreClaimAmrException, CoreIdpHintException } from '../exceptions';
import { CoreServiceInterface } from '../interfaces';
import { CORE_SERVICE } from '../tokens';
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
    @Inject(CORE_SERVICE)
    protected readonly core: CoreServiceInterface,
    protected readonly flowSteps: FlowStepsService,
  ) {}

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
    if (!['POST', 'GET'].includes(ctx.method)) {
      this.logger.warning(`Unsupported method "${ctx.method}".`);
      return;
    }

    const { defaultAcrValue } = this.config.get<OidcAcrConfig>('OidcAcr');
    const knownAcrValues = this.oidcAcr.getKnownAcrValues();

    const isPostMethod = ctx.method === 'POST';
    const data = isPostMethod ? ctx.req.body : ctx.query;
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { acr_values: dataAcrValues } = data as { acr_values: string };
    const acrValues = dataAcrValues.split(/\s+/);
    data.acr_values = pickAcr(knownAcrValues, acrValues, defaultAcrValue);

    this.logger.info(`Overriding "acr_values" with "${data.acr_values}"`);
    this.logger.debug({
      originalAcrValues: dataAcrValues,
      overriddenAcrValues: data.acr_values,
    });
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
    if (!['POST', 'GET'].includes(ctx.method)) {
      this.logger.warning(`Unsupported method "${ctx.method}".`);
      return;
    }

    const { forcedPrompt } =
      this.config.get<OidcProviderConfig>('OidcProvider');
    const overrideValue = forcedPrompt.join(' ');

    /**
     * Support both methods
     * @TODO #137 check what needs to be done if we implement pushedAuthorizationRequests
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/137
     */
    const isPostMethod = ctx.method === 'POST';
    const data = isPostMethod ? ctx.req.body : ctx.query;
    const { prompt: dataPrompt } = data as { prompt: string };
    data.prompt = overrideValue;

    this.logger.info(`Overriding "prompt" with "${data.prompt}"`);
    this.logger.debug({
      originalPrompt: dataPrompt,
      overriddenPrompt: data.prompt,
    });
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
      await this.oidcErrorService.throwError(ctx, exception);
    }
  }

  protected async tokenMiddleware(ctx: OidcCtx) {
    try {
      const sessionId = this.getSessionId(ctx);
      await this.sessionService.initCache(sessionId);

      const { AccessToken } = ctx.oidc.entities;
      const atHash = atHashFromAccessToken(AccessToken);

      await this.sessionService.setAlias(atHash, sessionId);

      const eventContext = this.getEventContext(ctx);

      const { SP_REQUESTED_FC_TOKEN } = this.tracking.TrackedEventsMap;
      await this.tracking.track(SP_REQUESTED_FC_TOKEN, eventContext);
    } catch (exception) {
      ctx.oidc['isError'] = true;
      await this.oidcErrorService.throwError(ctx, exception);
    }
  }

  protected async userinfoMiddleware(ctx) {
    try {
      const sessionId = this.getSessionId(ctx);
      await this.sessionService.initCache(sessionId);

      const eventContext = this.getEventContext(ctx);

      const { SP_REQUESTED_FC_USERINFO } = this.tracking.TrackedEventsMap;
      await this.tracking.track(SP_REQUESTED_FC_USERINFO, eventContext);
    } catch (exception) {
      ctx.oidc['isError'] = true;
      await this.oidcErrorService.throwError(ctx, exception);
    }
  }

  private shouldAbortIdpHint(ctx: OidcCtx) {
    const { req } = ctx;
    const idpHint = req.query.idp_hint as string;

    return ctx.oidc['isError'] === true || ctx.isSso || !idpHint;
  }

  private trackRedirectToIdp(ctx: OidcCtx) {
    const eventContext = this.getEventContext(ctx);
    const { FC_REDIRECTED_TO_HINTED_IDP } = this.tracking.TrackedEventsMap;
    return this.tracking.track(FC_REDIRECTED_TO_HINTED_IDP, eventContext);
  }

  protected async redirectToHintedIdpMiddleware(ctx: OidcCtx) {
    const { req, res } = ctx;
    const idpHint = req.query.idp_hint as string;
    const { allowedIdpHints } = this.config.get<CoreConfig>('Core');
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const acr_values = ctx.oidc.params.acr_values as string;

    if (this.shouldAbortIdpHint(ctx)) {
      return;
    }

    if (!allowedIdpHints.includes(idpHint)) {
      const exception = new CoreIdpHintException();
      return this.oidcErrorService.handleRedirectableError(ctx, exception);
    }

    this.flowSteps.setStep(OidcClientRoutes.REDIRECT_TO_IDP);

    try {
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await this.core.redirectToIdp(res, idpHint, { acr_values });
      await this.sessionService.commit();
      await this.trackRedirectToIdp(ctx);
    } catch (error) {
      await this.oidcErrorService.throwError(ctx, error);
    }
  }

  protected isSsoAvailable(spAcr: string): boolean {
    const { allowedSsoAcrs, enableSso } = this.config.get<CoreConfig>('Core');
    const { spIdentity, idpAcr } =
      this.sessionService.get<OidcSession>('OidcClient') || {};

    const hasSpIdentity = Boolean(spIdentity);
    const hasSufficientAcr = this.oidcAcr.isAcrValid(idpAcr, spAcr);
    const hasAuthorizedAcr = allowedSsoAcrs.includes(spAcr);
    const ssoCanBeUsed = this.ssoCanBeUsed(
      enableSso,
      hasAuthorizedAcr,
      hasSufficientAcr,
      hasSpIdentity,
    );

    return ssoCanBeUsed;
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
      this.logger.info('SSO detected, skipping IdP authentication.');
      await this.redirectToSso(ctx);
    }
  }

  private getSessionId(ctx: OidcCtx): string {
    const { sessionId } = this.getEventContext(ctx);

    if (!sessionId) {
      throw new SessionNoSessionIdException();
    }

    return sessionId;
  }

  private ssoCanBeUsed(
    enableSso: boolean,
    hasAuthorizedAcr: boolean,
    hasSufficientAcr: boolean,
    hasSpIdentity: boolean,
  ): boolean {
    return enableSso && hasAuthorizedAcr && hasSufficientAcr && hasSpIdentity;
  }
}
