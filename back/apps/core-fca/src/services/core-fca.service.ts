import { Response } from 'express';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { CoreServiceInterface } from '@fc/core';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import {
  OidcClientConfig,
  OidcClientService,
  OidcClientSession,
} from '@fc/oidc-client';
import { ISessionService } from '@fc/session';

import { CoreFcaAuthorizationUrlService } from './core-fca-authorization-url.service';

@Injectable()
export class CoreFcaService implements CoreServiceInterface {
  constructor(
    private readonly config: ConfigService,
    private readonly oidcClient: OidcClientService,
    private readonly identityProvider: IdentityProviderAdapterMongoService,
    private readonly coreFcaAuthorizationUrlService: CoreFcaAuthorizationUrlService,
  ) {}

  async redirectToIdp(
    res: Response,
    acr: string,
    idpId: string,
    session: ISessionService<OidcClientSession>,
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
      })) as string; // @todo Fix FeatureHandler return type

    const sessionPayload: OidcClientSession = {
      idpId,
      idpName,
      idpLabel,
      idpNonce: nonce,
      idpState: state,
      idpIdentity: undefined,
      spIdentity: undefined,
      accountId: undefined,
    };

    await session.set(sessionPayload);

    res.redirect(authorizationUrl);
  }
}
