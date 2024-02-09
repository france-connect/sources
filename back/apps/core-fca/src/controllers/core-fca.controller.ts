import { Request, Response } from 'express';

import {
  Controller,
  Get,
  Header,
  Param,
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
import { NotificationsService } from '@fc/notifications';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, Session, SessionCsrfService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  GetInteractionOidcClientSessionDto,
  GetVerifyOidcClientSessionDto,
} from '../dto';
import { CoreFcaVerifyService } from '../services';

@Controller()
export class CoreFcaController {
  // More than 4 parameters authorized for a controller
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly oidcProvider: OidcProviderService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
    private readonly csrfService: SessionCsrfService,
    private readonly oidcAcr: OidcAcrService,
    private readonly coreAcr: CoreAcrService,
    private readonly coreFcaVerify: CoreFcaVerifyService,
    private readonly coreVerify: CoreVerifyService,
    private readonly tracking: TrackingService,
  ) {}

  @Get(CoreRoutes.DEFAULT)
  @Header('cache-control', 'no-store')
  getDefault(@Res() res) {
    const { defaultRedirectUri } = this.config.get<CoreConfig>('Core');
    res.redirect(301, defaultRedirectUri);
  }

  @Get(CoreRoutes.INTERACTION)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  async getInteraction(
    @Req() req,
    @Res() res: Response,
    @Param() _params: Interaction,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetInteractionOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { spName, stepRoute } = await sessionOidc.get();

    const { params } = await this.oidcProvider.getInteraction(req, res);
    const {
      acr_values: acrValues,
      client_id: clientId,
      scope: spScope,
    } = params;

    const {
      configuration: { acrValues: allowedAcrValues },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    const rejected = await this.coreAcr.rejectInvalidAcr(
      acrValues,
      allowedAcrValues,
      { req, res },
    );

    if (rejected) {
      return;
    }

    const { idpFilterExclude, idpFilterList } =
      await this.serviceProvider.getById(clientId);

    const providers = await this.identityProvider.getFilteredList({
      blacklist: idpFilterExclude,
      idpList: idpFilterList,
    });

    const authorizedProviders = providers.map((provider) => {
      const isAcrValid = this.oidcAcr.isAcrValid(
        provider.maxAuthorizedAcr,
        acrValues,
      );

      if (!isAcrValid) {
        provider.active = false;
      }

      return provider;
    });

    // -- generate and store in session the CSRF token
    const csrfToken = this.csrfService.get();
    await this.csrfService.save(sessionOidc, csrfToken);
    const notification = await this.notifications.getNotificationToDisplay();

    const response = {
      csrfToken,
      notification,
      params,
      providers: authorizedProviders,
      spName,
      spScope,
    };

    const isRefresh = stepRoute === CoreRoutes.INTERACTION;

    if (!isRefresh) {
      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_SHOWED_IDP_CHOICE } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_SHOWED_IDP_CHOICE, trackingContext);
    }

    res.render('interaction', response);
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
