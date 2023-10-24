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
  OidcCtx,
  OidcProviderAppConfigLibService,
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { ISessionService, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { CoreFcaMissingAtHashException } from '../exceptions';

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
    private tracking: TrackingService,
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
  async logoutSource(ctx: OidcCtx, form: any): Promise<void> {
    await this.switchToAliasedSession(ctx);
    const { req } = ctx;

    const session = SessionService.getBoundSession<OidcClientSession>(
      req,
      'OidcClient',
    );

    const params = await this.getLogoutParams(session);

    const trackingContext: TrackedEventContextInterface = { req };
    const { SP_REQUESTED_LOGOUT } = this.tracking.TrackedEventsMap;
    await this.tracking.track(SP_REQUESTED_LOGOUT, trackingContext);

    await this.logoutFormSessionDestroy(ctx, form, session, params);
  }

  private async switchToAliasedSession(ctx: OidcCtx): Promise<void> {
    const { req, res, oidc } = ctx;
    const alias = oidc.entities?.IdTokenHint?.payload?.at_hash;

    // Check on `typeof` since `oidc-provider` types `at_hash` as `unknown`
    if (typeof alias !== 'string') {
      throw new CoreFcaMissingAtHashException();
    }

    const sessionId = await this.sessionService.getAlias(alias);
    await this.sessionService.attach(req, res, sessionId);
    this.logger.debug({
      dbg: 'switched session',
      from: req.sessionId,
      to: sessionId,
    });
  }

  private async getLogoutParams(
    session: ISessionService<OidcSession>,
  ): Promise<LogoutFormParamsInterface> {
    const { urlPrefix } = this.config.get<AppConfig>('App');

    const hasIdpLogoutUrl = await this.hasIdpLogoutUrl(session);

    if (hasIdpLogoutUrl) {
      return {
        method: 'POST',
        uri: `${urlPrefix}${OidcClientRoutes.DISCONNECT_FROM_IDP}`,
        title: 'Déconnexion du FI',
      };
    }

    return {
      method: 'GET',
      uri: `${urlPrefix}${OidcClientRoutes.CLIENT_LOGOUT_CALLBACK}`,
      title: 'Déconnexion FC',
    };
  }

  private async hasIdpLogoutUrl(
    session: ISessionService<OidcSession>,
  ): Promise<boolean> {
    const idpId = await session.get('idpId');

    if (!idpId) {
      return false;
    }

    return this.oidcClient.hasEndSessionUrlFromProvider(idpId);
  }
}
