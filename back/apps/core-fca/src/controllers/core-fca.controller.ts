import { Request, Response } from 'express';

import {
  Controller,
  Get,
  Header,
  Param,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import {
  CoreAcrService,
  CoreConfig,
  CoreRoutes,
  CoreVerifyService,
  Interaction,
} from '@fc/core';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { MinistriesService } from '@fc/ministries';
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
} from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  GetInteractionOidcClientSessionDto,
  GetVerifyOidcClientSessionDto,
} from '../dto';
import { CoreFcaVerifyService } from '../services';

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
    private readonly config: ConfigService,
    private readonly csrfService: SessionCsrfService,
    private readonly coreAcr: CoreAcrService,
    private readonly coreFcaVerify: CoreFcaVerifyService,
    private readonly coreVerify: CoreVerifyService,
    private readonly tracking: TrackingService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(CoreRoutes.DEFAULT)
  @Header('cache-control', 'no-store')
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
  @Header('cache-control', 'no-store')
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
  @Header('cache-control', 'no-store')
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
  @Header('cache-control', 'no-store')
  @Render('interaction')
  @IsStep()
  async getInteraction(
    @Req() req,
    @Res() res,
    @Session('OidcClient', GetInteractionOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { params } = await this.oidcProvider.getInteraction(req, res);

    const { acr_values: acrValues } = params;

    const {
      configuration: { acrValues: allowedAcrValues },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    const rejected = await this.coreAcr.rejectInvalidAcr(
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

    const stepRoute = await sessionOidc.get('stepRoute');
    const isRefresh = stepRoute === CoreRoutes.INTERACTION;

    if (!isRefresh) {
      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_SHOWED_IDP_CHOICE } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_SHOWED_IDP_CHOICE, trackingContext);
    }

    return {};
  }

  @Get(CoreRoutes.INTERACTION_VERIFY)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  // we choose to keep code readable here and to be close to fcp
  // eslint-disable-next-line complexity
  async getVerify(
    @Req() req: Request,
    @Res() res: Response,
    @Param() _params: Interaction,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetVerifyOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { idpId, interactionId, spId, isSso } = await sessionOidc.get();

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const params = { urlPrefix, interactionId, sessionOidc };

    const { ssoDisabled } = await this.serviceProvider.getById(spId);
    if (isSso && ssoDisabled) {
      const url = await this.coreFcaVerify.handleSsoDisabled(req, params);
      return res.redirect(url);
    }
    const isIdpActive = await this.identityProvider.isActiveById(idpId);

    const isBlackListed = await this.serviceProvider.shouldExcludeIdp(
      spId,
      idpId,
    );

    if (isBlackListed || !isIdpActive) {
      const url = await this.coreVerify.handleUnavailableIdp(
        req,
        params,
        !isIdpActive,
      );
      return res.redirect(url);
    }

    const url = await this.coreFcaVerify.handleVerifyIdentity(req, params);
    return res.redirect(url);
  }
}
