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
  CoreConfig,
  GetConsentSessionDto,
  GetVerifySessionDto,
  InteractionSessionDto,
} from '../dto';
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
    private readonly core: CoreFcpService,
    private readonly config: ConfigService,
    private readonly notifications: NotificationsService,
    private readonly csrfService: SessionCsrfService,
    private readonly coreService: CoreService,
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
  ) {
    const session = await sessionOidc.get();

    this.logger.trace({ session });

    const { spName } = session;
    const { params, uid } = await this.oidcProvider.getInteraction(req, res);
    const { scope } = this.config.get<OidcClientConfig>('OidcClient');
    const { acr_values: acrValues, client_id: clientId } = params;

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

    const { idpFilterExclude, idpFilterList } =
      await this.serviceProvider.getById(clientId);

    const providers = await this.identityProvider.getFilteredList({
      blacklist: idpFilterExclude,
      idpList: idpFilterList,
    });

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const authorizedProviders = providers.filter(({ maxAuthorizedAcr }) =>
      this.coreService.isAcrValid(maxAuthorizedAcr, acrValues),
    );

    // -- generate and store in session the CSRF token
    const csrfToken = this.csrfService.get();
    await this.csrfService.save(sessionOidc, csrfToken);

    const notifications = await this.notifications.getNotifications();
    const response = {
      csrfToken,
      notifications,
      params,
      providers: authorizedProviders,
      scope,
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
  ) {
    const { idpId, interactionId, spId } = await sessionOidc.get();

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);

    const trackingContext: TrackedEventContextInterface = { req };
    await this.core.verify(sessionOidc, trackingContext);

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

    const scopes = this.core.getScopesForInteraction(interaction);
    const claims = this.core.getClaimsLabelsForInteraction(interaction);
    const consentRequired = await this.core.isConsentRequired(spId);

    // -- generate and store in session the CSRF token
    const csrfToken = this.csrfService.get();
    await this.csrfService.save(sessionOidc, csrfToken);

    const response = {
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
