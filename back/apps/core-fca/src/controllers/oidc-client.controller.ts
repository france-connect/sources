import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AppConfig } from '@fc/app';
import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { CsrfToken, CsrfTokenGuard } from '@fc/csrf';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import {
  OidcClientConfigService,
  OidcClientRoutes,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService, Session, SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import {
  GetIdentityProviderSelectionOidcClientSessionDto,
  GetOidcCallbackOidcClientSessionDto,
  GetOidcCallbackSessionDto,
  GetRedirectToIdpOidcClientSessionDto,
  OidcIdentityDto,
} from '../dto';
import { RedirectToIdp } from '../dto/redirect-to-idp.dto';
import { CoreFcaRoutes } from '../enums/core-fca-routes.enum';
import { CoreFcaInvalidIdentityException } from '../exceptions';
import { CoreFcaService } from '../services';

@Controller()
export class OidcClientController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly oidcClient: OidcClientService,
    private readonly oidcClientConfig: OidcClientConfigService,
    private readonly coreFca: CoreFcaService,
    private readonly oidcProvider: OidcProviderService,
    private readonly sessionService: SessionService,
    private readonly tracking: TrackingService,
    private readonly crypto: CryptographyService,
  ) {}

  @Get(CoreFcaRoutes.INTERACTION_IDENTITY_PROVIDER_SELECTION)
  @Header('cache-control', 'no-store')
  @IsStep()
  async getIdentityProviderSelection(
    @CsrfToken() csrfToken: string,
    @Res() res: Response,
    @Session('OidcClient', GetIdentityProviderSelectionOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { login_hint: email } = sessionOidc.get();

    const idpIds = await this.coreFca.getIdpIdForEmail(email);
    const providers = await this.coreFca.getIdentityProvidersByIds(...idpIds);
    const response = { csrfToken, email, providers };

    res.render('interaction-identity-provider', response);
  }

  /**
   * @todo #242 get configured parameters (scope and acr)
   */
  @Post(OidcClientRoutes.REDIRECT_TO_IDP)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Header('cache-control', 'no-store')
  @IsStep()
  @ForbidRefresh()
  @UseGuards(CsrfTokenGuard)
  async redirectToIdp(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: RedirectToIdp,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetRedirectToIdpOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ): Promise<void> {
    const { email, identityProviderUid } = body;
    const fqdn = this.coreFca.getFqdnFromEmail(email);

    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      params: { acr_values },
    } = await this.oidcProvider.getInteraction(req, res);

    const authorizeParams = {
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      // login_hint is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint: email,
    };

    sessionOidc.set('login_hint', email);

    if (identityProviderUid) {
      return this.coreFca.redirectToIdp(
        res,
        identityProviderUid,
        authorizeParams,
      );
    }

    const idpIds = await this.coreFca.getIdpIdForEmail(email);
    const hasUniqueProvider = idpIds.length === 1;

    if (hasUniqueProvider) {
      const [idpId] = idpIds;
      this.logger.debug(
        `Redirect "****@${fqdn}" to the identity provider "${idpId}"`,
      );

      // we need to keep idpId as 2nd parameter for the idp_hint
      return this.coreFca.redirectToIdp(res, idpId, authorizeParams);
    }

    this.logger.debug(
      `${idpIds.length} identity providers matching for "****@${fqdn}"`,
    );
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}${CoreFcaRoutes.INTERACTION_IDENTITY_PROVIDER_SELECTION}`;

    return res.redirect(url);
  }

  /**
   * @TODO #141 implement proper well-known
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/141
   *  - generated by openid-client
   *  - pub keys orverrided by keys from HSM
   */
  @Get(OidcClientRoutes.WELL_KNOWN_KEYS)
  @Header('cache-control', 'public, max-age=600')
  async getWellKnownKeys() {
    return await this.oidcClient.utils.wellKnownKeys();
  }

  @Post(OidcClientRoutes.DISCONNECT_FROM_IDP)
  @Header('cache-control', 'no-store')
  async logoutFromIdp(
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { idpIdToken, idpId } = sessionOidc.get();

    const { stateLength } = await this.oidcClientConfig.get();
    const idpState: string = this.crypto.genRandomString(stateLength);

    const endSessionUrl: string =
      await this.oidcClient.getEndSessionUrlFromProvider(
        idpId,
        idpState,
        idpIdToken,
      );

    return res.redirect(endSessionUrl);
  }

  @Get(OidcClientRoutes.CLIENT_LOGOUT_CALLBACK)
  @Header('cache-control', 'no-store')
  @Render('oidc-provider-logout-form')
  async redirectAfterIdpLogout(
    @Req() req,
    @Res() res,
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { oidcProviderLogoutForm } = sessionOidc.get();

    const trackingContext: TrackedEventContextInterface = { req };
    const { FC_SESSION_TERMINATED } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_SESSION_TERMINATED, trackingContext);

    await this.sessionService.destroy(res);

    return { oidcProviderLogoutForm };
  }

  /**
   * @TODO #308 ETQ DEV je veux éviter que deux appels Http soient réalisés au lieu d'un à la discovery Url dans le cadre d'oidc client
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/308
   */
  @Get(OidcClientRoutes.OIDC_CALLBACK)
  @Header('cache-control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @IsStep()
  @ForbidRefresh()
  async getOidcCallback(
    @Req() req,
    @Res() res,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient', GetOidcCallbackOidcClientSessionDto)
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    await this.sessionService.duplicate(res, GetOidcCallbackSessionDto);
    this.logger.debug('Session has been detached and duplicated');

    const { IDP_CALLEDBACK } = this.tracking.TrackedEventsMap;
    await this.tracking.track(IDP_CALLEDBACK, { req });

    const { idpId, idpNonce, idpState, interactionId, spId } =
      sessionOidc.get();

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const extraParams = {
      // OIDC inspired variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sp_id: spId,
    };

    const { accessToken, idToken, acr, amr } =
      await this.oidcClient.getTokenFromProvider(
        idpId,
        tokenParams,
        req,
        extraParams,
      );

    const { FC_REQUESTED_IDP_TOKEN } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_REQUESTED_IDP_TOKEN, { req });

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    const { FC_REQUESTED_IDP_USERINFO } = this.tracking.TrackedEventsMap;
    await this.tracking.track(FC_REQUESTED_IDP_USERINFO, { req });

    await this.validateIdentity(idpId, identity);

    const identityExchange: OidcSession = cloneDeep({
      amr,
      idpAccessToken: accessToken,
      idpIdToken: idToken,
      idpAcr: acr,
      idpIdentity: identity,
    });
    sessionOidc.set(identityExchange);

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

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
      this.logger.debug(errors, `Identity from "${idpId}" is invalid`);
      throw new CoreFcaInvalidIdentityException();
    }

    return true;
  }
}
