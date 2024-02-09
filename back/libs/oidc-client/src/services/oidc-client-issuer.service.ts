import { JWK } from 'jose';
import { Client, custom, Issuer } from 'openid-client';

import { Injectable, OnModuleInit } from '@nestjs/common';

import { IdentityProviderMetadata } from '@fc/oidc';

import { OidcClientClass } from '../enums';
import {
  OidcClientIdpDisabledException,
  OidcClientIdpNotFoundException,
} from '../exceptions';
import { OidcClientConfigService } from './oidc-client-config.service';

@Injectable()
export class OidcClientIssuerService implements OnModuleInit {
  private IssuerProxy = Issuer;

  constructor(private readonly config: OidcClientConfigService) {}

  async onModuleInit() {
    const { httpOptions } = await this.config.get();

    custom.setHttpOptionsDefaults(httpOptions);
  }

  /**
   * Get Idp data in idp list.
   *
   * We have to throw a specific error in case of disabled idp
   */
  private async getIdpMetadata(
    issuerId: string,
  ): Promise<IdentityProviderMetadata> {
    const configuration = await this.config.get();
    const idpMetadata = configuration.providers.find(
      ({ uid }) => uid === issuerId,
    );

    if (!idpMetadata) {
      throw new OidcClientIdpNotFoundException();
    }

    if (!idpMetadata.active) {
      throw new OidcClientIdpDisabledException();
    }

    const { redirectUri, postLogoutRedirectUri } = configuration;

    const result = {
      ...idpMetadata,
      client: {
        ...idpMetadata.client,

        // OIDC style naming
        // eslint-disable-next-line @typescript-eslint/naming-convention
        redirect_uris: [redirectUri],
        // OIDC style naming
        // eslint-disable-next-line @typescript-eslint/naming-convention
        post_logout_redirect_uris: [postLogoutRedirectUri],
      },
    };

    return result;
  }

  /**
   * @param issuerId identifier used to indicate Chosen IdP
   * @returns providers metadata
   * @throws Error
   */
  private async getIssuer(issuerId: string): Promise<Issuer<Client>> {
    const idpMetadata = await this.getIdpMetadata(issuerId);

    if (idpMetadata.discovery) {
      /**
       * @TODO #142 handle network failure with specific Exception / error code
       * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/142
       */
      const issuer = await this.IssuerProxy.discover(idpMetadata.discoveryUrl);

      return issuer;
    }

    return new this.IssuerProxy(idpMetadata.issuer);
  }

  private async getClientClass(): Promise<OidcClientClass> {
    const { fapi } = await this.config.get();
    const clientClass = fapi ? OidcClientClass.FAPI : OidcClientClass.STANDARD;

    return clientClass;
  }

  public async getClient(issuerId: string): Promise<Client> {
    const idpMetadata = await this.getIdpMetadata(issuerId);

    const issuer = await this.getIssuer(issuerId);
    const { jwks } = await this.config.get();
    const clientClass = await this.getClientClass();

    const client = new issuer[clientClass](
      idpMetadata.client,
      jwks as { keys: JWK[] },
    );

    return client;
  }
}
