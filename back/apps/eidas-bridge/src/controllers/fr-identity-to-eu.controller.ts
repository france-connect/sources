import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Request } from 'express';

import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { EidasResponse } from '@fc/eidas';
import {
  AcrValues,
  EidasToOidcService,
  OidcToEidasService,
} from '@fc/eidas-oidc-mapper';
import { EidasProviderSession } from '@fc/eidas-provider';
import { LoggerService } from '@fc/logger';
import {
  OidcClientConfigService,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import {
  ISessionService,
  Session,
  SessionNotFoundException,
} from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { AppConfig, EidasBridgeIdentityDto } from '../dto';
import { EidasBridgeRoutes } from '../enums';
import { EidasBridgeInvalidFRIdentityException } from '../exceptions';

/**
 * @todo #412 Clean the controller (create a service, generalize code, ...)
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/412
 */
@Controller(EidasBridgeRoutes.BASE)
export class FrIdentityToEuController {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly crypto: CryptographyService,
    private readonly cryptoEidas: CryptographyEidasService,
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly oidcClientConfig: OidcClientConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly eidasToOidc: EidasToOidcService,
    private readonly oidcToEidas: OidcToEidasService,
    private readonly tracking: TrackingService,
  ) {}

  @Get(EidasBridgeRoutes.INIT_SESSION)
  @Redirect()
  async initSession(
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const { stateLength } = await this.oidcClientConfig.get();
    const idpState: string = this.crypto.genRandomString(stateLength);

    sessionOidc.set({
      idpState,
      idpId: this.getIdpId(),
    });

    const response = {
      statusCode: 302,
      url: `${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.REDIRECT_TO_FC_AUTHORIZE}`,
    };

    return response;
  }

  /**
   * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
   */
  @Get(EidasBridgeRoutes.REDIRECT_TO_FC_AUTHORIZE)
  @Redirect()
  async redirectToFcAuthorize(
    @Req() req: Request,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('EidasProvider')
    sessionEidasProvider: ISessionService<EidasProviderSession>,
  ) {
    const { eidasRequest } = sessionEidasProvider.get();
    const oidcRequest = this.eidasToOidc.mapPartialRequest(eidasRequest);

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl(
      this.getIdpId(),
      {
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: oidcRequest.acr_values,
        nonce,
        scope: oidcRequest.scope.join(' '),
        state,
      },
    );

    sessionOidc.set({
      idpNonce: nonce,
      idpState: state,
    });

    const response = { statusCode: 302, url: authorizationUrl };

    return response;
  }

  @Get(EidasBridgeRoutes.REDIRECT_TO_EIDAS_RESPONSE_PROXY)
  @Redirect()
  async redirectToEidasResponseProxy(
    @Req()
    req,
    /**
     * @todo Ajouter un DTO pour vérifier la présence du code d'autorisation
     */
    @Query()
    query,
    @Session('EidasProvider')
    sessionEidasProvider: ISessionService<EidasProviderSession>,
    /**
     * @todo #1020 Partage d'une session entre oidc-provider & oidc-client
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1020
     * @ticket FC-1020
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const trackingContext: TrackedEventContextInterface = { req };
    const { RECEIVED_FC_AUTH_CODE, RECEIVED_FC_AUTH_ERROR } =
      this.tracking.TrackedEventsMap;

    let partialEidasResponse;

    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { error, error_description } = query;
    if (error) {
      this.logger.err({ error }, error_description);
      await this.tracking.track(RECEIVED_FC_AUTH_ERROR, trackingContext);

      partialEidasResponse = this.oidcToEidas.mapPartialResponseFailure({
        error,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description,
      });
    } else {
      await this.tracking.track(RECEIVED_FC_AUTH_CODE, trackingContext);

      try {
        partialEidasResponse = await this.handleOidcCallbackAuthCode(
          req,
          sessionOidc,
          sessionEidasProvider,
        );
      } catch (error) {
        this.logger.err(error);
        await this.tracking.trackExceptionIfNeeded(error, trackingContext);

        partialEidasResponse =
          this.oidcToEidas.mapPartialResponseFailure(error);
      }
    }

    sessionEidasProvider.set('partialEidasResponse', partialEidasResponse);

    const response = {
      statusCode: 302,
      url: '/eidas-provider/response-proxy',
    };

    return response;
  }

  private async handleOidcCallbackAuthCode(
    req: Request,
    sessionOidc: ISessionService<OidcClientSession>,
    sessionEidasProvider: ISessionService<EidasProviderSession>,
  ): Promise<Partial<EidasResponse>> {
    const session = sessionOidc.get();

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce, idpState } = session;

    const tokenParams = {
      state: idpState,
      nonce: idpNonce,
    };

    const { accessToken, acr } = await this.oidcClient.getTokenFromProvider(
      idpId,
      tokenParams,
      req,
    );

    const userInfoParams = {
      accessToken,
      idpId,
    };

    const { requestedAttributes, spCountryCode } =
      sessionEidasProvider.get('eidasRequest');

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    sessionOidc.set('idpIdentity', identity);

    await this.validateIdentity(identity);

    identity.sub = this.computePairwisedSub(identity.sub, spCountryCode);

    const partialEidasResponse =
      await this.oidcToEidas.mapPartialResponseSuccess(
        identity,
        /**
         * @todo #412 Apply strong typing to acr values in other libs and apps
         * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/412
         */
        acr as AcrValues,
        requestedAttributes,
      );

    return partialEidasResponse;
  }

  private async validateIdentity(identity: Partial<EidasBridgeIdentityDto>) {
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
      EidasBridgeIdentityDto,
      validatorOptions,
      transformOptions,
    );
    if (errors.length) {
      throw new EidasBridgeInvalidFRIdentityException();
    }
  }

  /**
   * Adapt sub with CountryCode to make it unique by country
   * @param {string} idpSub the original sub given by Idp
   * @param {string} spCountryCode the country code (FR, BE, DE...)
   * @returns {string} the new Sub
   */
  private computePairwisedSub(idpSub: string, spCountryCode: string): string {
    this.logger.debug(
      `Format new Sub based on country "${spCountryCode}" and sub "${idpSub}"`,
    );
    const pairwisedSub = this.cryptoEidas.computeSubV1(spCountryCode, idpSub);
    return pairwisedSub;
  }

  private getIdpId(): string {
    const { idpId } = this.config.get<AppConfig>('App');

    return idpId;
  }
}
