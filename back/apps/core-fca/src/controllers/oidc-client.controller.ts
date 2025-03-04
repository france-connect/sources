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

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { CsrfToken, CsrfTokenGuard } from '@fc/csrf';
import { ForbidRefresh, IsStep } from '@fc/flow-steps';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
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
import { AppConfig } from '../dto/app-config.dto';
import { RedirectToIdp } from '../dto/redirect-to-idp.dto';
import { CoreFcaRoutes } from '../enums/core-fca-routes.enum';
import {
  CoreFcaAgentNoIdpException,
  CoreFcaInvalidIdentityException,
} from '../exceptions';
import { CoreFcaFqdnService, CoreFcaService } from '../services';

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
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly sessionService: SessionService,
    private readonly tracking: TrackingService,
    private readonly crypto: CryptographyService,
    private readonly fqdnService: CoreFcaFqdnService,
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
    const fqdnConfig = await this.fqdnService.getFqdnConfigFromEmail(email);
    const { acceptsDefaultIdp, identityProviders } = fqdnConfig;

    const providers: { title: string; uid: string }[] =
      await this.coreFca.getIdentityProvidersByIds(identityProviders);

    // replace default idp title by "Autre"
    const defaultIdpId = this.config.get<AppConfig>('App').defaultIdpId;
    providers.map((provider) => {
      if (provider.uid === defaultIdpId) {
        provider.title = 'Autre';
      }
    });

    const response = {
      acceptsDefaultIdp,
      csrfToken,
      email,
      providers,
    };

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
    const fqdn = this.fqdnService.getFqdnFromEmail(email);

    const {
      params: { acr_values },
    } = await this.oidcProvider.getInteraction(req, res);

    const authorizeParams = {
      acr_values,
      login_hint: email,
    };

    sessionOidc.set('login_hint', email);

    if (identityProviderUid) {
      const { name: idpName, title: idpLabel } =
        await this.identityProvider.getById(identityProviderUid);
      this.logger.debug(
        `Redirect "****@${fqdn}" to selected idp "${idpLabel}" (${identityProviderUid})`,
      );

      const trackingContext: TrackedEventContextInterface = {
        req,
        fqdn,
        idpId: identityProviderUid,
        idpLabel: idpLabel,
        idpName: idpName,
      };
      const { FC_REDIRECT_TO_IDP } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_REDIRECT_TO_IDP, trackingContext);
      return this.coreFca.redirectToIdp(
        res,
        identityProviderUid,
        authorizeParams,
      );
    }

    const { identityProviders } =
      await this.fqdnService.getFqdnConfigFromEmail(email);
    const hasNoProvider = identityProviders.length === 0;
    const hasUniqueProvider = identityProviders.length === 1;

    if (hasNoProvider) {
      throw new CoreFcaAgentNoIdpException();
    }

    if (hasUniqueProvider) {
      const [idpId] = identityProviders;

      const { title: idpLabel } = await this.identityProvider.getById(idpId);
      this.logger.debug(
        `Redirect "****@${fqdn}" to unique idp "${idpLabel}" (${idpId})`,
      );

      const trackingContext: TrackedEventContextInterface = { req, fqdn };
      const { FC_REDIRECT_TO_IDP } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_REDIRECT_TO_IDP, trackingContext);
      // we need to keep idpId as 2nd parameter for the idp_hint
      return this.coreFca.redirectToIdp(res, idpId, authorizeParams);
    }

    this.logger.debug(
      `${identityProviders.length} identity providers matching for "****@${fqdn}"`,
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

    const { idpId, idpNonce, idpState, interactionId, spId, login_hint } =
      sessionOidc.get();

    const fqdn = this.fqdnService.getFqdnFromEmail(login_hint ?? '');
    const { IDP_CALLEDBACK } = this.tracking.TrackedEventsMap;
    await this.tracking.track(IDP_CALLEDBACK, { req, fqdn });
    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const extraParams = {
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
    await this.tracking.track(FC_REQUESTED_IDP_TOKEN, { req, fqdn });

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const identity =
      await this.oidcClient.getUserInfosFromProvider<OidcIdentityDto>(
        userInfoParams,
        req,
      );

    const { FC_REQUESTED_IDP_USERINFO } = this.tracking.TrackedEventsMap;
    const identityFqdn = this.fqdnService.getFqdnFromEmail(
      identity.email ?? '',
    );
    await this.tracking.track(FC_REQUESTED_IDP_USERINFO, {
      req,
      fqdn: identityFqdn,
    });

    const transformedIdentity = await this.transformIdentity(idpId, identity);

    const isAllowedIdpForEmail = await this.fqdnService.isAllowedIdpForEmail(
      idpId,
      transformedIdentity.email,
    );
    if (!isAllowedIdpForEmail) {
      this.logger.warning(
        `Identity from "${idpId}" using "***@${identityFqdn}" is not allowed`,
      );
      const { FC_FQDN_MISMATCH } = this.tracking.TrackedEventsMap;
      await this.tracking.track(FC_FQDN_MISMATCH, { req, fqdn: identityFqdn });
    }

    const identityExchange: OidcSession = cloneDeep({
      amr,
      idpAccessToken: accessToken,
      idpIdToken: idToken,
      idpAcr: acr,
      idpIdentity: transformedIdentity,
    });
    sessionOidc.set(identityExchange);

    // BUSINESS: Redirect to business page
    const { urlPrefix } = this.config.get<AppConfig>('App');
    const url = `${urlPrefix}/interaction/${interactionId}/verify`;

    res.redirect(url);
  }

  private async transformIdentity(
    idpId: string,
    identity: OidcIdentityDto,
  ): Promise<OidcIdentityDto> {
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

    if (errors.length === 0) {
      return identity;
    }

    const transformedIdentity = { ...identity };

    errors.forEach((error) => {
      if (error.property === 'phone_number') {
        delete transformedIdentity.phone_number;
      } else {
        this.logger.debug(errors, `Identity from "${idpId}" is invalid`);
        throw new CoreFcaInvalidIdentityException();
      }
    });

    return transformedIdentity;
  }
}
