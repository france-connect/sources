import { Request } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { IdentityProviderAdapterEnvService } from '@fc/identity-provider-adapter-env';
import { OidcSession } from '@fc/oidc';
import { OidcAcrConfig } from '@fc/oidc-acr';
import { OidcClientConfig, OidcClientService } from '@fc/oidc-client';
import { OidcProviderPrompt } from '@fc/oidc-provider';
import {
  PartnersAccountIdentity,
  PartnersAccountService,
} from '@fc/partners-account';
import { SessionNotFoundException, SessionService } from '@fc/session';
import { queryBuilderGetCurrentTimestamp } from '@fc/typeorm';

import { AppConfig } from '../dto';
import { PartnersFrontRoutes } from '../enums';
import { AgentIdentityInterface } from '../interfaces';

@Injectable()
export class PartnersOidcClientService {
  // More than 4 parameters allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly config: ConfigService,
    private readonly identityProvider: IdentityProviderAdapterEnvService,
    private readonly oidcClient: OidcClientService,
    private readonly partnersAccount: PartnersAccountService,
    private readonly session: SessionService,
  ) {}

  async getAuthorizeUrl(): Promise<string> {
    const { defaultAcrValue: acr_values } =
      this.config.get<OidcAcrConfig>('OidcAcr');

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const { proConnectIdpId: idpId } = this.config.get<AppConfig>('App');

    const prompt = OidcProviderPrompt.LOGIN;

    const authorizeParams = {
      acr_values,
      nonce,
      scope,
      state,
      prompt,
    };

    const authorizationUrl = await this.oidcClient.utils.getAuthorizeUrl(
      idpId,
      authorizeParams,
    );

    const { name, title } = await this.identityProvider.getById(idpId);
    const session: OidcSession = {
      idpId,
      idpName: name,
      idpLabel: title,
      idpNonce: nonce,
      idpState: state,
    };

    this.session.set('OidcClient', session);

    return authorizationUrl;
  }

  async getIdentityFromIdp(req: Request): Promise<AgentIdentityInterface> {
    const session = this.session.get<OidcSession>('OidcClient');

    if (!session) {
      throw new SessionNotFoundException('OidcClient');
    }

    const { idpId, idpNonce: nonce, idpState: state } = session;

    const tokenParams = {
      nonce,
      state,
    };

    const { accessToken, idToken } = await this.oidcClient.getTokenFromProvider(
      idpId,
      tokenParams,
      req,
    );

    const identity =
      await this.oidcClient.getUserInfosFromProvider<AgentIdentityInterface>(
        {
          accessToken,
          idpId,
        },
        req,
      );

    this.session.set('OidcClient', {
      idpIdentity: identity,
      idpIdToken: idToken,
    });

    return identity;
  }

  async retrieveOrCreateAccount(
    identity: AgentIdentityInterface,
  ): Promise<void> {
    const partnersAccount: PartnersAccountIdentity = {
      sub: identity.sub,
      firstname: identity.given_name,
      lastname: identity.usual_name,
      email: identity.email,
    };

    let accountId = await this.partnersAccount.updateAccount(partnersAccount);

    if (!accountId) {
      accountId = await this.partnersAccount.init({
        ...partnersAccount,
        lastConnection: queryBuilderGetCurrentTimestamp,
      });
    }

    // Store partnerAccount in session
    const sessionData = {
      identity: {
        ...partnersAccount,
        id: accountId,
      },
    };
    this.session.set('PartnersAccount', sessionData);
  }

  async getLogoutUrl(): Promise<string> {
    const session = this.session.get<OidcSession>('OidcClient');

    if (!session?.idpIdToken) {
      return PartnersFrontRoutes.INDEX;
    }

    const { idpIdToken, idpState, idpId } = session;

    const { postLogoutRedirectUri } =
      this.config.get<OidcClientConfig>('OidcClient');

    const endSessionUrl = await this.oidcClient.getEndSessionUrlFromProvider(
      idpId,
      idpState,
      idpIdToken,
      postLogoutRedirectUri,
    );

    return endSessionUrl;
  }
}
