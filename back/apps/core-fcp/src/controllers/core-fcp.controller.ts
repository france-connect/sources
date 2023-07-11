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
  CoreRoutes,
  CoreVerifyService,
  Interaction,
} from '@fc/core';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { NotificationsService } from '@fc/notifications';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientConfig, OidcClientSession } from '@fc/oidc-client';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, Session, SessionCsrfService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  AppSession,
  CoreConfig,
  GetConsentSessionDto,
  GetVerifySessionDto,
  InteractionSessionDto,
} from '../dto';
import { InsufficientAcrLevelSuspiciousContextException } from '../exceptions';
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
    private readonly csrf: SessionCsrfService,
    private readonly oidcAcr: OidcAcrService,
    private readonly coreAcr: CoreAcrService,
    private readonly coreVerify: CoreVerifyService,
    private readonly coreFcpVerify: CoreFcpVerifyService,
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
    @Session('OidcClient', InteractionSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App')
    sessionApp: ISessionService<AppSession>,
  ) {
    const { spName, stepRoute } = await sessionOidc.get();

    const { params, uid } = await this.oidcProvider.getInteraction(req, res);
    const { scope: spScope } = params;
    const { scope: idpScope } = this.config.get<OidcClientConfig>('OidcClient');
    const { acr_values: acrValues, client_id: clientId } = params;

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

    const { idpFilterExclude, idpFilterList } =
      await this.serviceProvider.getById(clientId);

    const providers = await this.identityProvider.getFilteredList({
      blacklist: idpFilterExclude,
      idpList: idpFilterList,
    });

    const isSuspicious = await sessionApp.get('isSuspicious');

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

    // -- generate and store in session the CSRF token
    const csrfToken = this.csrf.get();
    await this.csrf.save(sessionOidc, csrfToken);

    const notification = await this.notifications.getNotificationToDisplay();
    const response = {
      csrfToken,
      notification,
      params,
      providers: authorizedProviders,
      idpScope,
      spScope,
      spName,
      uid,
    };

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION',
      response,
      route: CoreRoutes.INTERACTION,
    });

    const isRefresh = stepRoute === CoreRoutes.INTERACTION;

    if (!isRefresh) {
      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_SHOWED_IDP_CHOICE } = this.tracking.TrackedEventsMap;
      this.tracking.track(FC_SHOWED_IDP_CHOICE, trackingContext);
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
    @Session('OidcClient', GetVerifySessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('App')
    sessionApp: ISessionService<AppSession>,
  ) {
    const { idpId, idpAcr, interactionId, spId } = await sessionOidc.get();

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const params = { urlPrefix, interactionId, sessionOidc };

    const isBlackListed = await this.serviceProvider.shouldExcludeIdp(
      spId,
      idpId,
    );

    if (isBlackListed) {
      const url = await this.coreVerify.handleBlacklisted(req, params);
      return res.redirect(url);
    }

    const isSuspicious = await sessionApp.get('isSuspicious');
    const isInsufficientAcrLevel = this.coreFcp.isInsufficientAcrLevel(
      idpAcr,
      isSuspicious,
    );
    if (isInsufficientAcrLevel) {
      throw new InsufficientAcrLevelSuspiciousContextException();
    }

    const url = await this.coreFcpVerify.handleVerifyIdentity(req, params);
    return res.redirect(url);
  }

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
    @Session('OidcClient', GetConsentSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const {
      interactionId,
      spId,
      spIdentity: identity,
      spName,
      stepRoute,
    }: OidcSession = await sessionOidc.get();

    const interaction = await this.oidcProvider.getInteraction(req, res);

    const scopes = this.coreFcp.getScopesForInteraction(interaction);
    const claims = this.coreFcp.getClaimsLabelsForInteraction(interaction);
    const consentRequired = await this.coreFcp.isConsentRequired(spId);
    const isOpenIdScope = scopes.every((scope) => scope === 'openid');

    // -- generate and store in session the CSRF token
    const csrfToken = this.csrf.get();
    await this.csrf.save(sessionOidc, csrfToken);

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

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION_CONSENT',
      response,
      route: CoreRoutes.INTERACTION_CONSENT,
    });

    const isRefresh = stepRoute === CoreRoutes.INTERACTION_CONSENT;

    if (!isRefresh) {
      const trackingContext: TrackedEventContextInterface = { req };
      const { FC_SHOWED_CONSENT } = this.tracking.TrackedEventsMap;
      this.tracking.track(FC_SHOWED_CONSENT, trackingContext);
    }

    return response;
  }
}
