import { KoaContextWithOIDC } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderAppConfigLibService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

@Injectable()
export class OidcProviderConfigAppService extends OidcProviderAppConfigLibService {
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
}
