import { encode } from 'querystring';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  Type,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { ConfigService } from '@fc/config';
import {
  CoreMissingIdentityException,
  CoreRoutes,
  CoreService,
  CsrfToken,
  Interaction,
} from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { NotificationsService } from '@fc/notifications';
import { OidcSession } from '@fc/oidc';
import {
  GetOidcCallback,
  OidcClientConfig,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderConfig, OidcProviderService } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfConsentException,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { Core, OidcIdentityDto } from '../dto';
import { ProcessCore } from '../enums';
import {
  CoreFcpDatatransferConsentIdentityEvent,
  CoreFcpDatatransferInformationAnonymousEvent,
  CoreFcpDatatransferInformationIdentityEvent,
} from '../events';
import {
  CoreFcpInvalidEventClassException,
  CoreFcpInvalidIdentityException,
} from '../exceptions';
import { IIdentityCheckFeatureHandler } from '../interfaces';
import { CoreFcpService } from '../services';

export const datatransferEventsMap = {
  'CONSENT:IDENTITY': CoreFcpDatatransferConsentIdentityEvent,
  'INFORMATION:ANONYMOUS': CoreFcpDatatransferInformationAnonymousEvent,
  'INFORMATION:IDENTITY': CoreFcpDatatransferInformationIdentityEvent,
};
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
    private readonly oidcClient: OidcClientService,
    private readonly tracking: TrackingService,
    private readonly sessionService: SessionService,
    private readonly csrfService: SessionCsrfService,
    private readonly coreService: CoreService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(CoreRoutes.DEFAULT)
  getDefault(@Res() res) {
    const { defaultRedirectUri } = this.config.get<Core>('Core');

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
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session = await sessionOidc.get();
    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

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
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { interactionId } = await sessionOidc.get();
    await this.core.verify(sessionOidc, req);

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
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const {
      interactionId,
      spId,
      spIdentity: identity,
      spName,
    }: OidcSession = await sessionOidc.get();

    const interaction = await this.oidcProvider.getInteraction(req, res);

    const scopes = await this.core.getScopesForInteraction(interaction);
    const claims = await this.core.getClaimsLabelsForInteraction(interaction);
    const consentRequired = await this.core.isConsentRequired(spId);

    // -- generate and store in session the CSRF token
    const csrfToken = await this.csrfService.get();
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

  private getEventClass(
    scopes: string[],
    consentRequired: boolean,
  ): Type<
    | CoreFcpDatatransferConsentIdentityEvent
    | CoreFcpDatatransferInformationAnonymousEvent
    | CoreFcpDatatransferInformationIdentityEvent
  > {
    const dataType = scopes.every((scope) => scope === 'openid')
      ? 'ANONYMOUS'
      : 'IDENTITY';
    const consentOrInfo = consentRequired ? 'CONSENT' : 'INFORMATION';

    const classMapKey = `${consentOrInfo}:${dataType}`;

    if (!(classMapKey in datatransferEventsMap)) {
      throw new CoreFcpInvalidEventClassException();
    }

    return datatransferEventsMap[classMapKey];
  }

  private async trackDatatransfer(
    trackingContext,
    interaction: any,
    spId: string,
  ): Promise<void> {
    const scopes = await this.core.getScopesForInteraction(interaction);
    const consentRequired = await this.core.isConsentRequired(spId);
    const claims = await this.core.getClaimsForInteraction(interaction);

    const eventClass = this.getEventClass(scopes, consentRequired);
    const context = {
      ...trackingContext,
      claims,
    };

    this.tracking.track(eventClass, context);
  }

  @Post(CoreRoutes.INTERACTION_LOGIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getLogin(
    @Req() req,
    @Res() res,
    @Body() body: CsrfToken,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { _csrf: csrfToken } = body;
    const session: OidcSession = await sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { spId, spIdentity } = session;

    try {
      await this.csrfService.validate(sessionOidc, csrfToken);
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new SessionInvalidCsrfConsentException(error);
    }

    if (!spIdentity) {
      this.logger.trace({ spIdentity }, LoggerLevelNames.WARN);
      throw new CoreMissingIdentityException();
    }

    this.logger.trace({ csrfToken, spIdentity });

    const interaction = await this.oidcProvider.getInteraction(req, res);
    const trackingContext = req;
    await this.trackDatatransfer(trackingContext, interaction, spId);

    // send the notification mail to the final user
    await this.core.sendAuthenticationMail(session);

    /**
     * We need to set an alias with the sub since later (findAccount) we do not have access
     * to the sessionId, nor the interactionId.
     */
    await this.sessionService.setAlias(spIdentity.sub, req.sessionId);

    this.logger.trace({
      data: { req, res, session },
      method: 'POST',
      name: 'CoreRoutes.INTERACTION_LOGIN',
      route: CoreRoutes.INTERACTION_LOGIN,
    });

    return this.oidcProvider.finishInteraction(req, res, session);
  }

  @Get(OidcClientRoutes.OIDC_CALLBACK_LEGACY)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Redirect()
  async getLegacyOidcCallback(
    @Query() query,
    @Param() params: GetOidcCallback,
  ) {
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const queryParams = encode(query);

    const response = {
      statusCode: 302,
      url: `${urlPrefix}${OidcClientRoutes.OIDC_CALLBACK}?${queryParams}`,
    };

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK_LEGACY',
      providerUid: params.providerUid,
    });

    return response;
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  async getOidcCallback(
    @Req() req,
    @Res() res,
    /**
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = await sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce, idpState, interactionId, spId } = session;

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const { accessToken, acr, amr } =
      await this.oidcClient.getTokenFromProvider(idpId, tokenParams, req);

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    await this.validateIdentity(idpId, identity);

    const identityExchange: OidcSession = {
      amr,
      idpAccessToken: accessToken,
      idpAcr: acr,
      idpIdentity: identity,
    };
    sessionOidc.set({ ...identityExchange });

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK',
      redirect: url,
      route: OidcClientRoutes.OIDC_CALLBACK,
    });

    res.redirect(url);
  }

  private async validateIdentity(idpId: string, identity: OidcIdentityDto) {
    const identityCheckHandler =
      await this.core.getFeature<IIdentityCheckFeatureHandler>(
        idpId,
        ProcessCore.ID_CHECK,
      );

    const errors = await identityCheckHandler.handle(identity);
    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new CoreFcpInvalidIdentityException();
    }
  }
}
