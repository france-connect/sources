import { KoaContextWithOIDC } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import {
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import {
  LogoutFormParamsInterface,
  OidcProviderAppConfigLibService,
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

@Injectable()
export class OidcProviderConfigAppService extends OidcProviderAppConfigLibService {
  // eslint-disable-next-line max-params
  constructor(
    protected readonly logger: LoggerService,
    protected readonly sessionService: SessionService,
    protected readonly errorService: OidcProviderErrorService,
    protected readonly grantService: OidcProviderGrantService,
    private readonly oidcClient: OidcClientService,
    private readonly config: ConfigService,
  ) {
    super(logger, sessionService, errorService, grantService);
    this.logger.setContext(this.constructor.name);
  }

  /**
   * More documentation can be found in oidc-provider repo
   * @see https://github.com/panva/node-oidc-provider/blob/v6.x/docs/README.md#featuresrpinitiatedlogout
   * @TODO #109 Check the behaving of the page when javascript is disabled
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/issues/109
   */
  async logoutSource(ctx: KoaContextWithOIDC, form: any): Promise<void> {
    const boundedSession = SessionService.getBoundedSession<OidcClientSession>(
      ctx.req,
      'OidcClient',
    );
    const session: OidcSession = await boundedSession.get();
    const { urlPrefix } = this.config.get<AppConfig>('App');

    let params: LogoutFormParamsInterface = {
      method: 'GET',
      uri: `${urlPrefix}${OidcClientRoutes.CLIENT_LOGOUT_CALLBACK}`,
      title: 'Déconnexion FC',
    };

    if (session && session.idpId) {
      const idpHasEndSessionUrl =
        await this.oidcClient.hasEndSessionUrlFromProvider(session.idpId);

      if (idpHasEndSessionUrl) {
        params = {
          method: 'POST',
          uri: `${urlPrefix}${OidcClientRoutes.DISCONNECT_FROM_IDP}`,
          title: 'Déconnexion du FI',
        };
      }
    }

    this.logoutFormSessionDestroy(ctx, form, boundedSession, params);
  }
}
