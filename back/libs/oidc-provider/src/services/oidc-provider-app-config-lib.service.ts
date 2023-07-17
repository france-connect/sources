import {
  InteractionResults,
  KoaContextWithOIDC,
  Provider,
} from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import {
  ISessionBoundContext,
  ISessionService,
  SessionService,
  SessionSubNotFoundException,
} from '@fc/session';

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

  constructor(
    protected readonly logger: LoggerService,
    protected readonly sessionService: SessionService,
    protected readonly errorService: OidcProviderErrorService,
    protected readonly grantService: OidcProviderGrantService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

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
  async postLogoutSuccessSource(ctx: KoaContextWithOIDC) {
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
  async findAccount(ctx: KoaContextWithOIDC, sessionId: string) {
    try {
      const boundSessionContext: ISessionBoundContext = {
        sessionId,
        moduleName: 'OidcClient',
      };

      // Retrieve spId from panva context
      const spId = this.getServiceProviderIdFromCtx(ctx);
      this.checkSpId(ctx, spId);

      const { spIdentity, subs }: OidcSession = await this.sessionService.get(
        boundSessionContext,
      );

      const subSp = spId && subs[spId];
      this.checkSub(ctx, subSp);

      const account = await this.formatAccount(sessionId, spIdentity, subSp);

      return account;
    } catch (error) {
      // Hacky throw from oidc-provider
      this.errorService.throwError(ctx, error);
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
    const { spAcr: acr, amr }: OidcClientSession = session;
    /**
     * Build Interaction results
     * For all available options, refer to `oidc-provider` documentation:
     * @see https://github.com/panva/node-oidc-provider/blob/master/docs/README.md#user-flows
     */

    const grant = await this.grantService.generateGrant(
      this.provider,
      req,
      res,
      req.sessionId,
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
        accountId: req.sessionId,
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

  /**
   * Set provider implementation from OidcProviderService
   * @param provider
   */
  setProvider(provider: Provider): void {
    this.provider = provider;
  }

  logoutFormSessionDestroy(
    ctx: KoaContextWithOIDC,
    form: any,
    session: ISessionService<OidcClientSession>,
    { method, uri, title }: LogoutFormParamsInterface,
  ): void {
    session.set('oidcProviderLogoutForm', form);

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

  protected checkSpId(ctx: KoaContextWithOIDC, spId: string): void {
    if (!spId) {
      this.errorService.throwError(
        ctx,
        new OidcProviderSpIdNotFoundException(),
      );
    }
  }

  protected checkSub(ctx: KoaContextWithOIDC, sub: string): void {
    if (!sub) {
      this.errorService.throwError(ctx, new SessionSubNotFoundException());
    }
  }

  protected async formatAccount(sessionId, spIdentity, subSp) {
    return {
      /**
       * We used the `sessionId` as `accountId` identifier when building the grant
       * @see OidcProviderService.finishInteraction()
       */
      accountId: sessionId,
      async claims() {
        return { ...spIdentity, sub: subSp };
      },
    };
  }
}
