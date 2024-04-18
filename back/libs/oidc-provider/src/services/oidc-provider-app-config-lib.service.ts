import {
  InteractionResults,
  KoaContextWithOIDC,
  Provider,
} from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { SessionService, SessionSubNotFoundException } from '@fc/session';

import { OidcProviderConfig } from '../dto';
import {
  OidcProviderRuntimeException,
  OidcProviderSpIdNotFoundException,
} from '../exceptions';
import {
  IOidcProviderConfigAppService,
  LogoutFormParamsInterface,
} from '../interfaces';
import { OidcProviderErrorService } from './oidc-provider-error.service';
import { OidcProviderGrantService } from './oidc-provider-grant.service';

@Injectable()
export abstract class OidcProviderAppConfigLibService
  implements IOidcProviderConfigAppService
{
  protected provider: Provider;

  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    protected readonly _logger: LoggerService,
    protected readonly sessionService: SessionService,
    protected readonly errorService: OidcProviderErrorService,
    protected readonly grantService: OidcProviderGrantService,
    protected readonly config: ConfigService,
  ) {}

  /**
   * More documentation can be found in oidc-provider repo
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   * @TODO #109 Check the behaving of the page when javascript is disabled
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/issues/109
   */
  logoutSource(ctx: KoaContextWithOIDC, form: any): void {
    ctx.body = `<!DOCTYPE html>
      <head>
        <title>Déconnexion</title>
      </head>
      <body>
        ${form}
        <script>
          var form = document.forms[0];
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'logout';
          input.value = 'yes';
          form.appendChild(input);
          form.submit();
        </script>
      </body>
    </html>`;
  }

  /**
   * More documentation can be found in oidc-provider repo
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   * @TODO #109 Check the behaving of the page when javascript is disabled
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/issues/109
   */
  postLogoutSuccessSource(ctx: KoaContextWithOIDC) {
    ctx.body = `<!DOCTYPE html>
        <head>
          <title>Déconnexion</title>
        </head>
        <body>
          <p>Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.</p>
        </body>
        </html>`;
  }

  /**
   * Returned object should contains an `accountId` property
   * and an async `claims` function.
   * More documentation can be found in oidc-provider repo.
   * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#accounts
   */
  async findAccount(
    ctx: KoaContextWithOIDC,
    sessionId: string,
  ): Promise<{ accountId: string; claims: Function }> {
    try {
      // Use the user session from the service provider request
      await this.sessionService.initCache(sessionId);

      // Retrieve spId from panva context
      const spId = this.getServiceProviderIdFromCtx(ctx);

      await this.checkSpId(ctx, spId);

      const { spIdentity, subs } =
        this.sessionService.get<OidcSession>('OidcClient');

      const subSp = spId && subs[spId];
      await this.checkSub(ctx, subSp);

      const account = await this.formatAccount(sessionId, spIdentity, subSp);

      return account;
    } catch (error) {
      // Hacky throw from oidc-provider
      await this.errorService.throwError(ctx, error);
    }
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
   * @param {any} req
   * @param {any} res
   * @param {OidcSession} session Object that contains the session info
   */
  async finishInteraction(req: any, res: any, session: OidcSession) {
    const { amr }: OidcClientSession = session;
    const acr = this.getInteractionAcr(session);
    const sessionId = this.sessionService.getId();

    /**
     * Build Interaction results
     * For all available options, refer to `oidc-provider` documentation:
     * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#user-flows
     */

    const grant = await this.grantService.generateGrant(
      this.provider,
      req,
      res,
      sessionId,
    );

    const grantId = await this.grantService.saveGrant(grant);

    /**
     * We use `sessionId` as `accountId` in order to to easily retrieve the session for back channel requests
     * @see OidcProviderConfigService.findAccount()
     */
    const result = {
      login: {
        amr,
        acr,
        accountId: sessionId,
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

  private getInteractionAcr(session: OidcSession): string {
    const { spAcr, idpAcr }: OidcClientSession = session;

    const {
      configuration: { acrValues },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    if (acrValues.includes(idpAcr)) {
      return idpAcr;
    }

    return spAcr;
  }

  /**
   * Set provider implementation from OidcProviderService
   * @param provider
   */
  setProvider(provider: Provider): void {
    this.provider = provider;
  }

  async logoutFormSessionDestroy(
    ctx: KoaContextWithOIDC,
    form: any,
    { method, uri, title }: LogoutFormParamsInterface,
  ): Promise<void> {
    this.sessionService.set('OidcClient', 'oidcProviderLogoutForm', form);
    await this.sessionService.commit();

    ctx.body = `<!DOCTYPE html>
      <head>
        <title>${title}</title>
      </head>
      <body>
        <form method="${method}" action="${uri}">
        </form>
        <script>
          var form = document.forms[0];
          form.submit();
        </script>
      </body>
    </html>`;
  }

  getServiceProviderIdFromCtx(ctx: KoaContextWithOIDC): string | undefined {
    return ctx.oidc?.entities?.Client?.clientId;
  }

  protected async checkSpId(
    ctx: KoaContextWithOIDC,
    spId: string,
  ): Promise<void> {
    if (!spId) {
      await this.errorService.throwError(
        ctx,
        new OidcProviderSpIdNotFoundException(),
      );
    }
  }

  protected async checkSub(
    ctx: KoaContextWithOIDC,
    sub: string,
  ): Promise<void> {
    if (!sub) {
      await this.errorService.throwError(
        ctx,
        new SessionSubNotFoundException(),
      );
    }
  }

  // Needed for consistent typing
  // eslint-disable-next-line require-await
  protected async formatAccount(
    sessionId: string,
    spIdentity: Partial<Omit<IOidcIdentity, 'sub'>>,
    subSp: string,
  ): Promise<{ accountId: string; claims: Function }> {
    return {
      /**
       * We used the `sessionId` as `accountId` identifier when building the grant
       * @see OidcProviderService.finishInteraction()
       */
      accountId: sessionId,
      // Needed to match panva interface
      // eslint-disable-next-line require-await
      async claims() {
        return { ...spIdentity, sub: subSp };
      },
    };
  }
}
