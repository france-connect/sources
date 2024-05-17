import { Response } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreAuthorizationService } from '@fc/core';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { OidcSession } from '@fc/oidc';
import {
  OidcClientConfig,
  OidcClientIdpBlacklistedException,
  OidcClientIdpDisabledException,
  OidcClientService,
} from '@fc/oidc-client';
import { SessionService } from '@fc/session';

import { AppConfig } from '../dto/app-config.dto';
import { CoreFcaOidcClientSession } from '../dto/core-fca-oidc-client-session.dto';
import {
  CoreFcaAgentIdpBlacklistedException,
  CoreFcaAgentIdpDisabledException,
  CoreFcaAgentNoIdpException,
} from '../exceptions';
import {
  CoreFcaAuthorizationParametersInterface,
  CoreFcaServiceInterface,
} from '../interfaces';

@Injectable()
export class CoreFcaService implements CoreFcaServiceInterface {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly fqdnToIdpAdapterMongo: FqdnToIdpAdapterMongoService,
    private readonly coreAuthorization: CoreAuthorizationService,
    private readonly session: SessionService,
  ) {}
  // eslint-disable-next-line max-params
  async redirectToIdp(
    res: Response,
    idpId: string,
    {
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint,
    }: Pick<
      CoreFcaAuthorizationParametersInterface,
      'acr_values' | 'login_hint'
    >,
  ): Promise<void> {
    const { spId } = this.session.get<OidcSession>('OidcClient');

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    await this.checkIdpBlacklisted(spId, idpId);
    await this.checkIdpDisabled(idpId);

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const authorizeParams: CoreFcaAuthorizationParametersInterface = {
      state,
      scope,
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values,
      nonce,
      // We want the same nomenclature as OpenId Connect
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sp_id: spId,
      // login_hint is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint,
    };

    const authorizationUrl = await this.coreAuthorization.getAuthorizeUrl(
      idpId,
      authorizeParams,
    );

    const { name: idpName, title: idpLabel } =
      await this.identityProvider.getById(idpId);
    // from OidcClientSession to CoreFcaOidcClientSession because we add email
    const sessionPayload: CoreFcaOidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
      idpIdentity: undefined,
      spIdentity: undefined,
      accountId: undefined,
      // login_hint is an oidc defined variable name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      login_hint: login_hint,
    };

    this.session.set('OidcClient', sessionPayload);

    res.redirect(authorizationUrl);
  }

  async getIdpIdForEmail(email: string): Promise<string[]> {
    const { defaultIpdId } = this.config.get<AppConfig>('App');
    // find the proper identity provider by fqdn
    const fqdn = this.getFqdnFromEmail(email);
    const idpsByFqdn = await this.fqdnToIdpAdapterMongo.getIdpsByFqdn(fqdn);

    return idpsByFqdn.length > 0
      ? idpsByFqdn.map(({ identityProvider }) => identityProvider)
      : [defaultIpdId];
  }

  getFqdnFromEmail(email: string): string {
    return email.split('@').pop().toLowerCase();
  }

  private async checkIdpBlacklisted(spId: string, idpId: string) {
    try {
      await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);
    } catch (error) {
      if (error instanceof OidcClientIdpBlacklistedException) {
        throw new CoreFcaAgentIdpBlacklistedException();
      }
      throw error;
    }
  }

  private async checkIdpDisabled(idpId: string) {
    try {
      await this.oidcClient.utils.checkIdpDisabled(idpId);
    } catch (error) {
      if (error instanceof OidcClientIdpDisabledException) {
        throw new CoreFcaAgentIdpDisabledException();
      }
      throw error;
    }
  }

  private getDefaultIdp(idpsByFqdnLength: number): string {
    const { defaultIpdId } = this.config.get<AppConfig>('App');

    if (idpsByFqdnLength === 0 && !defaultIpdId) {
      throw new CoreFcaAgentNoIdpException();
    }

    return defaultIpdId;
  }

  async getIdentityProvidersByIds(...idpIds: string[]) {
    const idpList = await this.identityProvider.getList();
    return idpList
      .filter(({ uid }) => idpIds.includes(uid))
      .map(({ name, title, uid }) => ({ name, title, uid }));
  }
}
