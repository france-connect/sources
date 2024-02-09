import { Response } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import {
  OidcClientConfig,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

import { AppConfig } from '../dto/app-config.dto';
import { CoreFcaOidcClientSession } from '../dto/core-fca-oidc-client-session.dto';
import {
  CoreFcaServiceInterface,
  FcaAuthorizeParamsInterface,
} from '../interfaces';
import { CoreFcaAuthorizationUrlService } from './core-fca-authorization-url.service';

@Injectable()
export class CoreFcaService implements CoreFcaServiceInterface {
  // Dependency injection can require more than 4 parameters
  /* eslint-disable-next-line max-params */
  constructor(
    private readonly config: ConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly coreFcaAuthorizationUrlService: CoreFcaAuthorizationUrlService,
    private readonly fqdnToIdpAdapterMongoService: FqdnToIdpAdapterMongoService,
    private readonly logger: LoggerService,
  ) {}
  // eslint-disable-next-line max-params
  async redirectToIdp(
    res: Response,
    idpId: string,
    session: ISessionService<OidcClientSession>,
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { acr, login_hint }: FcaAuthorizeParamsInterface,
  ): Promise<void> {
    const { spId } = await session.get();

    const { scope } = this.config.get<OidcClientConfig>('OidcClient');

    await this.oidcClient.utils.checkIdpBlacklisted(spId, idpId);
    await this.oidcClient.utils.checkIdpDisabled(idpId);

    const { nonce, state } =
      await this.oidcClient.utils.buildAuthorizeParameters();

    const {
      name: idpName,
      title: idpLabel,
      featureHandlers: idpFeatureHandlers,
    } = await this.identityProvider.getById(idpId);

    const authorizationUrl =
      (await this.coreFcaAuthorizationUrlService.getAuthorizeUrl({
        oidcClient: this.oidcClient,
        state,
        scope,
        idpId,
        idpFeatureHandlers,
        // oidc parameter
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: acr,
        nonce,
        spId,
        // login_hint is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        login_hint: login_hint,
      })) as string; // @todo Fix FeatureHandler return type

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

    await session.set(sessionPayload);

    res.redirect(authorizationUrl);
  }

  async getIdpIdForEmail(email: string): Promise<string> {
    // find the proper identity provider by fqdn
    const fqdn = this.getFqdnFromEmail(email);
    const idpsByFqdn =
      await this.fqdnToIdpAdapterMongoService.getIdpsByFqdn(fqdn);

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
