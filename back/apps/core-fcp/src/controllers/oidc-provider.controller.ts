import { ValidatorOptions } from 'class-validator';
import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  CoreMissingIdentityException,
  CoreRoutes,
  DataTransfertType,
} from '@fc/core';
import { CsrfTokenGuard } from '@fc/csrf';
import { DeviceService } from '@fc/device';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger';
import { OidcError, OidcSession } from '@fc/oidc';
import { OidcClientSession } from '@fc/oidc-client';
import {
  InteractionInterface,
  OidcProviderAuthorizeParamsException,
  OidcProviderService,
  OidcProviderUserAbortedException,
} from '@fc/oidc-provider';
import { OidcProviderRoutes } from '@fc/oidc-provider/enums';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import {
  ISessionService,
  Session,
  SessionConfig,
  SessionService,
} from '@fc/session';
import {
  TrackedEventContextInterface,
  TrackedEventInterface,
  TrackingService,
} from '@fc/tracking';

import {
  AuthorizeParamsDto,
  CoreConfig,
  GetLoginOidcClientSessionDto,
} from '../dto';
import { ConfirmationType, DataType } from '../enums';
import { CoreFcpInvalidEventKeyException } from '../exceptions';
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
    private readonly config: ConfigService,
    private readonly device: DeviceService,
  ) {}

  /**
   * Authorize route via HTTP GET
   * Authorization endpoint MUST support GET method
   * @see https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
   *
   * @TODO #144 do a more shallow validation and let oidc-provider handle redirections
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/144
   */
  @Get(OidcProviderRoutes.AUTHORIZATION)
  @Header('cache-control', 'no-store')
  async getAuthorize(
    @Req() req,
    @Res() res,
    @Query() query: AuthorizeParamsDto,
  ) {
    const { enableSso } = this.config.get<CoreConfig>('Core');
    if (!enableSso) {
      /**
       * DO NOT REMOVE !
       * The session cannot be reset outside the controller,
       * because we do not always go through the before middleware
       * according to the different kinematics
       */
      // Initializes a new session local
      await this.sessionService.reset(res);
    }

    const errors = await validateDto(
      query,
      AuthorizeParamsDto,
      validatorOptions,
    );

    if (errors.length) {
      throw new OidcProviderAuthorizeParamsException();
    }

    // Make spName available in templates in case of error
    const { client_id: spId } = query;
    const serviceProvider = await this.serviceProvider.getById(spId);

    if (serviceProvider) {
      const { name: spName } = serviceProvider;
      res.locals.spName = spName;
    }

    await this.oidcProvider.callback(req, res);
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
  @Header('cache-control', 'no-store')
  async postAuthorize(
    @Req() req,
    @Res() res,
    @Body() body: AuthorizeParamsDto,
  ) {
    const { enableSso } = this.config.get<CoreConfig>('Core');
    if (!enableSso) {
      /**
       * DO NOT REMOVE !
       * The session cannot be reset outside the controller,
       * because we do not always go through the before middleware
       * according to the different kinematics
       */
      // Initializes a new session local
      await this.sessionService.reset(res);
    }

    const errors = await validateDto(
      body,
      AuthorizeParamsDto,
      validatorOptions,
    );

    if (errors.length) {
      throw new OidcProviderAuthorizeParamsException();
    }

    // Make spName available in templates in case of error
    const { client_id: spId } = body;
    const { name: spName } = await this.serviceProvider.getById(spId);
    res.locals.spName = spName;

    await this.oidcProvider.callback(req, res);
  }

  @Get(CoreRoutes.REDIRECT_TO_SP_WITH_ERROR)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  redirectToSpWithError(
    @Query() { error, error_description, state }: OidcError,
  ) {
    const exception = new Error();
    Object.assign(exception, { error, error_description, state });
    throw new OidcProviderUserAbortedException(exception);
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
    interaction: InteractionInterface,
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

    await this.tracking.track(eventKey, context);
  }

  @Post(CoreRoutes.INTERACTION_LOGIN)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  @UseGuards(CsrfTokenGuard)
  async getLogin(
    @Req() req: Request,
    @Res() res: Response,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetLoginOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const session: OidcSession = sessionOidc.get();

    const { spId, spIdentity, rnippIdentity } = session;

    if (!spIdentity) {
      throw new CoreMissingIdentityException();
    }

    const deviceIdentity = rnippIdentity || spIdentity;

    const deviceInfo = await this.device.update(req, res, deviceIdentity);
    const trackingContext: TrackedEventContextInterface = {
      ...deviceInfo,
      req,
    };
    const interaction = await this.oidcProvider.getInteraction(req, res);
    await this.trackDatatransfer(trackingContext, interaction, spId);

    await this.core.sendNotificationMail(deviceInfo);

    const sessionId = this.sessionService.getId();

    await this.handleSessionLife(req, res);

    await this.oidcProvider.finishInteraction(req, res, session, sessionId);
  }

  private async handleSessionLife(req: Request, res: Response): Promise<void> {
    if (this.shouldExtendSessionLifeTime()) {
      await this.sessionService.refresh(req, res);
      this.logger.debug('Session has been refreshed to be used later for SSO');
    }

    const { enableSso } = this.config.get<CoreConfig>('Core');

    /**
     * @todo #1429 change behavior once SSO is enabled on all instances
     *
     * Either we remove this code altogether since no instance will have SSO disabled.
     * Or we can keep it in case it happens again in the future,
     * but we would have to change the behavior to not detach the session but to init a new empty session,
     * for the sake of simplicity in session library (SessionCommitInterceptor)
     */
    if (!enableSso) {
      await this.sessionService.detach(res);
      this.logger.debug(
        'Session has been detached because SSO is disabled on this platform',
      );
    }
  }

  private shouldExtendSessionLifeTime() {
    const { enableSso } = this.config.get<CoreConfig>('Core');
    const { slidingExpiration } = this.config.get<SessionConfig>('Session');

    return enableSso && !slidingExpiration;
  }
}
