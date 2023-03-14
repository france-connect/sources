import { ValidatorOptions } from 'class-validator';

import {
  Body,
  Controller,
  Get,
  Next,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { validateDto } from '@fc/common';
import {
  CoreMissingIdentityException,
  CoreRoutes,
  CsrfToken,
  DataTransfertType,
} from '@fc/core';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import {
  OidcProviderAuthorizeParamsException,
  OidcProviderService,
} from '@fc/oidc-provider';
import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import {
  ISessionService,
  Session,
  SessionCsrfService,
  SessionInvalidCsrfConsentException,
  SessionService,
} from '@fc/session';
import {
  TrackedEventContextInterface,
  TrackedEventInterface,
  TrackingService,
} from '@fc/tracking';

import { AuthorizeParamsDto, ErrorParamsDto, GetLoginSessionDto } from '../dto';
import { ConfirmationType, DataType } from '../enums';
import {
  CoreFcpFailedAbortSessionException,
  CoreFcpInvalidEventKeyException,
} from '../exceptions';
import { CoreFcpService } from '../services';

const validatorOptions: ValidatorOptions = {
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
  whitelist: true,
};

@Controller()
export class OidcProviderController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly logger: LoggerService,
    private readonly oidcProvider: OidcProviderService,
    private readonly sessionService: SessionService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly core: CoreFcpService,
    private readonly tracking: TrackingService,
    private readonly csrfService: SessionCsrfService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Authorize route via HTTP GET
   * Authorization endpoint MUST support GET method
   * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   *
   * @TODO #144 do a more shallow validation and let oidc-provider handle redirections
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/144
   */
  @Get(OidcProviderRoutes.AUTHORIZATION)
  async getAuthorize(
    @Req() req,
    @Res() res,
    @Next() next,
    @Query() query: AuthorizeParamsDto,
  ) {
    this.logger.trace({
      method: 'GET',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      query,
      route: OidcProviderRoutes.AUTHORIZATION,
    });

    // Initializes a new session local
    await this.sessionService.reset(req, res);

    const errors = await validateDto(
      query,
      AuthorizeParamsDto,
      validatorOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new OidcProviderAuthorizeParamsException();
    }

    // Make spName available in templates in case of error
    const { client_id: spId } = query;
    const serviceProvider = await this.serviceProvider.getById(spId);

    if (serviceProvider) {
      const { name: spName } = serviceProvider;
      res.locals.spName = spName;
    }
    // We do not need an `else` case to handle unknown service provider here,
    // it will be handled by oidc-provider in `next()`.

    // Pass the query to oidc-provider
    return next();
  }

  /**
   * Authorize route via HTTP POST
   * Authorization endpoint MUST support POST method
   * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   *
   * @TODO #144 do a more shallow validation and let oidc-provider handle redirections
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/144
   */
  @Post(OidcProviderRoutes.AUTHORIZATION)
  async postAuthorize(
    @Req() req,
    @Res() res,
    @Next() next,
    @Body() body: AuthorizeParamsDto,
  ) {
    this.logger.trace({
      body,
      method: 'POST',
      name: 'OidcProviderRoutes.AUTHORIZATION',
      route: OidcProviderRoutes.AUTHORIZATION,
    });

    // Initializes a new session local
    await this.sessionService.reset(req, res);
    const errors = await validateDto(
      body,
      AuthorizeParamsDto,
      validatorOptions,
    );

    if (errors.length) {
      this.logger.trace({ errors }, LoggerLevelNames.WARN);
      throw new OidcProviderAuthorizeParamsException();
    }

    // Make spName available in templates in case of error
    const { client_id: spId } = body;
    const { name: spName } = await this.serviceProvider.getById(spId);
    res.locals.spName = spName;

    // Pass the query to oidc-provider
    return next();
  }

  // A controller is an exception to the max-params lint due to decorators
  @Get(CoreRoutes.REDIRECT_TO_SP_WITH_ERROR)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async redirectToSpWithError(
    @Query() { error, error_description: errorDescription }: ErrorParamsDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      await this.oidcProvider.abortInteraction(
        req,
        res,
        error,
        errorDescription,
      );
    } catch (error) {
      throw new CoreFcpFailedAbortSessionException(error);
    }
  }

  private isAnonymous(scopes): boolean {
    const anonymousScope = 'openid';
    return scopes.every((scope) => scope === anonymousScope);
  }

  private getDataType(isAnonymous: boolean): DataType {
    return isAnonymous ? DataType.ANONYMOUS : DataType.IDENTITY;
  }

  private getConfirmationType(
    consentRequired: boolean,
    isAnonymous: boolean,
  ): ConfirmationType {
    return consentRequired && !isAnonymous
      ? ConfirmationType.CONSENT
      : ConfirmationType.INFORMATION;
  }

  private getDataEvent(
    scopes: string[],
    consentRequired: boolean,
  ): TrackedEventInterface {
    const isAnonymous = this.isAnonymous(scopes);
    const dataType = this.getDataType(isAnonymous);
    const consentOrInfo = this.getConfirmationType(
      consentRequired,
      isAnonymous,
    );
    const eventKey =
      `FC_DATATRANSFER_${consentOrInfo}_${dataType}` as DataTransfertType;
    const { TrackedEventsMap } = this.tracking;

    if (!TrackedEventsMap.hasOwnProperty(eventKey)) {
      throw new CoreFcpInvalidEventKeyException();
    }

    return TrackedEventsMap[eventKey];
  }

  private async trackDatatransfer(
    trackingContext: TrackedEventContextInterface,
    interaction: any,
    spId: string,
  ): Promise<void> {
    const scopes = this.core.getScopesForInteraction(interaction);
    const consentRequired = await this.core.isConsentRequired(spId);
    const claims = this.core.getClaimsForInteraction(interaction);

    const eventKey = this.getDataEvent(scopes, consentRequired);
    const context = {
      ...trackingContext,
      claims,
    };

    this.tracking.track(eventKey, context);
  }

  @Post(CoreRoutes.INTERACTION_LOGIN)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getLogin(
    @Req() req,
    @Res() res,
    @Body() body: CsrfToken,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetLoginSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { _csrf: csrfToken } = body;
    const session: OidcSession = await sessionOidc.get();

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
    const trackingContext: TrackedEventContextInterface = { req };
    await this.trackDatatransfer(trackingContext, interaction, spId);

    // send the notification mail to the final user
    await this.core.sendAuthenticationMail(session);

    this.logger.trace({
      data: { req, res, session },
      method: 'POST',
      name: 'CoreRoutes.INTERACTION_LOGIN',
      route: CoreRoutes.INTERACTION_LOGIN,
    });

    return this.oidcProvider.finishInteraction(req, res, session);
  }
}
