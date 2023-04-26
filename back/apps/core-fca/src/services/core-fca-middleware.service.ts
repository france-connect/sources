import { Injectable } from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { CoreOidcProviderMiddlewareService, CoreRoutes } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientSession } from '@fc/oidc-client';
import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { CoreConfig } from '../dto';

@Injectable()
export class CoreFcaMiddlewareService extends CoreOidcProviderMiddlewareService {
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
    super(
      logger,
      config,
      oidcProvider,
      sessionService,
      serviceProvider,
      tracking,
      oidcErrorService,
      oidcAcr,
    );
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit() {
    this.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.beforeAuthorizeMiddleware,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.overrideAuthorizeAcrValues,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.overrideAuthorizePrompt,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.afterAuthorizeMiddleware,
    );

    this.registerMiddleware(
      OidcProviderMiddlewareStep.AFTER,
      OidcProviderRoutes.AUTHORIZATION,
      this.overrideClaimAmrMiddleware,
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

  protected async afterAuthorizeMiddleware(ctx: OidcCtx) {
    /**
     * Abort middleware if authorize is in error
     *
     * We do not want to start a session
     * nor trigger authorization event for invalid requests
     */
    if (ctx.oidc['isError'] === true) {
      return;
    }
    const eventContext = this.getEventContext(ctx);
    const { req } = ctx;

    const { enableSso } = this.config.get<CoreConfig>('Core');
    const oidcSession = SessionService.getBoundedSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    ctx.isSso = await this.isSsoAvailable(oidcSession);
    const { isSso } = ctx;

    const sessionProperties = await this.buildSessionWithNewInteraction(
      ctx,
      eventContext,
    );
    Object.assign(sessionProperties, { isSso });

    await oidcSession.set(sessionProperties);

    await this.trackAuthorize(eventContext);

    if (enableSso && isSso) {
      this.logger.trace('ssoMiddleware');
      await this.redirectToSso(ctx);
    }
  }

  private async isSsoAvailable(
    session: ISessionService<OidcSession>,
  ): Promise<boolean> {
    const spIdentity = await session.get('spIdentity');

    return Boolean(spIdentity);
  }

  private async redirectToSso(ctx: OidcCtx) {
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

  private async trackSso(ctx: OidcCtx) {
    const eventContext = this.getEventContext(ctx);

    const { FC_SSO_INITIATED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_SSO_INITIATED, eventContext);
  }
}
