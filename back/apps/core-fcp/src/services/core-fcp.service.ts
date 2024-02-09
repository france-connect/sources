import { Response } from 'express';

import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ConfigService } from '@fc/config';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { OidcSession, stringToArray } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import {
  OidcClientConfig,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { OidcProviderPrompt } from '@fc/oidc-provider';
import { IClaim, IRichClaim, ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService } from '@fc/session';

import { AppConfig, CoreSessionDto } from '../dto';
import { CoreFcpSendEmailHandler } from '../handlers';
import {
  CoreFcpAuthorizeParamsInterface,
  CoreFcpServiceInterface,
} from '../interfaces/core-fcp-service.interface';

@Injectable()
export class CoreFcpService implements CoreFcpServiceInterface {
  // Dependency injection can require more than 4 parameters
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    public readonly moduleRef: ModuleRef,
    private readonly scopes: ScopesService,
    private readonly serviceProvider: ServiceProviderAdapterMongoService,
    private readonly oidcAcr: OidcAcrService,
    private readonly oidcClient: OidcClientService,
  ) {}

  /**
   * Send an email to the authenticated end-user after consent.
   *
   * @param {ISessionService<OidcClientSession>} sessionOidc
   * @returns {Promise<void>}
   */
  async sendAuthenticationMail(
    session: OidcSession,
    sessionCore: ISessionService<CoreSessionDto>,
  ): Promise<void> {
    const { sentNotificationsForSp } = await sessionCore.get();
    const { idpId, spId } = session;
    const idp = await this.identityProvider.getById(idpId);

    const { authenticationEmail } = idp.featureHandlers;
    const handler = FeatureHandler.get<CoreFcpSendEmailHandler>(
      authenticationEmail,
      this,
    );

    // notification already sent for this service provider during this session
    if (sentNotificationsForSp.includes(spId)) {
      return;
    }

    // update the session to take into account the notification for this service provider
    sentNotificationsForSp.push(spId);
    await sessionCore.set('sentNotificationsForSp', sentNotificationsForSp);

    await handler.handle(session);
  }

  async isConsentRequired(spId: string): Promise<boolean> {
    const { type, identityConsent } = await this.serviceProvider.getById(spId);

    const consentRequired = this.serviceProvider.consentRequired(
      type,
      identityConsent,
    );

    return consentRequired;
  }

  async redirectToIdp(
    res: Response,
    idpId: string,
    session: ISessionService<OidcClientSession>,
    { acr }: CoreFcpAuthorizeParamsInterface,
  ): Promise<void> {
    const { spId } = await session.get();

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);
    await this.oidcClient.utils.checkIdpDisabled(idpId);

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizeParams = {
      // acr_values is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: acr,
      nonce,
      idpId,
      scope,
      state,
      // Prompt for the identity provider is forced here
      // and not linked to the prompt required of the service provider
      prompt: OidcProviderPrompt.LOGIN,
    };

    const authorizationUrl =
      await this.oidcClient.utils.getAuthorizeUrl(authorizeParams);

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(idpId);
    const sessionPayload: OidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
      rnippIdentity: undefined,
      idpIdentity: undefined,
      spIdentity: undefined,
      accountId: undefined,
    };

    await session.set(sessionPayload);

    res.redirect(authorizationUrl);
  }

  isInsufficientAcrLevel(acrValue: string, isSuspicious: boolean) {
    const { minAcrForContextRequest } = this.config.get<AppConfig>('App');

    const insufficientAcrLevel = !this.oidcAcr.isAcrValid(
      acrValue,
      minAcrForContextRequest,
    );

    return isSuspicious && insufficientAcrLevel;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  getClaimsLabelsForInteraction(interaction: any): IRichClaim[] {
    const scopes = this.getScopesForInteraction(interaction);

    const claims = this.scopes.getRichClaimsFromScopes(scopes);

    return claims;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  getClaimsForInteraction(interaction: any): IClaim[] {
    const scopes = this.getScopesForInteraction(interaction);

    const claims = this.scopes.getRawClaimsFromScopes(scopes);

    return claims;
  }

  /**
   * @todo #1023 je type les entrées et sortie correctement et non pas avec any
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/1023
   * @ticket #FC-1023
   */
  getScopesForInteraction(interaction: any): string[] {
    const {
      params: { scope },
    } = interaction;
    const scopes = stringToArray(scope);

    return scopes;
  }
}
