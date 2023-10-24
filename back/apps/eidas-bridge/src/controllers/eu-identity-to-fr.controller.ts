import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Request } from 'express';

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
import { EidasClientRoutes, EidasClientSession } from '@fc/eidas-client';
import { EidasCountryService } from '@fc/eidas-country';
import { EidasToOidcService, OidcToEidasService } from '@fc/eidas-oidc-mapper';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity, OidcError } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import {
  AppConfig,
  EidasBridgeIdentityDto,
  EidasBridgeValidateEuropeanIdentity,
} from '../dto';
import { EidasBridgeRoutes } from '../enums';
import { EidasBridgeInvalidEUIdentityException } from '../exceptions';

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
    private readonly tracking: TrackingService,
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
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
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
    @Req() req: Request,
    @Body() body: EidasBridgeValidateEuropeanIdentity,
  ) {
    const { country: countryCodeDst } = body;
    const url = `${EidasClientRoutes.BASE}${EidasClientRoutes.REDIRECT_TO_FR_NODE_CONNECTOR}?country=${countryCodeDst}`;
    const response = {
      url,
      statusCode: 302,
    };

    const { SELECTED_CITIZEN_COUNTRY } = this.tracking.TrackedEventsMap;
    const trackingContext = { req, countryCodeDst };

    await this.tracking.track(SELECTED_CITIZEN_COUNTRY, trackingContext);

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
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('EidasClient')
    sessionEidas: ISessionService<EidasClientSession>,
  ) {
    const { REDIRECT_TO_FC, EIDAS_RESPONSE_ERROR } =
      this.tracking.TrackedEventsMap;
    const trackingContext = { req };

    const { eidasResponse } = await sessionEidas.get();

    if (eidasResponse.status.failure) {
      await this.tracking.track(EIDAS_RESPONSE_ERROR, trackingContext);

      const { params } = await this.oidcProvider.getInteraction(req, res);

      const oidcError = await this.eidasToOidc.mapPartialResponseFailure(
        eidasResponse,
      );

      return res.redirect(this.buildRedirectUriErrorUrl(params, oidcError));
    }

    const { acr, userinfos: idpIdentity } =
      this.eidasToOidc.mapPartialResponseSuccess(eidasResponse);

    await this.validateIdentity(idpIdentity);

    const { sub, ...spIdentity } = idpIdentity;

    // Delete idp identity from volatile memory but keep the sub for the business logs.
    const idpIdentityReset: PartialExcept<IOidcIdentity, 'sub'> = {
      sub: idpIdentity.sub,
    };

    const { spId, subs }: OidcClientSession = await sessionOidc.get();
    const session = {
      // Save idp identity.
      idpIdentity: idpIdentityReset,
      // Save service provider identity.
      spIdentity,
      spAcr: acr,
      subs: { ...subs, [spId]: sub },
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

    await this.tracking.track(REDIRECT_TO_FC, trackingContext);

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
      throw new EidasBridgeInvalidEUIdentityException();
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
