import { Injectable } from '@nestjs/common';

import { AccountBlockedException, AccountService } from '@fc/account';
import { ConfigService } from '@fc/config';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { Acr, OidcSession } from '@fc/oidc';
import {
  OidcCtx,
  OidcProviderAuthorizationEvent,
  OidcProviderConfig,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
  OidcProviderTokenEvent,
  OidcProviderUserinfoEvent,
} from '@fc/oidc-provider';
import { OidcProviderErrorService } from '@fc/oidc-provider/services';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionBoundContext, SessionService } from '@fc/session';
import { IEventContext, TrackingService } from '@fc/tracking';

import {
  CoreFailedPersistenceException,
  CoreInvalidAcrException,
  CoreLowAcrException,
} from '../exceptions';
import { AcrValues, pickAcr } from '../transforms';
import { ComputeIdp, ComputeSp } from '../types';

@Injectable()
export class CoreService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly oidcProvider: OidcProviderService,
    private readonly oidcErrorService: OidcProviderErrorService,
    private readonly account: AccountService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly sessionService: SessionService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Configure hooks on oidc-provider
   */
  onModuleInit() {
    this.registerMiddlewares();
  }

  private getEventContext(ctx): IEventContext {
    const interactionId: string =
      this.oidcProvider.getInteractionIdFromCtx(ctx);
    const ip: string = this.getIpFromCtx(ctx);

    const eventContext: IEventContext = {
      fc: { interactionId },
      headers: { 'x-forwarded-for': ip },
    };

    this.logger.trace(eventContext);

    return eventContext;
  }

  private registerMiddlewares() {
    const { defaultAcrValue, forcedPrompt, knownAcrValues } =
      this.config.get<OidcProviderConfig>('OidcProvider');

    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.resetCookies.bind(this),
    );

    /** Force prompt @see overrideAuthorizePrompt header */
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.overrideAuthorizePrompt.bind(this, forcedPrompt.join(' ')),
    );

    /** Force Acr values @see overrideAuthorizeAcrValues header */
    this.oidcProvider.registerMiddleware(
      OidcProviderMiddlewareStep.BEFORE,
      OidcProviderRoutes.AUTHORIZATION,
      this.overrideAuthorizeAcrValues.bind(
        this,
        knownAcrValues,
        defaultAcrValue,
      ),
    );

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

    const eventContext = this.getEventContext(ctx);

    const { interactionId } = eventContext.fc;

    const { req, res } = ctx;
    const sessionId = await this.sessionService.reset(req, res);

    // oidc defined variable name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { acr_values: spAcr, client_id: spId } = ctx.oidc.params;

    const { name: spName } = await this.serviceProvider.getById(spId);

    const sessionProperties: OidcSession = {
      interactionId,
      spAcr,
      spId,
      spName,
    };

    const sessionContext: ISessionBoundContext = {
      moduleName: 'OidcClient',
      sessionId,
    };
    await this.sessionService.set(sessionContext, sessionProperties);

    const authEventContext: IEventContext = {
      ...eventContext,
      spAcr,
      spId,
      spName,
    };

    this.tracking.track(OidcProviderAuthorizationEvent, authEventContext);
  }

  private tokenMiddleware(ctx) {
    try {
      const eventContext = this.getEventContext(ctx);

      this.tracking.track(OidcProviderTokenEvent, eventContext);
    } catch (exception) {
      this.oidcErrorService.throwError(ctx, exception);
    }
  }

  private userinfoMiddleware(ctx) {
    try {
      const eventContext = this.getEventContext(ctx);

      this.tracking.track(OidcProviderUserinfoEvent, eventContext);
    } catch (exception) {
      this.oidcErrorService.throwError(ctx, exception);
    }
  }

  /**
   * Force cookies to be reset to prevent panva from keeping
   * a session open if you use several service provider in a row
   * @param ctx
   */
  private resetCookies(ctx: OidcCtx): void {
    ctx.req.headers.cookie = '';
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
  private overrideAuthorizePrompt(overrideValue: string, ctx: OidcCtx): void {
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

  // Revers ingineering of PANVA library
  getIpFromCtx(ctx): string {
    return ctx.req.headers['x-forwarded-for'];
  }

  private overrideAuthorizeAcrValues(
    knownAcrValues: string[],
    defaultAcrValue: string,
    ctx: OidcCtx,
  ): void {
    this.logger.trace({ ctx, knownAcrValues });

    if (['POST', 'GET'].includes(ctx.method)) {
      const isPostMethod = ctx.method === 'POST';
      const data = isPostMethod ? ctx.req.body : ctx.query;
      const { acr_values: dataAcrValues } = data as AcrValues;
      const acrValues = dataAcrValues.split(/[ ]+/);
      data.acr_values = pickAcr(knownAcrValues, acrValues, defaultAcrValue);
    } else {
      this.logger.warn(
        `Unsupported method "${ctx.method} on /authorize endpoint". This should not happen`,
      );
    }
  }

  /**
   * Check if an account exists and is blocked
   * @param identity
   */
  async checkIfAccountIsBlocked(identityHash: string): Promise<void> {
    const accountIsBlocked = await this.account.isBlocked(identityHash);

    if (accountIsBlocked) {
      throw new AccountBlockedException();
    }
  }

  /**
   * Computes federation entry for a given identity and provider id
   *
   * @param providerId
   * @param sub
   * @param entityId?
   */

  private getFederation(providerId: string, sub: string, entityId?: string) {
    const key = entityId || providerId;
    return { [key]: { sub } };
  }

  /**
   * Build and persist current interaction with account service
   * @param {string} spId - id of the Service Provider
   * @param {string} entityId -
   * @param {string} subSp - sub of the Service Provider
   * @param {string} hashSp - hash of the Service Provider
   * @param {string} idpId - id of the Identity Provider
   * @param {string} subIdp - sub of the Identity Provider
   */
  async computeInteraction(
    { entityId, hashSp, spId, subSp }: ComputeSp,
    { idpId, subIdp }: ComputeIdp,
  ): Promise<string> {
    const spFederation = this.getFederation(spId, subSp, entityId);
    const idpFederation = this.getFederation(idpId, subIdp);

    const interaction = {
      // service provider Hash is used as main identity hash
      identityHash: hashSp,
      // federation for each sides
      idpFederation: idpFederation,
      // Set last connection time to now
      lastConnection: new Date(),
      spFederation: spFederation,
    };

    this.logger.trace(interaction);

    try {
      const accountId = await this.account.storeInteraction(interaction);

      return accountId;
    } catch (error) {
      throw new CoreFailedPersistenceException(error);
    }
  }

  checkIfAcrIsValid(received: string, requested: string): void {
    /**
     * @todo #494
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/494
     */
    if (!received || !requested) {
      this.logger.trace(
        { error: 'received or requested ACR missing' },
        LoggerLevelNames.WARN,
      );
      throw new CoreInvalidAcrException();
    }

    if (!this.isAcrValid(received, requested)) {
      this.logger.trace(
        { error: 'received ACR lower than requested' },
        LoggerLevelNames.WARN,
      );
      throw new CoreLowAcrException();
    }
  }

  /**
   * Acr level is high enough to respect provider requirements
   * @param source Acr given from the user
   * @param target Acr given from the Idp
   * @returns
   */
  isAcrValid(source: string, target: string): boolean {
    const sourceAcr = Acr[source];
    const targetAcr = Acr[target];

    return sourceAcr >= targetAcr;
  }

  async rejectInvalidAcr(
    currentAcrValue: string,
    allowedAcrValues: string[],
    { req, res }: { req: any; res: any },
  ): Promise<boolean> {
    const isAllowed = allowedAcrValues.includes(currentAcrValue);

    if (isAllowed) {
      this.logger.trace({ isAllowed, currentAcrValue, allowedAcrValues });
      return false;
    }

    const error = 'invalid_acr';
    const allowedAcrValuesString = allowedAcrValues.join(',');
    const errorDescription = `acr_value is not valid, should be equal one of these values, expected ${allowedAcrValuesString}, got ${currentAcrValue}`;

    await this.oidcProvider.abortInteraction(req, res, error, errorDescription);

    this.logger.trace(
      { isAllowed, currentAcrValue, allowedAcrValues },
      LoggerLevelNames.WARN,
    );

    return true;
  }
}
