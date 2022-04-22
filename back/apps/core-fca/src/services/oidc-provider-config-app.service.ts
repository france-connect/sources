import { KoaContextWithOIDC } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { OidcClientSession } from '@fc/oidc-client';
import { IOidcProviderConfigAppService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

@Injectable()
export class OidcProviderConfigAppService
  implements IOidcProviderConfigAppService
{
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * More documentation can be found in oidc-provider repo
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   * @TODO #109 Check the behaving of the page when javascript is disabled
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/issues/109
   */
  async logoutSource(ctx: KoaContextWithOIDC, form: any) {
    const boundedSession = SessionService.getBoundedSession<OidcClientSession>(
      ctx.req,
      'OidcClient',
    );
    boundedSession.set('oidcProviderLogoutForm', form);

    ctx.body = `<!DOCTYPE html>
        <head>
          <title>Déconnexion du FI</title>
        </head>
        <body>
          <form method="POST" action="/api/v2/client/disconnect-from-idp">
          </form>
          <script>
            var form = document.forms[0];
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
}
