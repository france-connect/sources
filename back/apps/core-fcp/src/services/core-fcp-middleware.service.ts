import { v4 as uuid } from 'uuid';

import { Inject, Injectable } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  CORE_SERVICE,
  CoreConfig,
  CoreOidcProviderMiddlewareService,
} from '@fc/core';
import { FlowStepsService } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger-legacy';
import { stringToArray } from '@fc/oidc';
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
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  AppSession,
  CoreSessionDto,
  GetAuthorizeOidcClientSsoSession,
  GetAuthorizeSessionDto,
} from '../dto';
import { CoreFcpService } from './core-fcp.service';

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
    @Inject(CORE_SERVICE)
    protected readonly core: CoreFcpService,
    protected readonly flowSteps: FlowStepsService,
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
      core,
      flowSteps,
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
      this.redirectToHintedIdpMiddleware,
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

  private async isSsoSession(ctx: OidcCtx) {
    const { req } = ctx;
    const oidcSession = SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    const data = await oidcSession.get();

    const validationErrors = await validateDto(
      data,
      GetAuthorizeOidcClientSsoSession,
      { forbidNonWhitelisted: true },
    );

    this.logger.trace({ data, validationErrors });

    return validationErrors.length === 0;
  }

  private async renewSession(ctx: OidcCtx, spAcr: string): Promise<void> {
    const { req, res } = ctx;

    const { allowedSsoAcrs, enableSso } = this.config.get<CoreConfig>('Core');
    const sessionSsoCompatible = await this.isSsoSession(ctx);

    const hasAuthorizedAcr = allowedSsoAcrs.includes(spAcr);

    if (enableSso && sessionSsoCompatible && hasAuthorizedAcr) {
      await this.sessionService.detach(req, res);
      await this.sessionService.duplicate(req, res, GetAuthorizeSessionDto);
    } else {
      /**
       * @TODO #1418 Je ne veux pas supprimer ma première session si je passe d'un FS substantiel à élevé
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1418
       * @ticket FC-1418
       */
      await this.sessionService.reset(req, res);
    }
  }

  private async getBrowsingSessionId(
    session: ISessionService<OidcClientSession>,
  ): Promise<string> {
    return (await session.get('browsingSessionId')) || uuid();
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
    const { req } = ctx;

    // We force string casting because if it's undefined SSO will not be enable
    const spAcr = ctx?.oidc?.params?.acr_values as string;
    await this.renewSession(ctx, spAcr);

    const oidcSession = SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    const appSession = SessionService.getBoundSession<AppSession>(req, 'App');
    await appSession.set(
      'isSuspicious',
      ctx.req.headers['x-suspicious'] === '1',
    );

    ctx.isSso = await this.isSsoAvailable(oidcSession, spAcr);

    const sessionProperties = await this.buildSessionWithNewInteraction(
      ctx,
      eventContext,
    );

    const scope = ctx.oidc.params.scope as string;
    const spScope = stringToArray(scope);

    const browsingSessionId = await this.getBrowsingSessionId(oidcSession);

    await oidcSession.set({ ...sessionProperties, browsingSessionId, spScope });

    const coreSession = SessionService.getBoundSession<CoreSessionDto>(
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
