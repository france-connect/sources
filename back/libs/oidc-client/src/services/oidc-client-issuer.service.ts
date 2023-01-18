import { JWK } from 'jose';
import { Client, custom, Issuer } from 'openid-client';

import { Injectable, OnModuleInit } from '@nestjs/common';

import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata } from '@fc/oidc';

import { OidcClientClass } from '../enums';
import {
  OidcClientProviderDisabledException,
  OidcClientProviderNotFoundException,
} from '../exceptions';
import { OidcClientConfigService } from './oidc-client-config.service';

@Injectable()
export class OidcClientIssuerService implements OnModuleInit {
  private IssuerProxy = Issuer;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: OidcClientConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    const { httpOptions } = await this.config.get();

    this.logger.trace('Initializing oidc-client');

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
      throw new OidcClientProviderNotFoundException();
    }

    if (!idpMetadata.active) {
      throw new OidcClientProviderDisabledException();
    }

    return idpMetadata;
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
