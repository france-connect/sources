import { ClassTransformOptions } from 'class-transformer';
import { ValidatorOptions } from 'class-validator';
import { Request } from 'express';

import { Controller, Get, Query, Redirect, Req } from '@nestjs/common';

import { validateDto } from '@fc/common';
import { CryptographyService } from '@fc/cryptography';
import { EidasResponse } from '@fc/eidas';
import { EidasToOidcService, OidcToEidasService } from '@fc/eidas-oidc-mapper';
import { EidasProviderSession } from '@fc/eidas-provider';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { AcrValues } from '@fc/oidc';
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

import { EidasBridgeIdentityDto } from '../dto/eidas-bridge-identity.dto';
import { EidasBridgeRoutes, IDP_ID } from '../enums';
import { EidasBridgeInvalidIdentityException } from '../exceptions';

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
    private readonly logger: LoggerService,
    private readonly oidcClientConfig: OidcClientConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly eidasToOidc: EidasToOidcService,
    private readonly oidcToEidas: OidcToEidasService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Get(EidasBridgeRoutes.INIT_SESSION)
  @Redirect()
  async initSession(
    /**
     * @todo Adaptation for now, correspond to the oidc-client side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    const sessionIdLength = 32;
    const sessionId: string = this.crypto.genRandomString(sessionIdLength);

    const { stateLength } = await this.oidcClientConfig.get();
    const idpState: string = this.crypto.genRandomString(stateLength);

    await sessionOidc.set({
      idpState,
      sessionId,
      idpId: IDP_ID,
    });

    const response = {
      statusCode: 302,
      url: `${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.REDIRECT_TO_FC_AUTORIZE}`,
    };

    this.logger.trace({
      method: 'GET',
      name: 'EidasBridgeRoutes.INIT_SESSION',
      response,
      route: EidasBridgeRoutes.INIT_SESSION,
    });

    return response;
  }

  /**
   * @TODO #251 ETQ Dev, j'utilise une configuration pour savoir si j'utilise FC, AC, EIDAS, et avoir les valeurs de scope et acr en config et non en dur.
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/251
   */
  @Get(EidasBridgeRoutes.REDIRECT_TO_FC_AUTORIZE)
  @Redirect()
  async redirectToFcAuthorize(
    /**
     * @todo Adaptation for now, correspond to the oidc-client side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
    @Session('EidasProvider')
    sessionEidasProvider: ISessionService<EidasProviderSession>,
  ) {
    const { eidasRequest } = await sessionEidasProvider.get();
    const oidcRequest = this.eidasToOidc.mapPartialRequest(eidasRequest);

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl({
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: oidcRequest.acr_values,
      nonce,
      idpId: IDP_ID,
      scope: oidcRequest.scope.join(' '),
      state,
    });

    await sessionOidc.set({
      idpNonce: nonce,
      idpState: state,
    });

    const response = { statusCode: 302, url: authorizationUrl };

    this.logger.trace({
      method: 'GET',
      name: 'EidasBridgeRoutes.REDIRECT_TO_FC_AUTORIZE',
      response,
      route: EidasBridgeRoutes.REDIRECT_TO_FC_AUTORIZE,
    });

    return response;
  }

  @Get(EidasBridgeRoutes.REDIRECT_TO_EIDAS_RESPONSE_PROXY)
  @Redirect()
  async redirectToEidasResponseProxy(
    @Req()
    req,
    @Query()
    query,
    @Session('EidasProvider')
    sessionEidasProvider: ISessionService<EidasProviderSession>,
    /**
     * @todo Adaptation for now, correspond to the oidc-client side.
     * Named "OidcClient" because we need a future shared session between our libs oidc-provider and oidc-client
     * without a direct dependance like now.
     * @author Hugues
     * @date 2021-04-16
     * @ticket FC-xxx
     */
    @Session('OidcClient')
    sessionOidc: ISessionService<OidcClientSession>,
  ) {
    let partialEidasResponse;

    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { error, error_description } = query;
    if (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      partialEidasResponse = this.oidcToEidas.mapPartialResponseFailure({
        error,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description,
      });
    } else {
      try {
        partialEidasResponse = await this.handleOidcCallbackAuthCode(
          req,
          sessionOidc,
          sessionEidasProvider,
        );
      } catch (error) {
        this.logger.trace({ error }, LoggerLevelNames.WARN);
        partialEidasResponse =
          this.oidcToEidas.mapPartialResponseFailure(error);
      }
    }

    await sessionEidasProvider.set(
      'partialEidasResponse',
      partialEidasResponse,
    );

    const response = {
      statusCode: 302,
      url: '/eidas-provider/response-proxy',
    };

    this.logger.trace({
      method: 'GET',
      name: 'EidasBridgeRoutes.REDIRECT_TO_EIDAS_RESPONSE_PROXY',
      response,
      route: EidasBridgeRoutes.REDIRECT_TO_EIDAS_RESPONSE_PROXY,
    });

    return response;
  }

  private async handleOidcCallbackAuthCode(
    req: Request,
    sessionOidc: ISessionService<OidcClientSession>,
    sessionEidasProvider: ISessionService<EidasProviderSession>,
  ): Promise<Partial<EidasResponse>> {
    const session = await sessionOidc.get();

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

    const identity = await this.oidcClient.getUserInfosFromProvider(
      userInfoParams,
      req,
    );

    await this.validateIdentity(identity);

    const { requestedAttributes } = await sessionEidasProvider.get(
      'eidasRequest',
    );

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
      throw new EidasBridgeInvalidIdentityException();
    }
  }
}
