import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';

import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PartialExcept, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { EidasClientSession } from '@fc/eidas-client';
import { EidasCountryService } from '@fc/eidas-country';
import { EidasToOidcService, OidcToEidasService } from '@fc/eidas-oidc-mapper';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcError } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session, SessionService } from '@fc/session';

import {
  AppConfig,
  EidasBridgeIdentityDto,
  EidasBridgeValidateEuropeanIdentity,
} from '../dto';
import { EidasBridgeRoutes } from '../enums';
import { EidasBridgeInvalidIdentityException } from '../exceptions';

/**
 * @todo #411 Clean the controller (create a service, generalize code, ...)
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/411
 */
@Controller()
export class EuIdentityToFrController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly oidcToEidas: OidcToEidasService,
    private readonly eidasToOidc: EidasToOidcService,
    private readonly eidasCountry: EidasCountryService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * @TODO #291
   * modify interaction.ejs
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/271
   */
  @Get(EidasBridgeRoutes.INTERACTION)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Render('interaction')
  async getInteraction(
    @Req() req,
    @Res() res,
    @Session('EidasClient')
    sessionEidas: ISessionService<EidasClientSession>,
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
    const { uid, params } = await this.oidcProvider.getInteraction(req, res);
    const { countryIsoList } = await this.config.get<AppConfig>('App');
    const { spName } = await sessionOidc.get();

    const eidasPartialRequest = this.oidcToEidas.mapPartialRequest(
      params.scope,
      params.acr_values,
    );

    await sessionEidas.set('eidasPartialRequest', eidasPartialRequest);

    const countryList = await this.eidasCountry.getListByIso(countryIsoList);

    const response = {
      countryList,
      uid,
      params,
      spName,
    };

    this.logger.trace({
      route: EidasBridgeRoutes.INTERACTION,
      method: 'GET',
      name: 'EidasBridgeRoutes.INTERACTION',
      response,
    });

    return response;
  }

  /**
   * @todo #411 ajouter une interface sur l'identité au format oidc
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/411
   */
  @Post(EidasBridgeRoutes.INTERACTION_LOGIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Redirect()
  async redirectToFrNodeConnector(
    @Body() body: EidasBridgeValidateEuropeanIdentity,
  ) {
    const response = {
      url: `/eidas-client/redirect-to-fr-node-connector?country=${body.country}`,
      statusCode: 302,
    };

    this.logger.trace({
      route: EidasBridgeRoutes.INTERACTION_LOGIN,
      method: 'POST',
      name: 'EidasBridgeRoutes.INTERACTION_LOGIN',
      response,
    });

    return response;
  }

  @Get(EidasBridgeRoutes.FINISH_FC_INTERACTION)
  async finishInteraction(
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
    @Session('EidasClient')
    sessionEidas: ISessionService<EidasClientSession>,
  ) {
    const { eidasResponse } = await sessionEidas.get();

    if (eidasResponse.status.failure) {
      const { params } = await this.oidcProvider.getInteraction(req, res);

      const oidcError = await this.eidasToOidc.mapPartialResponseFailure(
        eidasResponse,
      );

      return res.redirect(this.buildRedirectUriErrorUrl(params, oidcError));
    }

    const { acr, userinfos: idpIdentity } =
      this.eidasToOidc.mapPartialResponseSuccess(eidasResponse);

    await this.validateIdentity(idpIdentity);

    const spIdentity: IOidcIdentity = idpIdentity;

    /**
     * We need to set an alias with the sub since later (findAccount) we do not have access
     * to the sessionId, nor the interactionId.
     */
    await this.sessionService.setAlias(spIdentity.sub, req.sessionId);

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityReset: PartialExcept<IOidcIdentity, 'sub'> = {
      sub: idpIdentity.sub,
    };
    const session = {
      // Save idp identity.
      idpIdentity: idpIdentityReset,
      // Save service provider identity.
      spIdentity,
      spAcr: acr,
    };

    // Store the changes in session
    await sessionOidc.set(session);

    const sessionClient: OidcClientSession = await sessionOidc.get();

    this.logger.trace({
      route: EidasBridgeRoutes.FINISH_FC_INTERACTION,
      method: 'GET',
      name: 'EidasBridgeRoutes.FINISH_FC_INTERACTION',
      session,
    });

    return this.oidcProvider.finishInteraction(req, res, sessionClient);
  }

  /**
   * Validate the identity of userInfos.
   * @param identity
   */
  private async validateIdentity(identity: Partial<EidasBridgeIdentityDto>) {
    const validatorOptions: ValidatorOptions = {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    };
    const transformOptions: ClassTransformOptions = {
      excludeExtraneousValues: true,
    };

    const errors = await validateDto(
      identity,
      EidasBridgeIdentityDto,
      validatorOptions,
      transformOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new EidasBridgeInvalidIdentityException();
    }
  }

  private buildRedirectUriErrorUrl(params, oidcError: OidcError) {
    const { error, error_description: errorDescription } = oidcError;

    return `${params.redirect_uri}?error=${encodeURIComponent(
      error,
    )}&error_description=${encodeURIComponent(
      errorDescription,
    )}&state=${encodeURIComponent(params.state)}`;
  }
}
