import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Request } from 'express';

import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { EidasNameIdFormats, EidasResponse } from '@fc/eidas';
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
import {
  EidasBridgeInvalidFRIdentityException,
  EidasBridgeInvalidNameIdFormatException,
} from '../exceptions';

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

    const { error, error_description } = query;
    if (error) {
      this.logger.err({ error }, error_description);
      await this.tracking.track(RECEIVED_FC_AUTH_ERROR, trackingContext);

      partialEidasResponse = this.oidcToEidas.mapPartialResponseFailure({
        error,
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

    const { requestedAttributes, spCountryCode, nameIdFormat } =
      sessionEidasProvider.get('eidasRequest');

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    sessionOidc.set('idpIdentity', identity);

    await this.validateIdentity(identity);

    /**
     * This field will be set as PersonIdentifier in the eIDAS response.
     * It is used to compute the SAML Subject when NameID format is PERSISTENT.
     */
    identity.sub = this.cryptoEidas.computeSubV1(spCountryCode, identity.sub);

    const samlSubject = this.computeSamlSubject(identity.sub, nameIdFormat);

    const partialEidasResponse = this.oidcToEidas.mapPartialResponseSuccess(
      identity,
      /**
       * @todo #412 Apply strong typing to acr values in other libs and apps
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/412
       */
      acr as AcrValues,
      requestedAttributes,
      nameIdFormat,
      samlSubject,
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
   * Handle sub generation depending on country and requested nameIdFormat
   * @param {string} personIdentifier the person identifier (sub oidc pairwised with country)
   * @param {EidasNameIdFormats} nameIdFormat the NameID format (can be undefined if not requested)
   * @returns {string} the new Sub
   */
  // This "complexity" is reasonable with switch statement
  // eslint-disable-next-line complexity
  private computeSamlSubject(
    personIdentifier: string,
    nameIdFormat?: EidasNameIdFormats,
  ): string {
    /**
     * If transient -> Privacy first, use transient sub
     * If unspecified -> Use persistent sub for compatibilty with countries that don't support transient sub
     * If persistent -> Use persistent sub
     * If not handled -> throw an error
     */
    switch (nameIdFormat) {
      case EidasNameIdFormats.TRANSIENT:
        return this.cryptoEidas.generateTransientSub();
      case undefined:
      case EidasNameIdFormats.UNSPECIFIED:
      case EidasNameIdFormats.PERSISTENT:
        return personIdentifier;
      default:
        throw new EidasBridgeInvalidNameIdFormatException(nameIdFormat);
    }
  }

  private getIdpId(): string {
    const { idpId } = this.config.get<AppConfig>('App');

    return idpId;
  }
}
