import { Response } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreAuthorizationService } from '@fc/core';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { OidcClientConfig, OidcClientService } from '@fc/oidc-client';
import { SessionService } from '@fc/session';

import { AppConfig } from '../dto/app-config.dto';
import { CoreFcaOidcClientSession } from '../dto/core-fca-oidc-client-session.dto';
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
    private readonly logger: LoggerService,
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

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);
    await this.oidcClient.utils.checkIdpDisabled(idpId);

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

  async getIdpIdForEmail(email: string): Promise<string> {
    // find the proper identity provider by fqdn
    const fqdn = this.getFqdnFromEmail(email);
    const idpsByFqdn = await this.fqdnToIdpAdapterMongo.getIdpsByFqdn(fqdn);

    if (idpsByFqdn?.length > 1) {
      this.logger.warning('More than one IdP exists');
    }

    const { defaultIpdId } = this.config.get<AppConfig>('App');

    return idpsByFqdn?.length > 0
      ? idpsByFqdn[0].identityProvider
      : defaultIpdId;
  }

  private getFqdnFromEmail(email: string): string {
    return email.split('@').pop();
  }
}
