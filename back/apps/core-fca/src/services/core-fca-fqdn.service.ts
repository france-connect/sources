import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { FqdnToIdpAdapterMongoService } from '@fc/fqdn-to-idp-adapter-mongo';

import { AppConfig } from '../dto/app-config.dto';
import { FqdnConfigInterface } from '../interfaces';

@Injectable()
export class CoreFcaFqdnService {
  constructor(
    private readonly fqdnToIdpAdapterMongo: FqdnToIdpAdapterMongoService,
    private readonly config: ConfigService,
  ) {}
  async getFqdnConfigFromEmail(email: string): Promise<FqdnConfigInterface> {
    const { defaultIdpId } = this.config.get<AppConfig>('App');
    const fqdn = this.getFqdnFromEmail(email);
    const idpsByFqdn = await this.fqdnToIdpAdapterMongo.getIdpsByFqdn(fqdn);

    // when there is no idp mapped for this fqdn
    // we check if there is or not a default idp set in the app
    // if yes, we return the default idp
    // if no, we return an empty config and we deduce that the default idp is not accepted
    if (idpsByFqdn.length === 0) {
      return {
        fqdn,
        identityProviders: defaultIdpId ? [defaultIdpId] : [],
        acceptsDefaultIdp: !!defaultIdpId,
      };
    }

    // create a Set to prevent duplicate identity providers
    // e.g.: if adding mapping to default idp and default idp is accepted and set
    const identityProvidersSet = new Set<string>();

    // when there is at least one idp mapped for this fqdn
    // we add all the idps mapped for this fqdn
    // and we handle the default idp
    let acceptsDefaultIdpConfig = true;

    idpsByFqdn.forEach(({ identityProvider, acceptsDefaultIdp }) => {
      if (acceptsDefaultIdp === false) {
        acceptsDefaultIdpConfig = false;
      }

      identityProvidersSet.add(identityProvider);
    });

    const idpsWithDefaultIdpSet = this.addDefaultIdp(
      acceptsDefaultIdpConfig,
      identityProvidersSet,
      defaultIdpId,
    );

    return {
      fqdn,
      identityProviders: Array.from(idpsWithDefaultIdpSet),
      acceptsDefaultIdp: acceptsDefaultIdpConfig,
    };
  }

  getFqdnFromEmail(email: string): string {
    return email.split('@').pop().toLowerCase();
  }

  private addDefaultIdp(
    acceptsDefaultIdp: boolean,
    identityProvidersSet: Set<string>,
    defaultIdpId: string,
  ): Set<string> {
    // we only add default idp when
    // there is more than one idp mapped for the fqdn
    // we use set to prevent duplicate default idp
    if (acceptsDefaultIdp && identityProvidersSet.size > 1) {
      identityProvidersSet.add(defaultIdpId);
    }

    return identityProvidersSet;
  }
}
