import { get } from 'lodash';
import {
  InteractionResults,
  KoaContextWithOIDC,
  Provider,
} from 'oidc-provider';
import { HttpOptions } from 'openid-client';

import { Global, Inject, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { Redis, REDIS_CONNECTION_TOKEN } from '@fc/redis';

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
import {
  OidcProviderConfigService,
  OidcProviderErrorService,
} from './services';
import { OidcProviderGrantService } from './services/oidc-provider-grant.service';

const PATHS = {
  [OidcProviderRoutes.TOKEN]: 'oidc.entities.Grant.accountId',
  [OidcProviderRoutes.USERINFO]: 'oidc.entities.Account.accountId',
};
const DEFAULT_PATH = 'oidc.entities.Interaction.uid';

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
    @Inject(REDIS_CONNECTION_TOKEN)
    readonly redis: Redis,
    private readonly errorService: OidcProviderErrorService,
    private readonly configService: OidcProviderConfigService,
    private readonly grantService: OidcProviderGrantService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Wait for nest to load its own route before binding oidc-provider routes
   * @see https://docs.nestjs.com/faq/http-adapter
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events
   */
  async onModuleInit() {
    const { prefix, issuer, configuration } =
      await this.configService.getConfig(this);
    this.configuration = configuration;

    this.logger.debug('Initializing oidc-provider');
    try {
      this.provider = new this.ProviderProxy(issuer, {
        ...configuration,
        httpOptions: this.getHttpOptions.bind(this),
      });
      this.provider.proxy = true;
    } catch (error) {
      throw new OidcProviderInitialisationException();
    }

    this.logger.debug('Mouting oidc-provider middleware');
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

    this.logger.trace({ interactionId });

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
   * Wrap `oidc-provider` method to
   *  - lower coupling in other modules
   *  - handle exceptions
   *
   * @param req
   * @param res
   */
  /**
   *
   * @todo type return (if not already done in #461)
   * For now, the `Interaction` type from oidc-provider seems unreachable
   */
  async getInteraction(req, res): Promise<any> {
    try {
      const interactionDetail = await this.provider.interactionDetails(
        req,
        res,
      );

      this.logger.trace({
        text: 'Interaction Type',
        interactionType: interactionDetail.prompt.name,
        interactionReason: interactionDetail.prompt.reasons,
      });

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

  /**
   * Wrap `oidc-provider` method to
   *  - lower coupling in other modules
   *  - handle exceptions
   *
   * @param {any} req
   * @param {any} res
   * @param {OidcSession} session Object that contains the session info
   */
  async finishInteraction(req: any, res: any, session: OidcSession) {
    const { spAcr: acr, amr, spIdentity }: OidcClientSession = session;
    /**
     * Build Interaction results
     * For all available options, refer to `oidc-provider` documentation:
     * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#user-flows
     */

    const grant = await this.grantService.generateGrant(
      this.provider,
      req,
      res,
      spIdentity.sub,
    );

    const grantId = await this.grantService.saveGrant(grant);

    const result = {
      login: {
        amr,
        acr,
        accountId: spIdentity.sub,
        ts: Math.floor(Date.now() / 1000),
        remember: false,
      },
      /**
       * We need to return this information, it will always be empty arrays
       * since franceConnect does not allow for partial authorizations yet,
       * it's an "all or nothing" consent.
       */
      consent: {
        grantId,
      },
    } as InteractionResults;

    try {
      return await this.provider.interactionFinished(req, res, result);
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
}
