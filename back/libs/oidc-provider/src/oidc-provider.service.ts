import { Request, Response } from 'express';
import { JSONWebKeySet } from 'jose';
import { get } from 'lodash';
import {
  Configuration,
  InteractionResults,
  KoaContextWithOIDC,
  Provider,
} from 'oidc-provider';

import { Global, Inject, Injectable } from '@nestjs/common';

import { AsyncFunctionSafe, FunctionSafe } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { RedisService } from '@fc/redis';

import { OidcProviderConfig } from './dto';
import {
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
} from './enums';
import {
  OidcProviderInitialisationException,
  OidcProviderInteractionNotFoundException,
  OidcProviderRuntimeException,
} from './exceptions';
import {
  InteractionInterface,
  IOidcProviderConfigAppService,
} from './interfaces';
import {
  OidcProviderConfigService,
  OidcProviderErrorService,
} from './services';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';

const PATHS = {
  [OidcProviderRoutes.TOKEN]: 'oidc.entities.Grant.accountId',
  [OidcProviderRoutes.USERINFO]: 'oidc.entities.Account.accountId',
};
const DEFAULT_PATH = 'oidc.entities.Interaction.uid';

export const COOKIES = ['_session', '_interaction', '_interaction_resume'];

/**
 * Make service global in order to ease retrieval and override from other libraries.
 * It is unlikely we will need multiple instances of this module any time.
 */
@Global()
@Injectable()
export class OidcProviderService {
  private ProviderProxy = Provider;
  private provider: Provider;
  private configuration;

  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    readonly logger: LoggerService,
    readonly redis: RedisService,
    private readonly errorService: OidcProviderErrorService,
    private readonly configService: OidcProviderConfigService,
    @Inject(OIDC_PROVIDER_CONFIG_APP_TOKEN)
    private readonly oidcProviderConfigApp: IOidcProviderConfigAppService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Wait for nest to load its own route before binding oidc-provider routes
   * @see https://docs.nestjs.com/faq/http-adapter
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
  init() {
    const { issuer, configuration } = this.configService.getConfig(this);
    this.configuration = configuration;

    const conf = {
      ...configuration,
      fetch: this.fetch.bind(this),
    } as Configuration;

    try {
      this.provider = new this.ProviderProxy(issuer, conf);
      this.provider.proxy = true;
    } catch (error) {
      throw new OidcProviderInitialisationException(error);
    }
  }

  onModuleInit() {
    this.init();

    this.oidcProviderConfigApp.setProvider(this.provider);

    this.errorService.catchErrorEvents(this.provider);
  }

  // Reverse engineering of PANVA library
  getInteractionIdFromCtx(ctx) {
    const path = PATHS[ctx.req._parsedUrl.pathname] || DEFAULT_PATH;
    const interactionId = get(ctx, path);

    if (!interactionId) {
      throw new OidcProviderInteractionNotFoundException();
    }

    return interactionId;
  }

  /**
   * Getter for external override module
   *
   * @warning Will return `undefined` before onModuleInit() is ran
   */
  getProvider(): Provider {
    return this.provider;
  }

  async callback(req: Request, res: Response) {
    const { prefix } = this.configService.getConfig(this);
    req.url = req.originalUrl.replace(prefix, '');

    return await this.provider.callback()(req, res);
  }

  /**
   * Add global request timeout
   * @see https://github.com/panva/node-oidc-provider/blob/HEAD/docs/README.md#httpoptions
   *
   * @param {HttpOptions} options
   */
  private fetch(
    url: string,
    options: RequestInit,
  ): Promise<globalThis.Response> {
    options.signal = AbortSignal.timeout(this.configuration.timeout);
    return globalThis.fetch(url, options);
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  /**
   * Wrap `oidc-provider` method to
   *  - lower coupling in other modules
   *  - handle exceptions
   *
   * @param req
   * @param res
   */
  async getInteraction(req, res): Promise<InteractionInterface> {
    try {
      const interactionDetails = (await this.provider.interactionDetails(
        req,
        res,
      )) as InteractionInterface;

      return interactionDetails;
    } catch (error) {
      throw new OidcProviderRuntimeException(error);
    }
  }

  async abortInteraction(
    req: any,
    res: any,
    errorParams: InteractionResults,
    retry: boolean = false,
  ): Promise<void> {
    const result = retry ? {} : errorParams;
    await this.provider.interactionFinished(req, res, result);
  }

  private async runMiddlewareBeforePattern(
    { step, path, pattern, ctx },
    middleware: FunctionSafe | AsyncFunctionSafe,
  ) {
    // run middleware BEFORE pattern occurs
    if (step === OidcProviderMiddlewareStep.BEFORE && path === pattern) {
      await middleware(ctx);
    }
  }

  private async runMiddlewareAfterPattern(
    { step, route, path, pattern, ctx },
    middleware: FunctionSafe | AsyncFunctionSafe,
  ) {
    // run middleware AFTER pattern occurred
    if (
      !this.isInError(ctx) &&
      this.shouldRunAfterPattern({ step, route, path, pattern })
    ) {
      await middleware(ctx);
    }
  }

  private shouldRunAfterPattern({ step, route, path, pattern }) {
    return (
      step === OidcProviderMiddlewareStep.AFTER &&
      /**
       * In the post processing phase, we may also target more specific actions with ctx.oidc.route
       * Though we can still match on the path.
       * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#pre--and-post-middlewares
       *
       * Since there can be no overlap between MiddlewarePatterns and Routes,
       * we can safely use a unique function parameter (`pattern`) and test it against both values.
       */
      (route === pattern || path === pattern)
    );
  }

  private isInError(ctx) {
    return ctx['oidc']?.isError === true;
  }

  /**
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#pre--and-post-middlewares
   */
  registerMiddleware(
    step: OidcProviderMiddlewareStep,
    pattern: OidcProviderMiddlewarePattern | OidcProviderRoutes,
    middleware: FunctionSafe | AsyncFunctionSafe,
  ): void {
    this.provider.use(async (ctx: KoaContextWithOIDC, next: FunctionSafe) => {
      // Extract path and oidc.route from ctx
      const { path, oidc: { route = '' } = {} } = ctx;

      await this.runMiddlewareBeforePattern(
        { step, path, pattern, ctx },
        middleware,
      );

      // Let pattern occur
      await next();

      await this.runMiddlewareAfterPattern(
        { step, route, path, pattern, ctx },
        middleware,
      );
    });
  }

  async finishInteraction(
    req: any,
    res: any,
    session: OidcSession,
    sessionId?: string,
  ): Promise<void> {
    await this.oidcProviderConfigApp.finishInteraction(
      req,
      res,
      session,
      sessionId,
    );
  }

  getJwks(): JSONWebKeySet {
    const {
      configuration: { jwks },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    return jwks as JSONWebKeySet;
  }

  clearCookies(res: Response): void {
    COOKIES.forEach((cookieName) => {
      res.clearCookie(cookieName);
    });
  }
}
