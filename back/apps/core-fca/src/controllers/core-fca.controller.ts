import { Request, Response } from 'express';

import {
  Controller,
  Get,
  Param,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import { CoreRoutes, Interaction } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { MinistriesService } from '@fc/ministries';
import { OidcSession } from '@fc/oidc';
import {
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import {
  ISessionService,
  Session,
  SessionBadFormatException,
  SessionCsrfService,
  SessionNotFoundException,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { CoreConfig } from '../dto';
import { CoreFcaService, CoreService } from '../services';

@Controller()
export class CoreFcaController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly ministries: MinistriesService,
    private readonly core: CoreFcaService,
    private readonly config: ConfigService,
    private readonly csrfService: SessionCsrfService,
    private readonly coreService: CoreService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(CoreRoutes.DEFAULT)
  getDefault(@Res() res) {
    const { defaultRedirectUri } = this.config.get<CoreConfig>('Core');
    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.DEFAULT',
      redirect: defaultRedirectUri,
      route: CoreRoutes.DEFAULT,
    });
    res.redirect(301, defaultRedirectUri);
  }

  @Get(CoreRoutes.FCA_FRONT_HISTORY_BACK_URL)
  async getFrontHistoryBackURL(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    /**
     * @TODO #1018 Refactoriser la partie API du controller core-fca
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1018
     * @ticket FC-1018
     */
    const { spName } = (await sessionOidc.get()) || {};
    if (!spName) {
      throw new SessionBadFormatException();
    }

    const { params } = await this.oidcProvider.getInteraction(req, res);
    const { redirect_uri: redirectURI, state } = params;

    const redirectURIQuery = {
      state,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      error_description: 'User auth aborted',
      error: 'access_denied',
    };

    const jsonResponse = {
      spName,
      redirectURIQuery,
      redirectURI,
    };
    return res.json(jsonResponse);
  }

  @Get(CoreRoutes.FCA_FRONT_DATAS)
  async getFrontData(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    try {
      const { spName } = (await sessionOidc.get()) || {};
      if (!spName) {
        throw new SessionBadFormatException();
      }
      const { params } = await this.oidcProvider.getInteraction(req, res);
      const { scope } = this.config.get<OidcClientConfig>('OidcClient');
      const { urlPrefix } = this.config.get<AppConfig>('App');

      // -- generate and store in session the CSRF token
      const csrfToken = this.csrfService.get();
      await this.csrfService.save(sessionOidc, csrfToken);

      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response_type,
      } = params;

      const redirectToIdentityProviderInputs = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values,
        csrfToken,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uri,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response_type,
        scope,
      };

      const ministries = await this.ministries.getList();
      const { idpFilterExclude, idpFilterList } =
        await this.serviceProvider.getById(client_id);

      const identityProvidersList = await this.identityProvider.getFilteredList(
        {
          blacklist: idpFilterExclude,
          idpList: idpFilterList,
        },
      );

      const identityProviders = identityProvidersList.map(
        ({ active, display, title, uid }) => ({
          active,
          display,
          name: title,
          uid,
        }),
      );

      const jsonResponse = {
        identityProviders,
        ministries,
        redirectToIdentityProviderInputs,
        redirectURL: `${urlPrefix}${OidcClientRoutes.REDIRECT_TO_IDP}`,
        serviceProviderName: spName,
      };

      this.logger.trace({
        method: 'GET',
        name: 'CoreRoutes.FCA_FRONT_DATAS',
        response: jsonResponse,
        route: CoreRoutes.FCA_FRONT_DATAS,
      });
      return res.json(jsonResponse);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  @Get(CoreRoutes.INTERACTION)
  @Render('interaction')
  async getInteraction(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session = await sessionOidc.get();
    if (!session) {
      this.logger.trace(
        { route: CoreRoutes.INTERACTION },
        LoggerLevelNames.WARN,
      );
      throw new SessionNotFoundException('OidcClient');
    }

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION',
      route: CoreRoutes.INTERACTION,
      session,
    });
    const { params } = await this.oidcProvider.getInteraction(req, res);

    const { acr_values: acrValues } = params;

    const {
      configuration: { acrValues: allowedAcrValues },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    const rejected = await this.coreService.rejectInvalidAcr(
      acrValues,
      allowedAcrValues,
      { req, res },
    );

    if (rejected) {
      this.logger.trace(
        { acrValues, allowedAcrValues, rejected },
        LoggerLevelNames.WARN,
      );
      return;
    }

    return {};
  }

  private async trackBlackListed(req: Request) {
    const eventContext = { req };
    const { FC_BLACKLISTED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_BLACKLISTED, eventContext);
  }

  private async trackVerified(req: Request) {
    const eventContext = { req };
    const { FC_VERIFIED } = this.tracking.TrackedEventsMap;

    await this.tracking.track(FC_VERIFIED, eventContext);
  }

  private async handleBlacklisted(
    req: Request,
    res: Response,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
  ): Promise<void> {
    const { interactionId, urlPrefix, sessionOidc } = params;

    const url = `${urlPrefix}${CoreRoutes.INTERACTION.replace(
      ':uid',
      interactionId,
    )}`;

    /**
     * Black listing redirects to idp choice,
     * thus we are no longer in an "sso" interaction,
     * so we update isSso flag in session.
     */
    sessionOidc.set('isSso', false);

    await this.trackBlackListed(req);

    return res.redirect(url);
  }

  private async handleVerifyIdentity(
    req: Request,
    res: Response,
    params: {
      urlPrefix: string;
      interactionId: string;
      sessionOidc: ISessionService<OidcClientSession>;
    },
  ): Promise<void> {
    const { sessionOidc, urlPrefix } = params;

    await this.core.verify(sessionOidc);

    const url = `${urlPrefix}${CoreRoutes.INTERACTION_LOGIN}`;

    await this.trackVerified(req);

    return res.redirect(url);
  }

  @Get(CoreRoutes.INTERACTION_VERIFY)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getVerify(
    @Req() req: Request,
    @Res() res: Response,
    @Param() _params: Interaction,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = await sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, interactionId, spId } = session;

    const isBlackListed = await this.serviceProvider.shouldExcludeIdp(
      spId,
      idpId,
    );

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const params = { urlPrefix, interactionId, sessionOidc };

    if (isBlackListed) {
      return this.handleBlacklisted(req, res, params);
    } else {
      return this.handleVerifyIdentity(req, res, params);
    }
  }
}
