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
  OidcProviderPrompt,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import {
  GetAuthorizeOidcClientSsoSession,
  GetAuthorizeSessionDto,
} from '../dto';
import { CoreFcaService } from './core-fca.service';

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
    @Inject(CORE_SERVICE)
    protected readonly core: CoreFcaService,
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
      this.handleSilentAuthenticationMiddleware,
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

  protected async handleSilentAuthenticationMiddleware(
    ctx: OidcCtx,
  ): Promise<void> {
    const { acr_values: acrValues, prompt } =
      this.getAuthorizationParameters(ctx);

    if (!prompt) {
      return this.overrideAuthorizePrompt(ctx);
    }

    const isSilentAuthentication = this.isPromptStrictlyEqualNone(prompt);

    // Persist this flag to adjust redirections during '/verify'
    this.sessionService.set(
      'OidcClient',
      'isSilentAuthentication',
      isSilentAuthentication,
    );
    await this.sessionService.commit();

    if (this.isSsoAvailable(acrValues) && isSilentAuthentication) {
      // Given the Panva middlewares lack of active session awareness, overriding the prompt value is crucial to prevent
      // login-required errors. Silent authentication will be treated as a login attempt when an active session exists.
      this.overrideAuthorizePrompt(ctx);
    }
  }

  private isPromptStrictlyEqualNone(prompt: string) {
    if (!prompt) {
      return false;
    }
    const promptValues = stringToArray(prompt);
    return (
      promptValues.length === 1 && promptValues[0] === OidcProviderPrompt.NONE
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
    await this.renewSession(ctx);

    // We force string casting because if it's undefined SSO will not be enabled
    const spAcr = ctx?.oidc?.params?.acr_values as string;
    ctx.isSso = this.isSsoAvailable(spAcr);

    const sessionProperties = await this.buildSessionWithNewInteraction(
      ctx,
      eventContext,
    );

    const browsingSessionId = this.getBrowsingSessionId();

    this.sessionService.set('OidcClient', {
      ...sessionProperties,
      browsingSessionId,
    });
    await this.sessionService.commit();

    await this.trackAuthorize(eventContext);

    await this.checkRedirectToSso(ctx);
  }

  private async isSsoSession() {
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

  private async renewSession(ctx: OidcCtx): Promise<void> {
    const { res } = ctx;

    const { enableSso } = this.config.get<CoreConfig>('Core');
    const isSsoSession = await this.isSsoSession();

    if (enableSso && isSsoSession) {
      await this.sessionService.duplicate(res, GetAuthorizeSessionDto);
      this.logger.debug('Session has been detached and duplicated');
    } else {
      await this.sessionService.reset(res);
      this.logger.debug('Session has been reset');
    }
  }

  private getBrowsingSessionId(): string {
    return this.sessionService.get('OidcClient', 'browsingSessionId') || uuid();
  }
}
