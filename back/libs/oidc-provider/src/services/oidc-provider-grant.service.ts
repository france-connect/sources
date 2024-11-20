import { Provider } from 'oidc-provider';

import { Injectable } from '@nestjs/common';

import { safelyParseJson } from '@fc/common';
import { stringToArray } from '@fc/oidc';

import { OidcProviderParseJsonClaimsException } from '../exceptions';
import { OidcProviderGrantSaveException } from '../exceptions/oidc-provider-grant-save.exception';
import { InteractionParams } from '../interfaces';

@Injectable()
export class OidcProviderGrantService {
  /*
   * oidc-provider do not export the Grant type so we need
   * to use Promise<any> for the return type
   */
  async generateGrant(
    provider: Provider,
    req: any,
    res: any,
    accountId: string,
  ): Promise<any> {
    const details = await provider.interactionDetails(req, res);
    const { claims, client_id, scope } = details.params as InteractionParams;

    const grant = new provider.Grant();

    grant.accountId = accountId;
    grant.clientId = client_id as string;

    /*
     * FC does not support yet selective scope connection
     * that's why we get them directly from authorization
     * params from the ServiceProvider
     */
    const scopeArray = stringToArray(scope);
    scopeArray.forEach((scope) => {
      grant.addOIDCScope(scope);
    });

    const isRepScopeRequested = this.isRepScopeRequested(claims);

    if (isRepScopeRequested) {
      grant.addOIDCClaims(['rep_scope']);
    }

    return grant;
  }

  async saveGrant(grant: { save: Function }): Promise<string> {
    try {
      const result = await grant.save();
      return result;
    } catch (error) {
      throw new OidcProviderGrantSaveException(error);
    }
  }

  private isRepScopeRequested(claims: string): boolean {
    try {
      // Need to check claims value exist
      const claimsRequested = claims ? safelyParseJson(claims) : {};

      return !!claimsRequested?.id_token?.rep_scope?.essential;
    } catch (error) {
      throw new OidcProviderParseJsonClaimsException();
    }
  }
}
