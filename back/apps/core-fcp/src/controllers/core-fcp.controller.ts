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

import { ConfigService } from '@fc/config';
import {
  CoreAcrService,
  CoreRoutes,
  CoreVerifyService,
  Interaction,
} from '@fc/core';
import { CsrfToken } from '@fc/csrf';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { NotificationsService } from '@fc/notifications';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientRoutes, OidcClientSession } from '@fc/oidc-client';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, Session } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  AppConfig,
  AppSession,
  CoreConfig,
  GetConsentOidcClientSessionDto,
  GetInteractionOidcClientSessionDto,
  GetVerifyOidcClientSessionDto,
} from '../dto';
import { InteractionResponseInterface } from '../interfaces';
import { CoreFcpService, CoreFcpVerifyService } from '../services';

@Controller()
export class CoreFcpController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly coreFcp: CoreFcpService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
    private readonly oidcAcr: OidcAcrService,
    private readonly coreAcr: CoreAcrService,
    private readonly coreVerify: CoreVerifyService,
    private readonly coreFcpVerify: CoreFcpVerifyService,
    private readonly tracking: TrackingService,
  ) {}

  @Get(CoreRoutes.DEFAULT)
  @Header('cache-control', 'no-store')
  getDefault(@Res() res) {
    const { defaultRedirectUri } = this.config.get<CoreConfig>('Core');

    res.redirect(301, defaultRedirectUri);
  }

  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  @Get(CoreRoutes.INTERACTION)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  async getInteraction(
    @Req() req,
    @Res() res,
    @Param() _params: Interaction,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetInteractionOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App')
    sessionApp: ISessionService<AppSession>,
    @CsrfToken() csrfToken: string,
  ) {
    const { spName, stepRoute, idpLabel = null } = sessionOidc.get();

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

    const isSuspicious = sessionApp.get('isSuspicious');

    const authorizedProviders = providers.map((provider) => {
      const isAcrValid = this.oidcAcr.isAcrValid(
        provider.maxAuthorizedAcr,
        acrValues,
      );

      const isInsufficientAcrLevel = this.coreFcp.isInsufficientAcrLevel(
        provider.maxAuthorizedAcr,
        isSuspicious,
      );

      if (!isAcrValid || isInsufficientAcrLevel) {
        provider.active = false;
      }

      return provider;
    });

    const { aidantsConnectUid } = this.config.get<AppConfig>('App');
    const aidantsConnect = authorizedProviders.find((provider) => {
      const isAidantsConnect = provider.uid === aidantsConnectUid;
      return isAidantsConnect && provider.display;
    });

    // -- generate and store in session the CSRF token

    const notification = await this.notifications.getNotificationToDisplay();

    /** Currently, we don't have the ability to know what the error message is.
     * Therefore, the only way to check if we have an error is to verify
     * if we just came from oidc callback step route */
    const hasError = stepRoute === OidcClientRoutes.OIDC_CALLBACK;

    const response: InteractionResponseInterface = {
      csrfToken,
      notification,
      params,
      providers: authorizedProviders,
      aidantsConnect: aidantsConnect,
      spName,
      spScope,
      errorContext: {
        hasError,
        idpLabel,
      },
    };

    const isRefresh = stepRoute === CoreRoutes.INTERACTION;

    if (!isRefresh) {
      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_SHOWED_IDP_CHOICE } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_SHOWED_IDP_CHOICE, trackingContext);
    }

    return res.render('interaction', response);
  }

  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  @Get(CoreRoutes.INTERACTION_VERIFY)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  async getVerify(
    @Req() req,
    @Res() res,
    @Param() _params: Interaction,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetVerifyOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App')
    sessionApp: ISessionService<AppSession>,
  ) {
    const { idpId, idpAcr, interactionId, spId } = sessionOidc.get();

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const params = { urlPrefix, interactionId, sessionOidc };

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

    const isSuspicious = sessionApp.get('isSuspicious');
    const isInsufficientAcrLevel = this.coreFcp.isInsufficientAcrLevel(
      idpAcr,
      isSuspicious,
    );
    if (isInsufficientAcrLevel) {
      const url = this.coreFcpVerify.handleInsufficientAcrLevel(interactionId);

      /**
       * Suspect context redirects to idp choice,
       * thus we are no longer in an "sso" interaction,
       * so we update isSso flag in session.
       */
      sessionOidc.set('isSso', false);
      this.logger.info(
        `Disabling SSO since idP ACR is insufficient: ${idpAcr}`,
      );

      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_IDP_INSUFFICIENT_ACR } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_IDP_INSUFFICIENT_ACR, trackingContext);

      return res.redirect(url);
    }

    const url = await this.coreFcpVerify.handleVerifyIdentity(req, params);
    return res.redirect(url);
  }

  // eslint-disable-next-line max-params
  @Get(CoreRoutes.INTERACTION_CONSENT)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @Render('consent')
  async getConsent(
    @Req() req,
    @Res() res,
    @Param() _params: Interaction,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetConsentOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
    @CsrfToken() csrfToken: string,
  ) {
    const {
      interactionId,
      spId,
      spIdentity: identity,
      spName,
      stepRoute,
    }: OidcSession = sessionOidc.get();

    const interaction = await this.oidcProvider.getInteraction(req, res);

    const scopes = this.coreFcp.getScopesForInteraction(interaction);
    const claims = this.coreFcp.getClaimsLabelsForInteraction(interaction);
    const consentRequired = await this.coreFcp.isConsentRequired(spId);
    const isOpenIdScope = scopes.every((scope) => scope === 'openid');

    // -- generate and store in session the CSRF token

    const response = {
      isOpenIdScope,
      claims,
      consentRequired,
      csrfToken,
      identity,
      interactionId,
      scopes,
      spName,
    };

    const isRefresh = stepRoute === CoreRoutes.INTERACTION_CONSENT;

    if (!isRefresh) {
      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_SHOWED_CONSENT } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_SHOWED_CONSENT, trackingContext);
    }

    return response;
  }
}
