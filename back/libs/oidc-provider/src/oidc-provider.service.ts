import { Response } from 'express';
import { get } from 'lodash';
import { KoaContextWithOIDC, Provider } from 'oidc-provider';
import { HttpOptions } from 'openid-client';

import { Global, Inject, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { RedisService } from '@fc/redis';

import {
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
} from './enums';
import {
  OidcProviderBindingException,
  OidcProviderInitialisationException,
  OidcProviderInteractionNotFoundException,
  OidcProviderRuntimeException,
} from './exceptions';
import { IOidcProviderConfigAppService } from './interfaces';
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
    private httpAdapterHost: HttpAdapterHost,
    readonly logger: LoggerService,
    readonly redis: RedisService,
    private readonly errorService: OidcProviderErrorService,
    private readonly configService: OidcProviderConfigService,
    @Inject(OIDC_PROVIDER_CONFIG_APP_TOKEN)
    private readonly oidcProviderConfigApp: IOidcProviderConfigAppService,
  ) {}

  /**
   * Wait for nest to load its own route before binding oidc-provider routes
   * @see https://docs.nestjs.com/faq/http-adapter
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
  async onModuleInit() {
    const { prefix, issuer, configuration } =
      await this.configService.getConfig(this);
    this.configuration = configuration;

    try {
      this.provider = new this.ProviderProxy(issuer, {
        ...configuration,
        httpOptions: this.getHttpOptions.bind(this),
      });
      this.provider.proxy = true;
    } catch (error) {
      throw new OidcProviderInitialisationException();
    }

    this.oidcProviderConfigApp.setProvider(this.provider);

    try {
      /**
       * @see https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#mounting-oidc-provider
       */
      this.httpAdapterHost.httpAdapter.use(prefix, this.provider.callback());
    } catch (error) {
      throw new OidcProviderBindingException();
    }

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

  /**
   * Add global request timeout
   * @see https://github.com/panva/node-oidc-provider/blob/HEAD/docs/README.md#httpoptions
   *
   * @param {HttpOptions} options
   */
  private getHttpOptions(options: HttpOptions): HttpOptions {
    options.timeout = this.configuration.timeout;
    return options;
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
  // `oidc-provider` does not provide a type for interaction
  async getInteraction(req, res): Promise<any> {
    try {
      const interactionDetail = await this.provider.interactionDetails(
        req,
        res,
      );

      return interactionDetail;
    } catch (error) {
      throw new OidcProviderRuntimeException(error);
    }
  }

  /**
   * @todo Expliciter par une interface le retour d'appel à OidcProvider.interactionFinished
   *
   * @see #533
   * https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/553
   */
  async abortInteraction(
    req: any,
    res: any,
    error: string,
    errorDescription: string,
  ): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const result = { error, error_description: errorDescription };
      const finished = await this.provider.interactionFinished(
        req,
        res,
        result,
      );
      return finished;
    } catch (error) {
      throw new OidcProviderRuntimeException(error);
    }
  }

  private async runMiddlewareBeforePattern(
    { step, path, pattern, ctx },
    middleware: Function,
  ) {
    // run middleware BEFORE pattern occurs
    if (step === OidcProviderMiddlewareStep.BEFORE && path === pattern) {
      await middleware(ctx);
    }
  }

  private async runMiddlewareAfterPattern(
    { step, route, path, pattern, ctx },
    middleware: Function,
  ) {
    // run middleware AFTER pattern occured
    if (
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
    ) {
      await middleware(ctx);
    }
  }

  /**
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#pre--and-post-middlewares
   */
  registerMiddleware(
    step: OidcProviderMiddlewareStep,
    pattern: OidcProviderMiddlewarePattern | OidcProviderRoutes,
    middleware: Function,
  ): void {
    this.provider.use(async (ctx: KoaContextWithOIDC, next: Function) => {
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

  finishInteraction(req: any, res: any, session: OidcSession) {
    this.oidcProviderConfigApp.finishInteraction(req, res, session);
  }

  clearCookies(res: Response) {
    COOKIES.forEach((cookieName) => {
      res.clearCookie(cookieName);
    });
  }
}
