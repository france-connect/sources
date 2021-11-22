import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { encode } from 'querystring';

import {
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  CoreMissingIdentityException,
  CoreRoutes,
  CoreService,
  Interaction,
} from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { MinistriesService } from '@fc/ministries';
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
  SessionBadFormatException,
  SessionCsrfService,
  SessionNotFoundException,
  SessionService,
} from '@fc/session';

import { Core, OidcIdentityDto } from '../dto';
import { CoreFcaInvalidIdentityException } from '../exceptions';
import { CoreFcaService } from '../services';

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
    private readonly oidcClient: OidcClientService,
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

  @Get(CoreRoutes.FCA_FRONT_HISTORY_BACK_URL)
  async getFrontHistoryBackURL(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    // @TODO a refacto
    // avec une methode private et en éclatant le controller `getFrontData`
    // afin de réduire la taille de ce fichier > 400 lignes
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
     * @todo Adaptation for now, correspond to the oidc-provider side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { spName } = (await sessionOidc.get()) || {};
    if (!spName) {
      throw new SessionBadFormatException();
    }
    const { params } = await this.oidcProvider.getInteraction(req, res);
    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

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

    const identityProvidersList = await this.identityProvider.getFilteredList({
      blacklist: idpFilterExclude,
      idpList: idpFilterList,
    });

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
      redirectURL: '/api/v2/redirect-to-idp',
      serviceProviderName: spName,
    };

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.FCA_FRONT_DATAS',
      response: jsonResponse,
      route: CoreRoutes.FCA_FRONT_DATAS,
    });

    return res.json(jsonResponse);
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

  @Get(CoreRoutes.INTERACTION_VERIFY)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getVerify(
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
    await this.core.verify(sessionOidc);

    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/login`;

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION_VERIFY',
      redirect: url,
      route: CoreRoutes.INTERACTION_VERIFY,
    });

    res.redirect(url);
  }

  /**
   * @TODO #185 Remove this controller once it is globaly available in `@fc/oidc-provider`
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/merge_requests/185
   */
  @Get(CoreRoutes.INTERACTION_LOGIN)
  async getLogin(
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
    const { spIdentity } = await sessionOidc.get();
    if (!spIdentity) {
      this.logger.trace(
        { route: CoreRoutes.INTERACTION_LOGIN },
        LoggerLevelNames.WARN,
      );
      throw new CoreMissingIdentityException();
    }

    /**
     * We need to set an alias with the sub since later (findAccount) we do not have access
     * to the sessionId, nor the interactionId.
     */
    await this.sessionService.setAlias(spIdentity.sub, req.sessionId);

    this.logger.trace({
      method: 'GET',
      name: 'CoreRoutes.INTERACTION_LOGIN',
      route: CoreRoutes.INTERACTION_LOGIN,
      spIdentity,
    });

    const session: OidcClientSession = await sessionOidc.get();
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

    const response = {
      statusCode: 302,
      url: `${urlPrefix}${OidcClientRoutes.OIDC_CALLBACK}?${encode(query)}`,
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
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

    /**
     *  @todo
     *  problem: reduce the complexity of the oidc-callback functions
     *  action: take token and userinfo and add them together in oidc.
     *
     *  @author Arnaud & Hugues
     *  @date 23/03/2020
     *  @ticket FC-244 (identity, DTO, Factorisation)
     */
    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const extraParams = {
      // OIDC inspired variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sp_id: spId,
    };

    const { accessToken, acr } = await this.oidcClient.getTokenFromProvider(
      idpId,
      tokenParams,
      req,
      extraParams,
    );

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
      idpAccessToken: accessToken,
      idpAcr: acr,
      idpIdentity: identity,
    };
    await sessionOidc.set({ ...identityExchange });

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    this.logger.trace({
      method: 'GET',
      name: 'OidcClientRoutes.OIDC_CALLBACK',
      redirect: url,
      route: OidcClientRoutes.OIDC_CALLBACK,
      identityExchange,
    });

    res.redirect(url);
  }

  private async validateIdentity(
    idpId: string,
    identity: Partial<OidcIdentityDto>,
  ): Promise<boolean> {
    const validatorOptions: ValidatorOptions = {
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    };
    const transformOptions: ClassTransformOptions = {
      excludeExtraneousValues: true,
    };

    const errors = await validateDto(
      identity,
      OidcIdentityDto,
      validatorOptions,
      transformOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new CoreFcaInvalidIdentityException();
    }

    this.logger.trace({ validate: { identity, idpId } });
    return true;
  }
}
