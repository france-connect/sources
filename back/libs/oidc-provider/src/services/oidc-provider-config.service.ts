import { ClientMetadata, KoaContextWithOIDC } from 'oidc-provider';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { IServiceProviderAdapter, OidcSession } from '@fc/oidc';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc/tokens';
import { OidcProviderConfig } from '@fc/oidc-provider';
import { ISessionBoundContext, SessionService } from '@fc/session';

import { OidcProviderRedisAdapter } from '../adapters';
import { IOidcProviderConfigAppService } from '../interfaces';
import { OidcProviderService } from '../oidc-provider.service';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from '../tokens';
import { OidcProviderErrorService } from './oidc-provider-error.service';

@Injectable()
export class OidcProviderConfigService {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    @Inject(OIDC_PROVIDER_CONFIG_APP_TOKEN)
    private readonly oidcProviderConfigApp: IOidcProviderConfigAppService,
    private readonly sessionService: SessionService,
    private readonly errorService: OidcProviderErrorService,
    @Inject(SERVICE_PROVIDER_SERVICE_TOKEN)
    private readonly serviceProvider: IServiceProviderAdapter,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Compose full config by merging static parameters from:
   *  - configuration file (some may be coming from environment variables).
   *  - database (SP configuration).
   *
   * @param {boolean} refresh Default false
   * @returns {Promise<OidcProviderConfig>}
   */
  async getConfig(
    oidcProviderService: OidcProviderService,
  ): Promise<OidcProviderConfig> {
    /**
     * Build our memory adapter for oidc-provider
     * @see https://github.com/panva/node-oidc-provider/tree/master/docs#adapter
     *
     * We can't use nest DI for our adapter.
     * `oidc-provider` wants a class and instantiate the adapter on it's own.
     * @see https://github.com/panva/node-oidc-provider/blob/9306f66bdbcdff01400773f26539cf35951b9ce8/lib/models/client.js#L201
     * @see https://github.com/panva/node-oidc-provider/blob/22cc547ffb45503cf2fc4357958325e0f5ed4b2f/lib/models/base_model.js#L28
     *
     * So we can not use directly NestJs DI to instantiate the adapter.
     *
     * The trick here is simple :
     * 1. We inject needed services in this service (oidcProviderService)
     * 2. We bind them to our adapter constructor.
     * 3. We give the resulting constructor to `oidc-provider`
     *
     * NB: If we want to add more services to the adapter,
     * we need add them to contructor and to pass them along here.
     */
    const adapter = OidcProviderRedisAdapter.getConstructorWithDI(
      oidcProviderService,
      this.serviceProvider,
    );

    /**
     * Get data from config file
     */
    const {
      prefix,
      issuer,
      configuration,
      forcedPrompt,
      knownAcrValues,
      defaultAcrValue,
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    /**
     * Bind callbacks to this class before passing them to oidc-provider
     * so we can use the NestJS dependencies injection
     */
    const logoutSource = this.oidcProviderConfigApp.logoutSource.bind(
      this.oidcProviderConfigApp,
    );
    const postLogoutSuccessSource =
      this.oidcProviderConfigApp.postLogoutSuccessSource.bind(
        this.oidcProviderConfigApp,
      );

    const findAccount = this.findAccount.bind(this);
    const pairwiseIdentifier = this.pairwiseIdentifier.bind(this);
    const renderError = this.errorService.renderError.bind(this.errorService);
    const clientBasedCORS = this.clientBasedCORS.bind(this);
    const url = this.url.bind(this, prefix);

    /**
     * Build final configuration object
     */
    const oidcProviderConfig: OidcProviderConfig = {
      forcedPrompt,
      prefix,
      issuer,
      knownAcrValues,
      defaultAcrValue,
      configuration: {
        ...configuration,
        features: {
          ...configuration.features,
          rpInitiatedLogout: {
            ...configuration.features.rpInitiatedLogout,
            logoutSource,
            postLogoutSuccessSource,
          },
        },
        adapter,
        findAccount,
        pairwiseIdentifier,
        renderError,
        clientBasedCORS,
        interactions: { url },
        pkce: {
          methods: ['S256'],
          required: () => false,
        },
      },
    };

    this.logger.trace({ oidcProviderConfig });

    return oidcProviderConfig;
  }

  /**
   * Returned object should contains an `accountId` property
   * and an async `claims` function.
   * More documentation can be found in oidc-provider repo.
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#accounts
   */
  private async findAccount(ctx: any, sessionId: string) {
    this.logger.debug('OidcProviderConfigService.findAccount');

    try {
      const boundSessionContext: ISessionBoundContext = {
        sessionId,
        moduleName: 'OidcClient',
      };

      const { spIdentity }: OidcSession = await this.sessionService.get(
        boundSessionContext,
      );

      const account = {
        /**
         * We used the `sessionId` as `accountId` identifier when building the grant
         * @see OidcProviderService.finishInteraction()
         */
        accountId: sessionId,
        async claims() {
          return spIdentity;
        },
      };

      this.logger.trace({ account });

      return account;
    } catch (error) {
      // Hacky throw from oidc-provider
      this.errorService.throwError(ctx, error);
    }
  }

  /**
   * Passthru original identifier (sub).
   *
   * While we could imagine that `accountId` would carry the value set by the `findAccount` method above,
   * it actually carries the sub.
   *
   * We kept the parameter name to be consistent with documentation and original function signature
   * Note that the function receives a third parameter `client` but it is of no use for our implementation.
   *
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#pairwiseidentifier
   */
  private pairwiseIdentifier(_ctx, accountId: string) {
    return accountId;
  }

  private clientBasedCORS(
    _ctx: KoaContextWithOIDC,
    _origin: unknown,
    _client: ClientMetadata,
  ) {
    return false;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  /**
   * More documentation can be found in oidc-provider repo
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#interactionsurl
   */
  private async url(
    prefix: string,
    _ctx: KoaContextWithOIDC,
    interaction: any,
  ) {
    return `${prefix}/interaction/${interaction.uid}`;
  }
}
