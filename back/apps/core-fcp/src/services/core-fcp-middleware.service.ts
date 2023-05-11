import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreConfig, CoreOidcProviderMiddlewareService } from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
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
import { SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { AppSession, CoreSessionDto } from '../dto';

@Injectable()
export class CoreFcpMiddlewareService extends CoreOidcProviderMiddlewareService {
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

  // eslint-disable-next-line complexity
  protected async afterAuthorizeMiddleware(ctx: OidcCtx): Promise<void> {
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
    const { req, res } = ctx;

    const { enableSso } = this.config.get<CoreConfig>('Core');
    if (!enableSso) {
      await this.sessionService.reset(req, res);
    }

    const oidcSession = SessionService.getBoundedSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    const appSession = SessionService.getBoundedSession<AppSession>(req, 'App');
    await appSession.set(
      'isSuspicious',
      ctx.req.headers['x-suspicious'] === '1',
    );

    const isSsoAvailable = await this.isSsoAvailable(oidcSession);
    ctx.isSso = enableSso && isSsoAvailable;

    const sessionProperties = await this.buildSessionWithNewInteraction(
      ctx,
      eventContext,
    );

    await oidcSession.set(sessionProperties);

    const coreSession = SessionService.getBoundedSession<CoreSessionDto>(
      req,
      'Core',
    );

    const sentNotificationsForSp = await coreSession.get(
      'sentNotificationsForSp',
    );

    const sentNotificationsForSpRes = sentNotificationsForSp ?? [];

    await coreSession.set('sentNotificationsForSp', sentNotificationsForSpRes);

    const { interactionId: _interactionId, ...sessionWithoutInteractionId } =
      sessionProperties;
    const authEventContext: TrackedEventContextInterface = {
      ...eventContext,
      ...sessionWithoutInteractionId,
    };

    await this.trackAuthorize(authEventContext);

    await this.checkRedirectToSso(ctx);
  }
}
