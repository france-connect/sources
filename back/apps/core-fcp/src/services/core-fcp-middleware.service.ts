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
import { LoggerService } from '@fc/logger';
import { OidcSession, stringToArray } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
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

import {
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

  private async isFinishedInteractionSession(): Promise<boolean> {
    const data = this.sessionService.get<OidcSession>('OidcClient');

    if (!data) {
      return false;
    }

    const validationErrors = await validateDto(
      data,
      GetAuthorizeOidcClientSsoSession,
      { forbidNonWhitelisted: true },
    );

    this.logger.debug({ data, validationErrors });

    return validationErrors.length === 0;
  }

  private async renewSession(ctx: OidcCtx, spAcr: string): Promise<void> {
    const isFinishedInteractionSession =
      await this.isFinishedInteractionSession();

    await this.detachSessionIfNeeded(isFinishedInteractionSession, ctx);

    await this.resetSessionIfNeeded(isFinishedInteractionSession, ctx, spAcr);
  }

  private async detachSessionIfNeeded(
    isFinishedInteractionSession: boolean,
    ctx: OidcCtx,
  ): Promise<void> {
    const { res } = ctx;

    if (isFinishedInteractionSession) {
      await this.sessionService.duplicate(res, GetAuthorizeSessionDto);
      this.logger.debug('Session has been detached and duplicated');
    }
  }

  private async resetSessionIfNeeded(
    isFinishedInteractionSession: boolean,
    ctx: OidcCtx,
    spAcr: string,
  ): Promise<void> {
    const { res } = ctx;
    const { allowedSsoAcrs, enableSso } = this.config.get<CoreConfig>('Core');
    const hasAuthorizedAcr = allowedSsoAcrs.includes(spAcr);
    const isSsoSession =
      enableSso && hasAuthorizedAcr && isFinishedInteractionSession;

    if (!isSsoSession) {
      await this.sessionService.reset(res);
      this.logger.debug('Session has been reset');
    }
  }

  private getBrowsingSessionId(): string {
    return this.sessionService.get('OidcClient', 'browsingSessionId') || uuid();
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

    // We force string casting because if it's undefined SSO will not be enable
    const spAcr = ctx?.oidc?.params?.acr_values as string;
    await this.renewSession(ctx, spAcr);

    this.sessionService.set(
      'App',
      'isSuspicious',
      ctx.req.headers['x-suspicious'] === '1',
    );

    ctx.isSso = this.isSsoAvailable(spAcr);

    const sessionProperties = await this.buildSessionWithNewInteraction(
      ctx,
      eventContext,
    );

    const scope = ctx.oidc.params.scope as string;
    const spScope = stringToArray(scope);

    const browsingSessionId = this.getBrowsingSessionId();

    this.sessionService.set('OidcClient', {
      ...sessionProperties,
      browsingSessionId,
      spScope,
    });

    await this.sessionService.commit();

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
