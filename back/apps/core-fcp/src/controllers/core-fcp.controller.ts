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
import { NotificationsService } from '@fc/notifications';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import {
  OidcClientConfig,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, Session, SessionCsrfService } from '@fc/session';
import { TrackedEventContextInterface } from '@fc/tracking';

import {
  AppSession,
  CoreConfig,
  GetConsentSessionDto,
  GetVerifySessionDto,
  InteractionSessionDto,
} from '../dto';
import { InsufficientAcrLevelSuspiciousContextException } from '../exceptions';
import { CoreFcpService, CoreService } from '../services';

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
    private readonly core: CoreService,
    private readonly oidcAcr: OidcAcrService,
    private readonly oidcClient: OidcClientService,
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

  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  @Get(CoreRoutes.INTERACTION)
  @UsePipes(new ValidationPipe({ whitelist: true }))
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
    const spName = await sessionOidc.get('spName');

    const { params, uid } = await this.oidcProvider.getInteraction(req, res);
    const { scope: spScope } = params;
    const { scope: idpScope } = this.config.get<OidcClientConfig>('OidcClient');
    const { acr_values: acrValues, client_id: clientId } = params;

    const {
      configuration: { acrValues: allowedAcrValues },
    } = this.config.get<OidcProviderConfig>('OidcProvider');

    const rejected = await this.core.rejectInvalidAcr(
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

    const authorizedProviders = providers
      .filter(({ maxAuthorizedAcr }) =>
        this.oidcAcr.isAcrValid(maxAuthorizedAcr, acrValues),
      )
      .filter(({ maxAuthorizedAcr }) => {
        const authorizedIdp = !this.coreFcp.isInsufficientAcrLevel(
          maxAuthorizedAcr,
          isSuspicious,
        );
        return authorizedIdp;
      });

    // -- generate and store in session the CSRF token
    const csrfToken = this.csrf.get();
    await this.csrf.save(sessionOidc, csrfToken);

    const notifications = await this.notifications.getNotifications();
    const response = {
      csrfToken,
      notifications,
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

    return res.render('interaction', response);
  }

  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  @Get(CoreRoutes.INTERACTION_VERIFY)
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);

    const isSuspicious = await sessionApp.get('isSuspicious');

    const isInsufficientAcrLevel = this.coreFcp.isInsufficientAcrLevel(
      idpAcr,
      isSuspicious,
    );
    if (isInsufficientAcrLevel) {
      throw new InsufficientAcrLevelSuspiciousContextException();
    }

    const trackingContext: TrackedEventContextInterface = { req };
    await this.coreFcp.verify(sessionOidc, trackingContext);

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/consent`;

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION_VERIFY',
      redirect: url,
      route: CoreRoutes.INTERACTION_VERIFY,
    });

    res.redirect(url);
  }

  @Get(CoreRoutes.INTERACTION_CONSENT)
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

    return response;
  }
}
